import { useState } from 'react';
import { cn } from '@/utils/cn';
import type { GalleryImage } from '@/types';

interface LazyImageProps {
  image: GalleryImage;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function LazyImage({ image, className, imgClassName, sizes, priority = false }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn('relative overflow-hidden bg-mist', className)}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-700',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}
