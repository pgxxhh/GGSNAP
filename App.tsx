
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CyberpunkCamera } from './components/CyberpunkCamera';
import { HeroList } from './components/HeroList';
import { PhotoWall } from './components/PhotoWall';
import { Character, GalleryItem } from './types';
import { generateToonAvatar } from './services/geminiService';
import { CHARACTERS, DEMO_ITEMS_CONFIG } from './constants';

const App: React.FC = () => {
  // --- DEMO DATA INITIALIZATION ---
  const getDemoItems = (): GalleryItem[] => {
    return DEMO_ITEMS_CONFIG.map((item, index) => ({
        id: item.id,
        original: '',
        generated: item.generatedUrl,
        characterId: item.characterId,
        timestamp: Date.now() - (index * 60000)
    }));
  };

  // Initialize to null to force user to select a hero first (Step 1)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  // Initialize gallery with demo items
  const [gallery, setGallery] = useState<GalleryItem[]>(getDemoItems());
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingImage, setCurrentProcessingImage] = useState<string | null>(null);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<GalleryItem | null>(null);
  
  // Mobile Navigation State: 'camera' (default), 'heroes', 'gallery'
  const [mobileView, setMobileView] = useState<'camera' | 'heroes' | 'gallery'>('camera');

  // Camera Transform State for Drag & Zoom
  const [cameraTransform, setCameraTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDraggingCamera, setIsDraggingCamera] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startTransform = useRef({ x: 0, y: 0 });

  // Mobile Touch Refs
  const touchStartDist = useRef<number>(0);
  const touchStartScale = useRef<number>(1);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchStartCameraPos = useRef({ x: 0, y: 0 });

  // Handle Global Drag Events (Desktop)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingCamera) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setCameraTransform(prev => ({
        ...prev,
        x: startTransform.current.x + dx,
        y: startTransform.current.y + dy
      }));
    };

    const handleMouseUp = () => {
      setIsDraggingCamera(false);
    };

    if (isDraggingCamera) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCamera]);

  const handleCameraMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging if clicking on buttons inside the camera
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
    
    e.preventDefault(); 
    setIsDraggingCamera(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    startTransform.current = { ...cameraTransform };
  };

  const handleCameraWheel = (e: React.WheelEvent) => {
    e.stopPropagation(); // Prevent page scroll
    const scaleAmount = -e.deltaY * 0.001;
    // Clamp scale between 0.5x and 1.5x
    const newScale = Math.min(Math.max(0.5, cameraTransform.scale + scaleAmount), 1.5);
    setCameraTransform(prev => ({ ...prev, scale: newScale }));
  };

  // --- MOBILE TOUCH LOGIC ---
  const getTouchDist = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Avoid interfering with UI controls
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;

    if (e.touches.length === 1) {
      // Panning
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartCameraPos.current = { x: cameraTransform.x, y: cameraTransform.y };
    } else if (e.touches.length === 2) {
      // Pinch Zoom
      touchStartDist.current = getTouchDist(e.touches);
      touchStartScale.current = cameraTransform.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Avoid interfering with UI controls
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;

    if (e.touches.length === 1) {
      // Panning
      const dx = e.touches[0].clientX - touchStartPos.current.x;
      const dy = e.touches[0].clientY - touchStartPos.current.y;
      setCameraTransform(prev => ({
        ...prev,
        x: touchStartCameraPos.current.x + dx,
        y: touchStartCameraPos.current.y + dy
      }));
    } else if (e.touches.length === 2) {
      // Pinch Zoom
      const newDist = getTouchDist(e.touches);
      if (touchStartDist.current > 0) {
        const scaleFactor = newDist / touchStartDist.current;
        const newScale = Math.min(Math.max(0.5, touchStartScale.current * scaleFactor), 1.5);
        setCameraTransform(prev => ({ ...prev, scale: newScale }));
      }
    }
  };

  const handleCapture = useCallback(async (base64: string) => {
    if (!selectedCharacter || isProcessing) return;
    
    setIsProcessing(true);
    setCurrentProcessingImage(base64);
    setLastGeneratedImage(null);

    try {
      const result = await generateToonAvatar(base64, selectedCharacter.stylePrompt);
      setLastGeneratedImage(result);

      const newItem: GalleryItem = {
        id: Date.now().toString(),
        original: base64,
        generated: result,
        characterId: selectedCharacter.id,
        timestamp: Date.now()
      };

      // Add to gallery AFTER the "Developing" animation finishes visually in the Camera component
      setTimeout(() => {
          setGallery(prev => {
              // Check if we are still in "demo mode" (gallery has demo items)
              // If so, clear them all and start fresh with the user's first photo
              const hasDemo = prev.some(i => i.id.startsWith('demo-'));
              if (hasDemo) {
                  return [newItem];
              }
              return [...prev, newItem];
          });
          setIsProcessing(false); 
          setCurrentProcessingImage(null); // Clear the printer slot
          
          // Optional: Switch to gallery view on mobile to show result? 
          // keeping it on camera is usually better flow for multiple shots.
      }, 5000); 

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Neural Link Failed. Retrying advised.");
    }
  }, [selectedCharacter, isProcessing]);

  const handleDeletePhoto = useCallback((id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
    if (viewingImage?.id === id) {
        setViewingImage(null);
    }
  }, [viewingImage]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-black text-[#e0e0e0] overflow-hidden relative">
      
      {/* GLOBAL BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none cyber-grid opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-0"></div>

      {/* LIGHTBOX MODAL */}
      {viewingImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setViewingImage(null)}></div>
            
            <div className="relative z-60 bg-[#0a0a0a] border border-[#222] rounded-2xl p-1 shadow-[0_0_100px_rgba(0,0,0,1)] max-w-4xl max-h-[90vh] flex flex-col items-center">
                 <div className="relative group overflow-hidden rounded-xl">
                    <img 
                        src={viewingImage.generated} 
                        alt="Full Size" 
                        className="max-h-[75vh] object-contain" 
                    />
                 </div>
                 
                 <div className="w-full flex justify-between items-center p-4">
                    <div className="text-xs text-gray-500 font-mono">
                        ID: {viewingImage.id}
                    </div>
                    <div className="flex space-x-4">
                        <a 
                            href={viewingImage.generated} 
                            download={`ggsnap-${viewingImage.id}.png`}
                            className="text-[#00dbff] hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
                        >
                            [ Download ]
                        </a>
                        <button 
                            onClick={() => handleDeletePhoto(viewingImage.id)}
                            className="text-red-500 hover:text-red-400 text-xs font-bold tracking-widest uppercase transition-colors"
                        >
                            [ Delete ]
                        </button>
                    </div>
                 </div>
            </div>
        </div>
      )}

      {/* LEFT PANEL: HERO SELECTOR (Mobile: Slide-over Drawer) */}
      <div className={`
        fixed inset-0 z-40 bg-[#050505] flex flex-col transition-transform duration-300
        md:relative md:inset-auto md:w-[320px] lg:w-[380px] md:h-full md:translate-x-0 md:border-r border-[#222] shadow-2xl
        ${mobileView === 'heroes' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
         {/* Mobile Header for Drawer */}
         <div className="md:hidden p-4 border-b border-[#222] flex justify-between items-center">
            <span className="text-white font-bold tracking-widest">SELECT HERO</span>
            <button onClick={() => setMobileView('camera')} className="text-gray-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
         </div>

         <div className="hidden md:block p-6 border-b border-[#222]">
            <h1 className="text-3xl font-bold tracking-widest text-white italic">
                GG<span className="text-[#00dbff]">SNAP</span>
            </h1>
            <p className="text-[10px] text-gray-500 mt-1 font-mono tracking-widest">NEURAL AVATAR LINK</p>
         </div>
         
         <div className="flex-1 overflow-hidden">
             <HeroList 
               selectedId={selectedCharacter?.id}
               onSelect={(char) => {
                   setSelectedCharacter(char);
                   // On mobile, auto-close drawer after selection for better flow
                   if (window.innerWidth < 768) {
                       setMobileView('camera');
                   }
               }}
             />
         </div>

         {/* PRIVACY FOOTER & CREDITS */}
         <div className="p-4 border-t border-[#222] bg-[#080808] z-30 mb-16 md:mb-0">
            <div className="flex items-start space-x-3 opacity-80 hover:opacity-100 transition-opacity mb-4">
                <div className="mt-0.5 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="text-[10px] text-gray-500 font-mono leading-relaxed">
                    <span className="text-[#00dbff] font-bold block mb-0.5 tracking-wider">PRIVACY PROTOCOL: SECURE</span>
                    Photos are processed in browser RAM only. No cloud storage. 
                    <span className="block mt-0.5 text-gray-600">Session data wipes on refresh.</span>
                </div>
            </div>

            {/* Developer Info */}
            <div className="pt-3 border-t border-[#222] opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 mb-1">
                    <span className="tracking-widest">DEVELOPER</span>
                    <span className="text-gray-300">UncleLee</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
                    <span className="tracking-widest">CONTACT</span>
                    <a href="mailto:975022570yp@gmail.com" className="text-[#00dbff] hover:text-white transition-colors">975022570yp@gmail.com</a>
                </div>
            </div>
         </div>
      </div>

      {/* MIDDLE: CAMERA STUDIO */}
      <div className="flex-1 relative flex flex-col items-center justify-start pt-0 md:pt-6 bg-[#080808] z-10 overflow-hidden">
         {/* Mobile Brand Header */}
         <div className="md:hidden w-full p-4 flex justify-center items-center bg-[#050505]/80 backdrop-blur border-b border-[#222] z-30 absolute top-0">
            <span className="text-xl font-bold tracking-widest text-white italic">
                GG<span className="text-[#00dbff]">SNAP</span>
            </span>
         </div>

         {/* GUIDE / STATUS BAR */}
         <div className="absolute top-[80px] md:top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
            <div className="bg-black/70 backdrop-blur border border-[#333] px-5 py-2 rounded-full flex items-center space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className={`flex items-center space-x-2 ${!selectedCharacter ? 'text-[#00dbff] animate-pulse' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${!selectedCharacter ? 'bg-[#00dbff]' : 'bg-gray-700'}`}></div>
                    <span className="text-[10px] font-mono font-bold tracking-widest">1. SELECT HERO</span>
                </div>
                <div className="text-gray-700 text-[10px]">////////////////</div>
                <div className={`flex items-center space-x-2 ${selectedCharacter ? 'text-[#ff00ff] animate-pulse' : 'text-gray-500'}`}>
                     <div className={`w-2 h-2 rounded-full ${selectedCharacter ? 'bg-[#ff00ff]' : 'bg-gray-700'}`}></div>
                    <span className="text-[10px] font-mono font-bold tracking-widest">2. UPLOAD / SNAP</span>
                </div>
            </div>
         </div>

         {/* Subtle Vignette */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none"></div>
         
         {/* Main Camera Container - Draggable & Resizable */}
         <div className="relative z-20 flex-1 w-full flex items-start justify-center pt-24 md:pt-10 overflow-visible">
             <div 
                className="origin-top w-full flex justify-center cursor-move touch-none"
                style={{
                    transform: `translate(${cameraTransform.x}px, ${cameraTransform.y}px) scale(${cameraTransform.scale})`,
                    transition: isDraggingCamera ? 'none' : 'transform 0.1s ease-out',
                    touchAction: 'none'
                }}
                onMouseDown={handleCameraMouseDown}
                onWheel={handleCameraWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                title="Drag to move, Scroll or Pinch to zoom"
             >
                <CyberpunkCamera 
                    selectedCharacter={selectedCharacter}
                    onCapture={handleCapture}
                    isProcessing={isProcessing}
                    currentProcessingImage={currentProcessingImage}
                    lastGeneratedImage={lastGeneratedImage}
                />
             </div>
         </div>
      </div>

      {/* RIGHT PANEL: GALLERY (Mobile: Slide-over Drawer) */}
      <div className={`
        fixed inset-0 z-40 bg-[#050505] flex flex-col transition-transform duration-300
        md:relative md:inset-auto md:w-[280px] lg:w-[320px] md:h-full md:translate-x-0 md:border-l border-[#222] shadow-2xl
        ${mobileView === 'gallery' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
         <div className="p-4 border-b border-[#222] flex justify-between items-center">
             <span className="text-xs font-bold tracking-widest text-gray-400">ARCHIVE</span>
             <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 rounded-full bg-[#00dbff] animate-pulse"></div>
                 {/* Mobile Close Button */}
                 <button onClick={() => setMobileView('camera')} className="md:hidden text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
             </div>
         </div>
         <div className="flex-1 overflow-hidden mb-16 md:mb-0">
            <PhotoWall 
                items={gallery} 
                onDelete={handleDeletePhoto} 
                onSelect={(item) => setViewingImage(item)}
            />
         </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#050505] border-t border-[#222] flex justify-around items-center p-2 pb-5 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => setMobileView('heroes')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${mobileView === 'heroes' ? 'text-[#00dbff]' : 'text-gray-500'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-[10px] font-bold tracking-wider">HEROES</span>
          </button>

          <button 
            onClick={() => setMobileView('camera')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${mobileView === 'camera' ? 'text-white' : 'text-gray-500'}`}
          >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${mobileView === 'camera' ? 'border-white bg-[#222]' : 'border-gray-600 bg-black'}`}>
                  <div className={`w-3 h-3 rounded-full ${mobileView === 'camera' ? 'bg-[#00dbff]' : 'bg-gray-600'}`}></div>
              </div>
          </button>

          <button 
            onClick={() => setMobileView('gallery')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${mobileView === 'gallery' ? 'text-[#ff00ff]' : 'text-gray-500'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-[10px] font-bold tracking-wider">GALLERY</span>
          </button>
      </div>

    </div>
  );
};

export default App;
