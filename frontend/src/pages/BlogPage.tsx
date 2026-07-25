import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/services/apiClient';
import { SEO } from '@/components/common/SEO';
import { Reveal } from '@/components/common/Reveal';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { blogPosts as fallbackBlogPosts } from '@/data/blog';

interface PublicBlogItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  category?: string;
  publishedAt?: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<PublicBlogItem[]>([]);

  useEffect(() => {
    apiFetch<{ content: PublicBlogItem[] }>('/public/blogs?page=0&size=20')
      .then((res) => {
        if (res && res.content && res.content.length > 0) {
          setBlogs(res.content);
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const displayList = blogs.length > 0 ? blogs : fallbackBlogPosts.map((b) => ({
    id: 0,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    coverImageUrl: b.cover.src,
    category: b.category,
    publishedAt: b.date,
  }));

  return (
    <>
      <SEO
        title="Blog"
        description="Wedding stories photographed by Brothers Photography across India and around the world."
        path="/blog"
      />

      {/* Hero header */}
      <section className="px-6 pb-12 pt-32 text-center md:pt-40">
        <AnimatedHeading as="h1" eyebrow="The journal">
          Stories we loved telling
        </AnimatedHeading>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-loose text-stone">
            A selection of celebrations we have had the honour of photographing.
            Click any story to see the full journal entry.
          </p>
        </Reveal>
      </section>

      {/* Masonry Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {displayList.map((post, i) => (
            <Reveal key={post.slug || i} delay={(i % 3) * 0.08}>
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="hover-zoom overflow-hidden rounded-sm bg-stone/10">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="px-1 pb-4 pt-4">
                  <p className="text-[11px] uppercase tracking-widest2 text-stone">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Journal'}
                    {post.category && ` · ${post.category}`}
                  </p>
                  <h2 className="mt-2 font-serif text-xl leading-snug transition-colors group-hover:text-gold">
                    {post.title}
                  </h2>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
