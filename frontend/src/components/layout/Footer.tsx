import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon } from '@/components/common/SocialIcons';
import { useCms } from '@/context/CmsContext';

export function Footer() {
  const { siteSettings, navItems } = useCms();
  const siteName = siteSettings.name || 'BROTHERS PHOTOGRAPHY';
  const copyrightText = siteSettings.copyright || `© ${new Date().getFullYear()} ${siteName.toUpperCase()}. ALL RIGHTS RESERVED.`;

  return (
    <footer className="border-t border-ink/8">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Social Row */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={siteSettings.instagram || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            className="text-ink/40 transition-colors hover:text-gold"
            aria-label="Instagram"
          >
            <InstagramIcon size={20} />
          </a>
          <a
            href={siteSettings.facebook || 'https://facebook.com'}
            target="_blank"
            rel="noreferrer"
            className="text-ink/40 transition-colors hover:text-gold"
            aria-label="Facebook"
          >
            <FacebookIcon size={20} />
          </a>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer" className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-widest2 text-stone transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs uppercase tracking-widest2 text-stone transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            to="/admin/login"
            className="text-xs uppercase tracking-widest2 text-stone/40 transition-colors hover:text-ink"
          >
            Admin Panel
          </Link>
        </nav>

        {/* Copyright */}
        <p className="mt-8 text-center text-[11px] tracking-widest2 text-ink/30">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
