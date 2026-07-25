import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { apiFetch } from '@/services/apiClient';
import { testimonials as fallbackTestimonials } from '@/data/site';
import { Reveal } from '@/components/common/Reveal';

interface PublicTestimonialItem {
  id: number;
  author: string;
  event?: string;
  quote: string;
  avatarUrl?: string;
}

export function Testimonials() {
  const [list, setList] = useState<PublicTestimonialItem[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    apiFetch<PublicTestimonialItem[]>('/public/testimonials')
      .then((data) => {
        if (data && data.length > 0) {
          setList(data);
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const displayList: PublicTestimonialItem[] = list.length > 0 ? list : fallbackTestimonials.map((t, idx) => ({
    id: idx,
    author: t.author,
    event: t.event,
    quote: t.quote,
    avatarUrl: undefined,
  }));

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
    <section className="py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="mb-4 text-xs uppercase tracking-widest2 text-stone">
            Kind words
          </p>
        </Reveal>

        <div className="mt-6 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {displayList.map((t, idx) => (
              <blockquote
                key={t.id || idx}
                className="min-w-0 shrink-0 grow-0 basis-full px-4"
              >
                <p className="font-serif text-2xl font-light italic leading-relaxed text-ink/85 md:text-3xl lg:text-4xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-8">
                  {t.avatarUrl && (
                    <img
                      src={t.avatarUrl}
                      alt={t.author}
                      className="mx-auto mb-3 h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <p className="text-xs uppercase tracking-widest2 font-medium">
                    {t.author}
                  </p>
                  {t.event && <p className="mt-1 text-xs text-stone">{t.event}</p>}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        {displayList.length > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {displayList.map((t, i) => (
              <button
                key={t.id || i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-[5px] w-[5px] rounded-full transition-all duration-300 ${
                  i === selected ? 'scale-125 bg-ink' : 'bg-ink/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
