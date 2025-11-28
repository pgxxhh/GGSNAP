import React, { useState, useMemo } from 'react';
import { CHARACTERS } from '../constants';
import { Character } from '../types';

interface HeroListProps {
  selectedId: string | undefined;
  onSelect: (char: Character) => void;
}

type GameZone = 'League of Legends' | 'Valorant';

export const HeroList: React.FC<HeroListProps> = ({ selectedId, onSelect }) => {
  const [activeZone, setActiveZone] = useState<GameZone>('League of Legends');

  const filteredCharacters = useMemo(() => {
    return CHARACTERS.filter(char => char.game === activeZone);
  }, [activeZone]);

  return (
    <div className="w-full h-full flex flex-col pt-6">
        {/* Zone Tabs */}
        <div className="flex items-center justify-center px-4 space-x-2 mb-4">
            <button 
                onClick={() => setActiveZone('League of Legends')}
                className={`
                    px-4 py-2 text-[10px] md:text-xs font-bold tracking-widest border transition-all duration-300 clip-path-slant
                    ${activeZone === 'League of Legends' 
                        ? 'border-[#00dbff] bg-[#00dbff]/10 text-[#00dbff] shadow-[0_0_10px_rgba(0,219,255,0.2)]' 
                        : 'border-[#333] text-gray-500 hover:border-gray-500'}
                `}
            >
                LEAGUE
            </button>
            <button 
                onClick={() => setActiveZone('Valorant')}
                className={`
                    px-4 py-2 text-[10px] md:text-xs font-bold tracking-widest border transition-all duration-300 clip-path-slant
                    ${activeZone === 'Valorant' 
                        ? 'border-[#ff4655] bg-[#ff4655]/10 text-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.2)]' 
                        : 'border-[#333] text-gray-500 hover:border-gray-500'}
                `}
            >
                VALORANT
            </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
            {filteredCharacters.map((char) => {
                const isSelected = selectedId === char.id;
                const activeColor = activeZone === 'Valorant' ? '#ff4655' : '#00dbff'; 

                return (
                    <button
                        key={char.id}
                        onClick={() => onSelect(char)}
                        className={`
                            w-full text-left p-2 rounded flex items-center space-x-3 group relative transition-all duration-200
                            ${isSelected 
                                ? 'bg-[#1a1a1a] border-l-4' 
                                : 'bg-transparent border-l-4 border-transparent hover:bg-white/5'}
                        `}
                        style={{ borderColor: isSelected ? activeColor : 'transparent' }}
                    >
                        {/* Avatar */}
                        <div className={`
                            w-10 h-10 rounded overflow-hidden border transition-all
                            ${isSelected ? `border-[${activeColor}]` : 'border-[#333] group-hover:border-gray-500'}
                        `}>
                            <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-gray-400'} group-hover:text-white`}>
                                {char.name}
                            </h3>
                            <p className="text-[9px] text-gray-600 uppercase tracking-wide truncate">{char.description}</p>
                        </div>

                        {/* Status Light */}
                        <div className={`
                            w-1.5 h-1.5 rounded-full transition-all
                            ${isSelected ? 'opacity-100 shadow-[0_0_5px_currentColor]' : 'opacity-0'}
                        `} style={{ backgroundColor: activeColor }}></div>
                    </button>
                );
            })}
        </div>
        
        {/* Fade at bottom of list */}
        <div className="h-6 bg-gradient-to-t from-[#0c0c0c] to-transparent w-full pointer-events-none absolute bottom-0"></div>
    </div>
  );
};