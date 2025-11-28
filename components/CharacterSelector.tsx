import React from 'react';
import { CHARACTERS } from '../constants';
import { Character } from '../types';

interface CharacterSelectorProps {
  onSelect: (char: Character) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Choose Your Hero
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            onClick={() => onSelect(char)}
            className={`
              relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl 
              transition-all duration-300 transform hover:-translate-y-1 text-left
              bg-white border-4 ${char.accentColor.replace('border-', 'border-')}
            `}
          >
            <div className={`h-24 ${char.color} absolute top-0 left-0 right-0 opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <div className="p-6 flex items-center space-x-4 relative z-10">
              <div className={`
                w-16 h-16 rounded-full border-4 ${char.accentColor} 
                flex-shrink-0 bg-gray-200 overflow-hidden shadow-sm
              `}>
                <img 
                    src={char.imageUrl} 
                    alt={char.name} 
                    className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{char.name}</h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{char.game}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{char.description}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
