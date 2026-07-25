import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { MasonryGrid } from '@/components/common/MasonryGrid';
import { LazyImage } from '@/components/common/LazyImage';
import { Reveal } from '@/components/common/Reveal';
import { stories } from '@/data/stories';

export default function StoriesPage() {
  return (
    <>
      <SEO
        title="Stories"
        description="Wedding stories photographed by Brothers Photography across India and around the world."
        path="/stories"
      />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-36">
        <AnimatedHeading as="h1" eyebrow="The portfolio">
          Every wedding is a story
        </AnimatedHeading>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-loose text-stone">
          A selection of celebrations we have had the honour of photographing. Click any story to see the
          full gallery.
        </p>
        <MasonryGrid className="mt-16">
          {stories.map((story, i) => (
            <Reveal key={story.slug} delay={(i % 3) * 0.08}>
              <Link to={`/stories/${story.slug}`} className="group block">
                <div className="hover-zoom">
                  <LazyImage
                    image={story.cover}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="px-1 pb-6 pt-4">
                  <p className="text-xs uppercase tracking-widest2 text-stone">
                    {story.location} · {story.date}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl transition-colors group-hover:text-gold">
                    {story.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone">{story.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </MasonryGrid>
      </section>
    </>
  );
}
