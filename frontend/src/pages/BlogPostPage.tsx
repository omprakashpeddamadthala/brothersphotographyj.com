import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { SEO } from '@/components/common/SEO';
import { MasonryGrid } from '@/components/common/MasonryGrid';
import { Lightbox } from '@/components/common/Lightbox';
import { Reveal } from '@/components/common/Reveal';
import { ParallaxSection } from '@/components/common/ParallaxSection';
import { getPost } from '@/data/blog';
import type { GalleryImage } from '@/types';

interface PublicBlogDetail {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImageUrl: string;
  category?: string;
  publishedAt?: string;
  images?: Array<{ id: number; imageUrl: string; caption?: string; width?: number; height?: number }>;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PublicBlogDetail | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    apiFetch<PublicBlogDetail>(`/public/blogs/${slug}`)
      .then((data) => {
        if (data) setPost(data);
      })
      .catch(() => {
        const mock = getPost(slug);
        if (mock) {
          setPost({
            id: 0,
            title: mock.title,
            slug: mock.slug,
            excerpt: mock.excerpt,
            content: mock.excerpt,
            coverImageUrl: mock.cover.src,
            category: mock.category,
            publishedAt: mock.date,
            images: mock.images.map((img, idx) => ({
              id: idx,
              imageUrl: img.src,
              caption: img.alt,
              width: img.width,
              height: img.height,
            })),
          });
        }
      });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen pt-40 text-center font-sans text-stone">
        Loading journal entry…
      </div>
    );
  }

  const coverImageObj: GalleryImage = {
    id: 'cover',
    src: post.coverImageUrl,
    alt: post.title,
    width: 2000,
    height: 1250,
  };

  const galleryImages: GalleryImage[] = (post.images || []).map((p, idx) => ({
    id: p.id ? String(p.id) : `photo-${idx}`,
    src: p.imageUrl,
    alt: p.caption || post.title,
    width: p.width || 1600,
    height: p.height || 1067,
  }));

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.coverImageUrl}
      />

      {/* Fullscreen hero */}
      <ParallaxSection image={coverImageObj} className="min-h-[80vh]">
        <p className="text-xs uppercase tracking-widest2 text-paper/60">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Journal'}
          {post.category && ` · ${post.category}`}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-tight md:text-6xl">
          {post.title}
        </h1>
      </ParallaxSection>

      {/* Excerpt */}
      {post.excerpt && (
        <section className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
          <Reveal>
            <p className="font-serif text-xl font-light leading-relaxed text-ink/80 md:text-2xl">
              {post.excerpt}
            </p>
          </Reveal>
        </section>
      )}

      {/* Content */}
      {post.content && (
        <section className="mx-auto max-w-3xl px-6 pb-12 font-sans text-stone leading-relaxed space-y-4">
          <Reveal>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </Reveal>
        </section>
      )}

      {/* Photo Gallery */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <MasonryGrid>
            {galleryImages.map((image, i) => (
              <Reveal key={image.id} delay={(i % 3) * 0.04}>
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

      {/* Post navigation */}
      <nav aria-label="Post navigation" className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-10">
          <Link to="/blog" className="group inline-flex items-center gap-3 text-sm font-medium hover:text-gold transition-colors">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Journal Articles</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
