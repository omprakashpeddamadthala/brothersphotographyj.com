import { useEffect, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

export function useScrollDirection(threshold = 8): { direction: ScrollDirection; atTop: boolean } {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setAtTop(y < 24);
        if (Math.abs(y - lastY) > threshold) {
          setDirection(y > lastY ? 'down' : 'up');
          lastY = y;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { direction, atTop };
}
