/**
 * Lightweight and robust SVG sanitizer for custom user-created vector graphics.
 * Strips out scripts, external executable references, and inline event handlers.
 */
export function sanitizeSvgMarkup(rawSvg: string): string {
  if (!rawSvg || typeof rawSvg !== 'string') return '';

  let cleaned = rawSvg.trim();

  // Strip script tags completely
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Strip foreignObject tags
  cleaned = cleaned.replace(/<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi, '');

  // Strip iframe, embed, object tags
  cleaned = cleaned.replace(/<(iframe|embed|object|meta|link)\b[^>]*>/gi, '');

  // Strip inline on* event listeners (e.g. onload, onerror, onclick)
  cleaned = cleaned.replace(/\s+on[a-z]+\s*=\s*(['\"]).*?\1/gi, '');
  cleaned = cleaned.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '');

  // Strip javascript: URLs inside href or xlink:href
  cleaned = cleaned.replace(/href\s*=\s*(['\"])javascript:.*?\1/gi, 'href=""');
  cleaned = cleaned.replace(/xlink:href\s*=\s*(['\"])javascript:.*?\1/gi, 'xlink:href=""');

  // Strip data: text/html URLs
  cleaned = cleaned.replace(/href\s*=\s*(['\"])data:text\/html.*?\1/gi, 'href=""');

  return cleaned;
}
