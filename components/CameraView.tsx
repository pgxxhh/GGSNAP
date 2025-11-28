import React, { useRef, useEffect, useState } from 'react';
import { POLAROID_DIMENSIONS } from '../constants';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  onBack: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1080 },
            height: { ideal: 1080 } // Try to get square-ish or portrait
          },
          audio: false,
        });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera permission denied or not available.");
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Calculate crop to make it square
      const size = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;

      canvas.width = 512;
      canvas.height = 512;

      // Flip horizontally for mirror effect logic
      ctx.translate(512, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(
        video,
        startX, startY, size, size, // Source crop
        0, 0, 512, 512 // Destination
      );

      const base64 = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(base64);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
        <button 
            onClick={onBack}
            className="absolute top-4 left-4 z-20 bg-white/50 backdrop-blur rounded-full p-2 hover:bg-white/80 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-800">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
        </button>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800 bg-black w-full max-w-[350px] aspect-[4/5] flex items-center justify-center">
        {error ? (
          <div className="text-white text-center p-6">{error}</div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100" // Mirror the preview
          />
        )}
        
        {/* Viewfinder overlay */}
        <div className="absolute inset-0 border-[20px] border-black/30 pointer-events-none rounded-3xl"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-48 h-48 border-2 border-white/50 border-dashed rounded-full"></div>
        </div>
      </div>

      <div className="mt-8 flex items-center space-x-8">
        <button
          onClick={handleSnap}
          disabled={!!error}
          className="w-20 h-20 rounded-full border-4 border-gray-300 bg-red-500 shadow-[0_0_0_4px_rgba(255,0,0,0.3)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group"
        >
            <div className="w-16 h-16 rounded-full border-2 border-red-300 bg-red-500 group-hover:bg-red-400"></div>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
