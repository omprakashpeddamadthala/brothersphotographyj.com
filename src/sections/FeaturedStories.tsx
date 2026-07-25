import { Link } from 'react-router-dom';
import { stories } from '@/data/stories';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { Reveal } from '@/components/common/Reveal';
import { LazyImage } from '@/components/common/LazyImage';

export function FeaturedStories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <AnimatedHeading eyebrow="Featured on the blog">Stories we loved telling</AnimatedHeading>
      <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story, i) => (
          <Reveal key={story.slug} delay={(i % 3) * 0.1}>
            <Link to={`/stories/${story.slug}`} className="group block">
              <div className="hover-zoom">
                <LazyImage
                  image={story.cover}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <p className="mt-5 text-xs uppercase tracking-widest2 text-stone">{story.location}</p>
              <h3 className="mt-2 font-serif text-2xl transition-colors group-hover:text-gold">
                {story.title}
              </h3>
              <p className="mt-1 text-sm text-stone">{story.couple}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
