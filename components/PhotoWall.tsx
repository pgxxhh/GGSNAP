import React from 'react';
import { GalleryItem } from '../types';

interface PhotoWallProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
  onSelect: (item: GalleryItem) => void;
}

export const PhotoWall: React.FC<PhotoWallProps> = ({ items, onDelete, onSelect }) => {
  return (
    <div className="w-full h-full flex flex-col pt-6 bg-[#050505]">
        
        {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-800 opacity-60">
                <div className="w-12 h-12 border border-dashed border-gray-800 rounded flex items-center justify-center mb-2">
                    <span className="text-xl">+</span>
                </div>
                <p className="font-mono text-[10px] tracking-widest">ARCHIVE_EMPTY</p>
                <p className="text-[9px] text-gray-800 mt-1">AWAITING INPUT DATA</p>
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.slice().reverse().map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => onSelect(item)}
                            className="relative group perspective-500 cursor-pointer"
                        >
                             <div className="bg-[#111] p-1.5 border border-[#222] shadow-lg transition-all duration-300 group-hover:border-[#ff00ff] group-hover:shadow-[0_0_15px_rgba(255,0,255,0.15)] group-hover:-translate-y-1">
                                
                                <div className="aspect-square bg-black overflow-hidden relative">
                                    <img src={item.generated} alt="Generated" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    {/* Scanline overlay on hover */}
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity"></div>
                                </div>
                                
                                <div className="mt-1.5 flex justify-between items-center border-t border-[#222] pt-1">
                                    <span className="text-[8px] text-gray-500 font-mono truncate max-w-[60px]">
                                        #{item.id.slice(-4)}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-[#ff00ff] opacity-50"></span>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item.id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-[#ff00ff] text-white rounded-none clip-path-slant p-1 opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-[#d900d9] shadow-md hover:scale-110"
                                    title="Delete Asset"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                             </div>
                             
                             {/* Hover Overlay for Download/View */}
                             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                                <span className="bg-black/80 backdrop-blur text-[#00dbff] border border-[#00dbff] px-2 py-0.5 text-[8px] font-bold">
                                    VIEW_DATA
                                </span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};