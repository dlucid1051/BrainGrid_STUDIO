import { Sticker } from '../types';
import { INITIAL_STICKER_PACKS } from '../data/stickerPacks';

export interface CardPalette {
  name: string;
  frontLightBg: string;
  frontDarkBg: string;
  frontBorder: string;
  frontGlowOrb: string;
  badgeLight: string;
  badgeDark: string;
  backLightBg: string;
  backDarkBg: string;
  backBorder: string;
  backGlowOrb: string;
  solidLightBg: string;
  solidDarkBg: string;
  solidBorder: string;
}

export const CARD_PALETTES: CardPalette[] = [
  // 1. Indigo Iris
  {
    name: 'Indigo Iris',
    frontLightBg: 'from-indigo-100/70 via-white to-indigo-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-indigo-950/80',
    frontBorder: 'border-indigo-300/90 dark:border-indigo-800/80 hover:border-indigo-400 dark:hover:border-indigo-600',
    frontGlowOrb: 'bg-indigo-400/35 dark:bg-indigo-500/30',
    badgeLight: 'text-indigo-700 bg-indigo-100/90 border-indigo-200',
    badgeDark: 'dark:text-indigo-300 dark:bg-indigo-950/80 dark:border-indigo-800/70',
    backLightBg: 'from-purple-100/80 via-white to-pink-100/70',
    backDarkBg: 'dark:from-purple-950/80 dark:via-slate-900 dark:to-indigo-950/85',
    backBorder: 'border-purple-300 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-700',
    backGlowOrb: 'bg-purple-400/40 dark:bg-purple-500/35',
    solidLightBg: 'bg-indigo-50/90 hover:bg-indigo-100/90',
    solidDarkBg: 'dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60',
    solidBorder: 'border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 dark:hover:border-indigo-600',
  },
  // 2. Emerald Sage
  {
    name: 'Emerald Sage',
    frontLightBg: 'from-emerald-100/70 via-white to-teal-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-emerald-950/80',
    frontBorder: 'border-emerald-300/90 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600',
    frontGlowOrb: 'bg-emerald-400/35 dark:bg-emerald-500/30',
    badgeLight: 'text-emerald-800 bg-emerald-100/90 border-emerald-200',
    badgeDark: 'dark:text-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-800/70',
    backLightBg: 'from-teal-100/80 via-white to-cyan-100/70',
    backDarkBg: 'dark:from-teal-950/80 dark:via-slate-900 dark:to-emerald-950/85',
    backBorder: 'border-teal-300 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-700',
    backGlowOrb: 'bg-teal-400/40 dark:bg-teal-500/35',
    solidLightBg: 'bg-emerald-50/90 hover:bg-emerald-100/90',
    solidDarkBg: 'dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60',
    solidBorder: 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600',
  },
  // 3. Rose Coral
  {
    name: 'Rose Coral',
    frontLightBg: 'from-rose-100/70 via-white to-pink-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-rose-950/80',
    frontBorder: 'border-rose-300/90 dark:border-rose-800/80 hover:border-rose-400 dark:hover:border-rose-600',
    frontGlowOrb: 'bg-rose-400/35 dark:bg-rose-500/30',
    badgeLight: 'text-rose-800 bg-rose-100/90 border-rose-200',
    badgeDark: 'dark:text-rose-300 dark:bg-rose-950/80 dark:border-rose-800/70',
    backLightBg: 'from-rose-100/80 via-white to-amber-100/70',
    backDarkBg: 'dark:from-rose-950/80 dark:via-slate-900 dark:to-pink-950/85',
    backBorder: 'border-rose-300 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-700',
    backGlowOrb: 'bg-rose-400/40 dark:bg-rose-500/35',
    solidLightBg: 'bg-rose-50/90 hover:bg-rose-100/90',
    solidDarkBg: 'dark:bg-rose-950/40 dark:hover:bg-rose-950/60',
    solidBorder: 'border-rose-200 dark:border-rose-800/80 hover:border-rose-400 dark:hover:border-rose-600',
  },
  // 4. Amber Honey
  {
    name: 'Amber Honey',
    frontLightBg: 'from-amber-100/70 via-white to-orange-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-amber-950/80',
    frontBorder: 'border-amber-300/90 dark:border-amber-800/80 hover:border-amber-400 dark:hover:border-amber-600',
    frontGlowOrb: 'bg-amber-400/35 dark:bg-amber-500/30',
    badgeLight: 'text-amber-900 bg-amber-100/90 border-amber-200',
    badgeDark: 'dark:text-amber-300 dark:bg-amber-950/80 dark:border-amber-800/70',
    backLightBg: 'from-amber-100/80 via-white to-yellow-100/70',
    backDarkBg: 'dark:from-amber-950/80 dark:via-slate-900 dark:to-orange-950/85',
    backBorder: 'border-amber-300 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-700',
    backGlowOrb: 'bg-amber-400/40 dark:bg-amber-500/35',
    solidLightBg: 'bg-amber-50/90 hover:bg-amber-100/90',
    solidDarkBg: 'dark:bg-amber-950/40 dark:hover:bg-amber-950/60',
    solidBorder: 'border-amber-200 dark:border-amber-800/80 hover:border-amber-400 dark:hover:border-amber-600',
  },
  // 5. Teal Sky
  {
    name: 'Teal Sky',
    frontLightBg: 'from-sky-100/70 via-white to-indigo-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-sky-950/80',
    frontBorder: 'border-sky-300/90 dark:border-sky-800/80 hover:border-sky-400 dark:hover:border-sky-600',
    frontGlowOrb: 'bg-sky-400/35 dark:bg-sky-500/30',
    badgeLight: 'text-sky-800 bg-sky-100/90 border-sky-200',
    badgeDark: 'dark:text-sky-300 dark:bg-sky-950/80 dark:border-sky-800/70',
    backLightBg: 'from-sky-100/80 via-white to-cyan-100/70',
    backDarkBg: 'dark:from-sky-950/80 dark:via-slate-900 dark:to-indigo-950/85',
    backBorder: 'border-sky-300 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-700',
    backGlowOrb: 'bg-sky-400/40 dark:bg-sky-500/35',
    solidLightBg: 'bg-sky-50/90 hover:bg-sky-100/90',
    solidDarkBg: 'dark:bg-sky-950/40 dark:hover:bg-sky-950/60',
    solidBorder: 'border-sky-200 dark:border-sky-800/80 hover:border-sky-400 dark:hover:border-sky-700',
  },
  // 6. Violet Berry
  {
    name: 'Violet Berry',
    frontLightBg: 'from-violet-100/75 via-white to-fuchsia-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-violet-950/80',
    frontBorder: 'border-violet-300/90 dark:border-violet-800/80 hover:border-violet-400 dark:hover:border-violet-600',
    frontGlowOrb: 'bg-violet-400/35 dark:bg-violet-500/30',
    badgeLight: 'text-violet-800 bg-violet-100/90 border-violet-200',
    badgeDark: 'dark:text-violet-300 dark:bg-violet-950/80 dark:border-violet-800/70',
    backLightBg: 'from-fuchsia-100/80 via-white to-purple-100/70',
    backDarkBg: 'dark:from-fuchsia-950/80 dark:via-slate-900 dark:to-violet-950/85',
    backBorder: 'border-fuchsia-300 dark:border-fuchsia-800 hover:border-fuchsia-400 dark:hover:border-fuchsia-700',
    backGlowOrb: 'bg-fuchsia-400/40 dark:bg-fuchsia-500/35',
    solidLightBg: 'bg-violet-50/90 hover:bg-violet-100/90',
    solidDarkBg: 'dark:bg-violet-950/40 dark:hover:bg-violet-950/60',
    solidBorder: 'border-violet-200 dark:border-violet-800/80 hover:border-violet-400 dark:hover:border-violet-600',
  },
  // 7. Tangerine Sunset
  {
    name: 'Tangerine Sunset',
    frontLightBg: 'from-orange-100/75 via-white to-amber-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-orange-950/80',
    frontBorder: 'border-orange-300/90 dark:border-orange-800/80 hover:border-orange-400 dark:hover:border-orange-600',
    frontGlowOrb: 'bg-orange-400/35 dark:bg-orange-500/30',
    badgeLight: 'text-orange-900 bg-orange-100/90 border-orange-200',
    badgeDark: 'dark:text-orange-300 dark:bg-orange-950/80 dark:border-orange-800/70',
    backLightBg: 'from-amber-100/80 via-white to-yellow-100/70',
    backDarkBg: 'dark:from-orange-950/80 dark:via-slate-900 dark:to-amber-950/85',
    backBorder: 'border-orange-300 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-700',
    backGlowOrb: 'bg-orange-400/40 dark:bg-orange-500/35',
    solidLightBg: 'bg-orange-50/90 hover:bg-orange-100/90',
    solidDarkBg: 'dark:bg-orange-950/40 dark:hover:bg-orange-950/60',
    solidBorder: 'border-orange-200 dark:border-orange-800/80 hover:border-orange-400 dark:hover:border-orange-600',
  },
  // 8. Cyan Lagoon
  {
    name: 'Cyan Lagoon',
    frontLightBg: 'from-cyan-100/75 via-white to-blue-50/80',
    frontDarkBg: 'dark:from-slate-900 dark:via-slate-900/95 dark:to-cyan-950/80',
    frontBorder: 'border-cyan-300/90 dark:border-cyan-800/80 hover:border-cyan-400 dark:hover:border-cyan-600',
    frontGlowOrb: 'bg-cyan-400/35 dark:bg-cyan-500/30',
    badgeLight: 'text-cyan-800 bg-cyan-100/90 border-cyan-200',
    badgeDark: 'dark:text-cyan-300 dark:bg-cyan-950/80 dark:border-cyan-800/70',
    backLightBg: 'from-blue-100/80 via-white to-sky-100/70',
    backDarkBg: 'dark:from-blue-950/80 dark:via-slate-900 dark:to-cyan-950/85',
    backBorder: 'border-blue-300 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-700',
    backGlowOrb: 'bg-blue-400/40 dark:bg-blue-500/35',
    solidLightBg: 'bg-cyan-50/90 hover:bg-cyan-100/90',
    solidDarkBg: 'dark:bg-cyan-950/40 dark:hover:bg-cyan-950/60',
    solidBorder: 'border-cyan-200 dark:border-cyan-800/80 hover:border-cyan-400 dark:hover:border-cyan-600',
  },
];

const ALL_STICKERS: Sticker[] = INITIAL_STICKER_PACKS.flatMap((p) => p.stickers);

export function calculateSeed(key: string | number, offset = 0): number {
  if (typeof key === 'number') return Math.abs(key + offset);
  let hash = offset;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCardPalette(seed: number | string, offset = 0): CardPalette {
  const numSeed = typeof seed === 'number' ? seed : calculateSeed(seed, offset);
  return CARD_PALETTES[numSeed % CARD_PALETTES.length];
}

export function getWatermarkSticker(
  seed: number | string,
  unlockedStickerIds?: string[],
  offset = 0
): Sticker | undefined {
  const numSeed = typeof seed === 'number' ? seed : calculateSeed(seed, offset);
  if (!unlockedStickerIds || unlockedStickerIds.length === 0) {
    return ALL_STICKERS[numSeed % ALL_STICKERS.length];
  }
  const unlocked = ALL_STICKERS.filter((s) => unlockedStickerIds.includes(s.id));
  const pool = unlocked.length > 0 ? unlocked : ALL_STICKERS;
  return pool[numSeed % pool.length];
}
