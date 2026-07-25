export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Story {
  slug: string;
  title: string;
  couple: string;
  location: string;
  date: string;
  excerpt: string;
  cover: GalleryImage;
  images: GalleryImage[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: GalleryImage;
  body: string[];
  images: GalleryImage[];
  category?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  event: string;
}

export interface Award {
  id: string;
  title: string;
  organisation: string;
  year: number;
}

export interface NavItem {
  label: string;
  to: string;
  external?: boolean;
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  numberOfEvents: string;
  location: string;
  heardAboutUs: string;
  message: string;
}

export interface PortraitShootSection {
  id: string;
  title: string;
  description: string;
  image: GalleryImage;
  reverse?: boolean;
}
