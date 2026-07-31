/**
 * Rewrites a Cloudinary delivery URL to request an optimized, resized variant.
 *
 * Inserting transformation flags after `/upload/` lets Cloudinary serve
 * automatically-compressed (`q_auto`), modern-format (`f_auto`, e.g. AVIF/WebP)
 * and correctly-sized images instead of the full-resolution original. This is
 * the single biggest lever for image load performance.
 *
 * Non-Cloudinary URLs (base64 data URLs, picsum placeholders, static assets)
 * are returned unchanged.
 */
export interface CloudinaryOptions {
  width?: number;
  height?: number;
  /** crop mode; `fill` keeps aspect via cropping, `limit` never upscales */
  crop?: 'fill' | 'limit' | 'fit';
  quality?: string; // e.g. 'auto', 'auto:good', '80'
}

export function optimizedImageUrl(url: string | undefined | null, opts: CloudinaryOptions = {}): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const { width, height, crop = 'limit', quality = 'auto' } = opts;
  const transforms = ['f_auto', `q_${quality}`, 'dpr_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  // Avoid double-applying if a transformation segment is already present.
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}

/** Builds a responsive srcSet across common widths for a Cloudinary URL. */
export function cloudinarySrcSet(url: string | undefined | null, widths: number[] = [400, 800, 1200, 1600]): string | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return undefined;
  }
  return widths.map((w) => `${optimizedImageUrl(url, { width: w })} ${w}w`).join(', ');
}
