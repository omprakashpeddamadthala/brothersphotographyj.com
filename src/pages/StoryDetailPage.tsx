import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { MasonryGrid } from '@/components/common/MasonryGrid';
import { LazyImage } from '@/components/common/LazyImage';
import { Lightbox } from '@/components/common/Lightbox';
import { Reveal } from '@/components/common/Reveal';
import { ParallaxSection } from '@/components/common/ParallaxSection';
import { getStory, stories } from '@/data/stories';

export default function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const story = slug ? getStory(slug) : undefined;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!story) return <Navigate to="/stories" replace />;

  const index = stories.findIndex((s) => s.slug === story.slug);
  const prevStory = stories[(index - 1 + stories.length) % stories.length];
  const nextStory = stories[(index + 1) % stories.length];

  return (
    <>
      <SEO
        title={story.title}
        description={story.excerpt}
        path={`/stories/${story.slug}`}
        image={story.cover.src}
      />
      <ParallaxSection image={story.cover} className="min-h-[80vh]">
        <p className="text-xs uppercase tracking-widest2">
          {story.location} · {story.date}
        </p>
        <h1 className="mt-4 font-serif text-5xl font-light md:text-7xl">{story.title}</h1>
        <p className="mt-4 font-serif text-xl italic">{story.couple}</p>
      </ParallaxSection>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <p className="font-serif text-2xl font-light leading-relaxed">{story.excerpt}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <MasonryGrid>
          {story.images.map((image, i) => (
            <Reveal key={image.id} delay={(i % 3) * 0.05}>
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="hover-zoom block w-full cursor-zoom-in"
                aria-label={`Open ${image.alt} in gallery view`}
              >
                <LazyImage
                  image={image}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </button>
            </Reveal>
          ))}
        </MasonryGrid>
      </section>

      <Lightbox
        images={story.images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <nav aria-label="Story navigation" className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-10">
          <Link
            to={`/stories/${prevStory.slug}`}
            className="group inline-flex items-center gap-3 text-sm"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
              aria-hidden
            />
            <span>
              <span className="block text-xs uppercase tracking-widest2 text-stone">Previous</span>
              {prevStory.couple}
            </span>
          </Link>
          <Link
            to={`/stories/${nextStory.slug}`}
            className="group inline-flex items-center gap-3 text-right text-sm"
          >
            <span>
              <span className="block text-xs uppercase tracking-widest2 text-stone">Next</span>
              {nextStory.couple}
            </span>
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </nav>
    </>
  );
}
