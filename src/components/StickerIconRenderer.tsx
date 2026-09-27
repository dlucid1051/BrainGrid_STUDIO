import React from 'react';
import { sanitizeSvgMarkup } from '../lib/sanitizeSvg';

interface StickerIconRendererProps {
  icon: string;
  className?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const StickerIconRenderer: React.FC<StickerIconRendererProps> = ({
  icon,
  className = '',
  alt = 'Sticker',
  size = 'md',
}) => {
  if (!icon) return <span>✨</span>;

  const sizeClasses = {
    sm: 'w-5 h-5 text-base',
    md: 'w-7 h-7 text-2xl',
    lg: 'w-10 h-10 text-3xl',
    xl: 'w-14 h-14 text-4xl sm:text-5xl',
    '2xl': 'w-20 h-20 text-6xl',
  }[size];

  const trimmed = icon.trim();

  // Image Data URL or remote image URL
  if (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:')
  ) {
    return (
      <img
        src={trimmed}
        alt={alt}
        className={`${sizeClasses} ${className} object-contain pointer-events-none select-none drop-shadow-2xs`}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Raw SVG markup
  if (trimmed.startsWith('<svg')) {
    const cleanSvg = sanitizeSvgMarkup(trimmed);
    return (
      <span
        className={`${sizeClasses} ${className} inline-flex items-center justify-center pointer-events-none select-none [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: cleanSvg }}
      />
    );
  }

  // Emoji or textual symbol
  return (
    <span className={`inline-flex items-center justify-center pointer-events-none select-none ${sizeClasses} ${className}`}>
      {trimmed}
    </span>
  );
};
