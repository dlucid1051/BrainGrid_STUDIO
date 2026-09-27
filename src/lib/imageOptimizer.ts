/**
 * Image optimization utility for BrainGrid ThemePack STUDIO.
 * Downscales and compresses large wallpaper/backdrop images and sticker images
 * to keep memory and storage footprint under control, preventing browser
 * localStorage QuotaExceededError while maintaining crisp HD visual quality.
 */

export async function optimizeImageDataUrl(
  dataUrl: string,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.82,
  mimeType: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg'
): Promise<string> {
  // If it's not a data URL or it's an SVG data URL, return as-is
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.startsWith('data:image/svg+xml')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    let resolved = false;
    const safeResolve = (val: string) => {
      if (!resolved) {
        resolved = true;
        resolve(val);
      }
    };

    // Timeout safety fallback: never hang longer than 3 seconds
    const timer = setTimeout(() => {
      safeResolve(dataUrl);
    }, 3000);

    try {
      const img = new Image();

      if (!dataUrl.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        clearTimeout(timer);
        try {
          let { width, height } = img;
          if (width === 0 || height === 0) {
            safeResolve(dataUrl);
            return;
          }

          // Calculate aspect ratio preserving downscale
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            safeResolve(dataUrl);
            return;
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image onto canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Determine output mime
          const effectiveMime =
            mimeType === 'image/png' ? 'image/png' : 'image/jpeg';

          const optimizedDataUrl = canvas.toDataURL(effectiveMime, quality);

          // If optimized is smaller, use it; otherwise keep original
          if (optimizedDataUrl && optimizedDataUrl.length < dataUrl.length) {
            safeResolve(optimizedDataUrl);
          } else {
            safeResolve(dataUrl);
          }
        } catch (err) {
          console.warn('Canvas optimization error:', err);
          safeResolve(dataUrl);
        }
      };

      img.onerror = (err) => {
        clearTimeout(timer);
        console.warn('Image load error during optimization:', err);
        safeResolve(dataUrl);
      };

      img.src = dataUrl;
    } catch {
      clearTimeout(timer);
      safeResolve(dataUrl);
    }
  });
}
