import React, { useState, useEffect } from 'react';
import { GridSize, StudySettings, CardOrientation, ThemeMode, CardBackgroundStyle } from '../types';
import { sounds } from '../lib/sound';
import { LOGO_OPTIONS, DEFAULT_LOGO_ID } from '../data/logoOptions';
import { X, Clock, Grid3X3, Volume2, RotateCcw, Sparkles, ArrowLeftRight, Moon, Sun, Monitor, AlertTriangle, Trash2, Palette, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudySettings;
  onUpdateSettings: (newSettings: StudySettings) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [showResetWarning, setShowResetWarning] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showResetWarning) {
          sounds.playPop();
          setShowResetWarning(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showResetWarning, onClose]);

  if (!isOpen) return null;

  const handleOpenResetWarning = () => {
    sounds.playPop();
    setShowResetWarning(true);
  };

  const handleCancelReset = () => {
    sounds.playPop();
    setShowResetWarning(false);
  };

  const handleConfirmReset = () => {
    sounds.playPop();
    onResetProgress();
    setShowResetWarning(false);
    onClose();
  };

  const handleTimerChange = (val: number) => {
    sounds.playPop();
    onUpdateSettings({
      ...settings,
      flipTimerDuration: val,
    });
  };

  const handleOrientationChange = (orientation: CardOrientation) => {
    sounds.playPop();
    onUpdateSettings({
      ...settings,
      cardOrientation: orientation,
    });
  };

  const handleThemeChange = (mode: ThemeMode) => {
    sounds.playPop();
    onUpdateSettings({
      ...settings,
      themeMode: mode,
    });
  };

  const handleBackgroundStyleChange = (style: CardBackgroundStyle) => {
    sounds.playPop();
    onUpdateSettings({
      ...settings,
      cardBackgroundStyle: style,
    });
  };

  const handleLogoGraphicChange = (logoId: string) => {
    sounds.playPop();
    onUpdateSettings({
      ...settings,
      logoGraphicId: logoId,
    });
  };

  const handleGridChange = (size: GridSize) => {
    sounds.playPop();
    onUpdateSettings({
      ...settings,
      gridSize: size,
    });
  };

  const handleSoundToggle = (enabled: boolean) => {
    sounds.setEnabled(enabled);
    if (enabled) sounds.playPop();
    onUpdateSettings({
      ...settings,
      soundEnabled: enabled,
    });
  };

  const currentTheme = settings.themeMode || 'system';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
              Study & Game Settings
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Appearance / Dark Mode */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Theme / Appearance</span>
              </label>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60 capitalize">
                {currentTheme === 'system' ? 'System (Auto)' : currentTheme}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Defaults to your device's system appearance (dark or light), or lock it to your personal preference.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleThemeChange('system')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  currentTheme === 'system'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>System</span>
              </button>

              <button
                onClick={() => handleThemeChange('light')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  currentTheme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  currentTheme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Card Flip Timer Setting */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Card-Flip Timer (Default: 15s)</span>
              </label>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
                {settings.flipTimerDuration === 0 ? 'Manual (0s)' : `${settings.flipTimerDuration} seconds`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Time before card auto-flips once started. Use the green Start button to begin countdown or tap anytime to flip. Set to 0 for manual tap-to-flip.
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 15, 25].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleTimerChange(sec)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                    settings.flipTimerDuration === sec
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {sec === 0 ? 'Manual' : `${sec}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Starting Side (Q/A) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Card Starting Side (Q/A)</span>
              </label>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
                {settings.cardOrientation === 'definition-first' ? 'A → Q' : 'Q → A'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Choose whether flashcards start with the Term/Question face or Definition/Answer face.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOrientationChange('term-first')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  settings.cardOrientation !== 'definition-first'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                Q → A (Question First)
              </button>
              <button
                onClick={() => handleOrientationChange('definition-first')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  settings.cardOrientation === 'definition-first'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                A → Q (Answer First)
              </button>
            </div>
          </div>

          {/* Card Background Style Setting */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Card Background Style</span>
              </label>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/60">
                {(settings.cardBackgroundStyle || 'illustrated') === 'illustrated' ? 'Illustrated' : 'Minimal'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Choose between ambient watercolor gradients with sticker watermarks and tactile textures, or classic solid cards.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleBackgroundStyleChange('illustrated')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  (settings.cardBackgroundStyle || 'illustrated') === 'illustrated'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                ✨ Illustrated / Ambient
              </button>
              <button
                type="button"
                onClick={() => handleBackgroundStyleChange('minimal')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  settings.cardBackgroundStyle === 'minimal'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                ◻️ Minimal / Clean
              </button>
            </div>
          </div>

          {/* BrainGrid Studio Logo & Icon Graphic Setting */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>BrainGrid Studio Brand Logo Graphic</span>
              </label>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-pink-800/60">
                {LOGO_OPTIONS.find((l) => l.id === (settings.logoGraphicId || DEFAULT_LOGO_ID))?.name || 'Synapse Matrix'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Choose your preferred visual emblem for BrainGrid Studio's header badge and brand identity:
            </p>

            <div className="grid grid-cols-1 gap-2">
              {LOGO_OPTIONS.map((logo) => {
                const isSelected = (settings.logoGraphicId || DEFAULT_LOGO_ID) === logo.id;
                return (
                  <button
                    key={logo.id}
                    type="button"
                    onClick={() => handleLogoGraphicChange(logo.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shadow-xs">
                      {logo.imageSrc ? (
                        <img
                          src={logo.imageSrc}
                          alt={logo.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold">{logo.emoji || '⚡'}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {logo.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {logo.subtitle}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {logo.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matching Grid Size Setting */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Grid3X3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Matching Grid Size (Default: 2x3)</span>
              </label>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/60">
                {settings.gridSize}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Grid layout and number of pairs (2x3 = 3 pairs, 3x4 = 6 pairs, 4x4 = 8 pairs).
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(['2x3', '3x4', '4x4'] as GridSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => handleGridChange(size)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                    settings.gridSize === size
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sound FX Setting */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  <span>Tactile Sound Effects</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Playful card swooshes, buzzer cues, and celebration fanfares.
                </p>
              </div>

              <button
                onClick={() => handleSoundToggle(!settings.soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Data Reset */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Clear local sticker canvas & records:</span>
            <button
              id="open-reset-warning-btn"
              type="button"
              onClick={handleOpenResetWarning}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* Warning Confirmation Modal */}
      {showResetWarning && (
        <div
          id="reset-warning-modal-backdrop"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelReset();
            }
          }}
        >
          <div
            id="reset-warning-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-warning-title"
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-red-200 dark:border-red-900/60 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
          >
            {/* Header with 'X' at the top right corner */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 dark:border-red-900/40 bg-red-50/70 dark:bg-red-950/40">
              {/* Title on left */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 id="reset-warning-title" className="font-display font-bold text-base sm:text-lg text-red-700 dark:text-red-400">
                  Reset All Data?
                </h4>
              </div>

              {/* Top-right close X button (default action: Cancel) */}
              <button
                id="reset-warning-close-btn"
                type="button"
                onClick={handleCancelReset}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-red-100/70 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                title="Cancel and close (Default: Cancel)"
                aria-label="Close and cancel reset"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Explanations 1-4 */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                This will perform a complete reset of all your local application data. The following will be reset or lost:
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm">
                {/* 1. Stickers & Canvas */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 transition-colors">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-900/60 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100">Stickers & Canvas: </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Clears all placed stickers from your sticker canvas scenes and resets your unlocked stickers back to the initial starter set (the first two stickers).
                    </span>
                  </div>
                </div>

                {/* 2. Custom Decks & Packs */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 transition-colors">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-900/60 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100">Custom Decks & Themes: </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Removes any custom flashcard decks, imported sticker packs, and custom themes you created, keeping all original core starter decks and built-in packs.
                    </span>
                  </div>
                </div>

                {/* 3. Settings */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 transition-colors">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-900/60 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100">Settings: </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Restores all study settings (15s timer, 2x3 matching grid, sound effects enabled, default question-first orientation, illustrated card backgrounds, and system theme) back to defaults.
                    </span>
                  </div>
                </div>

                {/* 4. Active Selection & View */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 transition-colors">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-900/60 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100">Active View & Selection: </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Returns to the first-open Card Flip study view with the first starter deck selected and round progress reset.
                    </span>
                  </div>
                </div>
              </div>

              {/* Are you sure prompt */}
              <div className="pt-2 text-center">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  Are you sure you want to reset all data? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Footer Choices */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <button
                id="reset-warning-cancel-btn"
                type="button"
                onClick={handleCancelReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:dark:bg-slate-800 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer text-center"
              >
                Cancel (Keep My Data)
              </button>
              <button
                id="reset-warning-confirm-btn"
                type="button"
                onClick={handleConfirmReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Reset Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
