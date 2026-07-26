import type { Award, NavItem, Testimonial } from '@/types';

export const siteConfig = {
  name: 'Brothers Photography',
  tagline: 'Stories of love, laughter and happily ever after.',
  url: 'https://brothersphotographyj.com',
  description:
    'Brothers Photography is an international award-winning team of photographers who believe in stories; stories of love, laughter and happily ever after.',
  email: 'hello@brothersphotographyj.com',
  phone: '+91 98765 43210',
  instagram: 'https://instagram.com/brothersphotographyj',
  facebook: 'https://facebook.com/brothersphotographyj',
};

export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Book us now :)', to: '/contact' },
  { label: 'Portrait Shoots', to: '/portrait-shoots' },
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
    title: 'ISPWP Top 20',
    organisation: 'International Society of Professional Wedding Photographers',
    year: 2025,
  },
  {
    id: 'a2',
    title: 'Fearless Award',
    organisation: 'Fearless Photographers',
    year: 2024,
  },
  {
    id: 'a3',
    title: "WeddingSutra Favourite",
    organisation: 'WeddingSutra',
    year: 2024,
  },
  {
    id: 'a4',
    title: 'Better Photography Award',
    organisation: 'Better Photography Magazine',
    year: 2023,
  },
  {
    id: 'a5',
    title: 'Canvera Wedding Photographer of the Year',
    organisation: 'Canvera',
    year: 2023,
  },
];
