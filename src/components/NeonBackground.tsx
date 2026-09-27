import React from 'react';
import { NeonSet } from '../data/neonThemes';

interface NeonBackgroundProps {
  neonSet: NeonSet;
}

export const NeonBackground: React.FC<NeonBackgroundProps> = ({ neonSet }) => {
  return (
    <div
      data-canvas-bg="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Ambient Horizon Neon Glows */}
      {/* Central Horizon Sun Bloom */}
      <div
        data-canvas-bg="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-96 h-64 rounded-full blur-3xl opacity-25 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${neonSet.primaryGlow} 0%, ${neonSet.secondaryGlow} 60%, transparent 80%)`,
        }}
      />
      {/* Top Left Ambient Neon Haze */}
      <div
        data-canvas-bg="true"
        className="absolute -top-12 -left-12 w-72 h-72 rounded-full blur-3xl opacity-20 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${neonSet.secondaryGlow} 0%, transparent 70%)`,
        }}
      />
      {/* Bottom Grid Ground Bloom */}
      <div
        data-canvas-bg="true"
        className="absolute -bottom-16 inset-x-0 h-44 blur-2xl opacity-15 transition-colors duration-700"
        style={{
          background: `linear-gradient(to top, ${neonSet.primaryGlow}, transparent)`,
        }}
      />

      {/* SVG Canvas for Detailed Vector Neon Art & Perspective Grid */}
      <svg
        data-canvas-bg="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Horizon Sun Gradient */}
          <linearGradient id="neonSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={neonSet.sunColors[0]} stopOpacity="0.65" />
            <stop offset="50%" stopColor={neonSet.sunColors[0]} stopOpacity="0.45" />
            <stop offset="100%" stopColor={neonSet.sunColors[1]} stopOpacity="0.25" />
          </linearGradient>

          {/* Perspective Grid Line Gradient */}
          <linearGradient id="neonGridGrad" x1="0%" y1="320" x2="0%" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={neonSet.primaryGlow} stopOpacity="0.05" />
            <stop offset="40%" stopColor={neonSet.primaryGlow} stopOpacity="0.28" />
            <stop offset="100%" stopColor={neonSet.secondaryGlow} stopOpacity="0.5" />
          </linearGradient>

          {/* Laser Equalizer Wave Gradient */}
          <linearGradient id="neonWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={neonSet.primaryGlow} stopOpacity="0.05" />
            <stop offset="35%" stopColor={neonSet.primaryGlow} stopOpacity="0.35" />
            <stop offset="65%" stopColor={neonSet.secondaryGlow} stopOpacity="0.35" />
            <stop offset="100%" stopColor={neonSet.secondaryGlow} stopOpacity="0.05" />
          </linearGradient>

          {/* Horizon Sun Blind Mask (Classic 80s horizontal slice cutouts) */}
          <mask id="neonSunMask">
            <rect width="1000" height="500" fill="white" />
            {/* Cut out horizontal lines that get progressively thicker toward bottom */}
            <rect x="380" y="275" width="240" height="3" fill="black" />
            <rect x="380" y="285" width="240" height="4.5" fill="black" />
            <rect x="380" y="297" width="240" height="6.5" fill="black" />
            <rect x="380" y="311" width="240" height="9" fill="black" />
            <rect x="380" y="328" width="240" height="12" fill="black" />
            {/* Cut off anything below the horizon line at y=330 */}
            <rect x="350" y="335" width="300" height="100" fill="black" />
          </mask>
        </defs>

        {/* ================= LAYER 1: HORIZON RETRO SUN ================= */}
        {/* Centered at (500, 275) with r=68 */}
        <g opacity="0.85">
          {/* Outer Sun Ambient Glow Ring */}
          <circle
            cx="500"
            cy="275"
            r="82"
            fill={neonSet.primaryGlow}
            opacity="0.12"
            filter="blur(6px)"
          />
          {/* Main Sliced Sun Body */}
          <circle
            cx="500"
            cy="275"
            r="68"
            fill="url(#neonSunGrad)"
            mask="url(#neonSunMask)"
          />
        </g>

        {/* ================= LAYER 2: DISTANT CYBER SKYLINE SPIRES ================= */}
        {/* Silhouetted wireframe skyline along horizon (y: 310 - 330) */}
        <g opacity="0.45">
          {/* Left Skyline Block */}
          <path
            d="M 160 330 L 160 300 L 175 300 L 175 330 L 180 330 L 180 285 L 195 285 L 195 330 L 205 330 L 205 270 L 210 255 L 215 270 L 215 330 L 225 330 L 225 295 L 245 295 L 245 330 L 260 330 L 260 310 L 275 310 L 275 330"
            stroke={neonSet.secondaryGlow}
            strokeWidth="1.2"
            fill="none"
          />
          {/* Left Spire Antenna Point */}
          <line x1="210" y1="255" x2="210" y2="242" stroke={neonSet.secondaryGlow} strokeWidth="1" />
          <circle cx="210" cy="242" r="1.5" fill={neonSet.primaryGlow} opacity="0.8" />

          {/* Right Skyline Block */}
          <path
            d="M 720 330 L 720 305 L 735 305 L 735 330 L 745 330 L 745 280 L 755 260 L 765 280 L 765 330 L 780 330 L 780 295 L 795 295 L 795 330 L 810 330 L 810 315 L 830 315 L 830 330"
            stroke={neonSet.primaryGlow}
            strokeWidth="1.2"
            fill="none"
          />
          {/* Right Spire Antenna Point */}
          <line x1="755" y1="260" x2="755" y2="246" stroke={neonSet.primaryGlow} strokeWidth="1" />
          <circle cx="755" cy="246" r="1.5" fill={neonSet.secondaryGlow} opacity="0.8" />
        </g>

        {/* Horizon Glow Line */}
        <line
          x1="0"
          y1="330"
          x2="1000"
          y2="330"
          stroke={neonSet.primaryGlow}
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="250"
          y1="330"
          x2="750"
          y2="330"
          stroke="#ffffff"
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* ================= LAYER 3: RECEDING PERSPECTIVE ARCADE GRID ================= */}
        {/* Vanishing Point at (500, 330) extending down to y=500 */}
        <g opacity="0.75">
          {/* Radiating Perspective Lines */}
          <line x1="500" y1="330" x2="-200" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="-50" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="80" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="200" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="310" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="410" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="500" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.5" />
          <line x1="500" y1="330" x2="590" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="690" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="800" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="920" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="1050" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />
          <line x1="500" y1="330" x2="1200" y2="500" stroke="url(#neonGridGrad)" strokeWidth="1.2" />

          {/* Horizontal Transverse Perspective Lines (Logarithmically spaced) */}
          <line x1="0" y1="336" x2="1000" y2="336" stroke={neonSet.primaryGlow} strokeWidth="0.8" opacity="0.18" />
          <line x1="0" y1="344" x2="1000" y2="344" stroke={neonSet.primaryGlow} strokeWidth="0.9" opacity="0.22" />
          <line x1="0" y1="355" x2="1000" y2="355" stroke={neonSet.primaryGlow} strokeWidth="1" opacity="0.26" />
          <line x1="0" y1="370" x2="1000" y2="370" stroke={neonSet.primaryGlow} strokeWidth="1.1" opacity="0.32" />
          <line x1="0" y1="390" x2="1000" y2="390" stroke={neonSet.secondaryGlow} strokeWidth="1.2" opacity="0.38" />
          <line x1="0" y1="416" x2="1000" y2="416" stroke={neonSet.secondaryGlow} strokeWidth="1.3" opacity="0.44" />
          <line x1="0" y1="450" x2="1000" y2="450" stroke={neonSet.secondaryGlow} strokeWidth="1.5" opacity="0.52" />
          <line x1="0" y1="492" x2="1000" y2="492" stroke={neonSet.secondaryGlow} strokeWidth="1.8" opacity="0.6" />
        </g>

        {/* ================= LAYER 4: FLOATING NEON GEOMETRIC VECTOR MOTIFS ================= */}
        {/* Item A: Floating Wireframe Isometric Cube (Upper Left: x: 120, y: 110) */}
        <g transform="translate(120, 105) scale(0.85)" opacity="0.55">
          {/* Ambient Glow */}
          <circle cx="0" cy="0" r="45" fill={neonSet.primaryGlow} opacity="0.1" filter="blur(4px)" />
          {/* Isometric Cube Top Face */}
          <polygon
            points="0,-32 30,-15 0,2 -30,-15"
            stroke={neonSet.primaryGlow}
            strokeWidth="1.6"
            fill={neonSet.primaryGlow}
            fillOpacity="0.08"
          />
          {/* Isometric Cube Left Face */}
          <polygon
            points="-30,-15 0,2 0,36 -30,19"
            stroke={neonSet.primaryGlow}
            strokeWidth="1.6"
            fill={neonSet.secondaryGlow}
            fillOpacity="0.06"
          />
          {/* Isometric Cube Right Face */}
          <polygon
            points="0,2 30,-15 30,19 0,36"
            stroke={neonSet.secondaryGlow}
            strokeWidth="1.6"
            fill={neonSet.primaryGlow}
            fillOpacity="0.04"
          />
          {/* Internal Wireframe Axis Lines */}
          <line x1="0" y1="2" x2="0" y2="36" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
          <circle cx="0" cy="2" r="2" fill="#ffffff" opacity="0.6" />
        </g>

        {/* Item B: Retro 80s Arcade Diamond & Laser Reticle (Upper Right: x: 860, y: 115) */}
        <g transform="translate(860, 115) scale(0.85)" opacity="0.55">
          {/* Outer Rotating Diamond */}
          <polygon
            points="0,-36 36,0 0,36 -36,0"
            stroke={neonSet.secondaryGlow}
            strokeWidth="1.6"
            fill={neonSet.secondaryGlow}
            fillOpacity="0.06"
          />
          {/* Inner Inverted Diamond */}
          <polygon
            points="0,-22 22,0 0,22 -22,0"
            stroke={neonSet.primaryGlow}
            strokeWidth="1.4"
            fill="none"
          />
          {/* Targeting Crosshairs */}
          <line x1="0" y1="-46" x2="0" y2="-38" stroke={neonSet.secondaryGlow} strokeWidth="1.5" />
          <line x1="0" y1="38" x2="0" y2="46" stroke={neonSet.secondaryGlow} strokeWidth="1.5" />
          <line x1="-46" y1="0" x2="-38" y2="0" stroke={neonSet.secondaryGlow} strokeWidth="1.5" />
          <line x1="38" y1="0" x2="46" y2="0" stroke={neonSet.secondaryGlow} strokeWidth="1.5" />
          {/* Center Luminous Node */}
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Item C: Neon Audio Spectrum / Waveform Frequency Bars (Mid Sky: x: 340 - 660, y: 185) */}
        <g opacity="0.4">
          <path
            d="M 320 190 Q 380 160 440 185 T 500 170 T 560 185 T 620 165 T 680 190"
            stroke="url(#neonWaveGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 340 192 Q 400 172 460 188 T 520 178 T 580 188 T 660 192"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />

          {/* Equalizer Vertical Pulse Ticks */}
          <line x1="410" y1="180" x2="410" y2="165" stroke={neonSet.primaryGlow} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="430" y1="185" x2="430" y2="155" stroke={neonSet.primaryGlow} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="450" y1="183" x2="450" y2="150" stroke={neonSet.primaryGlow} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="470" y1="178" x2="470" y2="140" stroke={neonSet.secondaryGlow} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="490" y1="172" x2="490" y2="135" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="510" y1="173" x2="510" y2="142" stroke={neonSet.secondaryGlow} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="530" y1="180" x2="530" y2="152" stroke={neonSet.primaryGlow} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="550" y1="184" x2="550" y2="162" stroke={neonSet.primaryGlow} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="570" y1="186" x2="570" y2="170" stroke={neonSet.primaryGlow} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ================= LAYER 5: DIGITAL SPARKLES & VECTOR STARLETS ================= */}
        {/* Neon 4-point Diamond Star 1 */}
        <g transform="translate(260, 70)" opacity="0.45">
          <polygon points="0,-7 2,0 0,7 -2,0" fill="#ffffff" />
          <polygon points="-7,0 0,2 7,0 0,-2" fill="#ffffff" />
          <circle cx="0" cy="0" r="1.5" fill={neonSet.primaryGlow} />
        </g>

        {/* Neon 4-point Diamond Star 2 */}
        <g transform="translate(740, 75)" opacity="0.45">
          <polygon points="0,-7 2,0 0,7 -2,0" fill="#ffffff" />
          <polygon points="-7,0 0,2 7,0 0,-2" fill="#ffffff" />
          <circle cx="0" cy="0" r="1.5" fill={neonSet.secondaryGlow} />
        </g>

        {/* Neon Star 3 */}
        <g transform="translate(480, 50)" opacity="0.35">
          <polygon points="0,-6 1.5,0 0,6 -1.5,0" fill="#ffffff" />
          <polygon points="-6,0 0,1.5 6,0 0,-1.5" fill="#ffffff" />
        </g>

        {/* Floating Digital Pixel Nodes */}
        <circle cx="90" cy="220" r="1.5" fill={neonSet.secondaryGlow} opacity="0.4" />
        <circle cx="210" cy="180" r="1.2" fill={neonSet.primaryGlow} opacity="0.4" />
        <circle cx="340" cy="90" r="1.4" fill={neonSet.primaryGlow} opacity="0.35" />
        <circle cx="650" cy="100" r="1.3" fill={neonSet.secondaryGlow} opacity="0.35" />
        <circle cx="800" cy="210" r="1.5" fill={neonSet.primaryGlow} opacity="0.4" />
        <circle cx="910" cy="250" r="1.2" fill={neonSet.secondaryGlow} opacity="0.4" />
      </svg>
    </div>
  );
};
