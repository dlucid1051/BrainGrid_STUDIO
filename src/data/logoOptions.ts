import synapseImg from '../assets/images/braingrid_synapse_1789826240051.jpg';
import isometricImg from '../assets/images/braingrid_isometric_1789826252302.jpg';
import circuitImg from '../assets/images/braingrid_circuit_1789826264771.jpg';
import prismImg from '../assets/images/braingrid_prism_1789826276467.jpg';

export interface LogoOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageSrc?: string;
  emoji?: string;
}

export const LOGO_OPTIONS: LogoOption[] = [
  {
    id: 'synapse',
    name: 'Synapse Matrix',
    subtitle: 'Neural Network Grid',
    description: 'Stylized brain interconnected with geometric glowing grid nodes and electric cyan & violet accents.',
    imageSrc: synapseImg,
  },
  {
    id: 'isometric',
    name: 'Holo Cube',
    subtitle: 'Isometric 3D Crystal',
    description: 'Glossy translucent cubic node housing an illuminated neural grid with magenta & cyan neon glow.',
    imageSrc: isometricImg,
  },
  {
    id: 'circuit',
    name: 'Circuit Traces',
    subtitle: 'Geometric Tech Emblem',
    description: 'Refined tech emblem of brain circuitry traces with amber gold and violet grid intersections.',
    imageSrc: circuitImg,
  },
  {
    id: 'prism',
    name: 'Prismatic Crystal',
    subtitle: 'Low-Poly Grid Facets',
    description: 'Vibrant faceted low-poly crystalline brain radiating neon mint, violet, and electric blue reflections.',
    imageSrc: prismImg,
  },
  {
    id: 'classic-emoji',
    name: 'Classic Spark',
    subtitle: 'Minimalist Bolt & Gradient',
    description: 'Original lightweight electric lightning bolt framed in multi-hue indigo, purple & pink ring.',
    emoji: '⚡',
  },
];

export const DEFAULT_LOGO_ID = 'synapse';
