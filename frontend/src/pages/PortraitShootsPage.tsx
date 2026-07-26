import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { ParallaxSection } from '@/components/common/ParallaxSection';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { LazyImage } from '@/components/common/LazyImage';
import { MasonryGrid } from '@/components/common/MasonryGrid';
import { Reveal } from '@/components/common/Reveal';
import {
  portraitHero,
  portraitSections,
  portraitGallery,
} from '@/data/portraitShoots';
import { blogPosts } from '@/data/blog';

export default function PortraitShootsPage() {
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <>
      <SEO
        title="Portrait Shoots"
        description="Destination portrait sessions by Brothers Photography. Pre-wedding, couple, and engagement photography across India and the world."
        path="/portrait-shoots"
      />

      {/* Hero */}
      <ParallaxSection image={portraitHero} className="min-h-[80vh]">
        <p className="text-xs uppercase tracking-widest2 text-paper/60">
          Love by Stories
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-light leading-tight md:text-7xl">
          Portrait Shoots
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/70">
          Intimate, natural, and utterly you.
        </p>
      </ParallaxSection>

      {/* Alternating Content Sections */}
      {portraitSections.map((section, i) => (
        <section key={section.id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div
            className={`grid items-center gap-12 md:grid-cols-2 ${
              section.reverse ? 'md:[&>:first-child]:order-2' : ''
            }`}
          >
            <Reveal delay={0.1}>
              <div className="hover-zoom">
                <LazyImage
                  image={section.image}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-[11px] uppercase tracking-widest2 text-stone">
                0{i + 1}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-light md:text-4xl">
                {section.title}
              </h2>
              <p className="mt-5 text-sm leading-loose text-stone">
                {section.description}
              </p>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Gallery Grid */}
      <section className="bg-mist py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedHeading eyebrow="The gallery">
            A glimpse of our work
          </AnimatedHeading>
          <div className="mt-14">
            <MasonryGrid>
              {portraitGallery.map((image, i) => (
                <Reveal key={image.id} delay={(i % 3) * 0.06}>
                  <div className="hover-zoom">
                    <LazyImage
                      image={image}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                </Reveal>
              ))}
            </MasonryGrid>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-widest2 text-stone">
            Ask us for a destination portrait shoot
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light md:text-4xl">
            Ready to create your story?
          </h2>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-ink px-10 py-4 text-xs uppercase tracking-widest2 text-paper transition-colors hover:bg-gold"
          >
            Book a shoot
          </Link>
        </Reveal>
      </section>

      {/* Featured on the blog */}
      <section className="border-t border-ink/8 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedHeading eyebrow="Featured on the blog">
            Recent stories
          </AnimatedHeading>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.1}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="hover-zoom aspect-[4/5] overflow-hidden">
                    <LazyImage
                      image={post.cover}
                      className="h-full"
                      imgClassName="h-full"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <h3 className="mt-4 font-serif text-lg transition-colors group-hover:text-gold">
                    {post.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
