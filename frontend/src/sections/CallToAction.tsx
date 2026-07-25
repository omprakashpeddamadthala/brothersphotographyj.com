import { useNavigate } from 'react-router-dom';
import { ParallaxSection } from '@/components/common/ParallaxSection';
import { placeholder } from '@/data/placeholders';
import { Reveal } from '@/components/common/Reveal';

const ctaImage = placeholder('cta', 2000, 1100, 'Wedding celebration at dusk');

export function CallToAction() {
  const navigate = useNavigate();
  return (
    <ParallaxSection image={ctaImage} className="min-h-[70vh]">
      <Reveal>
        <p className="mb-6 text-xs uppercase tracking-widest2 text-paper/60">
          Let&apos;s create something beautiful
        </p>
        <h2 className="max-w-2xl font-serif text-4xl font-light leading-tight md:text-6xl">
          Your story deserves to be told well.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-paper/75">
          We take on a limited number of weddings every season so that each one
          gets our full attention.
        </p>
        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="mt-10 border border-paper/60 px-8 py-4 text-xs uppercase tracking-widest2 text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
        >
          Book your date
        </button>
      </Reveal>
    </ParallaxSection>
  );
}
