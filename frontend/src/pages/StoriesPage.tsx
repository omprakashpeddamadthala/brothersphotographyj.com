import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/services/apiClient';
import { SEO } from '@/components/common/SEO';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { MasonryGrid } from '@/components/common/MasonryGrid';
import { Reveal } from '@/components/common/Reveal';
import { stories as fallbackStories } from '@/data/stories';
import { optimizedImageUrl, cloudinarySrcSet } from '@/utils/cloudinary';

interface PublicAlbumItem {
  id: number;
  title: string;
  slug: string;
  couple?: string;
  location?: string;
  eventDate?: string;
  excerpt?: string;
  coverImageUrl: string;
}

export default function StoriesPage() {
  const [albums, setAlbums] = useState<PublicAlbumItem[]>([]);

  useEffect(() => {
    apiFetch<{ content: PublicAlbumItem[] }>('/public/gallery?page=0&size=20')
      .then((res) => {
        if (res && res.content && res.content.length > 0) {
          setAlbums(res.content);
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const displayAlbums = albums.length > 0 ? albums : fallbackStories.map((s) => ({
    id: 0,
    title: s.title,
    slug: s.slug,
    couple: s.couple,
    location: s.location,
    eventDate: s.date,
    excerpt: s.excerpt,
    coverImageUrl: s.cover.src,
  }));

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
          {displayAlbums.map((story, i) => (
            <Reveal key={story.slug || i} delay={(i % 3) * 0.08}>
              <Link to={`/stories/${story.slug}`} className="group block">
                <div className="hover-zoom overflow-hidden rounded-sm bg-stone/10">
                  <img
                    src={optimizedImageUrl(story.coverImageUrl, { width: 800 })}
                    srcSet={cloudinarySrcSet(story.coverImageUrl)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={story.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="px-1 pb-6 pt-4">
                  <p className="text-xs uppercase tracking-widest2 text-stone">
                    {story.location && `${story.location} · `}{story.eventDate || 'Portfolio'}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl transition-colors group-hover:text-gold">
                    {story.title}
                  </h2>
                  {story.excerpt && <p className="mt-1 text-sm text-stone">{story.excerpt}</p>}
                </div>
              </Link>
            </Reveal>
          ))}
        </MasonryGrid>
      </section>
    </>
  );
}
