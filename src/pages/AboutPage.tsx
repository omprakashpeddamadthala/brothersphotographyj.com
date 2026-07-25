import { SEO } from '@/components/common/SEO';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { Reveal } from '@/components/common/Reveal';
import { LazyImage } from '@/components/common/LazyImage';
import { ParallaxSection } from '@/components/common/ParallaxSection';
import { placeholder } from '@/data/placeholders';
import { Awards } from '@/sections/Awards';

const heroImage = placeholder('about-hero', 2000, 1100, 'The Brothers Photography team at work');
const teamImages = [
  placeholder('team-1', 1200, 1500, 'Lead photographer portrait'),
  placeholder('team-2', 1200, 1500, 'Second photographer portrait'),
  placeholder('team-3', 1200, 1500, 'Film director portrait'),
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Who We Are"
        description="Meet the team behind Brothers Photography — storytellers, travellers and lovers of light."
        path="/about"
      />
      <ParallaxSection image={heroImage} className="min-h-[70vh]">
        <h1 className="font-serif text-5xl font-light md:text-6xl">
          Hello, we are Brothers Photography.
        </h1>
      </ParallaxSection>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <p className="font-serif text-2xl font-light leading-relaxed md:text-3xl">
            We are a small team of photographers and filmmakers who believe weddings are the greatest
            stories never written down. Our job is to write them in light.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 text-sm leading-loose text-stone">
            Over the last decade we have photographed celebrations in palaces and living rooms, on
            beaches and mountaintops, across India and around the world. Wherever love gathers a crowd,
            we would like to be there — quietly, curiously, and with cameras ready.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <AnimatedHeading eyebrow="The team">The people behind the pictures</AnimatedHeading>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {teamImages.map((image, i) => (
            <Reveal key={image.id} delay={i * 0.1}>
              <div className="hover-zoom">
                <LazyImage image={image} sizes="(min-width: 640px) 33vw, 100vw" />
              </div>
              <h3 className="mt-4 text-center font-serif text-xl">
                {['Lead Photographer', 'Photographer', 'Film Director'][i]}
              </h3>
            </Reveal>
          ))}
        </div>
      </section>

      <Awards />
    </>
  );
}
