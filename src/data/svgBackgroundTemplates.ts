export interface SvgTemplatePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  svgMarkup: string;
}

export const DEEP_COSMOS_SVG = `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="deepSpaceGlow1" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#312e81" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="deepSpaceGlow2" cx="80%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#0891b2" stop-opacity="0.22" />
      <stop offset="60%" stop-color="#1e1b4b" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="deepNebula" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.3" />
      <stop offset="45%" stop-color="#818cf8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="deepGalaxyCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7" />
      <stop offset="30%" stop-color="#e9d5ff" stop-opacity="0.4" />
      <stop offset="70%" stop-color="#a855f7" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="deepComet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
      <stop offset="20%" stop-color="#38bdf8" stop-opacity="0.35" />
      <stop offset="70%" stop-color="#818cf8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="deepPlanet" x1="20%" y1="10%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#fde68a" stop-opacity="0.85" />
      <stop offset="35%" stop-color="#fb923c" stop-opacity="0.75" />
      <stop offset="70%" stop-color="#c084fc" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="deepRings" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#fde047" stop-opacity="0" />
      <stop offset="25%" stop-color="#fde047" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#fdba74" stop-opacity="0.5" />
      <stop offset="75%" stop-color="#c084fc" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="deepMoon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.8" />
      <stop offset="60%" stop-color="#cbd5e1" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#64748b" stop-opacity="0.2" />
    </linearGradient>
    <mask id="deepMoonMask">
      <rect width="200" height="200" fill="white" />
      <circle cx="82" cy="52" r="38" fill="black" />
    </mask>
  </defs>

  <rect width="1000" height="500" fill="#030712" />

  <circle cx="200" cy="150" r="350" fill="url(#deepSpaceGlow1)" />
  <circle cx="800" cy="220" r="380" fill="url(#deepSpaceGlow2)" />
  <circle cx="500" cy="460" r="260" fill="url(#deepNebula)" />

  <g fill="#ffffff" opacity="0.6">
    <circle cx="35" cy="80" r="1.2" />
    <circle cx="85" cy="240" r="1" />
    <circle cx="140" cy="130" r="1.5" />
    <circle cx="220" cy="70" r="1.3" />
    <circle cx="290" cy="220" r="1.1" />
    <circle cx="380" cy="110" r="1.6" />
    <circle cx="430" cy="260" r="1.2" />
    <circle cx="510" cy="80" r="1.4" />
    <circle cx="580" cy="190" r="1" />
    <circle cx="640" cy="70" r="1.5" />
    <circle cx="720" cy="260" r="1.2" />
    <circle cx="850" cy="140" r="1.5" />
    <circle cx="890" cy="280" r="1.1" />
    <circle cx="940" cy="90" r="1.4" />
    <circle cx="960" cy="230" r="1.2" />
    <circle cx="70" cy="420" r="1.1" />
    <circle cx="280" cy="440" r="1.3" />
    <circle cx="490" cy="410" r="1.2" />
    <circle cx="740" cy="450" r="1.4" />
    <circle cx="910" cy="420" r="1.2" />
  </g>

  <g transform="translate(180, 80)" opacity="0.75">
    <path d="M 0 -9 L 0 9 M -9 0 L 9 0" stroke="#ffffff" stroke-width="1.2" />
    <circle cx="0" cy="0" r="2" fill="#ffffff" />
  </g>
  <g transform="translate(630, 85)" opacity="0.65">
    <path d="M 0 -8 L 0 8 M -8 0 L 8 0" stroke="#93c5fd" stroke-width="1" />
    <circle cx="0" cy="0" r="1.8" fill="#e0f2fe" />
  </g>
  <g transform="translate(870, 390)" opacity="0.7">
    <path d="M 0 -8 L 0 8 M -8 0 L 8 0" stroke="#fde68a" stroke-width="1" />
    <circle cx="0" cy="0" r="1.8" fill="#fef3c7" />
  </g>

  <g transform="translate(65, 35) scale(0.9)" opacity="0.9">
    <circle cx="65" cy="65" r="50" fill="#e2e8f0" opacity="0.06" />
    <g mask="url(#deepMoonMask)">
      <circle cx="65" cy="65" r="42" fill="url(#deepMoon)" />
      <ellipse cx="44" cy="48" rx="5.5" ry="7" fill="#1e293b" opacity="0.4" />
      <ellipse cx="40" cy="70" rx="4" ry="5.5" fill="#1e293b" opacity="0.35" />
      <circle cx="52" cy="35" r="3" fill="#334155" opacity="0.4" />
      <ellipse cx="48" cy="85" rx="3.5" ry="4.5" fill="#334155" opacity="0.4" />
      <path d="M 58 24 Q 48 45 42 65 T 56 104" stroke="#94a3b8" stroke-width="0.8" fill="none" opacity="0.4" />
    </g>
    <path d="M 65 23 A 42 42 0 0 0 65 107 A 48 48 0 0 1 65 23 Z" fill="#ffffff" opacity="0.25" />
  </g>

  <g transform="translate(760, 110) rotate(-22)" opacity="0.85">
    <ellipse cx="0" cy="0" rx="130" ry="75" fill="url(#deepNebula)" />
    <path d="M 0 0 C 35 -20, 75 -25, 110 5 C 135 25, 130 65, 85 85 C 45 100, -20 85, -60 55" stroke="#c084fc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.3" />
    <path d="M 0 0 C -35 20, -75 25, -110 -5 C -135 -25, -130 -65, -85 -85 C -45 -100, 20 -85, 60 -55" stroke="#60a5fa" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.3" />
    <circle cx="75" cy="5" r="1.5" fill="#ffffff" opacity="0.6" />
    <circle cx="-75" cy="-5" r="1.5" fill="#ffffff" opacity="0.6" />
    <ellipse cx="0" cy="0" rx="34" ry="18" fill="url(#deepGalaxyCore)" />
    <ellipse cx="0" cy="0" rx="12" ry="7" fill="#ffffff" opacity="0.6" />
  </g>

  <g opacity="0.85">
    <polygon points="480,150 310,20 330,10 495,140" fill="url(#deepComet)" opacity="0.4" />
    <path d="M 490 148 Q 410 95 320 35" stroke="url(#deepComet)" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.6" />
    <circle cx="490" cy="148" r="8" fill="#38bdf8" opacity="0.3" />
    <circle cx="490" cy="148" r="3.5" fill="#e0f2fe" opacity="0.8" />
    <circle cx="490" cy="148" r="1.5" fill="#ffffff" />
  </g>

  <g transform="translate(195, 375) rotate(-18)" opacity="0.9">
    <path d="M -110 0 A 110 32 0 0 1 110 0" stroke="url(#deepRings)" stroke-width="14" fill="none" opacity="0.55" />
    <circle cx="0" cy="0" r="48" fill="url(#deepPlanet)" />
    <path d="M -47 -10 Q 0 -5 47 -10 A 48 48 0 0 1 45 5 Q 0 10 -45 5 Z" fill="#fbbf24" opacity="0.3" />
    <path d="M -44 12 Q 0 17 44 12 A 48 48 0 0 1 38 26 Q 0 30 -38 26 Z" fill="#c084fc" opacity="0.25" />
    <path d="M 0 -48 A 48 48 0 0 1 0 48 A 48 48 0 0 1 0 -48" fill="#090d16" opacity="0.4" />
    <path d="M 110 0 A 110 32 0 0 1 -110 0" stroke="url(#deepRings)" stroke-width="14" fill="none" opacity="0.75" />
    <path d="M 100 0 A 100 29 0 0 1 -100 0" stroke="#090d16" stroke-width="1.8" fill="none" opacity="0.5" />
    <path d="M -46 3 Q 0 8 46 3" stroke="#090d16" stroke-width="5" fill="none" opacity="0.45" />
  </g>
</svg>`;

export const PREHISTORIC_VALLEY_SVG = `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dinoSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#052e16" />
      <stop offset="35%" stop-color="#14532d" />
      <stop offset="70%" stop-color="#7c2d12" />
      <stop offset="100%" stop-color="#451a03" />
    </linearGradient>
    <linearGradient id="dinoVolcanoLava" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="25%" stop-color="#fbbf24" stop-opacity="0.8" />
      <stop offset="60%" stop-color="#ea580c" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id="dinoBackMtn" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </linearGradient>
  </defs>

  <rect width="1000" height="500" fill="url(#dinoSky)" />

  <!-- Volcanic Glow Horizon -->
  <circle cx="500" cy="270" r="140" fill="#f97316" opacity="0.25" filter="blur(20px)" />
  <circle cx="500" cy="270" r="70" fill="#fde047" opacity="0.3" filter="blur(10px)" />

  <!-- Distant Volcanic Ridge -->
  <polygon points="120,380 280,240 420,380" fill="url(#dinoBackMtn)" opacity="0.8" />
  <polygon points="380,380 500,220 640,380" fill="url(#dinoBackMtn)" />
  <!-- Lava Caldera Glow -->
  <polygon points="488,220 500,223 512,220 505,245 495,245" fill="url(#dinoVolcanoLava)" />
  <path d="M 500 220 Q 490 260 480 300" stroke="#f97316" stroke-width="2" fill="none" opacity="0.7" />
  <polygon points="590,380 730,250 860,380" fill="url(#dinoBackMtn)" opacity="0.85" />

  <!-- Prehistoric Pterosaurs Silhouettes -->
  <path d="M 230 140 Q 245 130 260 140 Q 252 145 245 142 Q 238 145 230 140 Z" fill="#0c0a09" opacity="0.7" />
  <path d="M 280 110 Q 298 98 316 110 Q 306 116 298 112 Q 290 116 280 110 Z" fill="#0c0a09" opacity="0.8" />
  <path d="M 720 130 Q 735 120 750 130 Q 742 135 735 132 Q 728 135 720 130 Z" fill="#0c0a09" opacity="0.65" />

  <!-- Foreground Jungle Fern Canopy -->
  <path d="M 0 420 Q 250 370 500 420 T 1000 390 L 1000 500 L 0 500 Z" fill="#022c22" />
  <!-- Tropical Fronds -->
  <g fill="#064e3b" opacity="0.7">
    <path d="M 0 500 Q 80 430 140 440 Q 60 470 0 500 Z" />
    <path d="M 120 500 Q 200 420 280 440 Q 180 470 120 500 Z" />
    <path d="M 760 500 Q 850 410 940 430 Q 840 470 760 500 Z" />
    <path d="M 850 500 Q 930 420 1000 430 L 1000 500 Z" />
  </g>
  <path d="M 0 460 Q 400 420 800 470 T 1000 450 L 1000 500 L 0 500 Z" fill="#021f19" />
</svg>`;

export const NEON_ARCADE_SVG = `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="neonArcadeSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b0114" />
      <stop offset="50%" stop-color="#240738" />
      <stop offset="85%" stop-color="#4a044e" />
      <stop offset="100%" stop-color="#180224" />
    </linearGradient>
    <linearGradient id="neonArcadeSun" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="45%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#a21caf" />
    </linearGradient>
  </defs>

  <rect width="1000" height="500" fill="url(#neonArcadeSky)" />

  <!-- Radiant Segmented Sun -->
  <g transform="translate(500, 310)">
    <circle cx="0" cy="0" r="105" fill="url(#neonArcadeSun)" />
    <!-- Segment Blinds -->
    <rect x="-115" y="-12" width="230" height="3" fill="#240738" />
    <rect x="-115" y="6" width="230" height="5" fill="#240738" />
    <rect x="-115" y="26" width="230" height="7" fill="#240738" />
    <rect x="-115" y="48" width="230" height="9" fill="#240738" />
    <rect x="-115" y="72" width="230" height="12" fill="#240738" />
    <rect x="-115" y="98" width="230" height="14" fill="#240738" />
  </g>

  <!-- Distant Cityscape Silhouettes -->
  <g fill="#0f021a">
    <rect x="120" y="260" width="45" height="60" />
    <rect x="180" y="230" width="55" height="90" />
    <rect x="250" y="270" width="40" height="50" />
    <rect x="310" y="240" width="60" height="80" />
    <rect x="630" y="240" width="50" height="80" />
    <rect x="700" y="220" width="65" height="100" />
    <rect x="785" y="250" width="45" height="70" />
    <rect x="850" y="265" width="50" height="55" />
  </g>

  <!-- Horizon Line -->
  <line x1="0" y1="320" x2="1000" y2="320" stroke="#f43f5e" stroke-width="2.5" />
  <line x1="0" y1="320" x2="1000" y2="320" stroke="#38bdf8" stroke-width="1" opacity="0.7" />

  <!-- 3D Perspective Ground Grid -->
  <g stroke="#ec4899" stroke-width="1.2" opacity="0.55">
    <line x1="0" y1="320" x2="0" y2="500" />
    <line x1="150" y1="320" x2="-80" y2="500" />
    <line x1="280" y1="320" x2="120" y2="500" />
    <line x1="390" y1="320" x2="310" y2="500" />
    <line x1="470" y1="320" x2="440" y2="500" />
    <line x1="530" y1="320" x2="560" y2="500" />
    <line x1="610" y1="320" x2="690" y2="500" />
    <line x1="720" y1="320" x2="880" y2="500" />
    <line x1="850" y1="320" x2="1080" y2="500" />
    <line x1="1000" y1="320" x2="1000" y2="500" />
  </g>
  <g stroke="#38bdf8" stroke-width="1.2" opacity="0.5">
    <line x1="0" y1="335" x2="1000" y2="335" />
    <line x1="0" y1="355" x2="1000" y2="355" />
    <line x1="0" y1="382" x2="1000" y2="382" />
    <line x1="0" y1="418" x2="1000" y2="418" />
    <line x1="0" y1="462" x2="1000" y2="462" stroke-width="1.6" />
  </g>
</svg>`;

export const OCEAN_REEF_SVG = `<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="oceanDeepSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="35%" stop-color="#0369a1" />
      <stop offset="70%" stop-color="#075985" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <linearGradient id="oceanSunbeams" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="1000" height="500" fill="url(#oceanDeepSky)" />

  <!-- Shimmering Cascading Sunbeams -->
  <polygon points="120,0 240,0 360,420 180,420" fill="url(#oceanSunbeams)" />
  <polygon points="380,0 520,0 680,420 460,420" fill="url(#oceanSunbeams)" opacity="0.8" />
  <polygon points="680,0 800,0 920,420 740,420" fill="url(#oceanSunbeams)" opacity="0.6" />

  <!-- Distant Seabed Layer -->
  <path d="M 0 400 Q 280 360 560 395 T 1000 375 L 1000 500 L 0 500 Z" fill="#0c4a6e" opacity="0.85" />

  <!-- Underwater Corals & Flora -->
  <g fill="#0e7490" opacity="0.75">
    <path d="M 140 420 Q 150 350 170 330 Q 185 365 180 420 Z" />
    <path d="M 175 420 Q 195 340 220 320 Q 230 360 215 420 Z" />
    <path d="M 780 410 Q 805 340 830 325 Q 845 365 835 410 Z" />
    <path d="M 830 410 Q 855 330 885 315 Q 895 355 875 410 Z" />
  </g>

  <!-- Foreground Coral Reef Ridge -->
  <path d="M 0 445 Q 320 410 650 450 T 1000 425 L 1000 500 L 0 500 Z" fill="#083344" />

  <!-- Rising Bioluminescent Bubbles -->
  <g fill="#bae6fd" opacity="0.6">
    <circle cx="210" cy="280" r="4.5" />
    <circle cx="225" cy="210" r="3" />
    <circle cx="218" cy="140" r="2.2" />
    <circle cx="510" cy="310" r="5" />
    <circle cx="525" cy="240" r="3.5" />
    <circle cx="515" cy="160" r="2.5" />
    <circle cx="810" cy="290" r="4" />
    <circle cx="828" cy="220" r="2.8" />
  </g>

  <!-- Swimming Fish Silhouettes -->
  <path d="M 380 180 Q 400 173 420 180 L 430 175 L 430 185 L 420 180 Z" fill="#bae6fd" opacity="0.45" />
  <path d="M 430 200 Q 448 194 466 200 L 475 196 L 475 204 L 466 200 Z" fill="#bae6fd" opacity="0.4" />
  <path d="M 405 215 Q 420 210 435 215 L 442 212 L 442 218 L 435 215 Z" fill="#bae6fd" opacity="0.35" />
</svg>`;

export interface CoreThemeBackdropInfo {
  templateId: string;
  name: string;
  shortLabel: string;
  theme: string;
  svgMarkup: string;
}

export const CORE_THEME_BACKDROPS: Record<string, CoreThemeBackdropInfo> = {
  'scene-space': {
    templateId: 'deep-cosmos',
    name: 'Deep Cosmos Nebula',
    shortLabel: 'Deep',
    theme: 'Galactic Starlight',
    svgMarkup: DEEP_COSMOS_SVG,
  },
  'scene-dino': {
    templateId: 'prehistoric-valley',
    name: 'Prehistoric Valley',
    shortLabel: 'Prehistoric',
    theme: 'Lush Jungle Flora',
    svgMarkup: PREHISTORIC_VALLEY_SVG,
  },
  'scene-arcade': {
    templateId: 'neon-arcade',
    name: 'Neon Grid Arcade',
    shortLabel: 'Neon',
    theme: 'Cyber Retro 80s',
    svgMarkup: NEON_ARCADE_SVG,
  },
  'scene-ocean': {
    templateId: 'ocean-reef',
    name: 'Ocean Reef Floor',
    shortLabel: 'Ocean',
    theme: 'Deep Coral Abyssal Waters',
    svgMarkup: OCEAN_REEF_SVG,
  },
};

export const getCoreThemeBackdrop = (sceneIdOrPatternOrPackId?: string): CoreThemeBackdropInfo | undefined => {
  if (!sceneIdOrPatternOrPackId || typeof sceneIdOrPatternOrPackId !== 'string') return undefined;
  const raw = sceneIdOrPatternOrPackId.trim();
  if (!raw) return undefined;

  // Direct key lookup
  if (CORE_THEME_BACKDROPS[raw]) {
    return CORE_THEME_BACKDROPS[raw];
  }

  // Clean identifier by removing copy suffixes and lowercasing
  const clean = raw
    .replace(/\s*\(copy\)\s*/gi, '')
    .replace(/\s+copy\s*$/gi, '')
    .replace(/\s+theme\s*$/gi, '')
    .replace(/\s+pack\s*$/gi, '')
    .trim()
    .toLowerCase();

  // Space / Cosmic Voyagers / Deep Cosmos
  if (
    clean === 'scene-space' ||
    clean === 'pack-space' ||
    clean === 'stars' ||
    clean === 'deep-cosmos' ||
    clean === 'deep' ||
    clean.includes('deep cosmos') ||
    clean.includes('cosmic voyager') ||
    clean.includes('galactic starlight') ||
    clean.includes('space') ||
    clean.includes('cosmos')
  ) {
    return CORE_THEME_BACKDROPS['scene-space'];
  }

  // Dino / Prehistoric Pals / Prehistoric Valley
  if (
    clean === 'scene-dino' ||
    clean === 'pack-dino' ||
    clean === 'dots' ||
    clean === 'prehistoric-valley' ||
    clean === 'prehistoric' ||
    clean.includes('prehistoric') ||
    clean.includes('lush jungle') ||
    clean.includes('dino')
  ) {
    return CORE_THEME_BACKDROPS['scene-dino'];
  }

  // Arcade / Neon Math Arcade / Neon Grid
  if (
    clean === 'scene-arcade' ||
    clean === 'pack-arcade' ||
    clean === 'pack-math-arcade' ||
    clean === 'arcade' ||
    clean === 'lines' ||
    clean === 'neon-arcade' ||
    clean === 'neon' ||
    clean.includes('neon') ||
    clean.includes('cyber retro') ||
    clean.includes('arcade')
  ) {
    return CORE_THEME_BACKDROPS['scene-arcade'];
  }

  // Ocean / Abyssal Reef / Ocean Reef
  if (
    clean === 'scene-ocean' ||
    clean === 'pack-ocean' ||
    clean === 'ocean' ||
    clean === 'waves' ||
    clean === 'ocean-reef' ||
    clean.includes('ocean') ||
    clean.includes('abyssal') ||
    clean.includes('coral') ||
    clean.includes('reef')
  ) {
    return CORE_THEME_BACKDROPS['scene-ocean'];
  }

  // Fallback templateId, shortLabel, name, or theme match
  return Object.values(CORE_THEME_BACKDROPS).find(
    (b) =>
      b.templateId.toLowerCase() === clean ||
      b.shortLabel.toLowerCase() === clean ||
      b.name.toLowerCase() === clean ||
      b.theme.toLowerCase() === clean
  );
};

export const SVG_BACKGROUND_TEMPLATES: SvgTemplatePreset[] = [
  // 4 Core Official Theme Backdrops
  {
    id: 'deep-cosmos',
    name: 'Deep Cosmos Nebula',
    description: 'Deep cosmic void with sparkling stars, glowing nebulae, crescent moon, and ringed planet',
    category: 'Core Theme (Deep)',
    svgMarkup: DEEP_COSMOS_SVG,
  },
  {
    id: 'prehistoric-valley',
    name: 'Prehistoric Valley',
    description: 'Primeval volcanic valley with smoking crater ridges, pterosaurs, and jungle flora',
    category: 'Core Theme (Prehistoric)',
    svgMarkup: PREHISTORIC_VALLEY_SVG,
  },
  {
    id: 'neon-arcade',
    name: 'Neon Grid Arcade',
    description: 'Retro 80s synthwave perspective grid with setting digital sun and cyber horizon skyline',
    category: 'Core Theme (Neon)',
    svgMarkup: NEON_ARCADE_SVG,
  },
  {
    id: 'ocean-reef',
    name: 'Ocean Reef Floor',
    description: 'Deep abyssal coral floor with shimmering sunbeams, swimming marine life, and bubbles',
    category: 'Core Theme (Ocean)',
    svgMarkup: OCEAN_REEF_SVG,
  },
  // Additional Creative Vector Presets
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
  <circle cx="500" cy="320" r="90" fill="#fef08a" opacity="0.8" />
  <path d="M 0 350 Q 240 280 500 340 T 1000 310 L 1000 500 L 0 500 Z" fill="url(#duneBack)" opacity="0.9" />
  <path d="M 0 390 Q 320 330 650 400 T 1000 370 L 1000 500 L 0 500 Z" fill="#6c2e17" opacity="0.95" />
  <path d="M 0 440 Q 400 390 800 460 T 1000 430 L 1000 500 L 0 500 Z" fill="url(#duneFront)" />
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
  <circle cx="280" cy="130" r="60" fill="#d1fae5" opacity="0.4" filter="blur(10px)" />
  <circle cx="280" cy="130" r="40" fill="#ecfdf5" opacity="0.8" />
  <g fill="#064e3b" opacity="0.45">
    <polygon points="120,430 145,260 170,430" />
    <polygon points="190,440 220,290 250,440" />
    <polygon points="450,450 475,310 500,450" />
    <polygon points="720,440 750,270 780,440" />
    <polygon points="840,430 865,300 890,430" />
  </g>
  <g fill="#022c22" opacity="0.95">
    <polygon points="30,470 65,220 100,470" />
    <polygon points="310,480 350,240 390,480" />
    <polygon points="600,475 635,210 670,475" />
    <polygon points="900,490 945,190 990,490" />
  </g>
  <path d="M 0 450 Q 300 410 600 460 T 1000 430 L 1000 500 L 0 500 Z" fill="#021f19" />
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
  <line x1="0" y1="360" x2="1000" y2="360" stroke="#ec4899" strokeWidth="2.5" opacity="0.85" />
  <g fill="#1e1b4b" opacity="0.8">
    <rect x="80" y="240" width="70" height="120" />
    <rect x="180" y="190" width="90" height="170" />
    <rect x="300" y="260" width="60" height="100" />
    <rect x="680" y="210" width="85" height="150" />
    <rect x="790" y="250" width="70" height="110" />
    <rect x="880" y="180" width="80" height="180" />
  </g>
  <g fill="#09090b">
    <rect x="390" y="150" width="100" height="210" />
    <polygon points="440,110 420,150 460,150" fill="#a855f7" />
    <rect x="520" y="130" width="110" height="230" />
    <line x1="575" y1="90" x2="575" y2="130" stroke="#06b6d4" strokeWidth="3" />
  </g>
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
  <path d="M 380 500 L 380 240 C 380 170 620 170 620 240 L 620 500 Z" fill="#27272a" />
  <circle cx="500" cy="220" r="70" fill="#ea580c" opacity="0.85" />
  <path d="M 340 500 L 340 240 C 340 140 660 140 660 240 L 660 500" fill="none" stroke="#ca8a04" strokeWidth="2.5" opacity="0.4" />
  <path d="M 0 460 Q 260 400 500 450 T 1000 420 L 1000 500 L 0 500 Z" fill="#3f3f46" />
</svg>`,
  },
];
