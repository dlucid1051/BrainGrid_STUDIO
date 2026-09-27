import React from 'react';

export const SpaceBackground: React.FC = () => {
  return (
    <div
      data-canvas-bg="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Ambient Cosmic Nebula Dust (Washed-out radial blooms) */}
      <div
        data-canvas-bg="true"
        className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl"
      />
      <div
        data-canvas-bg="true"
        className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-gradient-to-bl from-cyan-600/12 via-blue-600/10 to-transparent blur-3xl"
      />
      <div
        data-canvas-bg="true"
        className="absolute -bottom-20 left-1/3 w-88 h-88 rounded-full bg-gradient-to-tr from-fuchsia-600/12 via-violet-600/10 to-transparent blur-3xl"
      />

      {/* 2. Micro Star Dust Grid & Distant Stars */}
      <div
        data-canvas-bg="true"
        className="absolute inset-0 opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:28px_28px]"
      />

      {/* SVG Canvas for Detailed Vector Space Illustrations */}
      <svg
        data-canvas-bg="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#818cf8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="galaxyCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="30%" stopColor="#e9d5ff" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#a855f7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="cometTail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="15%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="planetBody" x1="20%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#fb923c" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="ringGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0" />
            <stop offset="25%" stopColor="#fde047" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#fdba74" stopOpacity="0.28" />
            <stop offset="75%" stopColor="#c084fc" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="moonShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
          </linearGradient>

          {/* Crescent Moon Clip Path */}
          <mask id="moonCrescentMask">
            <rect width="200" height="200" fill="white" />
            {/* Cut out the dark side of the moon to form a crisp crescent */}
            <circle cx="82" cy="52" r="38" fill="black" />
          </mask>
        </defs>

        {/* ================= ELEMENT 1: ASTEROID POCKED CRESCENT MOON ================= */}
        {/* Placed top-left (x: 95, y: 65) */}
        <g transform="translate(60, 30) scale(0.9)" opacity="0.85">
          {/* Subtle Lunar Ambient Glow */}
          <circle cx="65" cy="65" r="50" fill="#e2e8f0" opacity="0.04" filter="blur(6px)" />

          {/* Moon Body with Craters through Mask */}
          <g mask="url(#moonCrescentMask)">
            {/* Main Moon Disc */}
            <circle cx="65" cy="65" r="42" fill="url(#moonShade)" />

            {/* Asteroid Impact Craters on the Crescent Surface */}
            {/* Crater 1 (Large) */}
            <ellipse cx="44" cy="48" rx="5.5" ry="7" fill="#475569" opacity="0.32" />
            <ellipse cx="43" cy="47" rx="4.5" ry="6" fill="#1e293b" opacity="0.3" />
            <ellipse cx="45" cy="49" rx="3.5" ry="4.5" fill="#cbd5e1" opacity="0.15" />

            {/* Crater 2 (Medium) */}
            <ellipse cx="40" cy="70" rx="4" ry="5.5" fill="#475569" opacity="0.3" />
            <ellipse cx="39" cy="69" rx="3" ry="4.5" fill="#1e293b" opacity="0.28" />

            {/* Crater 3 (Small) */}
            <circle cx="52" cy="35" r="3" fill="#334155" opacity="0.3" />
            <circle cx="53" cy="36" r="2" fill="#cbd5e1" opacity="0.18" />

            {/* Crater 4 (Lower crescent) */}
            <ellipse cx="48" cy="85" rx="3.5" ry="4.5" fill="#334155" opacity="0.32" />

            {/* Crater 5 (Micro impact) */}
            <circle cx="36" cy="58" r="2" fill="#1e293b" opacity="0.35" />
            <circle cx="58" cy="28" r="1.8" fill="#1e293b" opacity="0.25" />
            <circle cx="55" cy="94" r="2" fill="#1e293b" opacity="0.25" />

            {/* Lunar Ridge Lines along the Terminator */}
            <path
              d="M 58 24 Q 48 45 42 65 T 56 104"
              stroke="#94a3b8"
              strokeWidth="0.8"
              fill="none"
              opacity="0.35"
            />
          </g>

          {/* Crescent Edge Highlight */}
          <path
            d="M 65 23 A 42 42 0 0 0 65 107 A 48 48 0 0 1 65 23 Z"
            fill="#ffffff"
            opacity="0.15"
          />
        </g>

        {/* ================= ELEMENT 2: PINWHEEL GALAXY ================= */}
        {/* Placed upper-right (x: 760, y: 110) */}
        <g transform="translate(760, 110) rotate(-22)" opacity="0.8">
          {/* Diffuse Galaxy Haze */}
          <ellipse cx="0" cy="0" rx="130" ry="75" fill="url(#nebulaGlow)" />

          {/* Outer Whispering Spiral Dust Arms */}
          <path
            d="M 0 0 Q 55 -35 105 -25 T 145 25 Q 120 70 65 75 T -45 55"
            stroke="#a855f7"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity="0.12"
            filter="blur(3px)"
          />
          <path
            d="M 0 0 Q -55 35 -105 25 T -145 -25 Q -120 -70 -65 -75 T 45 -55"
            stroke="#38bdf8"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity="0.12"
            filter="blur(3px)"
          />

          {/* Main Spiral Arm 1 */}
          <path
            d="M 0 0 C 35 -20, 75 -25, 110 5 C 135 25, 130 65, 85 85 C 45 100, -20 85, -60 55"
            stroke="#c084fc"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.22"
          />
          {/* Secondary Arm 1 Inner Arc */}
          <path
            d="M 0 0 C 25 -10, 55 -15, 80 5 C 95 20, 90 45, 60 55"
            stroke="#f472b6"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
          />

          {/* Main Spiral Arm 2 (Opposite) */}
          <path
            d="M 0 0 C -35 20, -75 25, -110 -5 C -135 -25, -130 -65, -85 -85 C -45 -100, 20 -85, 60 -55"
            stroke="#60a5fa"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.22"
          />
          {/* Secondary Arm 2 Inner Arc */}
          <path
            d="M 0 0 C -25 10, -55 15, -80 -5 C -95 -20, -90 -45, -60 -55"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
          />

          {/* Star Clusters on Galaxy Arms */}
          <circle cx="75" cy="5" r="1.5" fill="#ffffff" opacity="0.45" />
          <circle cx="115" cy="20" r="1.2" fill="#ffffff" opacity="0.4" />
          <circle cx="-75" cy="-5" r="1.5" fill="#ffffff" opacity="0.45" />
          <circle cx="-115" cy="-20" r="1.2" fill="#ffffff" opacity="0.4" />
          <circle cx="45" cy="65" r="1" fill="#e0e7ff" opacity="0.35" />
          <circle cx="-45" cy="-65" r="1" fill="#e0e7ff" opacity="0.35" />

          {/* Luminous Elliptical Galaxy Core */}
          <ellipse cx="0" cy="0" rx="36" ry="20" fill="url(#galaxyCore)" />
          <ellipse cx="0" cy="0" rx="14" ry="8" fill="#ffffff" opacity="0.4" filter="blur(1px)" />
        </g>

        {/* ================= ELEMENT 3: SWEEPING COMET ================= */}
        {/* Streaking from upper center toward mid-right (x1: 340, y1: 40 -> x2: 490, y2: 150) */}
        <g opacity="0.82">
          {/* Outer Broad Ion Tail Faint Haze */}
          <polygon
            points="480,150 310,20 330,10 495,140"
            fill="url(#cometTail)"
            opacity="0.45"
            filter="blur(4px)"
          />

          {/* Core Streamlined Dust Tail */}
          <path
            d="M 490 148 Q 410 95 320 35"
            stroke="url(#cometTail)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 488 147 Q 430 105 350 50"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />

          {/* Comet Nucleus Coma & Core */}
          <circle cx="490" cy="148" r="10" fill="#38bdf8" opacity="0.25" filter="blur(2px)" />
          <circle cx="490" cy="148" r="4" fill="#e0f2fe" opacity="0.6" />
          <circle cx="490" cy="148" r="1.8" fill="#ffffff" opacity="0.8" />
        </g>

        {/* ================= ELEMENT 4: RINGED PLANET ================= */}
        {/* Placed bottom-left / lower-mid-left (x: 210, y: 380) */}
        <g transform="translate(195, 375) rotate(-18)" opacity="0.85">
          {/* Back half of the planetary ring (behind planet body) */}
          <path
            d="M -110 0 A 110 32 0 0 1 110 0"
            stroke="url(#ringGrad)"
            strokeWidth="14"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M -90 0 A 90 25 0 0 1 90 0"
            stroke="#fde047"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M -120 0 A 120 35 0 0 1 120 0"
            stroke="#c084fc"
            strokeWidth="1.5"
            fill="none"
            opacity="0.25"
          />

          {/* Planet Body Sphere */}
          <circle cx="0" cy="0" r="48" fill="url(#planetBody)" />

          {/* Atmospheric Cloud Bands on Planet */}
          <g opacity="0.35">
            {/* Band 1 */}
            <path
              d="M -47 -10 Q 0 -5 47 -10 A 48 48 0 0 1 45 5 Q 0 10 -45 5 Z"
              fill="#fbbf24"
              opacity="0.35"
            />
            {/* Band 2 */}
            <path
              d="M -44 12 Q 0 17 44 12 A 48 48 0 0 1 38 26 Q 0 30 -38 26 Z"
              fill="#c084fc"
              opacity="0.3"
            />
            {/* Band 3 */}
            <path
              d="M -41 -24 Q 0 -20 41 -24 A 48 48 0 0 1 46 -13 Q 0 -9 -46 -13 Z"
              fill="#f472b6"
              opacity="0.25"
            />
          </g>

          {/* Planet Body Shadow Side (Simulating distant star light from top-right) */}
          <path
            d="M 0 -48 A 48 48 0 0 1 0 48 A 48 48 0 0 1 0 -48"
            fill="#090d16"
            opacity="0.4"
          />

          {/* Front half of the planetary ring (passes in front of planet body) */}
          <path
            d="M 110 0 A 110 32 0 0 1 -110 0"
            stroke="url(#ringGrad)"
            strokeWidth="14"
            fill="none"
            opacity="0.7"
          />
          {/* Ring Division (Cassini-style gap) */}
          <path
            d="M 100 0 A 100 29 0 0 1 -100 0"
            stroke="#090d16"
            strokeWidth="1.8"
            fill="none"
            opacity="0.45"
          />
          <path
            d="M 90 0 A 90 25 0 0 1 -90 0"
            stroke="#fde047"
            strokeWidth="2.2"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 120 0 A 120 35 0 0 1 -120 0"
            stroke="#c084fc"
            strokeWidth="1.8"
            fill="none"
            opacity="0.3"
          />

          {/* Ring Shadow cast across planet surface */}
          <path
            d="M -46 3 Q 0 8 46 3"
            stroke="#090d16"
            strokeWidth="5"
            fill="none"
            opacity="0.4"
          />
        </g>

        {/* ================= ELEMENT 5: SCATTERED 4-POINT CROSS STARS & ORBS ================= */}
        {/* Star 1 - Bright Cross Star (Near Moon) */}
        <g transform="translate(190, 85)" opacity="0.4">
          <path d="M 0 -10 L 0 10 M -10 0 L 10 0" stroke="#ffffff" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
        </g>

        {/* Star 2 - Blue Shimmer Star (Mid Sky) */}
        <g transform="translate(620, 80)" opacity="0.35">
          <path d="M 0 -8 L 0 8 M -8 0 L 8 0" stroke="#93c5fd" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.8" fill="#e0f2fe" />
        </g>

        {/* Star 3 - Gold Twinkle Star (Lower Right) */}
        <g transform="translate(860, 420)" opacity="0.35">
          <path d="M 0 -9 L 0 9 M -9 0 L 9 0" stroke="#fde68a" strokeWidth="1" />
          <circle cx="0" cy="0" r="2" fill="#fef3c7" />
        </g>

        {/* Star 4 - Violet Shimmer (Near Ringed Planet) */}
        <g transform="translate(370, 430)" opacity="0.3">
          <path d="M 0 -7 L 0 7 M -7 0 L 7 0" stroke="#c084fc" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.5" fill="#f5d0fe" />
        </g>

        {/* Distant Sparkling Starlet Points */}
        <circle cx="50" cy="220" r="1.5" fill="#ffffff" opacity="0.3" />
        <circle cx="110" cy="460" r="1.2" fill="#93c5fd" opacity="0.35" />
        <circle cx="280" cy="200" r="1.4" fill="#ffffff" opacity="0.25" />
        <circle cx="430" cy="290" r="1.5" fill="#fde68a" opacity="0.3" />
        <circle cx="540" cy="410" r="1.2" fill="#ffffff" opacity="0.25" />
        <circle cx="670" cy="230" r="1.6" fill="#a7f3d0" opacity="0.3" />
        <circle cx="700" cy="380" r="1.4" fill="#ffffff" opacity="0.3" />
        <circle cx="820" cy="270" r="1.5" fill="#c084fc" opacity="0.3" />
        <circle cx="940" cy="190" r="1.2" fill="#93c5fd" opacity="0.3" />
        <circle cx="920" cy="60" r="1.5" fill="#ffffff" opacity="0.35" />
      </svg>
    </div>
  );
};
