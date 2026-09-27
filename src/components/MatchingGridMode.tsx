import React, { useState, useEffect } from 'react';
import { Deck, GridSize, StudySettings } from '../types';
import { generateMatchingTiles, MatchingTile } from '../lib/engine';
import { sounds } from '../lib/sound';
import confetti from 'canvas-confetti';
import { getCardPalette, getWatermarkSticker } from '../lib/cardPalettes';
import { 
  Timer, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Flame, 
  HelpCircle,
  LayoutGrid
} from 'lucide-react';

interface MatchingGridModeProps {
  deck: Deck;
  settings: StudySettings;
  unlockedStickerIds?: string[];
  onUpdateGridSize: (size: GridSize) => void;
  onUnlockRandomSticker: () => void;
  onOpenVault: () => void;
}

export const MatchingGridMode: React.FC<MatchingGridModeProps> = ({
  deck,
  settings,
  unlockedStickerIds,
  onUpdateGridSize,
  onUnlockRandomSticker,
  onOpenVault,
}) => {
  const [gridSize, setGridSize] = useState<GridSize>(settings.gridSize || '2x3');
  const [tiles, setTiles] = useState<MatchingTile[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  const isIllustrated = (settings.cardBackgroundStyle || 'illustrated') === 'illustrated';

  // Expected total pairs
  const pairTargetMap: Record<GridSize, number> = {
    '2x3': 3,
    '3x4': 6,
    '4x4': 8,
  };
  const targetPairs = Math.min(pairTargetMap[gridSize] || 3, deck.cards.length);

  // Initialize or restart board
  const setupBoard = (size: GridSize = gridSize) => {
    const generated = generateMatchingTiles(deck.cards, size);
    setTiles(generated);
    setSelectedIndices([]);
    setIsProcessing(false);
    setMatchedPairsCount(0);
    setMistakesCount(0);
    setTimeElapsed(0);
    setIsTimerActive(true);
    setIsGameCompleted(false);
  };

  useEffect(() => {
    setupBoard(settings.gridSize || '2x3');
  }, [deck, settings.gridSize]);

  // Elapsed timer loop
  useEffect(() => {
    if (!isTimerActive || isGameCompleted) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, isGameCompleted]);

  const handleTileClick = (index: number) => {
    if (isProcessing) return;
    const clickedTile = tiles[index];

    // Ignore already matched or already flipped tile
    if (clickedTile.isMatched || clickedTile.isFlipped) return;

    sounds.playPop();

    // Flip the clicked tile
    const newTiles = [...tiles];
    newTiles[index].isFlipped = true;
    setTiles(newTiles);

    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newSelected;
      const firstTile = newTiles[firstIdx];
      const secondTile = newTiles[secondIdx];

      // Check if they match: same cardId and opposite types (one is term, one is definition)
      if (firstTile.cardId === secondTile.cardId && firstTile.type !== secondTile.type) {
        // MATCH!
        setTimeout(() => {
          sounds.playCorrect();
          newTiles[firstIdx].isMatched = true;
          newTiles[secondIdx].isMatched = true;
          setTiles([...newTiles]);
          setSelectedIndices([]);
          setIsProcessing(false);

          const newMatchCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchCount);

          if (newMatchCount >= targetPairs) {
            handleGameWin();
          }
        }, 400);
      } else {
        // MISMATCH!
        setTimeout(() => {
          sounds.playWrong();
          newTiles[firstIdx].isFlipped = false;
          newTiles[secondIdx].isFlipped = false;
          setTiles([...newTiles]);
          setSelectedIndices([]);
          setIsProcessing(false);
          setMistakesCount((prev) => prev + 1);
        }, 900);
      }
    }
  };

  const handleGameWin = () => {
    setIsGameCompleted(true);
    setIsTimerActive(false);
    sounds.playFanfare();

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Check if zero errors or great effort -> unlock sticker reward!
    if (mistakesCount === 0 || matchedPairsCount >= 3) {
      onUnlockRandomSticker();
    }
  };

  const handleSizeChange = (newSize: GridSize) => {
    sounds.playPop();
    setGridSize(newSize);
    onUpdateGridSize(newSize);
    setupBoard(newSize);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Determine CSS grid columns based on size
  const gridLayoutClasses: Record<GridSize, string> = {
    '2x3': 'grid-cols-2 sm:grid-cols-3 max-w-xl',
    '3x4': 'grid-cols-3 sm:grid-cols-4 max-w-3xl',
    '4x4': 'grid-cols-4 sm:grid-cols-4 max-w-4xl',
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full px-2 sm:px-4 py-4">
      {/* Top Header & Grid Size Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-5 gap-3">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Matching Grid</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-sans font-bold">
              {targetPairs} Pairs
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pair terms with their matching definitions as fast as you can!
          </p>
        </div>

        {/* Controls: Grid Size selector & Reset */}
        <div className="flex items-center gap-2">
          {/* Grid Size Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
            {(['2x3', '3x4', '4x4'] as GridSize[]).map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  gridSize === size
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                title={`Play with ${size} grid layout`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={() => setupBoard(gridSize)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 hover:bg-slate-50 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
            title="Restart board"
          >
            <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xl mb-6">
        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Time</div>
            <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">{formatTime(timeElapsed)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Matches</div>
            <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
              {matchedPairsCount} / {targetPairs}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Misses</div>
            <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">{mistakesCount}</div>
          </div>
        </div>
      </div>

      {/* Victory Celebration Modal / Card */}
      {isGameCompleted ? (
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-100 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-indigo-600 mx-auto flex items-center justify-center text-3xl shadow-lg mb-4 text-white">
            🎉
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            Grid Cleared!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
            Matched all {targetPairs} pairs in <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{formatTime(timeElapsed)}</span> with {mistakesCount} mistakes!
          </p>

          {mistakesCount === 0 && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-pink-50 dark:from-amber-950/40 dark:to-pink-950/40 border border-amber-200/90 dark:border-amber-800/60 mb-5 flex items-center gap-2.5 text-left">
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase">Flawless Run!</h4>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Zero mistakes recorded! A special reward has been added to your StickerBook STUDIO.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setupBoard(gridSize)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
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
      ) : (
        /* The Matching Tile Grid */
        <div className={`grid ${gridLayoutClasses[gridSize]} gap-2.5 sm:gap-3.5 w-full select-none`}>
          {tiles.map((tile, idx) => {
            const isSelected = selectedIndices.includes(idx);
            const palette = getCardPalette(tile.cardId);
            const watermark = getWatermarkSticker(tile.cardId, unlockedStickerIds);

            // Determine border & background styles
            let tileBgClasses = '';
            if (tile.isMatched) {
              tileBgClasses = 'bg-emerald-50/90 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-700 opacity-70 pointer-events-none scale-95 shadow-xs';
            } else if (tile.isFlipped) {
              if (isIllustrated) {
                tileBgClasses = tile.type === 'term'
                  ? `bg-gradient-to-br ${palette.frontLightBg} ${palette.frontDarkBg} border-2 ${palette.frontBorder} shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900/50`
                  : `bg-gradient-to-br ${palette.backLightBg} ${palette.backDarkBg} border-2 ${palette.backBorder} shadow-md ring-2 ring-purple-200 dark:ring-purple-900/50`;
              } else {
                tileBgClasses = tile.type === 'term'
                  ? 'bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-500 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900/50'
                  : 'bg-indigo-50/80 dark:bg-slate-900/90 border-2 border-purple-400 dark:border-purple-500 shadow-md ring-2 ring-purple-200 dark:ring-purple-900/50';
              }
            } else {
              if (isIllustrated) {
                tileBgClasses = 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-2 border-indigo-300/80 dark:border-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0';
              } else {
                tileBgClasses = 'bg-white dark:bg-slate-800 hover:bg-slate-50 hover:dark:bg-slate-750 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0';
              }
            }

            return (
              <div
                key={tile.tileId}
                onClick={() => handleTileClick(idx)}
                className={`relative min-h-[105px] sm:min-h-[125px] rounded-2xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 overflow-hidden perspective-1000 ${tileBgClasses}`}
              >
                {/* Back side of tile (Face-down) */}
                {!tile.isFlipped && !tile.isMatched ? (
                  isIllustrated ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center text-white/95 overflow-hidden">
                      {/* Tactile Dotted Grid Paper Texture */}
                      <div 
                        className="absolute inset-0 opacity-[0.10] dark:opacity-[0.14] pointer-events-none rounded-xl"
                        style={{
                          backgroundImage: 'radial-gradient(currentColor 1.2px, transparent 1.2px)',
                          backgroundSize: '16px 16px',
                        }}
                      />
                      <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full blur-xl bg-white/20 pointer-events-none" />
                      <span className="relative z-10 text-2xl sm:text-3xl filter drop-shadow-sm select-none">⚡</span>
                      <span className="relative z-10 text-[10px] uppercase font-extrabold tracking-widest text-white/80 mt-1">
                        Card
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-300">
                      <span className="text-2xl sm:text-3xl opacity-75">⚡</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                        Card
                      </span>
                    </div>
                  )
                ) : (
                  /* Front side of tile (Face-up) */
                  <div className="relative z-10 w-full h-full flex flex-col justify-between">
                    {/* Ambient Corner Glow Washes */}
                    {isIllustrated && !tile.isMatched && (
                      <>
                        <div className={`absolute -top-8 -left-8 w-24 h-24 rounded-full blur-xl pointer-events-none ${tile.type === 'term' ? palette.frontGlowOrb : palette.backGlowOrb}`} />
                        <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-xl pointer-events-none ${tile.type === 'term' ? palette.frontGlowOrb : palette.backGlowOrb}`} />
                      </>
                    )}

                    {/* Tactile Dotted Grid Paper Texture */}
                    {isIllustrated && !tile.isMatched && (
                      <div 
                        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.11] pointer-events-none rounded-xl"
                        style={{
                          backgroundImage: 'radial-gradient(currentColor 1.2px, transparent 1.2px)',
                          backgroundSize: '16px 16px',
                        }}
                      />
                    )}

                    {/* Watermark Sticker */}
                    {isIllustrated && watermark && !tile.isMatched && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
                        aria-hidden="true"
                      >
                        <span className="text-[64px] sm:text-[76px] leading-none opacity-[0.22] dark:opacity-[0.26] filter drop-shadow-xs">
                          {watermark.svgIcon}
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isIllustrated
                          ? tile.type === 'term' 
                            ? `${palette.badgeLight} ${palette.badgeDark}`
                            : 'text-purple-700 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800/70'
                          : tile.type === 'term'
                            ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                            : 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      }`}>
                        {tile.type === 'term' ? 'Term' : 'Definition'}
                      </span>
                      {tile.isMatched && (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          ✓ Match
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 my-auto py-1 text-center">
                      <p className={`leading-snug line-clamp-4 ${
                        tile.type === 'term'
                          ? 'font-display font-bold text-sm sm:text-base text-slate-950 dark:text-white'
                          : 'font-body font-bold text-xs sm:text-sm text-slate-950 dark:text-slate-100'
                      }`}>
                        {tile.text}
                      </p>
                    </div>

                    <div className="h-0.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
