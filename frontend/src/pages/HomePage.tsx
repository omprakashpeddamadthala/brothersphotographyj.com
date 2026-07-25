import { SEO } from '@/components/common/SEO';
import { siteConfig } from '@/data/site';
import { Hero } from '@/sections/Hero';
import { FeaturedStories } from '@/sections/FeaturedStories';
import { Testimonials } from '@/sections/Testimonials';
import { Awards } from '@/sections/Awards';
import { CallToAction } from '@/sections/CallToAction';
import { InstagramFeed } from '@/sections/InstagramFeed';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  sameAs: [siteConfig.instagram, siteConfig.facebook],
};

export default function HomePage() {
  return (
    <>
      <SEO path="/" structuredData={structuredData} />
      <Hero />
      <FeaturedStories />
      <Awards />
      <Testimonials />
      <CallToAction />
      <InstagramFeed />
    </>
  );
}
