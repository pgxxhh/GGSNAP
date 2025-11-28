import React, { useEffect, useState } from 'react';
import { Character } from '../types';

interface PolaroidPrinterProps {
  originalImage: string;
  generatedImage: string | null;
  character: Character;
  isProcessing: boolean;
  onReset: () => void;
}

export const PolaroidPrinter: React.FC<PolaroidPrinterProps> = ({
  originalImage,
  generatedImage,
  character,
  isProcessing,
  onReset
}) => {
  const [printStage, setPrintStage] = useState<'hidden' | 'printing' | 'developing' | 'done'>('hidden');
  const [loadingText, setLoadingText] = useState('Analyzing...');

  useEffect(() => {
    if (isProcessing) {
        // Start printing animation immediately
        setPrintStage('printing');
        
        // Cycle through creative steps
        const steps = [
            'Analyzing facial features...',
            'Sketching character outline...',
            'Applying base colors...',
            'Adding stylistic details...',
            'Finalizing artwork...'
        ];
        let stepIndex = 0;
        setLoadingText(steps[0]);
        
        const interval = setInterval(() => {
            stepIndex = (stepIndex + 1) % steps.length;
            setLoadingText(steps[stepIndex]);
        }, 1200);
        
        return () => clearInterval(interval);

    } else if (generatedImage) {
        // When image is ready, move to developing
        setPrintStage('developing');
        setTimeout(() => setPrintStage('done'), 4000); // 4 seconds to fully "develop"
    }
  }, [isProcessing, generatedImage]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-md mx-auto h-[600px] justify-start pt-10">
      
      {/* The "Camera" Body (Visual only) */}
      <div className="z-20 w-full bg-gray-900 rounded-t-3xl p-6 shadow-2xl flex flex-col items-center relative border-b-8 border-gray-800">
        <div className="w-full flex justify-between items-center mb-2">
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="text-xs text-gray-400 font-mono tracking-widest">AI-CAM 3000</div>
            </div>
            <div className="w-16 h-4 bg-gray-700 rounded-full"></div>
        </div>
        
        {/* The Slot */}
        <div className="w-[340px] h-2 bg-black rounded-full shadow-inner mb-[-34px] relative z-20"></div>
      </div>

      {/* The Polaroid Photo */}
      <div 
        className={`
            relative z-10 bg-white p-4 pb-12 shadow-xl
            w-[300px] h-[380px] 
            flex flex-col transform transition-all duration-[2000ms] ease-out origin-top
            ${printStage === 'hidden' ? '-translate-y-full opacity-0' : ''}
            ${printStage === 'printing' ? 'translate-y-0' : ''}
            ${printStage === 'developing' || printStage === 'done' ? 'translate-y-8 rotate-[-2deg]' : ''}
        `}
      >
        {/* Photo Area */}
        <div className="bg-gray-900 w-full h-[260px] relative overflow-hidden mb-4">
            {/* Original Image (Fades out) */}
            <img 
                src={originalImage} 
                alt="Original" 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ${printStage === 'done' ? 'opacity-0' : 'opacity-80'}`} 
            />
            
            {/* Generated Image (Fades in) */}
            {generatedImage && (
                <img 
                    src={generatedImage} 
                    alt="AI Generated" 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[4000ms] ease-in ${printStage === 'done' ? 'opacity-100' : 'opacity-0'}`} 
                />
            )}

            {/* Developing Overlay (Darkness that clears) */}
            <div 
                className={`absolute inset-0 bg-black transition-opacity duration-[4000ms] ease-in-out ${printStage === 'done' ? 'opacity-0' : 'opacity-60'}`} 
            ></div>

            {isProcessing && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                 </div>
            )}
        </div>

        {/* Handwritten Note Area */}
        <div className="flex-1 flex flex-col justify-center items-center">
            <div className={`font-['Fredoka'] text-gray-700 text-xl font-bold transition-opacity duration-[2000ms] delay-[2000ms] ${printStage === 'done' ? 'opacity-100' : 'opacity-0'}`}>
                #{character.name}
            </div>
             <div className={`font-['Fredoka'] text-gray-400 text-xs transition-opacity duration-[2000ms] delay-[2500ms] ${printStage === 'done' ? 'opacity-100' : 'opacity-0'}`}>
                {new Date().toLocaleDateString()}
            </div>
        </div>
      </div>

      {/* Controls (Only show when done) */}
      {printStage === 'done' && (
        <div className="mt-12 z-30 flex space-x-4 animate-fade-in-up">
            <a 
                href={generatedImage || ''} 
                download={`toon-polaroid-${character.id}.png`}
                className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-700 transition-colors flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Save
            </a>
            <button 
                onClick={onReset}
                className="bg-white text-gray-900 border-2 border-gray-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                New Photo
            </button>
        </div>
      )}

      {isProcessing && (
        <div className="mt-12 text-gray-500 font-mono animate-pulse w-full text-center">
            {loadingText}
        </div>
      )}
    </div>
  );
};