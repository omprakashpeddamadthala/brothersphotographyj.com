import type { BlogPost } from '@/types';
import { placeholder } from './placeholders';

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-we-shoot-film-first-moments',
    title: 'Why We Shoot the First Moments on Instinct',
    date: '2026-06-12',
    excerpt:
      'The first ten minutes of a wedding morning tell the whole story. Here is how we prepare to catch them.',
    cover: placeholder('blog-1', 1600, 1067, 'Bride getting ready by a window'),
    body: [
      'Every wedding morning has a rhythm of its own. We arrive early, stay quiet, and let the room settle around us before a single frame is made.',
      'Our approach is simple: anticipate, never interrupt. The best photographs happen when everyone forgets the camera is there.',
      'We plan our light in advance — window positions, lamp temperatures, the direction the makeup chair faces — so that when the moment arrives, technique is invisible.',
    ],
  },
  {
    slug: 'planning-a-destination-wedding-timeline',
    title: 'Planning a Destination Wedding Timeline for Great Photographs',
    date: '2026-04-03',
    excerpt:
      'Golden hour waits for no one. A practical guide to building a photography-friendly schedule.',
    cover: placeholder('blog-2', 1600, 1067, 'Couple at sunset on a cliff'),
    body: [
      'Destination weddings compress several events into a few days. The single most valuable thing you can do is protect thirty minutes at golden hour for portraits.',
      'Work backwards from sunset. Everything else — speeches, dinner calls, entrances — can flex; the light cannot.',
      'Share the venue layout with your photography team early. Scouting on arrival day saves precious time during the celebrations.',
    ],
  },
  {
    slug: 'our-favourite-frames-of-the-season',
    title: 'Our Favourite Frames of the Season',
    date: '2026-02-20',
    excerpt: 'A look back at the moments that stayed with us this wedding season.',
    cover: placeholder('blog-3', 1600, 2000, 'Confetti falling over a dancing couple'),
    body: [
      'Some photographs announce themselves the instant the shutter closes. Others reveal their weight weeks later, in the edit.',
      'This season gave us both kinds — grand palace celebrations and tiny living-room ceremonies, each with its own gravity.',
      'Here is a small selection, with notes on why each frame made the cut.',
    ],
  },
  {
    slug: 'what-to-ask-your-wedding-photographer',
    title: 'Ten Questions to Ask Before Booking a Wedding Photographer',
    date: '2025-12-08',
    excerpt: 'Beyond the portfolio: the questions that reveal how a team actually works on the day.',
    cover: placeholder('blog-4', 1600, 1067, 'Photographer adjusting a camera'),
    body: [
      'A portfolio shows outcomes; questions reveal process. Ask how many weddings the team shoots per season, and who exactly will be present on your day.',
      'Ask about backups — of gear, of people, of files. The unglamorous logistics are what protect your memories.',
      'And ask to see one full wedding gallery, not just highlights. Consistency across a whole day is the real test.',
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
