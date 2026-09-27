import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Deck, StudySettings, CardOrientation, Sticker } from '../types';
import { sounds } from '../lib/sound';
import { shuffleArray } from '../lib/engine';
import confetti from 'canvas-confetti';
import { INITIAL_STICKER_PACKS } from '../data/stickerPacks';
import { CARD_PALETTES, CardPalette } from '../lib/cardPalettes';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  Award,
  BookOpen,
  Play,
  Pause,
  ArrowLeftRight
} from 'lucide-react';

interface CardFlipModeProps {
  deck: Deck;
  settings: StudySettings;
  unlockedStickerIds?: string[];
  onUnlockRandomSticker: () => void;
  onOpenVault: () => void;
  onUpdateSettings?: (newSettings: StudySettings) => void;
}

export const CardFlipMode: React.FC<CardFlipModeProps> = ({
  deck,
  settings,
  unlockedStickerIds,
  onUnlockRandomSticker,
  onOpenVault,
  onUpdateSettings,
}) => {
  const activeTimerDuration = settings.flipTimerDuration > 0 ? settings.flipTimerDuration : 15;
  const [cards, setCards] = useState(deck.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(activeTimerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [needsReviewCards, setNeedsReviewCards] = useState<Set<string>>(new Set());
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Card orientation: 'term-first' (Q -> A) or 'definition-first' (A -> Q)
  const isReversed = (settings.cardOrientation || 'term-first') === 'definition-first';
  const isIllustrated = (settings.cardBackgroundStyle || 'illustrated') === 'illustrated';

  // Available stickers for background watermarks
  const allAvailableStickers = useMemo(() => INITIAL_STICKER_PACKS.flatMap((p) => p.stickers), []);
  const activeWatermarkPool = useMemo(() => {
    if (!unlockedStickerIds || unlockedStickerIds.length === 0) {
      return allAvailableStickers;
    }
    const unlocked = allAvailableStickers.filter((s) => unlockedStickerIds.includes(s.id));
    return unlocked.length > 0 ? unlocked : allAvailableStickers;
  }, [unlockedStickerIds, allAvailableStickers]);

  const toggleOrientation = () => {
    if (isTransitioning) return;
    sounds.playPop();
    const nextOrientation: CardOrientation = isReversed ? 'term-first' : 'definition-first';
    if (isFlipped) {
      setIsFlipped(false);
      setIsTransitioning(true);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = window.setTimeout(() => {
        setTimerSeconds(activeTimerDuration);
        setIsTimerRunning(false);
        if (onUpdateSettings) {
          onUpdateSettings({ ...settings, cardOrientation: nextOrientation });
        }
        setIsTransitioning(false);
      }, 260);
    } else {
      setTimerSeconds(activeTimerDuration);
      setIsTimerRunning(false);
      if (onUpdateSettings) {
        onUpdateSettings({ ...settings, cardOrientation: nextOrientation });
      }
    }
  };

  // Sync cards when deck changes
  useEffect(() => {
    setCards(deck.cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setTimerSeconds(activeTimerDuration);
    setIsTimerRunning(false);
    setMasteredCards(new Set());
    setNeedsReviewCards(new Set());
    setRoundCompleted(false);
  }, [deck, activeTimerDuration]);

  // Timer logic: Counts down from activeTimerDuration (e.g., 15s).
  // Can be overridden at any time by tap-to-flip.
  useEffect(() => {
    if (!isTimerRunning || roundCompleted) {
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          // Time is up! Flip to the definition side automatically
          setIsFlipped(true);
          sounds.playFlip();
          return activeTimerDuration; // reset for next review
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, activeTimerDuration, roundCompleted]);

  const toggleTimer = () => {
    sounds.playPop();
    const nextRunning = !isTimerRunning;
    if (nextRunning) {
      if (timerSeconds <= 0) {
        setTimerSeconds(activeTimerDuration);
      }
      if (settings.flipTimerDuration <= 0 && onUpdateSettings) {
        onUpdateSettings({ ...settings, flipTimerDuration: 15 });
      }
    }
    setIsTimerRunning(nextRunning);
  };

  const cycleTimerDuration = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    const durations = [10, 15, 25];
    const current = settings.flipTimerDuration > 0 ? settings.flipTimerDuration : 15;
    const nextIdx = (durations.indexOf(current) + 1) % durations.length;
    const nextDuration = durations[nextIdx === -1 ? 0 : nextIdx];
    setTimerSeconds(nextDuration);
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, flipTimerDuration: nextDuration });
    }
  };

  const handleCardClick = () => {
    if (isTransitioning) return;
    sounds.playFlip();
    setIsFlipped(!isFlipped);
    // Reset timer on manual flip
    setTimerSeconds(activeTimerDuration);
  };

  const handleNext = (fromReviewAction: boolean = false) => {
    if (isTransitioning) return;
    if (!fromReviewAction) {
      sounds.playPop();
    }
    
    if (currentIndex < cards.length - 1) {
      if (isFlipped) {
        // Card is currently showing the back. Flip back first so next answer is not spoiled!
        setIsFlipped(false);
        setIsTransitioning(true);
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = window.setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setTimerSeconds(activeTimerDuration);
          setIsTransitioning(false);
        }, 260);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setTimerSeconds(activeTimerDuration);
      }
    } else {
      // Completed round!
      if (isFlipped) {
        setIsFlipped(false);
        setIsTransitioning(true);
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = window.setTimeout(() => {
          handleCompleteRound();
          setIsTransitioning(false);
        }, 260);
      } else {
        handleCompleteRound();
      }
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    sounds.playPop();
    if (currentIndex > 0) {
      if (isFlipped) {
        setIsFlipped(false);
        setIsTransitioning(true);
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = window.setTimeout(() => {
          setCurrentIndex((prev) => prev - 1);
          setTimerSeconds(activeTimerDuration);
          setIsTransitioning(false);
        }, 260);
      } else {
        setCurrentIndex((prev) => prev - 1);
        setIsFlipped(false);
        setTimerSeconds(activeTimerDuration);
      }
    }
  };

  const handleShuffle = () => {
    if (isTransitioning) return;
    sounds.playPop();
    if (isFlipped) {
      setIsFlipped(false);
      setIsTransitioning(true);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = window.setTimeout(() => {
        setCards(shuffleArray(cards));
        setCurrentIndex(0);
        setTimerSeconds(activeTimerDuration);
        setIsTransitioning(false);
      }, 260);
    } else {
      setCards(shuffleArray(cards));
      setCurrentIndex(0);
      setIsFlipped(false);
      setTimerSeconds(activeTimerDuration);
    }
  };

  const markMastered = () => {
    if (isTransitioning) return;
    sounds.playCorrect();
    const currentCard = cards[currentIndex];
    const newMastered = new Set(masteredCards).add(currentCard.id);
    setMasteredCards(newMastered);

    const newReview = new Set(needsReviewCards);
    newReview.delete(currentCard.id);
    setNeedsReviewCards(newReview);

    handleNext(true);
  };

  const markNeedsReview = () => {
    if (isTransitioning) return;
    sounds.playWrong();
    const currentCard = cards[currentIndex];
    const newReview = new Set(needsReviewCards).add(currentCard.id);
    setNeedsReviewCards(newReview);

    const newMastered = new Set(masteredCards);
    newMastered.delete(currentCard.id);
    setMasteredCards(newMastered);

    handleNext(true);
  };

  const handleCompleteRound = () => {
    setRoundCompleted(true);
    sounds.playFanfare();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
    // Check if user earned a sticker (completed set)
    onUnlockRandomSticker();
  };

  const restartRound = () => {
    sounds.playPop();
    setCurrentIndex(0);
    setIsFlipped(false);
    setRoundCompleted(false);
    setTimerSeconds(activeTimerDuration);
    setIsTimerRunning(false);
    setMasteredCards(new Set());
    setNeedsReviewCards(new Set());
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
        <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="font-display text-lg font-bold text-slate-700">No cards in this deck</h3>
        <p className="text-sm text-slate-500 mt-1">Add cards or import a CSV to start studying!</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const cardSeed = currentCard 
    ? currentCard.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), currentIndex * 7)
    : 0;

  const watermarkSticker: Sticker | undefined = activeWatermarkPool[cardSeed % activeWatermarkPool.length];
  const currentPalette = CARD_PALETTES[cardSeed % CARD_PALETTES.length];

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto w-full px-2 sm:px-4 py-3 sm:py-4">
      {/* Top StudyCards STUDIO Brand Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-3.5 gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xs flex items-center justify-center text-white shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight leading-none bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                StudyCards
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60 leading-none">
                STUDIO
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            Interactive 3D flashcards & active recall training. Master concepts to earn collectible stickers!
          </p>
        </div>
      </div>

      {/* Line 1: Deck Title & Category Badge with Progress Wheel and Counter */}
      <div className="flex items-center justify-between w-full mb-2.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h2 className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base truncate">
            {deck.title}
          </h2>
          {currentCard.category && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 font-semibold text-xs border border-indigo-100 dark:border-indigo-800/60 shrink-0 truncate max-w-[140px] sm:max-w-[200px]">
              {currentCard.category}
            </span>
          )}
        </div>
        
        {/* Progress Wheel and Card Counter */}
        <div className="flex items-center gap-2 shrink-0 pl-2">
          {/* Circular Progress Wheel */}
          <div 
            className="relative flex items-center justify-center shrink-0"
            title={`${progressPercent}% Complete (${currentIndex + 1} of ${cards.length} cards)`}
            aria-label={`${progressPercent}% complete`}
          >
            <svg className="w-5 h-5 -rotate-90 transform" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.75"
                className="text-slate-200 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeDasharray={56.55}
                strokeDashoffset={56.55 - (56.55 * Math.min(Math.max(progressPercent, 0), 100)) / 100}
                strokeLinecap="round"
                className={`${
                  progressPercent >= 100 
                    ? 'text-emerald-500 dark:text-emerald-400' 
                    : 'text-indigo-600 dark:text-indigo-400'
                } transition-all duration-300 ease-out`}
                fill="transparent"
              />
            </svg>
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
            <span className="hidden sm:inline">Card </span>
            <span>{currentIndex + 1} of {cards.length}</span>
          </div>
        </div>
      </div>

      {/* Line 2: Study Controls (Timer, Orientation Toggle, Card Counter) */}
      <div className="flex items-center justify-between w-full mb-3 px-1 gap-2">
        {/* Left: Timer Controls (Start/Stop & Timer Badge) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="timer-toggle-btn"
            onClick={toggleTimer}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
              isTimerRunning
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
            title={isTimerRunning ? 'Stop Timer' : 'Start Timer'}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button 
            id="timer-badge-btn"
            type="button"
            onClick={cycleTimerDuration}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 active:scale-95 ${
              isTimerRunning
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title={`Timer: ${timerSeconds}s remaining (${isTimerRunning ? 'Running' : 'Stopped'}). Click to cycle duration (10s, 15s, 25s).`}
          >
            <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
            <span>{timerSeconds}s</span>
          </button>
        </div>

        {/* Right: Q/A Orientation Toggle & Card Counter */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            id="qa-orientation-toggle-btn"
            onClick={toggleOrientation}
            disabled={isTransitioning}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold border transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-60 disabled:pointer-events-none ${
              isReversed
                ? 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800/80'
                : 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/80'
            }`}
            title={
              isReversed
                ? 'Starting with Definition / Answer (A → Q). Click to start with Term / Question (Q → A).'
                : 'Starting with Term / Question (Q → A). Click to start with Definition / Answer (A → Q).'
            }
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="font-extrabold tracking-wide">
              {isReversed ? 'A → Q' : 'Q → A'}
            </span>
          </button>

          <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 mb-5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Round Completed Screen */}
      {roundCompleted ? (
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-100 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 mx-auto flex items-center justify-center text-3xl shadow-lg mb-4">
            🏆
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Deck Completed!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Fantastic effort! You've reviewed all <span className="font-bold text-indigo-600 dark:text-indigo-400">{cards.length}</span> cards in {deck.title}.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{masteredCards.size}</div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Mastered</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/60 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{needsReviewCards.size}</div>
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">Needs Review</div>
            </div>
          </div>

          {/* Reward Prompt */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-purple-800/60 mb-6 flex items-center gap-3 text-left">
            <span className="text-2xl">✨</span>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wide">
                StickerBook STUDIO Reward
              </h4>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                You earned progress towards unlocking fresh stickers! Check out your sticker album.
              </p>
            </div>
            <button
              onClick={onOpenVault}
              className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
            >
              Open StickerBook
            </button>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={restartRound}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Again</span>
            </button>
          </div>
        </div>
      ) : (
        /* The 3D Interactive Flip Card */
        <div className="w-full flex flex-col items-center">
          <div 
            onClick={handleCardClick}
            className="w-full min-h-[300px] sm:min-h-[360px] perspective-1000 cursor-pointer select-none group"
            title="Click or tap to flip card"
          >
            <div 
              className={`relative w-full h-full min-h-[300px] sm:min-h-[360px] transition-transform duration-500 transform-style-3d rounded-3xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                isIllustrated
                  ? `bg-gradient-to-br ${currentPalette.frontLightBg} ${currentPalette.frontDarkBg} border-2 ${currentPalette.frontBorder}`
                  : 'bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-700 hover:border-indigo-300 hover:dark:border-indigo-500'
              }`}>
                {/* Ambient Corner Glow Washes */}
                {isIllustrated && (
                  <>
                    <div className={`absolute -top-12 -left-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-2xl pointer-events-none ${currentPalette.frontGlowOrb}`} />
                    <div className={`absolute -bottom-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-2xl pointer-events-none ${currentPalette.frontGlowOrb}`} />
                  </>
                )}

                {/* Tactile Dotted Grid Paper Texture */}
                {isIllustrated && (
                  <div 
                    className="absolute inset-0 opacity-[0.08] dark:opacity-[0.11] pointer-events-none rounded-3xl"
                    style={{
                      backgroundImage: 'radial-gradient(currentColor 1.4px, transparent 1.4px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                )}

                {/* Watermark Sticker (Clearer, decreased transparency) */}
                {isIllustrated && watermarkSticker && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
                    aria-hidden="true"
                  >
                    <div className="relative flex flex-col items-center justify-center transform transition-transform duration-700 group-hover:scale-105">
                      <span className="text-[130px] sm:text-[160px] leading-none opacity-[0.25] dark:opacity-[0.28] filter drop-shadow-xs">
                        {watermarkSticker.svgIcon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500/75 dark:text-slate-400/70 -mt-2">
                        {watermarkSticker.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Top Pill */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      isReversed 
                        ? 'text-purple-700 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800/60'
                        : isIllustrated 
                          ? `${currentPalette.badgeLight} ${currentPalette.badgeDark}`
                          : 'text-indigo-500 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-100 dark:border-indigo-800/60'
                    }`}>
                      {isReversed ? 'Definition / Prompt' : 'Term / Question'}
                    </span>
                    {masteredCards.has(currentCard.id) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                        ✓ Mastered
                      </span>
                    )}
                    {needsReviewCards.has(currentCard.id) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                        ↺ Needs Review
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs font-medium">
                    <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Tap to flip</span>
                  </div>
                </div>

                {/* Front Content */}
                <div className="relative z-10 my-auto text-center px-2 py-4">
                  {isReversed ? (
                    <p className="font-body font-bold text-lg sm:text-2xl text-slate-950 dark:text-slate-100 leading-relaxed max-w-xl mx-auto">
                      {currentCard.definition}
                    </p>
                  ) : (
                    <h3 className="font-display font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white leading-snug tracking-tight">
                      {currentCard.term}
                    </h3>
                  )}
                </div>

                {/* Card Bottom Hint */}
                <div className="relative z-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {isTimerRunning
                    ? `Auto-flips in ${timerSeconds}s or click anywhere to flip now`
                    : `Timer stopped (${timerSeconds}s) • Click Start or click anywhere to flip`}
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                isIllustrated
                  ? `bg-gradient-to-br ${currentPalette.backLightBg} ${currentPalette.backDarkBg} border-2 ${currentPalette.backBorder}`
                  : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/70 border-2 border-purple-200 dark:border-purple-800/80 hover:border-purple-300 hover:dark:border-purple-700'
              }`}>
                {/* Back Corner Ambient Glow Washes */}
                {isIllustrated && (
                  <>
                    <div className={`absolute -top-12 -left-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-2xl pointer-events-none ${currentPalette.backGlowOrb}`} />
                    <div className={`absolute -bottom-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-2xl pointer-events-none ${currentPalette.backGlowOrb}`} />
                  </>
                )}

                {/* Tactile Dotted Grid Paper Texture */}
                {isIllustrated && (
                  <div 
                    className="absolute inset-0 opacity-[0.08] dark:opacity-[0.11] pointer-events-none rounded-3xl"
                    style={{
                      backgroundImage: 'radial-gradient(currentColor 1.4px, transparent 1.4px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                )}

                {/* Back Watermark Sticker (Clearer, decreased transparency for celebration) */}
                {isIllustrated && watermarkSticker && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
                    aria-hidden="true"
                  >
                    <div className="relative flex flex-col items-center justify-center transform transition-transform duration-700 group-hover:scale-105">
                      <span className="text-[130px] sm:text-[160px] leading-none opacity-[0.32] dark:opacity-[0.36] filter drop-shadow-md">
                        {watermarkSticker.svgIcon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600/75 dark:text-purple-300/70 -mt-2">
                        {watermarkSticker.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Top Pill */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    isReversed 
                      ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800/60'
                      : 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800/60'
                  }`}>
                    {isReversed ? 'Term / Answer' : 'Definition / Answer'}
                  </span>
                  <div className="flex items-center gap-1 text-purple-500 dark:text-purple-400 text-xs font-medium">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Tap to flip back</span>
                  </div>
                </div>

                {/* Back Content */}
                <div className="relative z-10 my-auto text-center px-2 py-4">
                  {isReversed ? (
                    <h3 className="font-display font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white leading-snug tracking-tight">
                      {currentCard.term}
                    </h3>
                  ) : (
                    <p className="font-body font-bold text-lg sm:text-2xl text-slate-950 dark:text-slate-100 leading-relaxed max-w-xl mx-auto">
                      {currentCard.definition}
                    </p>
                  )}
                </div>

                {/* Card Bottom Hint */}
                <div className="relative z-10 text-center text-xs text-purple-500 dark:text-purple-400 font-medium">
                  Rate your recall below to progress
                </div>
              </div>
            </div>
          </div>

          {/* Recall Actions (Got it vs Review again) */}
          <div className="flex items-center justify-center gap-3 w-full mt-6">
            <button
              onClick={markNeedsReview}
              disabled={isTransitioning}
              className="flex-1 max-w-[170px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 hover:dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              title="Mark for review"
            >
              <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Review Again</span>
            </button>

            <button
              onClick={handleCardClick}
              disabled={isTransitioning}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 hover:dark:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold shadow-xs active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              title="Flip Card"
            >
              <RotateCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </button>

            <button
              onClick={markMastered}
              disabled={isTransitioning}
              className="flex-1 max-w-[170px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 hover:dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              title="Mark as mastered"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Got It! ⭐</span>
            </button>
          </div>

          {/* Bottom Navigation Toolbar */}
          <div className="flex items-center justify-between w-full max-w-sm mt-4 px-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0 || isTransitioning}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:dark:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={handleShuffle}
              disabled={isTransitioning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 hover:dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/70 transition-colors disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              title="Shuffle Flashcards"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={() => handleNext(false)}
              disabled={isTransitioning}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:dark:bg-slate-800 transition-colors disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              <span>{currentIndex === cards.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
