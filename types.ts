export interface Character {
  id: string;
  name: string;
  game: string;
  description: string;
  stylePrompt: string;
  color: string; // Tailwind color class suitable for background
  accentColor: string;
  imageUrl: string; // Placeholder for the character selector
}

export interface GalleryItem {
  id: string;
  original: string;
  generated: string;
  characterId: string;
  timestamp: number;
}
