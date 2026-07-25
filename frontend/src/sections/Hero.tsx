import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';

interface HeroSlide {
  id?: number | string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'hero-fallback-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop',
    title: 'Exquisite Wedding Photography',
    subtitle: 'Capturing Timeless Moments of Love',
  },
  {
    id: 'hero-fallback-2',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop',
    title: 'Unscripted Emotions',
    subtitle: 'Real Stories, Real Celebrations',
  },
  {
    id: 'hero-fallback-3',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2000&auto=format&fit=crop',
    title: 'Cinematic Grandeur',
    subtitle: 'Crafted for a Lifetime of Memories',
  },
  {
    id: 'hero-fallback-4',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop',
    title: 'Golden Hour Perfection',
    subtitle: 'Brothers Photography Studio',
  },
];

const SLIDE_DURATION = 6000;

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    apiFetch<HeroSlide[]>('/public/hero-slides')
      .then((data) => {
        if (data && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_SLIDES on API error or empty DB
      });
  }, []);

  const nextSlide = useCallback(() => {
    setIndex((i) => (i + 1) % (slides.length || 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = window.setInterval(nextSlide, SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, [nextSlide, slides.length]);

  const currentSlide = slides[index] || DEFAULT_SLIDES[0];

  return (
    <section
      className="relative h-svh overflow-hidden bg-ink"
      aria-label="Featured photography"
    >
      {/* Slideshow Images with Ken Burns effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title || 'Wedding photography'}
            className="ken-burns absolute inset-0 h-full w-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding={index === 0 ? 'sync' : 'async'}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink/70"
        aria-hidden
      />

      {/* Dynamic Hero Slide Text & Branding */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16">
        <motion.div
          key={`text-${currentSlide.id || index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl text-paper"
        >
          {currentSlide.subtitle && (
            <p className="mb-2 text-xs md:text-sm uppercase tracking-widest text-accent font-medium">
              {currentSlide.subtitle}
            </p>
          )}
          {currentSlide.title && (
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-paper mb-4 font-light">
              {currentSlide.title}
            </h1>
          )}
          {currentSlide.ctaText && currentSlide.ctaUrl && (
            <a
              href={currentSlide.ctaUrl}
              className="inline-flex items-center px-6 py-3 border border-paper/40 text-xs uppercase tracking-widest text-paper hover:bg-paper hover:text-ink transition-colors duration-300 rounded-sm"
            >
              {currentSlide.ctaText}
            </a>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-paper/60"
        aria-hidden
      >
        <ChevronDown size={24} strokeWidth={1.5} />
      </motion.div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-8 right-8 z-20 hidden items-center gap-2 md:flex"
          role="tablist"
          aria-label="Hero slides"
        >
          {slides.map((s, i) => (
            <button
              key={s.id || i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-[2px] transition-all duration-500 cursor-pointer ${
                i === index ? 'w-10 bg-paper' : 'w-6 bg-paper/30 hover:bg-paper/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
