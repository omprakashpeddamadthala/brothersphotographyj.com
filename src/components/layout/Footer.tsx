import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/common/SocialIcons';
import { navItems, siteConfig } from '@/data/site';

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">{siteConfig.name}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <p className="mb-4 text-xs uppercase tracking-widest2 text-paper/50">Explore</p>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-paper/80 transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-xs uppercase tracking-widest2 text-paper/50">Say hello</p>
          <ul className="space-y-3 text-sm text-paper/80">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-gold"
              >
                <Mail size={16} aria-hidden /> {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-gold"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            </li>
            <li>
              <a
                href={siteConfig.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-gold"
              >
                <FacebookIcon size={16} /> Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-6 text-center text-xs tracking-widest2 text-paper/40">
        © {new Date().getFullYear()} {siteConfig.name.toUpperCase()}. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
