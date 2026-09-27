export interface NeonSet {
  id: string;
  name: string;
  themeLabel: string;
  primaryGlow: string; // Primary neon accent hex
  secondaryGlow: string; // Secondary neon accent hex
  sunColors: [string, string]; // Horizon sun gradient [top, bottom]
  canvasBg: string; // Tailwind background gradient classes
  canvasBorder: string; // Tailwind border & glow classes
  swatchGradient: string; // CSS linear-gradient for the palette swatch pill
  badgeClass: string; // Pill badge styling
  accentText: string; // Watermark label color
  description: string;
}

export const NEON_COLOR_SETS: NeonSet[] = [
  {
    id: 'synthwave',
    name: 'Synthwave',
    themeLabel: 'Cyber Synthwave Pink & Cyan',
    primaryGlow: '#f43f5e',
    secondaryGlow: '#06b6d4',
    sunColors: ['#ec4899', '#06b6d4'],
    canvasBg: 'bg-gradient-to-b from-[#120722] via-[#0d051b] to-[#06020e] text-fuchsia-100',
    canvasBorder: 'border-fuchsia-500/30 shadow-[0_0_25px_rgba(244,63,94,0.18)]',
    swatchGradient: 'linear-gradient(135deg, #f43f5e, #06b6d4)',
    badgeClass: 'bg-fuchsia-950/70 text-fuchsia-300 border-fuchsia-500/40',
    accentText: 'text-fuchsia-400',
    description: 'Hot neon magenta and electric cyan with arcade gridlines',
  },
  {
    id: 'tokyo',
    name: 'Acid Tokyo',
    themeLabel: 'Tokyo Electric Lime & Violet',
    primaryGlow: '#84cc16',
    secondaryGlow: '#a855f7',
    sunColors: ['#84cc16', '#a855f7'],
    canvasBg: 'bg-gradient-to-b from-[#0b1810] via-[#081016] to-[#04060c] text-lime-100',
    canvasBorder: 'border-lime-500/30 shadow-[0_0_25px_rgba(132,204,22,0.18)]',
    swatchGradient: 'linear-gradient(135deg, #84cc16, #a855f7)',
    badgeClass: 'bg-lime-950/70 text-lime-300 border-lime-500/40',
    accentText: 'text-lime-400',
    description: 'Acid neon green and deep ultraviolet cyber district glow',
  },
  {
    id: 'outrun',
    name: 'Outrun Sunset',
    themeLabel: 'Solar Tangerine & Radiant Red',
    primaryGlow: '#f97316',
    secondaryGlow: '#f43f5e',
    sunColors: ['#fbbf24', '#f43f5e'],
    canvasBg: 'bg-gradient-to-b from-[#1b090a] via-[#14060e] to-[#090207] text-orange-100',
    canvasBorder: 'border-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.18)]',
    swatchGradient: 'linear-gradient(135deg, #fb923c, #f43f5e)',
    badgeClass: 'bg-orange-950/70 text-orange-300 border-orange-500/40',
    accentText: 'text-orange-400',
    description: 'Blazing twilight solar sunset with warm magenta horizon',
  },
  {
    id: 'laser',
    name: 'Laser Ice',
    themeLabel: 'Matrix Ice Blue & Royal Cobalt',
    primaryGlow: '#38bdf8',
    secondaryGlow: '#6366f1',
    sunColors: ['#38bdf8', '#6366f1'],
    canvasBg: 'bg-gradient-to-b from-[#061427] via-[#050e1e] to-[#020610] text-sky-100',
    canvasBorder: 'border-cyan-500/30 shadow-[0_0_25px_rgba(56,189,248,0.18)]',
    swatchGradient: 'linear-gradient(135deg, #38bdf8, #6366f1)',
    badgeClass: 'bg-sky-950/70 text-sky-300 border-sky-500/40',
    accentText: 'text-sky-400',
    description: 'Hyper ice blue beams over deep oceanic cobalt cyber-space',
  },
  {
    id: 'vapor',
    name: 'Vapor Amethyst',
    themeLabel: 'Ultraviolet & Cyber Gold',
    primaryGlow: '#c084fc',
    secondaryGlow: '#facc15',
    sunColors: ['#e879f9', '#facc15'],
    canvasBg: 'bg-gradient-to-b from-[#19062b] via-[#12031f] to-[#07010f] text-purple-100',
    canvasBorder: 'border-purple-500/30 shadow-[0_0_25px_rgba(192,132,252,0.18)]',
    swatchGradient: 'linear-gradient(135deg, #c084fc, #facc15)',
    badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
    accentText: 'text-purple-400',
    description: 'Royal ultraviolet amethyst clouds with radiant gold wireframes',
  },
];

export function getRandomNeonSet(currentId?: string): NeonSet {
  const available = currentId
    ? NEON_COLOR_SETS.filter((set) => set.id !== currentId)
    : NEON_COLOR_SETS;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] || NEON_COLOR_SETS[0];
}
