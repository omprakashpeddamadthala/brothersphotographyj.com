import type { BlogPost } from '@/types';
import { placeholder } from './placeholders';

function buildGalleryImages(prefix: string, count: number): BlogPost['images'] {
  const shapes: Array<[number, number]> = [
    [1600, 1067],
    [1067, 1600],
    [1600, 1067],
    [1600, 2000],
    [1600, 1067],
    [1067, 1600],
    [1600, 900],
    [1600, 1067],
    [1067, 1600],
    [1600, 1067],
    [1600, 2000],
    [1600, 1067],
    [1067, 1600],
    [1600, 1067],
    [1600, 900],
  ];
  return Array.from({ length: count }, (_, i) => {
    const [w, h] = shapes[i % shapes.length];
    return placeholder(`${prefix}-gallery-${i}`, w, h, `${prefix} — photograph ${i + 1}`);
  });
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'aisha-rohan-udaipur-palace',
    title: 'A Palace of Their Own — Aisha & Rohan',
    date: 'February 2026',
    excerpt:
      'Three days of colour and candlelight on the shores of Lake Pichola.',
    cover: placeholder('story-udaipur', 1600, 2000, 'Aisha & Rohan wedding cover'),
    body: [
      'Every wedding morning has a rhythm of its own. We arrive early, stay quiet, and let the room settle around us before a single frame is made.',
      'Our approach is simple: anticipate, never interrupt. The best photographs happen when everyone forgets the camera is there.',
    ],
    images: buildGalleryImages('udaipur', 14),
    category: 'Wedding',
  },
  {
    slug: 'meera-arjun-goa-beach',
    title: 'Salt Air & Serenades — Meera & Arjun',
    date: 'December 2025',
    excerpt:
      'A barefoot beach ceremony that turned into an all-night celebration.',
    cover: placeholder('story-goa', 1600, 1067, 'Meera & Arjun wedding cover'),
    body: [
      'Destination weddings compress several events into a few days. The single most valuable thing you can do is protect thirty minutes at golden hour for portraits.',
    ],
    images: buildGalleryImages('goa', 12),
    category: 'Wedding',
  },
  {
    slug: 'sara-vikram-tuscan-light',
    title: 'Under Tuscan Light — Sara & Vikram',
    date: 'September 2025',
    excerpt:
      'An intimate destination wedding among the vineyards of Val d’Orcia.',
    cover: placeholder('story-tuscany', 1600, 2000, 'Sara & Vikram wedding cover'),
    body: [
      'Some photographs announce themselves the instant the shutter closes. Others reveal their weight weeks later, in the edit.',
    ],
    images: buildGalleryImages('tuscany', 15),
    category: 'Destination Wedding',
  },
  {
    slug: 'nina-kabir-jaipur-waltz',
    title: 'The Pink City Waltz — Nina & Kabir',
    date: 'November 2025',
    excerpt: 'Heritage courtyards, marigold showers and a midnight baraat.',
    cover: placeholder('story-jaipur', 1600, 1067, 'Nina & Kabir wedding cover'),
    body: [
      'A portfolio shows outcomes; questions reveal process. Ask how many weddings the team shoots per season.',
    ],
    images: buildGalleryImages('jaipur', 12),
    category: 'Wedding',
  },
  {
    slug: 'lea-dev-santorini-cliffs',
    title: 'Blue Domes, Golden Hour — Lea & Dev',
    date: 'June 2025',
    excerpt: 'A cliffside ceremony suspended between sea and sky.',
    cover: placeholder('story-santorini', 1600, 2000, 'Lea & Dev wedding cover'),
    body: [
      'The Aegean light is unlike anything else. We scouted three different spots before sunrise to find the one that would glow at ceremony time.',
    ],
    images: buildGalleryImages('santorini', 14),
    category: 'Destination Wedding',
  },
  {
    slug: 'tara-ishaan-kerala-backwaters',
    title: 'Backwater Ballad — Tara & Ishaan',
    date: 'January 2026',
    excerpt:
      'Temple bells, silk saris and slow mornings on the houseboat.',
    cover: placeholder('story-kerala', 1600, 1067, 'Tara & Ishaan wedding cover'),
    body: [
      'Kerala mornings start early — the temple bells, the mist on the water, the first light filtering through coconut palms.',
    ],
    images: buildGalleryImages('kerala', 12),
    category: 'Wedding',
  },
  {
    slug: 'priya-amit-jodhpur-sun',
    title: 'Fortress in the Sun — Priya & Amit',
    date: 'March 2025',
    excerpt:
      'A royal wedding at Mehrangarh Fort with views that stretched to the horizon.',
    cover: placeholder('story-jodhpur', 1600, 1067, 'Priya & Amit at Mehrangarh Fort'),
    body: [
      'Jodhpur at sunrise is something you have to see to believe. The blue city stretches out below the fort like a painting.',
    ],
    images: buildGalleryImages('jodhpur', 14),
    category: 'Wedding',
  },
  {
    slug: 'zara-kian-london-garden',
    title: 'A London Garden Party — Zara & Kian',
    date: 'July 2025',
    excerpt:
      'English country gardens, afternoon tea, and a first dance under fairy lights.',
    cover: placeholder('story-london', 1600, 2000, 'Zara & Kian garden wedding'),
    body: [
      'There is something about an English garden wedding that feels like stepping into a novel. The roses were in full bloom.',
    ],
    images: buildGalleryImages('london', 12),
    category: 'Destination Wedding',
  },
  {
    slug: 'ananya-rahul-mumbai-monsoon',
    title: 'Monsoon Magic — Ananya & Rahul',
    date: 'August 2025',
    excerpt:
      'When the rains came, they danced. A Mumbai wedding that embraced the storm.',
    cover: placeholder('story-mumbai', 1600, 1067, 'Ananya & Rahul monsoon wedding'),
    body: [
      'The forecast said rain. The couple said "we don’t care." Those turned out to be the most beautiful photographs of the season.',
    ],
    images: buildGalleryImages('mumbai', 12),
    category: 'Wedding',
  },
  {
    slug: 'nadia-farhan-istanbul-bosporus',
    title: 'Between Two Continents — Nadia & Farhan',
    date: 'May 2025',
    excerpt:
      'A wedding that spanned the Bosphorus — European elegance meets Asian warmth.',
    cover: placeholder('story-istanbul', 1600, 2000, 'Nadia & Farhan Istanbul wedding'),
    body: [
      'Istanbul at dusk, with the minarets silhouetted against a pink sky and the Bosphorus glittering below.',
    ],
    images: buildGalleryImages('istanbul', 14),
    category: 'Destination Wedding',
  },
  {
    slug: 'kavya-aarav-coorg-coffee',
    title: 'Coffee Estate Chronicles — Kavya & Aarav',
    date: 'October 2025',
    excerpt:
      'Misty mornings, coffee blossoms, and a wedding set among the hills of Coorg.',
    cover: placeholder('story-coorg', 1600, 1067, 'Kavya & Aarav Coorg wedding'),
    body: [
      'The scent of coffee blossoms filled the air as we walked through the estate. Every corner was a photograph waiting to happen.',
    ],
    images: buildGalleryImages('coorg', 12),
    category: 'Wedding',
  },
  {
    slug: 'riya-veer-bangkok-temple',
    title: 'Temple & Sky — Riya & Veer',
    date: 'April 2025',
    excerpt:
      'Traditional ceremonies at dawn, a rooftop reception under the Bangkok skyline at night.',
    cover: placeholder('story-bangkok', 1600, 2000, 'Riya & Veer Bangkok wedding'),
    body: [
      'Bangkok is a city of contrasts — ancient temples next to glass skyscrapers. This wedding embodied that perfectly.',
    ],
    images: buildGalleryImages('bangkok', 14),
    category: 'Destination Wedding',
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
