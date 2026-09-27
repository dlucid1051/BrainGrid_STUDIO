import React from 'react';

export const OceanBackground: React.FC = () => {
  return (
    <div
      data-canvas-bg="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Deep Ocean Lighting Gradients */}
      {/* Top Surface Light Bloom (Sunlight shimmering down from water surface) */}
      <div
        data-canvas-bg="true"
        className="absolute -top-16 inset-x-0 h-64 opacity-35 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #38bdf8 0%, #0284c7 45%, transparent 75%)',
        }}
      />

      {/* Deep Seabed Floor Glow (Warm sandy turquoise glow at bottom) */}
      <div
        data-canvas-bg="true"
        className="absolute -bottom-10 inset-x-0 h-44 opacity-25 blur-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #0d9488 0%, #083344 60%, transparent 85%)',
        }}
      />

      {/* 2. Full Vector SVG Underwater Scene */}
      <svg
        data-canvas-bg="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Water Caustics / Light Rays Gradient */}
          <linearGradient id="oceanSunRayGrad" x1="0%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>

          {/* Deep Sandy Seabed Gradient (Back dunes) */}
          <linearGradient id="oceanBedBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0e445b" />
            <stop offset="100%" stopColor="#04202e" />
          </linearGradient>

          {/* Foreground Sandy Ocean Floor Gradient */}
          <linearGradient id="oceanBedFore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#134e5e" />
            <stop offset="40%" stopColor="#0f3b48" />
            <stop offset="100%" stopColor="#08222b" />
          </linearGradient>

          {/* Bubble Shimmer Gradient */}
          <radialGradient id="bubbleShimmer" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
          </radialGradient>

          {/* Pearl Glow Gradient */}
          <radialGradient id="pearlGlow" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor="#fdf4ff" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#f5d0fe" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0.75" />
          </radialGradient>

          {/* Starfish Texture Gradient */}
          <linearGradient id="starfishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Clam Shell Outer Gradient */}
          <linearGradient id="clamOuterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Clam Inner Iridescent Gradient */}
          <linearGradient id="clamInnerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="40%" stopColor="#f472b6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fae8ff" stopOpacity="0.9" />
          </linearGradient>

          {/* Seaweed Kelp Gradient */}
          <linearGradient id="kelpGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          {/* Coral Branch Gradient */}
          <linearGradient id="coralGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="60%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>
        </defs>

        {/* ================= LAYER 1: SUNLIGHT SHIMMER RAYS ================= */}
        <g opacity="0.6">
          <polygon points="120,0 240,0 380,420 180,420" fill="url(#oceanSunRayGrad)" />
          <polygon points="360,0 490,0 680,450 510,450" fill="url(#oceanSunRayGrad)" />
          <polygon points="620,0 760,0 950,440 780,440" fill="url(#oceanSunRayGrad)" />
          <polygon points="820,0 920,0 1060,400 940,400" fill="url(#oceanSunRayGrad)" />
        </g>

        {/* ================= LAYER 2: DISTANT SCHOOL OF TINY FISH ================= */}
        <g opacity="0.35" fill="#38bdf8">
          {/* Fish 1 */}
          <path d="M 680 140 Q 695 136 710 140 Q 695 144 680 140 Z M 710 140 L 718 135 L 716 140 L 718 145 Z" />
          {/* Fish 2 */}
          <path d="M 705 125 Q 717 121 730 125 Q 717 129 705 125 Z M 730 125 L 736 121 L 735 125 L 736 129 Z" />
          {/* Fish 3 */}
          <path d="M 725 148 Q 738 144 750 148 Q 738 152 725 148 Z M 750 148 L 757 144 L 755 148 L 757 152 Z" />
          {/* Fish 4 */}
          <path d="M 660 160 Q 672 157 682 160 Q 672 163 660 160 Z M 682 160 L 688 157 L 687 160 L 688 163 Z" />
          {/* Fish 5 */}
          <path d="M 740 135 Q 750 132 760 135 Q 750 138 740 135 Z M 760 135 L 765 132 L 764 135 L 765 138 Z" />
        </g>

        {/* ================= LAYER 3: BACKGROUND OCEAN SEABED RIDGE ================= */}
        <path
          d="M 0 420 Q 150 400 320 425 T 640 415 T 880 435 Q 940 430 1000 422 L 1000 500 L 0 500 Z"
          fill="url(#oceanBedBack)"
          opacity="0.85"
        />

        {/* Distant Kelp Fronds along back ridge */}
        <g opacity="0.45">
          <path
            d="M 180 410 Q 170 340 190 280 T 175 200 Q 195 250 185 340 T 183 415"
            fill="none"
            stroke="#059669"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 820 425 Q 835 360 815 295 T 830 215 Q 815 270 825 355 T 822 430"
            fill="none"
            stroke="#059669"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* Distant Branching Coral on Back Ridge (Right) */}
        <g transform="translate(860, 420) scale(0.65)" opacity="0.6">
          <path
            d="M 0 0 C 0 -30 -15 -45 -25 -70 C -35 -95 -20 -115 -25 -135 C -15 -110 5 -90 10 -60 M -25 -70 C -45 -85 -60 -95 -75 -115 C -60 -95 -40 -80 -25 -70 M 0 -30 C 20 -50 35 -75 45 -105 C 50 -120 45 -135 55 -150 C 45 -130 30 -110 20 -85 C 10 -60 5 -40 0 0"
            stroke="url(#coralGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ================= LAYER 4: FOREGROUND SEABED DUNE ================= */}
        {/* Rolling organic sand dunes with deep shading */}
        <path
          d="M 0 445 Q 120 435 250 450 T 520 440 T 780 455 Q 890 448 1000 440 L 1000 500 L 0 500 Z"
          fill="url(#oceanBedFore)"
        />

        {/* Subtle Sand Ripple Highlights */}
        <path
          d="M 80 460 Q 180 452 280 462 M 350 465 Q 460 456 570 464 M 660 468 Q 760 462 860 469"
          stroke="#2dd4bf"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.18"
          fill="none"
        />

        {/* Seabed Pebbles & Tiny Shells */}
        <ellipse cx="220" cy="478" rx="8" ry="4" fill="#0f766e" opacity="0.6" />
        <ellipse cx="230" cy="482" rx="5" ry="3" fill="#14b8a6" opacity="0.4" />
        <ellipse cx="460" cy="485" rx="9" ry="4" fill="#042f2e" opacity="0.7" />
        <ellipse cx="730" cy="482" rx="7" ry="3.5" fill="#115e59" opacity="0.5" />
        <ellipse cx="742" cy="486" rx="4" ry="2" fill="#2dd4bf" opacity="0.3" />
        <ellipse cx="910" cy="476" rx="10" ry="4.5" fill="#042f2e" opacity="0.7" />

        {/* ================= LAYER 5: OCEAN FLORA (Kelp & Sea Anemone) ================= */}
        {/* Left Lush Kelp Forest (Foreground cluster at x: 40 - 130) */}
        <g opacity="0.85">
          {/* Kelp Stem 1 (Tall gracefully curving blade) */}
          <path
            d="M 60 470 C 45 400 90 330 65 240 C 45 170 85 110 70 50"
            stroke="url(#kelpGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaf blades along stem 1 */}
          <path
            d="M 63 380 Q 95 365 115 375 Q 85 395 62 390 Z"
            fill="#10b981"
            opacity="0.75"
          />
          <path
            d="M 74 310 Q 30 295 15 305 Q 45 325 72 320 Z"
            fill="#059669"
            opacity="0.75"
          />
          <path
            d="M 66 230 Q 100 215 120 225 Q 90 245 65 240 Z"
            fill="#34d399"
            opacity="0.8"
          />
          <path
            d="M 77 150 Q 40 135 25 145 Q 55 165 75 160 Z"
            fill="#10b981"
            opacity="0.8"
          />
          <path
            d="M 69 80 Q 95 70 108 80 Q 85 95 68 90 Z"
            fill="#6ee7b7"
            opacity="0.85"
          />

          {/* Kelp Stem 2 (Shorter lush companion blade) */}
          <path
            d="M 95 475 C 115 415 80 355 105 285 C 125 225 100 170 115 120"
            stroke="url(#kelpGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 98 400 Q 130 385 145 398 Q 120 415 97 410 Z"
            fill="#059669"
            opacity="0.7"
          />
          <path
            d="M 92 330 Q 60 315 45 325 Q 75 345 93 340 Z"
            fill="#10b981"
            opacity="0.75"
          />
          <path
            d="M 106 250 Q 140 235 155 248 Q 130 265 105 260 Z"
            fill="#34d399"
            opacity="0.8"
          />
          <path
            d="M 108 170 Q 75 158 60 168 Q 88 185 106 180 Z"
            fill="#6ee7b7"
            opacity="0.8"
          />

          {/* Small Sea Anemone Tentacle Cluster at Base of Kelp */}
          <g transform="translate(80, 470)" opacity="0.8">
            <path d="M 0 0 Q -15 -18 -20 -30 Q -12 -15 0 0" fill="#f43f5e" />
            <path d="M 0 0 Q -8 -22 -10 -35 Q -3 -18 0 0" fill="#fb7185" />
            <path d="M 0 0 Q 0 -25 0 -40 Q 5 -20 0 0" fill="#fda4af" />
            <path d="M 0 0 Q 8 -22 12 -34 Q 4 -17 0 0" fill="#fb7185" />
            <path d="M 0 0 Q 16 -18 22 -28 Q 11 -14 0 0" fill="#f43f5e" />
          </g>
        </g>

        {/* Right Coral Bush & Sea Ferns (x: 900 - 970) */}
        <g opacity="0.85">
          {/* Main Vibrant Pink Coral */}
          <g transform="translate(930, 475) scale(0.85)">
            <path
              d="M 0 0 C 0 -35 -20 -55 -30 -80 C -42 -110 -25 -135 -30 -160 C -18 -130 5 -105 12 -70 M -30 -80 C -55 -95 -75 -110 -90 -135 C -72 -112 -48 -95 -30 -80 M 0 -35 C 25 -60 40 -90 52 -125 C 58 -142 52 -160 62 -178 C 52 -154 36 -130 25 -100 C 12 -70 6 -45 0 0 M 25 -100 C 45 -118 68 -130 82 -150 C 65 -132 42 -116 25 -100"
              stroke="url(#coralGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* Sea Fern / Grass next to coral */}
          <path
            d="M 885 478 Q 870 420 890 370 Q 875 425 888 480"
            fill="#0d9488"
            opacity="0.8"
          />
          <path
            d="M 898 480 Q 915 430 902 385 Q 905 435 900 482"
            fill="#14b8a6"
            opacity="0.8"
          />
        </g>

        {/* ================= LAYER 6: DETAILED CLAM SHELL WITH LUMINOUS PEARL ================= */}
        {/* Positioned at Ocean Floor (x: 350, y: 462) */}
        <g transform="translate(350, 458)" opacity="0.95">
          {/* Soft Pearl Illumination Haze */}
          <circle
            cx="0"
            cy="-10"
            r="32"
            fill="#e879f9"
            opacity="0.22"
            filter="blur(8px)"
          />
          <circle
            cx="0"
            cy="-10"
            r="18"
            fill="#ffffff"
            opacity="0.3"
            filter="blur(4px)"
          />

          {/* Lower Clam Shell Half (Hinged at bottom) */}
          <path
            d="M -36 0 C -40 16 40 16 36 0 C 30 6 15 10 0 10 C -15 10 -30 6 -36 0 Z"
            fill="url(#clamOuterGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Upper Clam Shell Half (Open wide displaying pearl) */}
          <path
            d="M -36 0 C -42 -28 -18 -38 0 -38 C 18 -38 42 -28 36 0 C 24 -12 14 -18 0 -18 C -14 -18 -24 -12 -36 0 Z"
            fill="url(#clamInnerGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Clam Shell Ridges / Scallop Ribs */}
          <path
            d="M 0 0 L 0 -38 M 0 0 L -12 -36 M 0 0 L 12 -36 M 0 0 L -24 -30 M 0 0 L 24 -30"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Inside Shell Pearl Cushion / Mantle Fold */}
          <ellipse cx="0" cy="-2" rx="14" ry="7" fill="#f472b6" opacity="0.6" />

          {/* The Glowing Magic Pearl */}
          <circle cx="0" cy="-7" r="9" fill="url(#pearlGlow)" />
          {/* Pearl Specular Highlights */}
          <ellipse cx="-2.5" cy="-9.5" rx="3" ry="2" fill="#ffffff" opacity="0.9" />
          <circle cx="2" cy="-4" r="1" fill="#ffffff" opacity="0.6" />
        </g>

        {/* ================= LAYER 7: STARFISH ON OCEAN FLOOR ================= */}
        {/* Positioned on the Sandy Seabed Floor (x: 630, y: 466) */}
        <g transform="translate(630, 464) rotate(14) scale(0.95)" opacity="0.95">
          {/* Drop shadow under starfish */}
          <path
            d="M 0 -30 L 7 -9 L 28 -7 L 12 7 L 17 28 L 0 15 L -17 28 L -12 7 L -28 -7 L -7 -9 Z"
            fill="#021f28"
            opacity="0.6"
            transform="translate(2, 4) scale(1.05)"
          />

          {/* Starfish Body (Organic 5-arm sea star) */}
          <path
            d="M 0 -30 C 3 -20 5 -12 8 -9 C 14 -8 20 -7 29 -7 C 21 -1 16 3 13 8 C 15 15 16 21 18 29 C 11 23 6 18 0 16 C -6 18 -11 23 -18 29 C -16 21 -15 15 -13 8 C -16 3 -21 -1 -29 -7 C -20 -7 -14 -8 -8 -9 C -5 -12 -3 -20 0 -30 Z"
            fill="url(#starfishGrad)"
            stroke="#c2410c"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Central Disk Star Texture & Suction Tube Nodules */}
          <circle cx="0" cy="2" r="3.5" fill="#fed7aa" opacity="0.9" />
          <circle cx="0" cy="2" r="1.5" fill="#ea580c" />

          {/* Arm 1 Nodules (Top) */}
          <circle cx="0" cy="-8" r="1.8" fill="#ffedd5" opacity="0.85" />
          <circle cx="0" cy="-16" r="1.5" fill="#ffedd5" opacity="0.85" />
          <circle cx="0" cy="-23" r="1.2" fill="#ffedd5" opacity="0.8" />

          {/* Arm 2 Nodules (Top Right) */}
          <circle cx="7" cy="-2" r="1.8" fill="#ffedd5" opacity="0.85" />
          <circle cx="15" cy="-3" r="1.5" fill="#ffedd5" opacity="0.85" />
          <circle cx="22" cy="-5" r="1.2" fill="#ffedd5" opacity="0.8" />

          {/* Arm 3 Nodules (Bottom Right) */}
          <circle cx="5" cy="8" r="1.8" fill="#ffedd5" opacity="0.85" />
          <circle cx="10" cy="15" r="1.5" fill="#ffedd5" opacity="0.85" />
          <circle cx="14" cy="22" r="1.2" fill="#ffedd5" opacity="0.8" />

          {/* Arm 4 Nodules (Bottom Left) */}
          <circle cx="-5" cy="8" r="1.8" fill="#ffedd5" opacity="0.85" />
          <circle cx="-10" cy="15" r="1.5" fill="#ffedd5" opacity="0.85" />
          <circle cx="-14" cy="22" r="1.2" fill="#ffedd5" opacity="0.8" />

          {/* Arm 5 Nodules (Top Left) */}
          <circle cx="-7" cy="-2" r="1.8" fill="#ffedd5" opacity="0.85" />
          <circle cx="-15" cy="-3" r="1.5" fill="#ffedd5" opacity="0.85" />
          <circle cx="-22" cy="-5" r="1.2" fill="#ffedd5" opacity="0.8" />
        </g>

        {/* Small Companion Starfish (x: 275, y: 474) */}
        <g transform="translate(275, 474) rotate(-22) scale(0.5)" opacity="0.85">
          <path
            d="M 0 -26 L 6 -8 L 25 -6 L 10 6 L 15 25 L 0 13 L -15 25 L -10 6 L -25 -6 L -6 -8 Z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1.2"
          />
          <circle cx="0" cy="1" r="2.5" fill="#fef3c7" />
        </g>

        {/* ================= LAYER 8: SCATTERED BUBBLES OF VARYING SIZES ================= */}
        {/* Stream 1: Rising from the Clam Shell (Mid-Left) */}
        <g>
          {/* Tiny bubble just escaped shell */}
          <circle cx="348" cy="415" r="3.5" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.8" />
          <circle cx="347" cy="414" r="1" fill="#ffffff" opacity="0.9" />

          {/* Small bubble rising */}
          <circle cx="356" cy="365" r="5" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.75" />
          <circle cx="354.5" cy="363" r="1.5" fill="#ffffff" opacity="0.85" />

          {/* Medium bubble expanding */}
          <circle cx="345" cy="295" r="8" fill="url(#bubbleShimmer)" stroke="#bae6fd" strokeWidth="0.7" opacity="0.7" />
          <circle cx="342.5" cy="292" r="2.4" fill="#ffffff" opacity="0.85" />
          <circle cx="347" cy="297" r="1" fill="#ffffff" opacity="0.5" />

          {/* Large bubble floating higher */}
          <circle cx="360" cy="205" r="12" fill="url(#bubbleShimmer)" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.65" />
          <circle cx="356" cy="201" r="3.6" fill="#ffffff" opacity="0.9" />
          <circle cx="363" cy="209" r="1.4" fill="#ffffff" opacity="0.5" />

          {/* Huge shimmering bubble near upper ocean */}
          <circle cx="340" cy="95" r="16" fill="url(#bubbleShimmer)" stroke="#ffffff" strokeWidth="0.9" opacity="0.6" />
          <circle cx="335" cy="89" r="4.8" fill="#ffffff" opacity="0.9" />
          <circle cx="345" cy="100" r="2" fill="#ffffff" opacity="0.5" />
        </g>

        {/* Stream 2: Rising from the Kelp Forest (Far Left) */}
        <g>
          <circle cx="115" cy="360" r="3" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.75" />
          <circle cx="105" cy="290" r="6" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.7" />
          <circle cx="103" cy="288" r="1.8" fill="#ffffff" opacity="0.85" />

          <circle cx="125" cy="210" r="4.5" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.7" />
          <circle cx="95" cy="140" r="9" fill="url(#bubbleShimmer)" stroke="#bae6fd" strokeWidth="0.7" opacity="0.65" />
          <circle cx="92" cy="137" r="2.7" fill="#ffffff" opacity="0.85" />

          <circle cx="110" cy="65" r="13" fill="url(#bubbleShimmer)" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.6" />
          <circle cx="106" cy="61" r="3.9" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Stream 3: Rising near Starfish & Center (Mid-Right) */}
        <g>
          <circle cx="580" cy="420" r="4" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.75" />
          <circle cx="595" cy="340" r="7" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.7" />
          <circle cx="593" cy="338" r="2" fill="#ffffff" opacity="0.85" />

          <circle cx="575" cy="250" r="5" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.7" />
          <circle cx="590" cy="170" r="10" fill="url(#bubbleShimmer)" stroke="#bae6fd" strokeWidth="0.7" opacity="0.65" />
          <circle cx="587" cy="166" r="3" fill="#ffffff" opacity="0.85" />

          <circle cx="570" cy="80" r="14" fill="url(#bubbleShimmer)" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          <circle cx="566" cy="75" r="4.2" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Stream 4: Rising from Coral on Right */}
        <g>
          <circle cx="850" cy="380" r="3.5" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.75" />
          <circle cx="835" cy="310" r="6.5" fill="url(#bubbleShimmer)" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.7" />
          <circle cx="833" cy="308" r="1.9" fill="#ffffff" opacity="0.85" />

          <circle cx="860" cy="235" r="8.5" fill="url(#bubbleShimmer)" stroke="#bae6fd" strokeWidth="0.7" opacity="0.65" />
          <circle cx="857" cy="232" r="2.5" fill="#ffffff" opacity="0.85" />

          <circle cx="840" cy="150" r="11" fill="url(#bubbleShimmer)" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.65" />
          <circle cx="836" cy="146" r="3.3" fill="#ffffff" opacity="0.9" />

          <circle cx="855" cy="60" r="7.5" fill="url(#bubbleShimmer)" stroke="#bae6fd" strokeWidth="0.7" opacity="0.6" />
          <circle cx="852" cy="57" r="2.2" fill="#ffffff" opacity="0.85" />
        </g>

        {/* Solitary Scattered Micro-Bubbles */}
        <circle cx="210" cy="180" r="2.5" fill="url(#bubbleShimmer)" opacity="0.7" />
        <circle cx="450" cy="110" r="3.5" fill="url(#bubbleShimmer)" opacity="0.7" />
        <circle cx="480" cy="260" r="2.8" fill="url(#bubbleShimmer)" opacity="0.65" />
        <circle cx="680" cy="70" r="4.2" fill="url(#bubbleShimmer)" opacity="0.6" />
        <circle cx="740" cy="220" r="3.2" fill="url(#bubbleShimmer)" opacity="0.7" />
        <circle cx="940" cy="190" r="2.5" fill="url(#bubbleShimmer)" opacity="0.65" />
        <circle cx="920" cy="105" r="3.8" fill="url(#bubbleShimmer)" opacity="0.6" />
      </svg>
    </div>
  );
};
