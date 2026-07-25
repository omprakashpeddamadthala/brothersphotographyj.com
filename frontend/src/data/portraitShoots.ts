import type { PortraitShootSection } from '@/types';
import type { GalleryImage } from '@/types';
import { placeholder } from './placeholders';

export const portraitHero = placeholder(
  'portrait-hero',
  2000,
  1250,
  'Portrait shoot at golden hour by the ocean',
);

export const portraitSections: PortraitShootSection[] = [
  {
    id: 'ps-1',
    title: 'Love by Stories',
    description:
      'Portrait shoots by Stories are not just photographs — they are a chapter in your love story. We travel to the most beautiful locations to create images that are intimate, natural and unmistakably yours.',
    image: placeholder('portrait-1', 1600, 1067, 'Couple portrait in natural light'),
  },
  {
    id: 'ps-2',
    title: 'Destination Portraits',
    description:
      'From the cliffs of Santorini to the tea gardens of Munnar, we love creating portraits in extraordinary settings. Every destination brings its own mood, its own palette, its own story.',
    image: placeholder('portrait-2', 1067, 1600, 'Destination portrait in the mountains'),
    reverse: true,
  },
  {
    id: 'ps-3',
    title: 'Pre-Wedding Stories',
    description:
      'The days before the wedding are some of the most beautiful. No pressure, no timeline — just the two of you, a stunning location, and our cameras.',
    image: placeholder('portrait-3', 1600, 1067, 'Pre-wedding couple portrait at sunset'),
  },
  {
    id: 'ps-4',
    title: 'The Experience',
    description:
      'Every shoot begins with a conversation. We learn about you, your story, what makes you laugh. By the time we pick up the camera, it already feels like we are old friends.',
    image: placeholder('portrait-4', 1067, 1600, 'Behind the scenes portrait shoot'),
    reverse: true,
  },
];

export const portraitGallery: GalleryImage[] = Array.from(
  { length: 8 },
  (_, i) => {
    const shapes: Array<[number, number]> = [
      [1600, 1067],
      [1067, 1600],
      [1600, 1067],
      [1600, 2000],
      [1600, 1067],
      [1067, 1600],
      [1600, 900],
      [1600, 1067],
    ];
    const [w, h] = shapes[i % shapes.length];
    return placeholder(
      `portrait-gallery-${i}`,
      w,
      h,
      `Portrait shoot photograph ${i + 1}`,
    );
  },
);
