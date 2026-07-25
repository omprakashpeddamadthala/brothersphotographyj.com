import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { testimonials } from '@/data/site';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    const id = window.setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      window.clearInterval(id);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-mist py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <AnimatedHeading eyebrow="Kind words">From the couples we photographed</AnimatedHeading>
        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="min-w-0 shrink-0 grow-0 basis-full px-4">
                <p className="font-serif text-2xl font-light italic leading-relaxed md:text-3xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-8">
                  <p className="text-xs uppercase tracking-widest2">{t.author}</p>
                  <p className="mt-1 text-xs text-stone">{t.event}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${i === selected ? 'bg-ink' : 'bg-ink/25'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
