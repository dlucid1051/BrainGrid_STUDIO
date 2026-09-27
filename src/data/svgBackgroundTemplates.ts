export interface SvgTemplatePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  svgMarkup: string;
}

export const SVG_BACKGROUND_TEMPLATES: SvgTemplatePreset[] = [
  {
    id: 'sunset-dunes',
    name: 'Sunset Dunes',
    description: 'Layered desert sand dunes with warm dusk sky and evening star',
    category: 'Nature & Landscape',
    svgMarkup: `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#1e1b4b" />
      <stop offset="50%" stopColor="#4c1d95" />
      <stop offset="85%" stopColor="#f43f5e" />
      <stop offset="100%" stopColor="#fb923c" />
    </linearGradient>
    <linearGradient id="duneBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#7c2d12" />
      <stop offset="100%" stopColor="#431407" />
    </linearGradient>
    <linearGradient id="duneFront" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#9a3412" />
      <stop offset="100%" stopColor="#292524" />
    </linearGradient>
  </defs>
  <rect width="1000" height="500" fill="url(#skyGrad)" />
  <!-- Evening Sun -->
  <circle cx="500" cy="320" r="90" fill="#fef08a" opacity="0.8" />
  <!-- Distant Dunes -->
  <path d="M 0 350 Q 240 280 500 340 T 1000 310 L 1000 500 L 0 500 Z" fill="url(#duneBack)" opacity="0.9" />
  <!-- Mid Dunes -->
  <path d="M 0 390 Q 320 330 650 400 T 1000 370 L 1000 500 L 0 500 Z" fill="#6c2e17" opacity="0.95" />
  <!-- Foreground Dune -->
  <path d="M 0 440 Q 400 390 800 460 T 1000 430 L 1000 500 L 0 500 Z" fill="url(#duneFront)" />
  <!-- Evening Star -->
  <circle cx="780" cy="90" r="3.5" fill="#ffffff" />
  <path d="M 780 75 L 780 105 M 765 90 L 795 90" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
</svg>`,
  },
  {
    id: 'mystic-pines',
    name: 'Mystic Pines',
    description: 'Silhouetted pine forest shrouded in moonlight fog with fireflies',
    category: 'Atmospheric',
    svgMarkup: `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fogSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#022c22" />
      <stop offset="50%" stopColor="#064e3b" />
      <stop offset="100%" stopColor="#042f2e" />
    </linearGradient>
  </defs>
  <rect width="1000" height="500" fill="url(#fogSky)" />
  <!-- Soft Full Moon -->
  <circle cx="280" cy="130" r="60" fill="#d1fae5" opacity="0.4" filter="blur(10px)" />
  <circle cx="280" cy="130" r="40" fill="#ecfdf5" opacity="0.8" />
  <!-- Distant Ridge Trees -->
  <g fill="#064e3b" opacity="0.45">
    <polygon points="120,430 145,260 170,430" />
    <polygon points="190,440 220,290 250,440" />
    <polygon points="450,450 475,310 500,450" />
    <polygon points="720,440 750,270 780,440" />
    <polygon points="840,430 865,300 890,430" />
  </g>
  <!-- Foreground Deep Pines -->
  <g fill="#022c22" opacity="0.95">
    <polygon points="30,470 65,220 100,470" />
    <polygon points="310,480 350,240 390,480" />
    <polygon points="600,475 635,210 670,475" />
    <polygon points="900,490 945,190 990,490" />
  </g>
  <!-- Rolling Ground -->
  <path d="M 0 450 Q 300 410 600 460 T 1000 430 L 1000 500 L 0 500 Z" fill="#021f19" />
  <!-- Fireflies -->
  <circle cx="210" cy="380" r="3" fill="#6ee7b7" opacity="0.8" />
  <circle cx="480" cy="340" r="2.5" fill="#a7f3d0" opacity="0.9" />
  <circle cx="750" cy="360" r="3.5" fill="#6ee7b7" opacity="0.75" />
  <circle cx="580" cy="270" r="2" fill="#d1fae5" opacity="0.85" />
</svg>`,
  },
  {
    id: 'cyber-skyline',
    name: 'Cyber Horizon',
    description: 'Neon geometric cityscape with digital grid and horizon glow',
    category: 'Sci-Fi & Cyber',
    svgMarkup: `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cyberSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#0f172a" />
      <stop offset="60%" stopColor="#3b0764" />
      <stop offset="100%" stopColor="#581c87" />
    </linearGradient>
  </defs>
  <rect width="1000" height="500" fill="url(#cyberSky)" />
  <!-- Horizon Laser Line -->
  <line x1="0" y1="360" x2="1000" y2="360" stroke="#ec4899" strokeWidth="2.5" opacity="0.85" />
  <!-- Distant Buildings -->
  <g fill="#1e1b4b" opacity="0.8">
    <rect x="80" y="240" width="70" height="120" />
    <rect x="180" y="190" width="90" height="170" />
    <rect x="300" y="260" width="60" height="100" />
    <rect x="680" y="210" width="85" height="150" />
    <rect x="790" y="250" width="70" height="110" />
    <rect x="880" y="180" width="80" height="180" />
  </g>
  <!-- Main Towers with Glowing Windows -->
  <g fill="#09090b">
    <rect x="390" y="150" width="100" height="210" />
    <polygon points="440,110 420,150 460,150" fill="#a855f7" />
    <rect x="520" y="130" width="110" height="230" />
    <line x1="575" y1="90" x2="575" y2="130" stroke="#06b6d4" strokeWidth="3" />
  </g>
  <!-- Perspective Floor Grid -->
  <g stroke="#a855f7" strokeWidth="1" opacity="0.35">
    <line x1="0" y1="360" x2="0" y2="500" />
    <line x1="200" y1="360" x2="50" y2="500" />
    <line x1="400" y1="360" x2="300" y2="500" />
    <line x1="500" y1="360" x2="500" y2="500" />
    <line x1="600" y1="360" x2="700" y2="500" />
    <line x1="800" y1="360" x2="950" y2="500" />
    <line x1="1000" y1="360" x2="1000" y2="500" />
    <line x1="0" y1="380" x2="1000" y2="380" />
    <line x1="0" y1="410" x2="1000" y2="410" strokeWidth="1.2" />
    <line x1="0" y1="450" x2="1000" y2="450" strokeWidth="1.5" />
  </g>
</svg>`,
  },
  {
    id: 'zen-minimal',
    name: 'Zen Arch & Sun',
    description: 'Clean Scandinavian-Japanese geometric arches with soothing earth tones',
    category: 'Minimalist & Art',
    svgMarkup: `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="500" fill="#18181b" />
  <!-- Center Ambient Arch -->
  <path d="M 380 500 L 380 240 C 380 170 620 170 620 240 L 620 500 Z" fill="#27272a" />
  <!-- Warm Terracotta Sun -->
  <circle cx="500" cy="220" r="70" fill="#ea580c" opacity="0.85" />
  <!-- Accent Arch Ring -->
  <path d="M 340 500 L 340 240 C 340 140 660 140 660 240 L 660 500" fill="none" stroke="#ca8a04" strokeWidth="2.5" opacity="0.4" />
  <!-- Minimal Organic Mountain Curve -->
  <path d="M 0 460 Q 260 400 500 450 T 1000 420 L 1000 500 L 0 500 Z" fill="#3f3f46" />
</svg>`,
  },
];
