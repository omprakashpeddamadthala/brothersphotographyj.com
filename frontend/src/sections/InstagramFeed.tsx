import { InstagramIcon } from '@/components/common/SocialIcons';
import { placeholder } from '@/data/placeholders';
import { siteConfig } from '@/data/site';
import { LazyImage } from '@/components/common/LazyImage';
import { Reveal } from '@/components/common/Reveal';

const feed = Array.from({ length: 6 }, (_, i) =>
  placeholder(`insta-${i}`, 800, 800, `Instagram post ${i + 1}`),
);

export function InstagramFeed() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-10 flex flex-col items-center gap-3 text-center">
          <InstagramIcon size={24} />
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="font-serif text-2xl transition-colors hover:text-gold"
          >
            @brothersphotographyj
          </a>
          <p className="text-xs uppercase tracking-widest2 text-stone">Follow along on Instagram</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {feed.map((image) => (
            <a
              key={image.id}
              href={siteConfig.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover-zoom block"
              aria-label="Open Instagram profile"
            >
              <LazyImage image={image} sizes="(min-width: 768px) 16vw, 33vw" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
