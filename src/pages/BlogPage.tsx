import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { LazyImage } from '@/components/common/LazyImage';
import { Reveal } from '@/components/common/Reveal';
import { blogPosts } from '@/data/blog';
import { formatDate } from '@/utils/formatDate';

export default function BlogPage() {
  return (
    <>
      <SEO
        title="Blog"
        description="Notes on weddings, photography and light from Brothers Photography."
        path="/blog"
      />
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-36">
        <AnimatedHeading as="h1" eyebrow="The journal">
          Notes on weddings &amp; light
        </AnimatedHeading>
        <div className="mt-16 space-y-20">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <Link to={`/blog/${post.slug}`} className="group grid items-center gap-8 md:grid-cols-2">
                <div className={`hover-zoom ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <LazyImage image={post.cover} sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest2 text-stone">
                    {formatDate(post.date)}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl transition-colors group-hover:text-gold">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-sm leading-loose text-stone">{post.excerpt}</p>
                  <span className="mt-6 inline-block text-xs uppercase tracking-widest2 underline underline-offset-8">
                    Read more
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
