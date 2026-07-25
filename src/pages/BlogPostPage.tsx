import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { LazyImage } from '@/components/common/LazyImage';
import { Reveal } from '@/components/common/Reveal';
import { getPost } from '@/data/blog';
import { formatDate } from '@/utils/formatDate';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.cover.src}
      />
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <Reveal>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-stone hover:text-gold"
          >
            <ArrowLeft size={14} aria-hidden /> Back to the journal
          </Link>
          <p className="mt-10 text-xs uppercase tracking-widest2 text-stone">{formatDate(post.date)}</p>
          <h1 className="mt-4 font-serif text-4xl font-light leading-tight md:text-5xl">{post.title}</h1>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <LazyImage image={post.cover} sizes="(min-width: 768px) 720px, 100vw" priority />
        </Reveal>
        <div className="mt-12 space-y-6">
          {post.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-base leading-loose text-ink/85">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </article>
    </>
  );
}
