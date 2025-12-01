
import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import { Character } from '../types';

interface CyberpunkCameraProps {
  selectedCharacter: Character | null;
  onCapture: (base64: string) => void;
  isProcessing: boolean;
  currentProcessingImage: string | null;
  lastGeneratedImage: string | null;
}

export const CyberpunkCamera: React.FC<CyberpunkCameraProps> = ({
  selectedCharacter,
  onCapture,
  isProcessing,
  currentProcessingImage,
  lastGeneratedImage
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null); // For uploaded image processing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [flashActive, setFlashActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // New state to control when we actually ask for permissions
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const loadingMessages = [
    "SCANNING BIOMETRICS...",
    "MATCHING FACIAL NODES...",
    "FETCHING GAME ASSETS...",
    "APPLYING CHIBI VECTOR...",
    "RENDERING TEXTURES...",
    "FINALIZING OUTPUT..."
  ];

  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopAudioRef = useRef<() => void>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    
    // Only start camera if active flag is set AND we don't have an uploaded image
    const startCamera = async () => {
      if (!isCameraActive || uploadedImage) return;

      setCameraError(null);
      try {
         currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
            audio: false,
         });
        if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
            videoRef.current.play().catch(e => console.error(e));
        }
      } catch (err: any) {
        console.error("Camera Error:", err);
        setCameraError("ACCESS DENIED / CAMERA OFFLINE");
        setIsCameraActive(false); // Reset so button becomes "Turn On" again to allow retry
      }
    };

    if (isCameraActive) {
        startCamera();
    }

    return () => {
        if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, [isCameraActive, uploadedImage]); 

  // --- LOADING MESSAGE CYCLE ---
  useEffect(() => {
    if (isProcessing) {
        const interval = setInterval(() => {
            setLoadingStep(prev => (prev + 1) % loadingMessages.length);
        }, 800);
        return () => clearInterval(interval);
    } else {
        setLoadingStep(0);
    }
  }, [isProcessing]);

  // --- AUDIO ENGINE ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playSound = (type: 'snap' | 'success' | 'beep') => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // High pitch beep
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start();
        osc.stop(now + 0.1);

    } else if (type === 'snap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start();
        osc.stop(now + 0.1);
    } else {
        // Success Jingle: C Major Arpeggio (C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine'; // Pure tone
            osc.frequency.value = freq;
            
            const startTime = now + (i * 0.1); // Stagger notes
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
            
            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }
  };

  // Cheerful "Thinking" Loop
  useEffect(() => {
    if (isProcessing && !lastGeneratedImage) { // Only play thinking music if we haven't finished yet
      const ctx = initAudio();
      if (!ctx) return;

      let isPlaying = true;
      let nextNoteTime = ctx.currentTime;
      // Happy Major Pentatonic Arpeggio: C5, D5, E5, G5, A5, C6
      const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

      const schedule = () => {
        if (!isPlaying) return;
        // Schedule ahead 0.5 seconds
        while (nextNoteTime < ctx.currentTime + 0.5) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine'; // Soft sine wave for a cute sound
            
            // Randomly pick a note from the scale to make it feel alive but harmonious
            const note = melody[Math.floor(Math.random() * melody.length)];
            osc.frequency.value = note;
            
            // Short playful blips
            gain.gain.setValueAtTime(0.05, nextNoteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + 0.12);

            osc.start(nextNoteTime);
            osc.stop(nextNoteTime + 0.15);

            nextNoteTime += 0.15; // Fast pace
        }
        if (isPlaying) requestAnimationFrame(schedule);
      };
      
      schedule();
      stopAudioRef.current = () => { isPlaying = false; };
    } else {
       if (stopAudioRef.current) stopAudioRef.current();
    }
    
    return () => { if (stopAudioRef.current) stopAudioRef.current(); };
  }, [isProcessing, lastGeneratedImage]);

  // Trigger Success Sound when image arrives
  useEffect(() => {
    if (lastGeneratedImage) {
        playSound('success');
    }
  }, [lastGeneratedImage]);

  // Countdown Logic
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
        playSound('beep');
        const timer = setTimeout(() => {
            setCountdown(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearTimeout(timer);
    } else if (countdown === 0) {
        performCapture();
        setCountdown(null);
    }
  }, [countdown]);

  const handleShutterClick = () => {
    if (isProcessing || !selectedCharacter || countdown !== null) return;

    // Logic Tree:
    // 1. If Uploaded Image -> Snap Immediately
    // 2. If Camera INACTIVE (or Error) -> Activate it (Ask Perms)
    // 3. If Camera ACTIVE -> Start Countdown

    if (uploadedImage) {
        performCapture();
    } else if (!isCameraActive || cameraError) {
        setCameraError(null);
        setIsCameraActive(true);
        // This triggers the useEffect to call getUserMedia, prompting for permissions
    } else {
        // Only start countdown if the video stream is actually ready
        if (videoRef.current && videoRef.current.readyState >= 3) {
            setCountdown(3);
        } else {
            console.log("Camera initializing...");
            // Optional: You could show a toaster or UI feedback here
        }
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (typeof event.target?.result === 'string') {
                setUploadedImage(event.target.result);
                setCameraError(null); // Clear camera error if present
                setIsCameraActive(false); // Stop camera stream if we upload
            }
        };
        reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const performCapture = () => {
    if (!canvasRef.current) return;
    
    // Check if we are capturing from video or uploaded image
    const source: CanvasImageSource | null = uploadedImage ? imgRef.current : videoRef.current;
    
    if (!source) return;

    playSound('snap');
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get dimensions based on source type
    let sourceWidth = 0;
    let sourceHeight = 0;

    if (uploadedImage && imgRef.current) {
        sourceWidth = imgRef.current.naturalWidth;
        sourceHeight = imgRef.current.naturalHeight;
    } else if (videoRef.current) {
        sourceWidth = videoRef.current.videoWidth;
        sourceHeight = videoRef.current.videoHeight;
    }

    // Calculate crop
    const size = Math.min(sourceWidth, sourceHeight);
    const startX = (sourceWidth - size) / 2;
    const startY = (sourceHeight - size) / 2;

    canvas.width = 512;
    canvas.height = 512;
    
    // Only mirror if it's the live camera
    if (!uploadedImage) {
        ctx.translate(512, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(source, startX, startY, size, size, 0, 0, 512, 512);

    onCapture(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full max-w-[340px] px-4 md:px-0">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Hidden Image for Upload Processing */}
      {uploadedImage && (
        <img 
            ref={imgRef} 
            src={uploadedImage} 
            className="hidden" 
            alt="source" 
            onLoad={() => {
                // Auto-trigger capture when uploaded image is ready
                // Only if a character is selected and we aren't already busy
                if (selectedCharacter && !isProcessing) {
                    performCapture();
                }
            }}
        />
      )}

      {/* --- CAMERA BODY --- */}
      <div className="z-20 w-full bg-[#111] rounded-[2rem] p-4 shadow-2xl border border-[#333] relative">
        
        {/* Top Indicators */}
        <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${cameraError ? 'bg-red-500' : isCameraActive || uploadedImage ? 'bg-[#00dbff]' : 'bg-gray-600'}`}></div>
                <div className="w-2 h-2 rounded-full bg-[#333]"></div>
            </div>
            <div className="text-[10px] font-mono text-gray-600 tracking-widest">CYBER-OPTICS</div>
        </div>

        {/* Viewfinder Lens */}
        <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden border border-[#333] group shadow-inner flex items-center justify-center">
            {uploadedImage ? (
                // --- UPLOAD MODE VIEW ---
                <>
                    <img 
                        src={uploadedImage} 
                        className="w-full h-full object-cover" 
                        alt="Uploaded Preview" 
                    />
                    <button 
                        onClick={() => {
                            setUploadedImage(null);
                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors z-40"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="absolute top-2 left-2 bg-[#00dbff]/20 border border-[#00dbff] px-2 py-0.5 rounded">
                        <span className="text-[8px] font-bold text-[#00dbff] tracking-widest">DATA_LINK: ACTIVE</span>
                    </div>
                </>
            ) : isCameraActive && !cameraError ? (
                // --- LIVE CAMERA VIEW ---
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                />
            ) : (
                // --- STANDBY / ERROR VIEW ---
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0a0a0a]">
                     {cameraError ? (
                         <div className="text-red-500 text-xs font-mono mb-4 border border-red-900/50 bg-red-900/10 p-2 rounded">
                            {cameraError}
                         </div>
                     ) : (
                         <div className="text-[#00dbff]/50 text-[10px] font-mono mb-6 tracking-[0.2em] animate-pulse">
                            VIDEO FEED STANDBY
                         </div>
                     )}
                     
                     {/* Primary Call to Action in Standby */}
                     <button 
                        onClick={() => selectedCharacter && fileInputRef.current?.click()}
                        disabled={!selectedCharacter}
                        className={`
                            group relative px-6 py-3 bg-[#111] border border-[#333] rounded-lg transition-all overflow-hidden
                            ${selectedCharacter 
                                ? 'hover:border-[#00dbff] hover:shadow-[0_0_15px_rgba(0,219,255,0.2)] cursor-pointer' 
                                : 'opacity-40 cursor-not-allowed'}
                        `}
                     >
                        <div className="absolute inset-0 bg-[#00dbff]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <div className="flex flex-col items-center relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 group-hover:text-white mb-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-[10px] font-bold text-gray-300 group-hover:text-[#00dbff] tracking-wider">
                                UPLOAD PHOTO
                            </span>
                        </div>
                     </button>

                     <p className="text-[9px] text-gray-600 mt-4 max-w-[150px] leading-tight">
                        Select a source image to begin neural processing.
                     </p>
                </div>
            )}
            
            {/* Common Overlays (Countdown, Flash, HUD) */}
            {((isCameraActive && !cameraError) || uploadedImage) && (
                <>
                    {/* Countdown Overlay - only show for live camera */}
                    {countdown !== null && countdown > 0 && !uploadedImage && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                            <div 
                                key={countdown} 
                                className="text-[#00dbff]/80 text-9xl font-black animate-[ping_0.5s_ease-out] drop-shadow-[0_0_15px_rgba(0,219,255,0.5)]"
                            >
                                {countdown}
                            </div>
                        </div>
                    )}

                    <div className={`absolute inset-0 bg-white transition-opacity duration-75 pointer-events-none ${flashActive ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    {/* Minimalist HUD */}
                    <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none"></div>
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/40 pointer-events-none"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/40 pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/40 pointer-events-none"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/40 pointer-events-none"></div>
                    
                    {selectedCharacter && (
                        <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                            <span className="text-[9px] text-white/70 bg-black/50 px-2 py-0.5 rounded font-mono uppercase">
                                {selectedCharacter.name}
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex justify-between items-center px-4 pb-2">
            {/* Left Control: Upload (Secondary access) */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing || !selectedCharacter}
                className={`
                    w-10 h-10 rounded-lg border flex items-center justify-center transition-all group
                    ${isProcessing || !selectedCharacter 
                        ? 'border-gray-800 bg-[#111] text-gray-700 cursor-not-allowed' 
                        : 'border-[#333] bg-[#1a1a1a] hover:border-[#00dbff] hover:text-[#00dbff] hover:bg-[#222]'}
                `}
                title={selectedCharacter ? "Upload Local Photo" : "Select Hero First"}
            >
                <div className="relative">
                     {!uploadedImage && selectedCharacter && (
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00dbff] rounded-full animate-bounce"></div>
                     )}
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </div>
            </button>

            {/* Main Shutter / Power Button */}
            <button
                onClick={handleShutterClick}
                disabled={isProcessing || !selectedCharacter || countdown !== null}
                className={`
                    w-14 h-14 rounded-full border-2 transition-all duration-200 flex items-center justify-center group
                    ${isProcessing || !selectedCharacter || countdown !== null
                        ? 'border-gray-700 bg-gray-900 cursor-not-allowed' 
                        : 'border-[#333] bg-[#1a1a1a] hover:border-[#00dbff] hover:shadow-[0_0_15px_rgba(0,219,255,0.3)]'}
                `}
                title={!isCameraActive && !uploadedImage ? "Turn on Camera" : "Take Photo"}
            >
                {/* Center Logic */}
                {countdown !== null && !uploadedImage ? (
                    <div className="text-[#00dbff] font-mono font-bold text-xl">{countdown}</div>
                ) : !isCameraActive && !uploadedImage ? (
                    /* Power Icon for Activation */
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 group-hover:text-[#00dbff]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                    </svg>
                ) : (
                    /* Shutter Dot */
                    <div className={`w-10 h-10 rounded-full transition-all ${isProcessing ? 'bg-gray-700' : 'bg-white group-hover:scale-90'}`}></div>
                )}
            </button>

            {/* Right Control: Placeholder / Info */}
             <div className="w-10 h-10 flex items-center justify-center">
                 {isCameraActive && !cameraError && (
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]" title="Live Feed Active"></div>
                 )}
             </div>
        </div>
        
        {/* The Output Slot (Visual gap at bottom) */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-[#050505] rounded-b-lg border-x border-b border-[#222]"></div>
      </div>

      {/* --- PRINTING PHOTO --- */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[90%] md:w-[280px] h-[340px] z-10 pointer-events-none perspective-1000">
         {(isProcessing || currentProcessingImage) && (
            <div className={`
                w-full h-full bg-white p-3 pb-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] 
                flex flex-col animate-print-out origin-top border border-gray-200
            `}>
                <div className="flex-1 bg-black relative overflow-hidden group">
                    {/* 1. Base captured image (Wait for develop) */}
                    <img 
                        src={currentProcessingImage || ''} 
                        className="absolute inset-0 w-full h-full object-cover animate-develop" 
                        style={{ filter: lastGeneratedImage ? 'none' : 'grayscale(100%) brightness(0.4)' }}
                    />
                    
                    {/* 2. Scanning light & TEXT during processing */}
                    {!lastGeneratedImage && (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00dbff]/40 to-transparent h-[40%] w-full animate-[scan_1.5s_linear_infinite] mix-blend-screen"></div>
                            
                            {/* Central Spinner */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 border-2 border-[#00dbff] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#00dbff]"></div>
                            </div>

                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <div className="inline-block bg-black/80 border border-[#00dbff]/50 px-3 py-1">
                                    <span className="text-[#00dbff] text-[10px] font-mono font-bold animate-pulse tracking-widest block">
                                        {loadingMessages[loadingStep]}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 3. Final Image Fading In */}
                    {lastGeneratedImage && (
                        <img 
                            src={lastGeneratedImage} 
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100"
                        />
                    )}
                </div>
                
                <div className="mt-3 flex justify-between items-end font-mono text-[9px] text-gray-400">
                    <span className="uppercase tracking-wider font-bold text-gray-800">{selectedCharacter?.name}</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>
         )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
