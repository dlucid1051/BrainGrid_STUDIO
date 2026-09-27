export interface PastelSet {
  id: string;
  name: string;
  themeLabel: string;
  dotColor: string; // Hex for the radial-gradient dot pattern
  canvasBg: string; // Tailwind background & text classes
  canvasBorder: string; // Tailwind border classes
  swatchHex: string; // Hex for the color swatch preview dot
  badgeClass: string; // Pill badge for current active pastel variant
  accentText: string;
  description: string;
}

export const PASTEL_COLOR_SETS: PastelSet[] = [
  {
    id: 'lavender',
    name: 'Lavender',
    themeLabel: 'Pastel Lavender Paper',
    dotColor: '#a855f7',
    canvasBg: 'bg-purple-50/95 dark:bg-purple-950/40 text-slate-800 dark:text-slate-100',
    canvasBorder: 'border-purple-200 dark:border-purple-800/80 shadow-purple-500/5',
    swatchHex: '#c084fc',
    badgeClass: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    accentText: 'text-purple-600 dark:text-purple-400',
    description: 'Soft calming lavender floral mist with purple grid notes',
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    themeLabel: 'Pastel Honey Amber Paper',
    dotColor: '#f59e0b',
    canvasBg: 'bg-amber-50/95 dark:bg-amber-950/40 text-slate-800 dark:text-slate-100',
    canvasBorder: 'border-amber-200 dark:border-amber-800/80 shadow-amber-500/5',
    swatchHex: '#fbbf24',
    badgeClass: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    accentText: 'text-amber-600 dark:text-amber-400',
    description: 'Cozy golden honey sunlight with amber grid points',
  },
  {
    id: 'peach',
    name: 'Soft Peach',
    themeLabel: 'Pastel Apricot Peach Paper',
    dotColor: '#fb923c',
    canvasBg: 'bg-orange-50/95 dark:bg-orange-950/40 text-slate-800 dark:text-slate-100',
    canvasBorder: 'border-orange-200 dark:border-orange-800/80 shadow-orange-500/5',
    swatchHex: '#fdba74',
    badgeClass: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    accentText: 'text-orange-600 dark:text-orange-400',
    description: 'Gentle warm apricot peach cream with coral grid dots',
  },
  {
    id: 'teal',
    name: 'Pastel Teal',
    themeLabel: 'Pastel Seafoam Teal Paper',
    dotColor: '#14b8a6',
    canvasBg: 'bg-teal-50/95 dark:bg-teal-950/40 text-slate-800 dark:text-slate-100',
    canvasBorder: 'border-teal-200 dark:border-teal-800/80 shadow-teal-500/5',
    swatchHex: '#5eead4',
    badgeClass: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    accentText: 'text-teal-600 dark:text-teal-400',
    description: 'Crisp refreshing seafoam mint with teal grid points',
  },
  {
    id: 'pink',
    name: 'Blush Pink',
    themeLabel: 'Pastel Rose Pink Paper',
    dotColor: '#ec4899',
    canvasBg: 'bg-pink-50/95 dark:bg-pink-950/40 text-slate-800 dark:text-slate-100',
    canvasBorder: 'border-pink-200 dark:border-pink-800/80 shadow-pink-500/5',
    swatchHex: '#f472b6',
    badgeClass: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    accentText: 'text-pink-600 dark:text-pink-400',
    description: 'Delicate strawberry blossom pink with rosy grid dots',
  },
  {
    id: 'baby-blue',
    name: 'Baby Blue',
    themeLabel: 'Pastel Powder Blue Paper',
    dotColor: '#38bdf8',
    canvasBg: 'bg-sky-50/95 dark:bg-sky-950/40 text-slate-800 dark:text-slate-100',
    canvasBorder: 'border-sky-200 dark:border-sky-800/80 shadow-sky-500/5',
    swatchHex: '#7dd3fc',
    badgeClass: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    accentText: 'text-sky-600 dark:text-sky-400',
    description: 'Serene morning clear sky blue with azure grid dots',
  },
  {
    id: 'matcha',
    name: 'Matcha Sage',
    themeLabel: 'Pastel Matcha Sage Paper',
    dotColor: '#10b981',
    canvasBg: 'bg-emerald-50/95 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-100',
    canvasBorder: 'border-emerald-200 dark:border-emerald-800/80 shadow-emerald-500/5',
    swatchHex: '#6ee7b7',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    description: 'Earthy tranquil botanical matcha with sage grid points',
  },
];

export function getRandomPastelSet(excludeId?: string): PastelSet {
  const candidates = excludeId
    ? PASTEL_COLOR_SETS.filter((s) => s.id !== excludeId)
    : PASTEL_COLOR_SETS;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
