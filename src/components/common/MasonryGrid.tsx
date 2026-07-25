import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
}

export function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div
      className={cn(
        'columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid',
        className,
      )}
    >
      {children}
    </div>
  );
}
