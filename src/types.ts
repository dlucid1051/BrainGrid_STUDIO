export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  category?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  icon: string;
  cards: Flashcard[];
  isCustom?: boolean;
  createdAt: number;
}

export type StudyMode = 'card-flip' | 'matching-grid' | 'quiz' | 'sticker-vault';

export type GridSize = '2x3' | '3x4' | '4x4';

export type CardOrientation = 'term-first' | 'definition-first';

export type CardBackgroundStyle = 'illustrated' | 'minimal';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface StudySettings {
  flipTimerDuration: number; // in seconds, default 15, 0 = manual tap-to-flip only
  gridSize: GridSize; // default '2x3'
  soundEnabled: boolean;
  autoFlip: boolean;
  cardOrientation?: CardOrientation; // 'term-first' (Q -> A) or 'definition-first' (A -> Q)
  themeMode?: ThemeMode; // 'system' (default, matches OS) | 'light' | 'dark'
  cardBackgroundStyle?: CardBackgroundStyle; // 'illustrated' (default, ambient gradients + watermark) | 'minimal' (clean solid)
  logoGraphicId?: string; // e.g. 'synapse' | 'isometric' | 'circuit' | 'prism' | 'classic-emoji'
}

export const DEFAULT_SETTINGS: StudySettings = {
  flipTimerDuration: 15,
  gridSize: '2x3',
  soundEnabled: true,
  autoFlip: true,
  cardOrientation: 'term-first',
  themeMode: 'system',
  cardBackgroundStyle: 'illustrated',
  logoGraphicId: 'synapse',
};

export type StickerRarity = 'Common' | 'Rare' | 'Legendary' | 'Mythic';

export interface CustomBackgroundConfig {
  type: 'image' | 'svg';
  // For image wallpaper:
  imageUrl?: string;
  backgroundImageUrl?: string;
  opacity?: number; // 0 to 100
  dimming?: number; // 0 to 100 (darkness overlay)
  overlayColor?: string; // hex
  blur?: number; // 0 to 16
  fitMode?: 'cover' | 'contain' | 'center';
  gridOverlay?: 'none' | 'dots' | 'lines' | 'isometric';
  // For SVG builder:
  svgMarkup?: string;
  presetTemplate?: string;
}

export interface Sticker {
  id: string;
  name: string;
  packId: string;
  rarity: StickerRarity;
  svgIcon: string; // SVG or inline icon markup or image data URL
  color: string;
  description: string;
  isCustomImage?: boolean;
  isUnlocked?: boolean;
  tags?: string[];
}

export interface StickerPack {
  id: string;
  name: string;
  theme: string;
  description: string;
  icon: string;
  stickers: Sticker[];
  isUnlocked: boolean;
  isCustom?: boolean;
  author?: string;
  themeSceneId?: string; // Links to a companion canvas scene for combo packs
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number; // percentage (0 - 100) or pixels
  y: number;
  rotation: number; // -180 to 180 degrees
  scale: number; // 0.6 to 2.0
  isFlipped?: boolean; // Horizontal mirror (flip)
  sceneId?: string; // which canvas scene / page this sticker belongs to
  packId?: string; // Companion pack ID linkage for resilient theme persistence
  stickerSnapshot?: {
    name: string;
    svgIcon: string;
    rarity?: StickerRarity;
  };
}

export interface CanvasScene {
  id: string;
  name: string;
  theme: string;
  bgGradient: string;
  decorClass?: string;
  pattern: 'dots' | 'grid' | 'stars' | 'notebook' | 'arcade' | 'ocean' | 'custom-image' | 'custom-svg';
  isCustom?: boolean;
  author?: string;
  customConfig?: CustomBackgroundConfig;
  packId?: string; // If linked with a combo pack
}

export interface ExportedSticker {
  id?: string;
  name: string;
  rarity: StickerRarity;
  svgIcon: string;
  color: string;
  description: string;
  isCustomImage?: boolean;
  isUnlocked?: boolean;
  tags?: string[];
}

export interface VaultPackFile {
  version: 1;
  format: 'braingrid-vault-pack';
  packType: 'combo' | 'stickers-only' | 'background-only';
  name: string;
  author?: string;
  description: string;
  icon?: string;
  stickers?: ExportedSticker[];
  themeScene?: Omit<CanvasScene, 'id' | 'packId'>;
  createdAt: number;
}

export interface StudyResult {
  mode: StudyMode;
  deckId: string;
  totalQuestions: number;
  correctAnswers: number;
  perfectRun: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}
