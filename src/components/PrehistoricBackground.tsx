import React from 'react';

export const PrehistoricBackground: React.FC = () => {
  return (
    <div
      data-canvas-bg="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Ambient Primeval Sky & Volcanic / Asteroid Light Glows */}
      {/* Volcanic Magma Glow (Mid-Horizon) */}
      <div
        data-canvas-bg="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full bg-gradient-to-t from-orange-600/18 via-red-600/12 to-transparent blur-3xl"
      />
      {/* Asteroid Entry Fire Trail Glow (Upper Left to Mid-Sky) */}
      <div
        data-canvas-bg="true"
        className="absolute top-0 left-10 w-96 h-48 -rotate-12 bg-gradient-to-r from-amber-500/15 via-orange-600/10 to-transparent blur-2xl"
      />
      {/* Deep Jungle Floor Mist (Bottom) */}
      <div
        data-canvas-bg="true"
        className="absolute -bottom-10 inset-x-0 h-44 bg-gradient-to-t from-emerald-950/80 via-emerald-900/20 to-transparent blur-xl"
      />

      {/* SVG Canvas for Detailed Vector Prehistoric Landscapes */}
      <svg
        data-canvas-bg="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Asteroid Plasma Trail Gradient */}
          <linearGradient id="asteroidTrail" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="65%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="90%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>

          {/* Asteroid Smoke Haze */}
          <linearGradient id="asteroidSmoke" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0" />
            <stop offset="50%" stopColor="#475569" stopOpacity="0.18" />
            <stop offset="85%" stopColor="#f97316" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4" />
          </linearGradient>

          {/* Volcanic Magma Conduit Gradient */}
          <linearGradient id="lavaGlow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
          </linearGradient>

          {/* Volcanic Smoke Cloud Gradient */}
          <radialGradient id="smokePuff" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
          </radialGradient>

          {/* Far Mountain Ridge Gradient */}
          <linearGradient id="farMountains" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.4" />
          </linearGradient>

          {/* Midground Volcano Silhouette Gradient */}
          <linearGradient id="volcanoRock" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1c1917" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#292524" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.75" />
          </linearGradient>

          {/* Lush Prehistoric Jungle Fronds Gradient */}
          <linearGradient id="jungleFlora" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#047857" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#065f46" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* ================= LAYER 1: DISTANT VOLCANIC MOUNTAIN RIDGE ================= */}
        {/* Deep background hills rolling across horizon */}
        <path
          d="M 0 340 Q 120 290 260 320 T 520 300 T 780 325 T 1000 295 L 1000 500 L 0 500 Z"
          fill="url(#farMountains)"
        />

        {/* Secondary serrated mountain peaks */}
        <path
          d="M 0 360 L 90 310 L 180 345 L 310 280 L 410 330 L 620 290 L 750 335 L 890 295 L 1000 340 L 1000 500 L 0 500 Z"
          fill="#064e3b"
          opacity="0.32"
        />

        {/* ================= LAYER 2: THE ERUPTING STRATOVOLCANO ================= */}
        {/* Positioned majestic in midground center-left (x: 430 - 710, peak at x: 570, y: 195) */}
        <g opacity="0.85">
          {/* Volcanic Ash & Smoke Plume Billowing Upward into the Sky */}
          {/* Background billowing ash clouds */}
          <ellipse cx="570" cy="155" rx="42" ry="26" fill="url(#smokePuff)" />
          <ellipse cx="545" cy="130" rx="48" ry="32" fill="url(#smokePuff)" />
          <ellipse cx="595" cy="115" rx="55" ry="36" fill="url(#smokePuff)" />
          <ellipse cx="560" cy="85" rx="68" ry="42" fill="url(#smokePuff)" />
          <ellipse cx="615" cy="65" rx="80" ry="48" fill="url(#smokePuff)" />
          <ellipse cx="575" cy="38" rx="92" ry="52" fill="url(#smokePuff)" />

          {/* Ash cloud warm underbelly reflection from caldera lava */}
          <ellipse cx="570" cy="165" rx="30" ry="14" fill="#ea580c" opacity="0.25" filter="blur(3px)" />
          <ellipse cx="585" cy="130" rx="35" ry="18" fill="#f97316" opacity="0.18" filter="blur(4px)" />

          {/* Volcano Mountain Cone Base & Slopes */}
          <polygon
            points="380,420 545,210 595,210 740,420"
            fill="url(#volcanoRock)"
          />

          {/* Rugged Rock Fissures & Ridges on Slope */}
          <path
            d="M 545 210 Q 520 280 440 400"
            stroke="#1c1917"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />
          <path
            d="M 595 210 Q 630 290 700 410"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 570 215 Q 575 295 590 410"
            stroke="#1c1917"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
          />

          {/* Caldera Rim / Crater Bowl */}
          <ellipse cx="570" cy="210" rx="26" ry="7" fill="#0f172a" opacity="0.8" />
          <ellipse cx="570" cy="210" rx="22" ry="5" fill="#ea580c" opacity="0.6" filter="blur(1px)" />

          {/* Molten Lava Fountain Erupting from Crater */}
          <path
            d="M 565 208 Q 562 175 560 160 Q 568 185 572 208 Z"
            fill="url(#lavaGlow)"
          />
          <path
            d="M 572 208 Q 575 168 580 152 Q 582 182 578 208 Z"
            fill="url(#lavaGlow)"
          />
          <path
            d="M 568 208 Q 570 155 573 145 Q 574 175 571 208 Z"
            fill="#ffffff"
            opacity="0.65"
          />

          {/* Cascading Lava Flows down the Volcanic Slopes */}
          {/* Main Lava River (Left Slope) */}
          <path
            d="M 558 212 Q 550 250 535 285 Q 515 330 485 375 T 460 420"
            stroke="url(#lavaGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
          <path
            d="M 558 212 Q 550 250 535 285 Q 515 330 485 375"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />

          {/* Secondary Lava Branch (Right Slope) */}
          <path
            d="M 580 213 Q 595 255 615 300 Q 630 340 645 390"
            stroke="url(#lavaGlow)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />

          {/* Glowing Volcanic Embers & Sparks floating in the air */}
          <circle cx="552" cy="145" r="1.4" fill="#fbbf24" opacity="0.75" />
          <circle cx="585" cy="138" r="1.6" fill="#f97316" opacity="0.7" />
          <circle cx="568" cy="120" r="1.2" fill="#ffffff" opacity="0.8" />
          <circle cx="540" cy="110" r="1.5" fill="#f97316" opacity="0.6" />
          <circle cx="605" cy="98" r="1.3" fill="#fbbf24" opacity="0.65" />
          <circle cx="578" cy="80" r="1.4" fill="#ea580c" opacity="0.5" />
          <circle cx="620" cy="125" r="1.2" fill="#f97316" opacity="0.55" />
        </g>

        {/* ================= LAYER 3: GIANT ASTEROID STREAKING ACROSS HORIZON ================= */}
        {/* Entry trajectory from upper left (x: 40, y: 15) descending to mid-center (x: 410, y: 135) */}
        <g opacity="0.85">
          {/* Broad atmospheric friction glow / ionized air plume */}
          <polygon
            points="420,138 30,10 55,0 425,128"
            fill="url(#asteroidSmoke)"
            opacity="0.45"
            filter="blur(5px)"
          />

          {/* Primary Blazing Fiery Streaking Tail */}
          <path
            d="M 40 15 Q 220 70 415 133"
            stroke="url(#asteroidTrail)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* White-Hot Core Beam of Tail */}
          <path
            d="M 90 28 Q 240 76 415 133"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />

          {/* Shockwave Envelope & Bow Shock Ring */}
          <ellipse
            cx="418"
            cy="134"
            rx="14"
            ry="9"
            transform="rotate(18, 418, 134)"
            fill="#f97316"
            opacity="0.35"
            filter="blur(3px)"
          />
          <ellipse
            cx="418"
            cy="134"
            rx="8"
            ry="5.5"
            transform="rotate(18, 418, 134)"
            fill="#fde047"
            opacity="0.6"
            filter="blur(1px)"
          />

          {/* Rocky Bolide Asteroid Core with Impact Lighting */}
          <circle cx="417" cy="133" r="4.2" fill="#ffffff" opacity="0.95" />
          {/* Trailing fiery fragments flaking off behind the asteroid */}
          <circle cx="395" cy="125" r="1.6" fill="#fbbf24" opacity="0.75" />
          <circle cx="370" cy="116" r="1.3" fill="#f97316" opacity="0.65" />
          <circle cx="340" cy="105" r="1.8" fill="#f87171" opacity="0.6" />
          <circle cx="305" cy="94" r="1.2" fill="#fbbf24" opacity="0.5" />
          <circle cx="260" cy="80" r="1.4" fill="#f97316" opacity="0.45" />
        </g>

        {/* ================= LAYER 4: SOARING PTERODACTYLS IN THE SKY ================= */}
        {/* Pterosaur 1 (High sky, glides near asteroid and volcano) */}
        <g transform="translate(320, 160) scale(0.75) rotate(-6)" opacity="0.42">
          {/* Left Wing */}
          <path
            d="M 0 0 C -12 -14, -26 -16, -38 -10 C -28 -4, -14 -2, 0 0"
            fill="#064e3b"
          />
          {/* Right Wing */}
          <path
            d="M 0 0 C 14 -16, 30 -18, 42 -12 C 30 -5, 16 -3, 0 0"
            fill="#064e3b"
          />
          {/* Crested Head & Body */}
          <path d="M 0 -3 L 2 -10 L 4 -7 L 1 6 Z" fill="#022c22" />
        </g>

        {/* Pterosaur 2 (Smaller, distant soaring over mountain ridge) */}
        <g transform="translate(250, 195) scale(0.5) rotate(-2)" opacity="0.32">
          <path
            d="M 0 0 C -12 -14, -26 -16, -38 -10 C -28 -4, -14 -2, 0 0"
            fill="#064e3b"
          />
          <path
            d="M 0 0 C 14 -16, 30 -18, 42 -12 C 30 -5, 16 -3, 0 0"
            fill="#064e3b"
          />
          <path d="M 0 -3 L 2 -10 L 4 -7 L 1 6 Z" fill="#022c22" />
        </g>

        {/* Pterosaur 3 (Gliding right toward the volcano peak) */}
        <g transform="translate(730, 175) scale(0.65) rotate(8)" opacity="0.36">
          <path
            d="M 0 0 C -14 -16, -30 -18, -42 -12 C -30 -5, -16 -3, 0 0"
            fill="#064e3b"
          />
          <path
            d="M 0 0 C 12 -14, 26 -16, 38 -10 C 28 -4, 14 -2, 0 0"
            fill="#064e3b"
          />
          <path d="M 0 -3 L -2 -10 L -4 -7 L -1 6 Z" fill="#022c22" />
        </g>

        {/* ================= LAYER 5: TROPICAL PREHISTORIC VEGETATION ================= */}
        {/* LEFT FLANK: Giant Jurassic Tree Ferns & Cycad Fronds */}
        <g opacity="0.6">
          {/* Tall Cycad Trunk 1 */}
          <path
            d="M 0 500 Q 40 400 65 310 Q 75 250 85 220"
            stroke="#1c1917"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          {/* Cycad Crown Fronds (Pinnate arching leaves) */}
          <g transform="translate(85, 220)">
            {/* Frond Arching Right */}
            <path
              d="M 0 0 Q 60 -35 125 10 Q 75 10 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Arching High */}
            <path
              d="M 0 0 Q 35 -65 75 -95 Q 45 -45 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Arching Up-Right */}
            <path
              d="M 0 0 Q 65 -70 120 -60 Q 70 -35 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Arching Left/Overhanging */}
            <path
              d="M 0 0 Q -40 -50 -80 -60 Q -50 -25 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Drooping Low */}
            <path
              d="M 0 0 Q 70 -5 130 50 Q 70 35 0 0"
              fill="url(#jungleFlora)"
            />
          </g>

          {/* Shorter Secondary Tree Fern (x: 140, y: 320) */}
          <path
            d="M 110 500 Q 125 420 145 330"
            stroke="#1c1917"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          <g transform="translate(145, 330)">
            <path d="M 0 0 Q 50 -40 105 -20 Q 60 -10 0 0" fill="url(#jungleFlora)" />
            <path d="M 0 0 Q 30 -60 65 -80 Q 35 -40 0 0" fill="url(#jungleFlora)" />
            <path d="M 0 0 Q -35 -45 -70 -50 Q -40 -20 0 0" fill="url(#jungleFlora)" />
            <path d="M 0 0 Q 60 -10 110 30 Q 60 20 0 0" fill="url(#jungleFlora)" />
          </g>

          {/* Giant Prehistoric Monstera / Fan Palm Ground Foliage (Lower Left) */}
          <path
            d="M -10 420 Q 60 380 95 440 Q 30 470 -10 420"
            fill="#065f46"
            opacity="0.45"
          />
          <path
            d="M 20 450 Q 110 410 150 480 Q 80 500 20 450"
            fill="#047857"
            opacity="0.4"
          />
          <path
            d="M -20 470 Q 70 450 110 510 L -20 510 Z"
            fill="#022c22"
            opacity="0.65"
          />
        </g>

        {/* RIGHT FLANK: Tropical Jurassic Canopy Overhanging */}
        <g opacity="0.62">
          {/* Tall Overarching Cycad Trunk 2 (Right edge) */}
          <path
            d="M 1000 500 Q 960 380 930 280 Q 915 210 895 170"
            stroke="#1c1917"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          {/* Canopy Fronds Overhanging Inward */}
          <g transform="translate(895, 170)">
            {/* Major Frond Sweeping Inward Left */}
            <path
              d="M 0 0 Q -75 -40 -155 0 Q -95 10 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Arching High-Left */}
            <path
              d="M 0 0 Q -70 -75 -130 -90 Q -80 -50 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Arching Straight Up */}
            <path
              d="M 0 0 Q -30 -70 -50 -105 Q -25 -55 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Drooping Inward Low */}
            <path
              d="M 0 0 Q -85 -5 -160 55 Q -90 40 0 0"
              fill="url(#jungleFlora)"
            />
            {/* Frond Flaring Outward */}
            <path
              d="M 0 0 Q 45 -45 80 -40 Q 50 -20 0 0"
              fill="url(#jungleFlora)"
            />
          </g>

          {/* Lower Right Ground Cycad Cluster */}
          <path
            d="M 910 500 Q 880 430 850 360"
            stroke="#1c1917"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          <g transform="translate(850, 360)">
            <path d="M 0 0 Q -60 -40 -115 -25 Q -65 -10 0 0" fill="url(#jungleFlora)" />
            <path d="M 0 0 Q -40 -60 -75 -85 Q -40 -45 0 0" fill="url(#jungleFlora)" />
            <path d="M 0 0 Q -65 0 -115 40 Q -65 25 0 0" fill="url(#jungleFlora)" />
          </g>

          {/* Broad Ground Fronds (Lower Right Corner) */}
          <path
            d="M 1010 410 Q 920 400 870 460 Q 940 480 1010 410"
            fill="#065f46"
            opacity="0.45"
          />
          <path
            d="M 1020 460 Q 900 450 860 510 L 1020 510 Z"
            fill="#022c22"
            opacity="0.7"
          />
        </g>

        {/* BOTTOM HORIZON: Distant Primeval Jungle Canopy Silhouette */}
        <path
          d="M 0 490 Q 70 475 140 485 T 280 475 T 420 482 T 560 473 T 700 480 T 840 472 T 1000 485 L 1000 500 L 0 500 Z"
          fill="#022c22"
          opacity="0.75"
        />

        {/* Primeval Floating Spores / Embers in the Jungle Clearing */}
        <circle cx="210" cy="380" r="1.5" fill="#a7f3d0" opacity="0.35" />
        <circle cx="340" cy="420" r="1.3" fill="#fde68a" opacity="0.3" />
        <circle cx="470" cy="360" r="1.2" fill="#a7f3d0" opacity="0.35" />
        <circle cx="680" cy="410" r="1.5" fill="#fed7aa" opacity="0.3" />
        <circle cx="780" cy="370" r="1.4" fill="#a7f3d0" opacity="0.3" />
      </svg>
    </div>
  );
};
