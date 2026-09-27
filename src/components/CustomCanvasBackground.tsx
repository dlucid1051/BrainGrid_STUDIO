import React from 'react';
import { CustomBackgroundConfig } from '../types';
import { sanitizeSvgMarkup } from '../lib/sanitizeSvg';

interface CustomCanvasBackgroundProps {
  config?: CustomBackgroundConfig;
}

export const CustomCanvasBackground: React.FC<CustomCanvasBackgroundProps> = ({ config }) => {
  if (!config) return null;

  const effectiveImageUrl = config.imageUrl || config.backgroundImageUrl || (config as any).image || (config as any).url;
  const effectiveSvgMarkup = config.svgMarkup || (config as any).svg;

  if (effectiveImageUrl) {
    const opacity = (config.opacity ?? 100) / 100;
    const dimming = (config.dimming ?? 0) / 100;
    const blurPx = config.blur ?? 0;
    const fitMode = config.fitMode || 'cover';
    const safeUrl = effectiveImageUrl.replace(/"/g, '\\"');

    return (
      <div data-canvas-bg="true" className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Background Image Layer */}
        <div
          data-canvas-bg="true"
          className="absolute inset-0 transition-all duration-300"
          style={{
            backgroundImage: `url("${safeUrl}")`,
            backgroundSize: fitMode === 'center' ? 'auto' : fitMode,
            backgroundPosition: 'center',
            backgroundRepeat: fitMode === 'contain' ? 'no-repeat' : 'repeat',
            opacity,
            filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
          }}
        />

        {/* Optional Color Tint Overlay */}
        {config.overlayColor && (
          <div
            data-canvas-bg="true"
            className="absolute inset-0 mix-blend-color transition-opacity duration-300"
            style={{
              backgroundColor: config.overlayColor,
              opacity: 0.35,
            }}
          />
        )}

        {/* Darkness / Dimming Overlay for sticker legibility */}
        {dimming > 0 && (
          <div
            data-canvas-bg="true"
            className="absolute inset-0 bg-black transition-opacity duration-300 pointer-events-none"
            style={{ opacity: dimming }}
          />
        )}

        {/* Grid Overlay Texture if enabled */}
        {config.gridOverlay === 'dots' && (
          <div
            data-canvas-bg="true"
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />
        )}
        {config.gridOverlay === 'lines' && (
          <div
            data-canvas-bg="true"
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        )}
        {config.gridOverlay === 'isometric' && (
          <div
            data-canvas-bg="true"
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(30deg, currentColor 12%, transparent 12.5%, transparent 87%, currentColor 87.5%, currentColor), linear-gradient(150deg, currentColor 12%, transparent 12.5%, transparent 87%, currentColor 87.5%, currentColor)',
              backgroundSize: '40px 70px',
            }}
          />
        )}
      </div>
    );
  }

  if (effectiveSvgMarkup) {
    const cleanMarkup = sanitizeSvgMarkup(effectiveSvgMarkup);
    return (
      <div
        data-canvas-bg="true"
        className="absolute inset-0 pointer-events-none overflow-hidden select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:absolute [&>svg]:inset-0"
        dangerouslySetInnerHTML={{ __html: cleanMarkup }}
      />
    );
  }

  return null;
};
