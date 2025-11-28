import React, { useRef, useEffect, useState } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  
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
    const startCamera = async () => {
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
        setCameraError("CAMERA OFFLINE");
      }
    };
    startCamera();
    return () => {
        if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, []);

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

  const playSound = (type: 'snap' | 'success') => {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'snap') {
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

  const handleSnap = () => {
    if (!videoRef.current || !canvasRef.current || cameraError) return;
    playSound('snap');
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    canvas.width = 512;
    canvas.height = 512;
    ctx.translate(512, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 512, 512);

    onCapture(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full max-w-[340px] px-4 md:px-0">
      
      {/* --- CAMERA BODY --- */}
      <div className="z-20 w-full bg-[#111] rounded-[2rem] p-4 shadow-2xl border border-[#333] relative">
        
        {/* Top Indicators */}
        <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${cameraError ? 'bg-red-500' : 'bg-[#00dbff]'}`}></div>
                <div className="w-2 h-2 rounded-full bg-[#333]"></div>
            </div>
            <div className="text-[10px] font-mono text-gray-600 tracking-widest">CYBER-OPTICS</div>
        </div>

        {/* Viewfinder Lens */}
        <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden border border-[#333] group shadow-inner">
            {cameraError ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs font-mono">{cameraError}</div>
            ) : (
                <>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                />
                <div className={`absolute inset-0 bg-white transition-opacity duration-75 pointer-events-none ${flashActive ? 'opacity-100' : 'opacity-0'}`}></div>
                
                {/* Minimalist HUD */}
                <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none"></div>
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/40"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/40"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/40"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/40"></div>
                
                {selectedCharacter && (
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                        <span className="text-[9px] text-white/70 bg-black/50 px-2 py-0.5 rounded font-mono uppercase">
                            {selectedCharacter.name}
                        </span>
                    </div>
                )}
                </>
            )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex justify-center pb-2">
            <button
                onClick={handleSnap}
                disabled={isProcessing || !!cameraError || !selectedCharacter}
                className={`
                    w-14 h-14 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                    ${isProcessing || !selectedCharacter 
                        ? 'border-gray-700 bg-gray-900 cursor-not-allowed' 
                        : 'border-[#333] bg-[#1a1a1a] hover:border-[#00dbff] hover:shadow-[0_0_15px_rgba(0,219,255,0.3)]'}
                `}
            >
                <div className={`w-10 h-10 rounded-full transition-all ${isProcessing ? 'bg-gray-700' : 'bg-white hover:scale-90'}`}></div>
            </button>
        </div>
        
        {/* The Output Slot (Visual gap at bottom) */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-[#050505] rounded-b-lg border-x border-b border-[#222]"></div>
      </div>

      {/* --- PRINTING PHOTO --- */}
      {/* This element is absolutely positioned relative to the container but z-index behind the camera body */}
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