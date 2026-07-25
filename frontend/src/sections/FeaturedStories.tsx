import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/services/apiClient';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { Reveal } from '@/components/common/Reveal';
import { blogPosts as fallbackBlogPosts } from '@/data/blog';

interface PublicBlogItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  category?: string;
  publishedAt?: string;
  createdAt?: string;
}

export function FeaturedStories() {
  const [blogs, setBlogs] = useState<PublicBlogItem[]>([]);

  useEffect(() => {
    apiFetch<{ content: PublicBlogItem[] }>('/public/blogs?page=0&size=6')
      .then((res) => {
        if (res && res.content && res.content.length > 0) {
          setBlogs(res.content);
        }
      })
      .catch(() => {
        // Fallback to local items if empty
      });
  }, []);

  const displayList: PublicBlogItem[] = blogs.length > 0 ? blogs : fallbackBlogPosts.map((b) => ({
    id: 0,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    coverImageUrl: b.cover.src,
    category: b.category,
    publishedAt: b.date,
  }));

  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <AnimatedHeading eyebrow="Featured on the blog">
        Stories we loved telling
      </AnimatedHeading>

      <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {displayList.slice(0, 6).map((post, i) => (
          <Reveal key={post.slug || i} delay={(i % 3) * 0.1}>
            <Link to={`/blog/${post.slug}`} className="group block">
              <div className="hover-zoom aspect-[4/5] overflow-hidden rounded-sm bg-stone/10">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-widest2 text-stone">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Story'}
                  {post.category && ` · ${post.category}`}
                </p>
                <h3 className="mt-2 font-serif text-xl leading-snug transition-colors group-hover:text-gold md:text-2xl">
                  {post.title}
                </h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 text-center">
        <Link
          to="/blog"
          className="inline-block border border-ink px-8 py-4 text-xs uppercase tracking-widest2 transition-colors hover:bg-ink hover:text-paper"
        >
          View all stories
        </Link>
      </Reveal>
    </section>
  );
}
