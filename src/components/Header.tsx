import React, { useState, useRef, useEffect } from 'react';
import { Deck, StudyMode, ThemeMode } from '../types';
import { sounds } from '../lib/sound';
import { LOGO_OPTIONS } from '../data/logoOptions';
import { 
  BookOpen, 
  Grid3X3, 
  HelpCircle, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Download, 
  Settings, 
  GraduationCap,
  FolderOpen,
  Moon,
  Sun,
  ChevronDown,
  Check,
  BookMarked
} from 'lucide-react';

interface HeaderProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  decks: Deck[];
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  onOpenDeckManager: () => void;
  onOpenSettings: () => void;
  onOpenTutorGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isInstallable: boolean;
  onInstallPWA: () => void;
  unlockedStickersCount: number;
  totalStickersCount: number;
  themeMode: ThemeMode;
  isDark: boolean;
  onToggleTheme: () => void;
  logoGraphicId?: string;
}

const MODE_ITEMS: {
  id: StudyMode;
  label: string;
  shortLabel: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'card-flip',
    label: 'StudyCards STUDIO',
    shortLabel: 'Cards',
    desc: '3D Flashcards & Active Recall',
    icon: BookOpen,
  },
  {
    id: 'matching-grid',
    label: 'Matching Grid',
    shortLabel: 'Match',
    desc: 'Tile Pairing Memory Game',
    icon: Grid3X3,
  },
  {
    id: 'quiz',
    label: 'Quiz Mode',
    shortLabel: 'Quiz',
    desc: 'Self-Assessment Practice',
    icon: HelpCircle,
  },
];

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  decks,
  selectedDeckId,
  onSelectDeck,
  onOpenDeckManager,
  onOpenSettings,
  onOpenTutorGuide,
  soundEnabled,
  onToggleSound,
  isInstallable,
  onInstallPWA,
  unlockedStickersCount,
  totalStickersCount,
  themeMode,
  isDark,
  onToggleTheme,
  logoGraphicId,
}) => {
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const modeMenuRef = useRef<HTMLDivElement>(null);

  const activeLogo = LOGO_OPTIONS.find((l) => l.id === logoGraphicId) || LOGO_OPTIONS[0];
  const activeModeItem = MODE_ITEMS.find((m) => m.id === currentMode) || MODE_ITEMS[0];
  const ActiveIcon = activeModeItem.icon;

  // Handle click outside to close the mobile mode dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target as Node)) {
        setIsModeMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModeMenuOpen(false);
      }
    };

    if (isModeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModeMenuOpen]);

  const handleTabClick = (mode: StudyMode) => {
    sounds.playPop();
    onSelectMode(mode);
    setIsModeMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-indigo-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
        
        {/* Row 1: App Branding & Utility Action Buttons */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleTabClick('card-flip')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
            title="BrainGrid Studio Home"
          >
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0 overflow-hidden"
              title={`BrainGrid Studio Logo: ${activeLogo.name} (${activeLogo.subtitle})`}
            >
              {activeLogo.imageSrc ? (
                <img
                  src={activeLogo.imageSrc}
                  alt={activeLogo.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center text-base sm:text-lg font-bold">
                  {activeLogo.emoji || '⚡'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  BrainGrid
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold px-1.5 py-0.2 sm:py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60">
                  Studio
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block leading-tight">
                Memory & Flashcards
              </p>
            </div>
          </div>

          {/* Right Action Tools Toolbar (StickerBook STUDIO Launcher, Theme, Audio, Settings, Guide) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Dedicated Mode Switcher Button: StickerBook STUDIO <-> StudyCards STUDIO */}
            {currentMode === 'sticker-vault' ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onSelectMode('card-flip');
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold shadow-xs cursor-pointer shrink-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800/70 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xs group"
                title="Return to StudyCards STUDIO (3D Flashcards & Active Recall)"
                aria-label="StudyCards STUDIO"
              >
                <BookOpen className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform" />
                <span className="hidden sm:inline font-display font-bold">StudyCards STUDIO</span>
                <span className="sm:hidden font-display font-bold">StudyCards</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                  Cards
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onSelectMode('sticker-vault');
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold shadow-xs cursor-pointer shrink-0 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 text-purple-700 dark:text-purple-300 border-pink-200/90 dark:border-purple-800/60 hover:border-pink-300 dark:hover:border-purple-700 hover:shadow-xs group"
                title="Open StickerBook STUDIO - Collectible Stickers & Creative Canvas"
                aria-label="StickerBook STUDIO"
              >
                <BookMarked className="w-4 h-4 shrink-0 text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform" />
                <span className="hidden sm:inline font-display font-bold">StickerBook STUDIO</span>
                <span className="sm:hidden font-display font-bold">StickerBook</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80">
                  {unlockedStickersCount}/{totalStickersCount}
                </span>
              </button>
            )}

            {/* Install PWA Button */}
            {isInstallable && (
              <button
                type="button"
                onClick={onInstallPWA}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                title="Install PWA to Home Screen"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-xl border transition-colors bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-750 hover:text-indigo-600 dark:hover:text-amber-300 relative shrink-0"
              title={
                themeMode === 'system'
                  ? `Theme: System (${isDark ? 'Dark' : 'Light'}) - Click to toggle`
                  : isDark
                  ? 'Theme: Dark - Click to switch to Light'
                  : 'Theme: Light - Click to switch to Dark'
              }
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {themeMode === 'system' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" title="Synced with system" />
              )}
            </button>

            {/* Sound Mute Toggle */}
            <button
              type="button"
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) sounds.playPop();
              }}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors shrink-0 ${
                soundEnabled
                  ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                  : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900/60 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
              }`}
              title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
              aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Settings Modal */}
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onOpenSettings();
              }}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shrink-0"
              title="Study & Timer Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Guide & AI LLM Prompt Tutorial */}
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onOpenTutorGuide();
              }}
              className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/70 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-semibold text-xs transition-colors shrink-0"
              title="User Guide: Study Modes & AI Deck Prompt Tutorial"
              aria-label="User Guide & AI Tutorial"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </div>

        </div>

        {/* Row 2: Active Deck Picker + Mode Dropdown Selector (Hidden in StickerBook STUDIO) */}
        {currentMode !== 'sticker-vault' && (
          <div className="flex items-center justify-between gap-2 sm:gap-3 pt-2 sm:pt-2.5 mt-2 sm:mt-2.5 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-150">
            
            {/* Deck Picker & StudyPack STUDIO Manager */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 max-w-[62%] sm:max-w-md">
              <div className="relative flex-1 min-w-0">
                <select
                  aria-label="Active Deck"
                  value={selectedDeckId}
                  onChange={(e) => {
                    sounds.playPop();
                    onSelectDeck(e.target.value);
                  }}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-2.5 pr-7 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-750 transition-colors"
                >
                  {decks.map((deck) => (
                    <option key={deck.id} value={deck.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                      {deck.title} ({deck.cards.length})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 dark:text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* StudyPack STUDIO Button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onOpenDeckManager();
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-indigo-200/90 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50 to-purple-50/60 dark:from-indigo-950/70 dark:to-purple-950/50 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/80 dark:hover:to-purple-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-all shadow-2xs hover:shadow-xs shrink-0 cursor-pointer group"
                title="StudyPack STUDIO — Manage, Create & Import Flashcard Decks"
                aria-label="StudyPack STUDIO"
              >
                <div className="w-5 h-5 rounded-lg bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-display font-bold">StudyPack</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 leading-none">
                    STUDIO
                  </span>
                </div>
              </button>
            </div>

            {/* Mode Dropdown Selector */}
            <div className="relative flex-1 min-w-0 max-w-[38%] sm:max-w-[230px] md:max-w-[250px]" ref={modeMenuRef}>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setIsModeMenuOpen((prev) => !prev);
                }}
                className="w-full flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border transition-all text-xs sm:text-sm font-bold shadow-xs cursor-pointer bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-slate-700 hover:bg-indigo-100/80 dark:hover:bg-slate-750"
                aria-haspopup="true"
                aria-expanded={isModeMenuOpen}
                title="Switch Study Mode"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
                  <ActiveIcon className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span className="truncate">{activeModeItem.label}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 ${isModeMenuOpen ? 'rotate-180' : ''} text-indigo-500 dark:text-slate-400`} />
              </button>

              {/* Floating Mode Dropdown Menu */}
              {isModeMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 sm:w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Select Study Mode
                  </div>
                  <div className="space-y-0.5">
                    {MODE_ITEMS.map((item) => {
                      const ItemIcon = item.icon;
                      const isSelected = currentMode === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 sm:p-2 rounded-lg border shrink-0 ${
                              isSelected
                                ? 'bg-white dark:bg-slate-700 border-indigo-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 text-slate-500 dark:text-slate-400'
                            }`}>
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-bold truncate flex items-center gap-1.5">
                                <span>{item.label}</span>
                              </div>
                              <div className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </header>
  );
};

