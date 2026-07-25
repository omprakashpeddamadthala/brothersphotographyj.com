import { useNavigate } from 'react-router-dom';
import { ParallaxSection } from '@/components/common/ParallaxSection';
import { placeholder } from '@/data/placeholders';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/common/Reveal';

const ctaImage = placeholder('cta', 2000, 1100, 'Wedding celebration at dusk');

export function CallToAction() {
  const navigate = useNavigate();
  return (
    <ParallaxSection image={ctaImage}>
      <Reveal>
        <h2 className="font-serif text-4xl font-light md:text-6xl">
          Your story deserves to be told well.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-paper/85">
          We take on a limited number of weddings every season so that each one gets our full attention.
        </p>
        <Button variant="inverted" className="mt-10" onClick={() => navigate('/contact')}>
          Book your date
        </Button>
      </Reveal>
    </ParallaxSection>
  );
}
