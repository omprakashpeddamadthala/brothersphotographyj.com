import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { placeholder } from '@/data/placeholders';
import { siteConfig } from '@/data/site';

const slides = [
  placeholder('hero-1', 2000, 1250, 'Couple dancing at a wedding reception'),
  placeholder('hero-2', 2000, 1250, 'Bride laughing during the ceremony'),
  placeholder('hero-3', 2000, 1250, 'Wedding celebration under string lights'),
  placeholder('hero-4', 2000, 1250, 'Portrait of a couple at golden hour'),
];

const SLIDE_MS = 5000;

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative h-svh overflow-hidden" aria-label="Featured photography">
      <AnimatePresence>
        <motion.img
          key={slides[index].id}
          src={slides[index].src}
          alt={slides[index].alt}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4 }, scale: { duration: 6, ease: 'linear' } }}
          className="absolute inset-0 h-full w-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-ink/35" aria-hidden />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-paper">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="mb-6 text-xs uppercase tracking-widest2"
        >
          Wedding Photography &amp; Films
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-serif text-5xl font-light leading-tight md:text-7xl"
        >
          {siteConfig.tagline}
        </motion.h1>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-paper"
        aria-hidden
      >
        <ChevronDown size={28} />
      </motion.div>

      <div
        className="absolute bottom-8 right-8 z-10 hidden gap-2 md:flex"
        role="tablist"
        aria-label="Hero slides"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-[2px] w-8 transition-colors ${i === index ? 'bg-paper' : 'bg-paper/40'}`}
          />
        ))}
      </div>
    </section>
  );
}
