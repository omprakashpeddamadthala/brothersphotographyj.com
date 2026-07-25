import type { Story } from '@/types';
import { placeholder } from './placeholders';

function buildImages(prefix: string, couple: string): Story['images'] {
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
  ];
  return shapes.map(([w, h], i) =>
    placeholder(`${prefix}-${i}`, w, h, `${couple} — photograph ${i + 1}`),
  );
}

export const stories: Story[] = [
  {
    slug: 'aisha-rohan-udaipur',
    title: 'A Palace of Their Own',
    couple: 'Aisha & Rohan',
    location: 'Udaipur, India',
    date: 'February 2026',
    excerpt: 'Three days of colour and candlelight on the shores of Lake Pichola.',
    cover: placeholder('story-udaipur', 1600, 2000, 'Aisha & Rohan wedding cover'),
    images: buildImages('udaipur', 'Aisha & Rohan'),
  },
  {
    slug: 'meera-arjun-goa',
    title: 'Salt Air & Serenades',
    couple: 'Meera & Arjun',
    location: 'Goa, India',
    date: 'December 2025',
    excerpt: 'A barefoot beach ceremony that turned into an all-night celebration.',
    cover: placeholder('story-goa', 1600, 1067, 'Meera & Arjun wedding cover'),
    images: buildImages('goa', 'Meera & Arjun'),
  },
  {
    slug: 'sara-vikram-tuscany',
    title: 'Under Tuscan Light',
    couple: 'Sara & Vikram',
    location: 'Tuscany, Italy',
    date: 'September 2025',
    excerpt: 'An intimate destination wedding among the vineyards of Val d’Orcia.',
    cover: placeholder('story-tuscany', 1600, 2000, 'Sara & Vikram wedding cover'),
    images: buildImages('tuscany', 'Sara & Vikram'),
  },
  {
    slug: 'nina-kabir-jaipur',
    title: 'The Pink City Waltz',
    couple: 'Nina & Kabir',
    location: 'Jaipur, India',
    date: 'November 2025',
    excerpt: 'Heritage courtyards, marigold showers and a midnight baraat.',
    cover: placeholder('story-jaipur', 1600, 1067, 'Nina & Kabir wedding cover'),
    images: buildImages('jaipur', 'Nina & Kabir'),
  },
  {
    slug: 'lea-dev-santorini',
    title: 'Blue Domes, Golden Hour',
    couple: 'Lea & Dev',
    location: 'Santorini, Greece',
    date: 'June 2025',
    excerpt: 'A cliffside ceremony suspended between sea and sky.',
    cover: placeholder('story-santorini', 1600, 2000, 'Lea & Dev wedding cover'),
    images: buildImages('santorini', 'Lea & Dev'),
  },
  {
    slug: 'tara-ishaan-kerala',
    title: 'Backwater Ballad',
    couple: 'Tara & Ishaan',
    location: 'Kumarakom, Kerala',
    date: 'January 2026',
    excerpt: 'Temple bells, silk saris and slow mornings on the houseboat.',
    cover: placeholder('story-kerala', 1600, 1067, 'Tara & Ishaan wedding cover'),
    images: buildImages('kerala', 'Tara & Ishaan'),
  },
];

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}
