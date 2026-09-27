import React, { useState, useEffect } from 'react';
import { Deck, StudySettings, CardOrientation } from '../types';
import { generateQuizQuestions, QuizQuestion } from '../lib/engine';
import { sounds } from '../lib/sound';
import confetti from 'canvas-confetti';
import { getCardPalette, getWatermarkSticker } from '../lib/cardPalettes';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  HelpCircle,
  Award,
  ChevronRight,
  Play,
  Pause,
  Clock,
  ArrowLeftRight
} from 'lucide-react';

interface QuizModeProps {
  deck: Deck;
  settings: StudySettings;
  unlockedStickerIds?: string[];
  onUnlockRandomSticker: () => void;
  onOpenVault: () => void;
  onUpdateSettings?: (newSettings: StudySettings) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  deck,
  settings,
  unlockedStickerIds,
  onUnlockRandomSticker,
  onOpenVault,
  onUpdateSettings,
}) => {
  const activeTimerDuration = settings.flipTimerDuration > 0 ? settings.flipTimerDuration : 15;
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(activeTimerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const isReversed = (settings.cardOrientation || 'term-first') === 'definition-first';
  const isIllustrated = (settings.cardBackgroundStyle || 'illustrated') === 'illustrated';

  // Setup quiz when deck changes or orientation changes
  const startQuiz = (targetOrientation?: CardOrientation) => {
    const orientation = targetOrientation || settings.cardOrientation || 'term-first';
    const generated = generateQuizQuestions(deck.cards, orientation);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setIsTimedOut(false);
    setTimerSeconds(activeTimerDuration);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsQuizCompleted(false);
  };

  useEffect(() => {
    startQuiz();
  }, [deck, settings.cardOrientation, activeTimerDuration]);

  // Timer logic: Counts down from activeTimerDuration when running
  useEffect(() => {
    if (!isTimerRunning || isQuizCompleted || hasAnswered) {
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          // Time is up! Reveal the correct answer and mark timeout
          setIsTimedOut(true);
          setHasAnswered(true);
          sounds.playWrong();
          setStreak(0);
          return activeTimerDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isQuizCompleted, hasAnswered, activeTimerDuration]);

  const toggleTimer = () => {
    sounds.playPop();
    const nextRunning = !isTimerRunning;
    if (nextRunning) {
      if (timerSeconds <= 0 || hasAnswered) {
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

  const toggleOrientation = () => {
    sounds.playPop();
    const nextOrientation: CardOrientation = isReversed ? 'term-first' : 'definition-first';
    setTimerSeconds(activeTimerDuration);
    setIsTimerRunning(false);
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, cardOrientation: nextOrientation });
    }
    startQuiz(nextOrientation);
  };

  const handleOptionSelect = (option: string) => {
    if (hasAnswered || isQuizCompleted) return;

    const currentQuestion = questions[currentIndex];
    setSelectedOption(option);
    setHasAnswered(true);
    setIsTimedOut(false);

    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      sounds.playCorrect();
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      sounds.playWrong();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    sounds.playPop();
    setTimerSeconds(activeTimerDuration);
    setIsTimedOut(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Complete quiz!
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    setIsQuizCompleted(true);
    sounds.playFanfare();

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
    });

    // Check if zero errors (perfect run)
    const isFlawless = score === questions.length;
    if (isFlawless || score >= Math.ceil(questions.length * 0.8)) {
      onUnlockRandomSticker();
    }
  };

  if (deck.cards.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 max-w-lg mx-auto">
        <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="font-display text-lg font-bold text-slate-700">Need at least 2 cards for Quiz Mode</h3>
        <p className="text-sm text-slate-500 mt-1">Add more cards to this deck to generate multiple-choice questions!</p>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const accuracyPercent = Math.round((score / questions.length) * 100);
  const palette = getCardPalette(currentQ?.prompt || currentIndex);
  const watermark = getWatermarkSticker(currentQ?.prompt || currentIndex, unlockedStickerIds);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full px-2 sm:px-4 py-4">
      {/* Line 1: Deck Title / Subtitle & Streak/Progress Info */}
      <div className="flex items-center justify-between w-full mb-2 px-1">
        <div className="min-w-0 pr-2">
          <span className="font-display font-bold text-slate-800 dark:text-slate-100 text-lg truncate block">
            {deck.title} Quiz
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isReversed ? 'Pick the matching term for the definition' : 'Pick the accurate definition for the term'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Streak Counter */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-xs animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streak} Streak!</span>
            </div>
          )}

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono shrink-0 pl-1">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Line 2: Study Controls (Start/Stop, Timer Button, Q/A Swap Button, Question Counter) */}
      <div className="flex items-center justify-between w-full mb-3 px-1 gap-2">
        {/* Left: Timer Controls (Start/Stop & Timer Badge) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="timer-toggle-btn"
            type="button"
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

        {/* Right: Q/A Orientation Toggle & Question Counter */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            id="qa-orientation-toggle-btn"
            type="button"
            onClick={toggleOrientation}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold border transition-all shadow-xs active:scale-95 cursor-pointer ${
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
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Completion Summary Card */}
      {isQuizCompleted ? (
        <div className={`w-full rounded-3xl p-6 sm:p-8 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden ${
          isIllustrated
            ? 'bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/90 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/80 border-2 border-indigo-200 dark:border-indigo-800/80'
            : 'bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800'
        }`}>
          {isIllustrated && (
            <>
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-2xl pointer-events-none bg-indigo-400/25 dark:bg-indigo-500/25" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full blur-2xl pointer-events-none bg-purple-400/25 dark:bg-purple-500/25" />
              <div 
                className="absolute inset-0 opacity-[0.08] dark:opacity-[0.11] pointer-events-none rounded-3xl"
                style={{
                  backgroundImage: 'radial-gradient(currentColor 1.4px, transparent 1.4px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </>
          )}

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 mx-auto flex items-center justify-center text-3xl shadow-lg mb-4 text-white">
              🎓
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              Quiz Finished!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              You scored <span className="font-bold text-indigo-600 dark:text-indigo-400">{score}</span> out of <span className="font-bold text-slate-800 dark:text-slate-100">{questions.length}</span> ({accuracyPercent}%)!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{accuracyPercent}%</div>
                <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Accuracy</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/60 text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{maxStreak}</div>
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">Best Streak</div>
              </div>
            </div>

            {score === questions.length ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-pink-50 to-purple-50 dark:from-amber-950/40 dark:via-pink-950/40 dark:to-purple-950/40 border border-amber-200/90 dark:border-amber-800/70 mb-6 flex items-center gap-3 text-left">
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    Flawless Score — Sticker Unlocked!
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                    100% correct answers! Your new collectible sticker is waiting in StickerBook STUDIO.
                  </p>
                </div>
                <button
                  onClick={onOpenVault}
                  className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
                >
                  Open StickerBook
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 mb-6 text-xs text-slate-600 dark:text-slate-300">
                Score 100% on any deck quiz to unlock rare and legendary reward stickers!
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => startQuiz()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onOpenVault}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>StickerBook STUDIO</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* The Active Quiz Question Card */
        <div className="w-full flex flex-col items-center">
          {/* Question Prompt Card */}
          <div className={`w-full rounded-3xl p-6 sm:p-8 text-center mb-5 relative transition-all duration-300 ${
            isIllustrated
              ? `bg-gradient-to-br ${palette.frontLightBg} ${palette.frontDarkBg} border-2 ${palette.frontBorder} shadow-lg overflow-hidden`
              : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md'
          }`}>
            {/* Ambient Corner Glow Washes */}
            {isIllustrated && (
              <>
                <div className={`absolute -top-12 -left-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-2xl pointer-events-none ${palette.frontGlowOrb}`} />
                <div className={`absolute -bottom-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-2xl pointer-events-none ${palette.frontGlowOrb}`} />
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

            {/* Watermark Sticker */}
            {isIllustrated && watermark && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
                aria-hidden="true"
              >
                <div className="relative flex flex-col items-center justify-center transform transition-transform duration-700">
                  <span className="text-[120px] sm:text-[145px] leading-none opacity-[0.25] dark:opacity-[0.28] filter drop-shadow-xs">
                    {watermark.svgIcon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500/75 dark:text-slate-400/70 -mt-2">
                    {watermark.name}
                  </span>
                </div>
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                isIllustrated
                  ? `${palette.badgeLight} ${palette.badgeDark}`
                  : 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800/60'
              }`}>
                {isReversed ? 'Identify Matching Term' : 'Identify Definition'}
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 dark:text-white mt-3 mb-1">
                {currentQ.prompt}
              </h3>
            </div>
          </div>

          {/* Timeout Alert Notification */}
          {isTimedOut && (
            <div className="w-full mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center gap-2.5 text-amber-900 dark:text-amber-200 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
              <span>Time's up! The correct answer is highlighted in green below.</span>
            </div>
          )}

          {/* Option Choices (Max 4 definitions - clean solid color palettes with no gradients or stickers) */}
          <div className="grid grid-cols-1 gap-3 w-full mb-5 select-none">
            {currentQ.options.map((opt, index) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === currentQ.correctAnswer;

              // Assign a distinct palette to each option card in the question
              const optPalette = getCardPalette(currentQ.prompt, (index + 1) * 2 + currentIndex);

              let buttonContainerClasses = '';
              let textClasses = '';

              if (isIllustrated) {
                if (hasAnswered) {
                  if (isCorrectAnswer) {
                    buttonContainerClasses = 'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-800/80 shadow-md';
                    textClasses = 'text-emerald-950 dark:text-emerald-100';
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonContainerClasses = 'bg-red-50 dark:bg-red-950/80 border-2 border-red-500 dark:border-red-500 ring-2 ring-red-300 dark:ring-red-800/80 shadow-md';
                    textClasses = 'text-red-950 dark:text-red-100';
                  } else {
                    buttonContainerClasses = 'bg-slate-50/80 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 opacity-50';
                    textClasses = 'text-slate-400 dark:text-slate-500';
                  }
                } else {
                  // Clean solid color palette with no gradients and no stickers
                  buttonContainerClasses = `${optPalette.solidLightBg} ${optPalette.solidDarkBg} border-2 ${optPalette.solidBorder} shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0`;
                  textClasses = 'text-slate-950 dark:text-slate-100';
                }
              } else {
                // Minimal / Clean Mode (solid neutral styling)
                if (hasAnswered) {
                  if (isCorrectAnswer) {
                    buttonContainerClasses = 'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-200';
                    textClasses = 'text-emerald-900 dark:text-emerald-100';
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonContainerClasses = 'bg-red-50 dark:bg-red-950/80 border-2 border-red-400 text-red-900 dark:text-red-100 ring-2 ring-red-200';
                    textClasses = 'text-red-900 dark:text-red-100';
                  } else {
                    buttonContainerClasses = 'bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                    textClasses = 'text-slate-400 dark:text-slate-500';
                  }
                } else {
                  buttonContainerClasses = 'bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs';
                  textClasses = 'text-slate-900 dark:text-slate-100';
                }
              }

              const letters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-2xl flex items-center justify-between gap-3 transition-all duration-200 relative select-none active:scale-[0.99] group ${buttonContainerClasses}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 border shadow-xs transition-transform group-hover:scale-105 ${
                      isIllustrated
                        ? `${optPalette.badgeLight} ${optPalette.badgeDark}`
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      {letters[index] || `${index + 1}`}
                    </span>
                    <span className={`font-bold text-sm sm:text-base leading-snug ${textClasses}`}>
                      {opt}
                    </span>
                  </div>

                  {hasAnswered && (
                    <div className="shrink-0">
                      {isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-50 duration-200" />
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 animate-in zoom-in-50 duration-200" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Bar (Proceed to Next Question) */}
          {hasAnswered && (
            <div className="w-full flex items-center justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <span>{currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
