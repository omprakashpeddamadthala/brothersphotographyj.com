import { useState } from 'react';
import { cn } from '@/utils/cn';
import { optimizedImageUrl, cloudinarySrcSet } from '@/utils/cloudinary';
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
        src={optimizedImageUrl(image.src, { width: priority ? 1600 : 800 })}
        srcSet={cloudinarySrcSet(image.src)}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
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
