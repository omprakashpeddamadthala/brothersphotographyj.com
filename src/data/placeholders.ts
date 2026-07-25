import type { GalleryImage } from '@/types';

/**
 * All imagery is served from picsum.photos as royalty-free placeholders.
 * To use your own photography, either:
 *  1. Drop files into `src/assets/images` and swap the `src` values below, or
 *  2. Point `src` at your CDN. Dimensions drive aspect ratio, so keep them accurate.
 */
export function placeholder(seed: string, width: number, height: number, alt: string): GalleryImage {
  return {
    id: seed,
    src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    alt,
    width,
    height,
  };
}
