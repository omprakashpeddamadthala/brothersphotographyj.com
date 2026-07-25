import { motion } from 'framer-motion';
import type { JSX } from 'react';
import { cn } from '@/utils/cn';

interface AnimatedHeadingProps {
  as?: keyof Pick<JSX.IntrinsicElements, 'h1' | 'h2' | 'h3'>;
  children: string;
  className?: string;
  eyebrow?: string;
}

export function AnimatedHeading({ as = 'h2', children, className, eyebrow }: AnimatedHeadingProps) {
  const Tag = motion[as];
  return (
    <div className="text-center">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-xs uppercase tracking-widest2 text-stone"
        >
          {eyebrow}
        </motion.p>
      )}
      <Tag
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className={cn('font-serif text-4xl font-light leading-tight md:text-5xl', className)}
      >
        {children}
      </Tag>
    </div>
  );
}
