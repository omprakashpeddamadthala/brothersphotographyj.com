import { useState, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCms } from '@/context/CmsContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/utils/cn';
import { InstagramIcon, FacebookIcon } from '@/components/common/SocialIcons';

const menuItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export function Navbar() {
  const { siteSettings, navItems } = useCms();
  const { direction, atTop } = useScrollDirection();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useLockBodyScroll(open);

  const hidden = direction === 'down' && !atTop && !open;

  const handleClose = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const isHomepage = location.pathname === '/';
  const logoUrl = siteSettings.logoUrl;
  const siteName = siteSettings.name || 'Brothers Photography';

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          open
            ? 'bg-transparent'
            : atTop && isHomepage
              ? 'bg-transparent'
              : 'bg-paper/95 backdrop-blur shadow-[0_1px_0_rgba(0,0,0,0.06)]',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
        >
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              'font-serif text-xl tracking-wide transition-colors duration-300 flex items-center gap-3',
              open || (atTop && isHomepage) ? 'text-paper' : 'text-ink',
            )}
            onClick={handleClose}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
            ) : (
              siteName
            )}
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            className={cn(
              'relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[6px] transition-colors',
              open || (atTop && isHomepage) ? 'text-paper' : 'text-ink',
            )}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={toggle}
          >
            <motion.span
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block h-[1.5px] w-6 bg-current origin-center"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block h-[1.5px] w-6 bg-current origin-center"
            />
          </button>
        </nav>
      </motion.header>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="menu-overlay fixed inset-0 z-[55] flex flex-col items-center justify-center bg-ink/90"
          >
            <nav aria-label="Main menu">
              <ul className="flex flex-col items-center gap-6 md:gap-8">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.to}
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {item.external ? (
                      <a
                        href={item.to}
                        target="_blank"
                        rel="noreferrer"
                        className="font-serif text-3xl text-paper/80 transition-colors duration-300 hover:text-gold md:text-4xl"
                        onClick={handleClose}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <NavLink
                        to={item.to}
                        onClick={handleClose}
                        className={({ isActive }) =>
                          cn(
                            'font-serif text-3xl text-paper/80 transition-colors duration-300 hover:text-gold md:text-4xl',
                            isActive && 'text-gold',
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute bottom-10 flex items-center gap-6"
            >
              <a
                href={siteSettings.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="text-paper/50 transition-colors hover:text-gold"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href={siteSettings.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="text-paper/50 transition-colors hover:text-gold"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
