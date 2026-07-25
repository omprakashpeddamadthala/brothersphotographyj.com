import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { SEO } from '@/components/common/SEO';
import { MasonryGrid } from '@/components/common/MasonryGrid';
import { Lightbox } from '@/components/common/Lightbox';
import { Reveal } from '@/components/common/Reveal';
import { ParallaxSection } from '@/components/common/ParallaxSection';
import { getStory } from '@/data/stories';
import type { GalleryImage } from '@/types';

interface PublicAlbumDetail {
  id: number;
  title: string;
  slug: string;
  couple?: string;
  location?: string;
  eventDate?: string;
  excerpt?: string;
  coverImageUrl: string;
  photos?: Array<{ id: number; imageUrl: string; altText?: string; width?: number; height?: number }>;
}

export default function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [album, setAlbum] = useState<PublicAlbumDetail | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    apiFetch<PublicAlbumDetail>(`/public/gallery/${slug}`)
      .then((data) => {
        if (data) setAlbum(data);
      })
      .catch(() => {
        // Fallback to mock data if API unavailable
        const mock = getStory(slug);
        if (mock) {
          setAlbum({
            id: 0,
            title: mock.title,
            slug: mock.slug,
            couple: mock.couple,
            location: mock.location,
            eventDate: mock.date,
            excerpt: mock.excerpt,
            coverImageUrl: mock.cover.src,
            photos: mock.images.map((img, i) => ({
              id: i,
              imageUrl: img.src,
              altText: img.alt,
              width: img.width,
              height: img.height,
            })),
          });
        }
      });
  }, [slug]);

  if (!album) {
    return (
      <div className="min-h-screen pt-40 text-center font-sans text-stone">
        Loading story details…
      </div>
    );
  }

  const coverImageObj: GalleryImage = {
    id: 'cover',
    src: album.coverImageUrl,
    alt: album.title,
    width: 2000,
    height: 1250,
  };

  const galleryImages: GalleryImage[] = (album.photos || []).map((p, idx) => ({
    id: p.id ? String(p.id) : `photo-${idx}`,
    src: p.imageUrl,
    alt: p.altText || album.title,
    width: p.width || 1600,
    height: p.height || 1067,
  }));

  return (
    <>
      <SEO
        title={album.title}
        description={album.excerpt}
        path={`/stories/${album.slug}`}
        image={album.coverImageUrl}
      />
      <ParallaxSection image={coverImageObj} className="min-h-[80vh]">
        <p className="text-xs uppercase tracking-widest2">
          {album.location && `${album.location} · `}{album.eventDate || 'Portfolio'}
        </p>
        <h1 className="mt-4 font-serif text-5xl font-light md:text-7xl">{album.title}</h1>
        {album.couple && <p className="mt-4 font-serif text-xl italic">{album.couple}</p>}
      </ParallaxSection>

      {album.excerpt && (
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Reveal>
            <p className="font-serif text-2xl font-light leading-relaxed">{album.excerpt}</p>
          </Reveal>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <MasonryGrid>
            {galleryImages.map((image, i) => (
              <Reveal key={image.id} delay={(i % 3) * 0.05}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="hover-zoom block w-full cursor-zoom-in overflow-hidden rounded-sm bg-stone/10"
                  aria-label={`Open ${image.alt} in gallery view`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              </Reveal>
            ))}
          </MasonryGrid>
        </section>
      )}

      <Lightbox
        images={galleryImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <nav aria-label="Story navigation" className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-10">
          <Link to="/stories" className="group inline-flex items-center gap-3 text-sm font-medium hover:text-gold transition-colors">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Stories Portfolio</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
