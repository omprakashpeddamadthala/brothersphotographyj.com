import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { GalleryImage } from '@/types';
import { cn } from '@/utils/cn';

interface ParallaxSectionProps {
  image: GalleryImage;
  children?: React.ReactNode;
  className?: string;
}

export function ParallaxSection({ image, children, className }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section
      ref={ref}
      className={cn('relative flex min-h-[60vh] items-center justify-center overflow-hidden', className)}
    >
      <motion.img
        src={image.src}
        alt={image.alt}
        style={{ y }}
        loading="lazy"
        className="absolute inset-0 h-[124%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" aria-hidden />
      <div className="relative z-10 px-6 text-center text-paper">{children}</div>
    </section>
  );
}
