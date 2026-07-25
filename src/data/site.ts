import type { Award, NavItem, Testimonial } from '@/types';

export const siteConfig = {
  name: 'Brothers Photography',
  tagline: 'Timeless wedding photography, told like stories.',
  url: 'https://brothersphotographyj.com',
  description:
    'Brothers Photography is an award-winning wedding photography studio crafting timeless, editorial wedding stories across India and around the world.',
  email: 'hello@brothersphotographyj.com',
  phone: '+91 98765 43210',
  instagram: 'https://instagram.com/brothersphotographyj',
  facebook: 'https://facebook.com/brothersphotographyj',
};

export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Stories', to: '/stories' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'They disappeared into the celebration and reappeared with photographs we did not know were possible. Every frame feels like a memory, not a pose.',
    author: 'Aisha & Rohan',
    event: 'Udaipur, 2026',
  },
  {
    id: 't2',
    quote:
      'From the first call to the final album, the team was calm, invisible and completely in control. Our families still talk about them.',
    author: 'Meera & Arjun',
    event: 'Goa, 2025',
  },
  {
    id: 't3',
    quote:
      'We flew them to Italy and it was the best decision of the wedding. The gallery made our grandparents cry.',
    author: 'Sara & Vikram',
    event: 'Tuscany, 2025',
  },
];

export const awards: Award[] = [
  {
    id: 'a1',
    title: 'Wedding Photographer of the Year',
    organisation: 'International Wedding Photography Guild',
    year: 2025,
  },
  {
    id: 'a2',
    title: 'Top 10 Destination Wedding Studios',
    organisation: 'Asia Wedding Awards',
    year: 2024,
  },
  {
    id: 'a3',
    title: 'Editorial Excellence in Wedding Storytelling',
    organisation: 'Frame & Light Society',
    year: 2024,
  },
  {
    id: 'a4',
    title: 'Best Candid Wedding Coverage',
    organisation: 'National Photography Forum',
    year: 2023,
  },
];
