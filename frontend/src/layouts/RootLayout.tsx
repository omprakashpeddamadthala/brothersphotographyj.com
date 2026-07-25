import { Suspense, useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/useLenis';
import { usePreloader } from '@/hooks/usePreloader';
import { siteConfig } from '@/data/site';

function PageLoader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <div className="preloader-pulse font-serif text-2xl tracking-wide text-ink/60">
        {siteConfig.name}
      </div>
    </div>
  );
}

function Preloader({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center bg-ink"
      onClick={onDismiss}
      role="button"
      aria-label="Enter site"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDismiss();
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="font-serif text-3xl tracking-wide text-paper md:text-5xl"
      >
        {siteConfig.name}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-6 text-xs uppercase tracking-widest2 text-paper/40"
      >
        Welcome
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-10"
      >
        <span className="border border-paper/30 px-6 py-3 text-xs uppercase tracking-widest2 text-paper/60 transition-colors hover:border-paper hover:text-paper">
          Enter
        </span>
      </motion.div>
    </motion.div>
  );
}

export function RootLayout() {
  const location = useLocation();
  const { showPreloader, dismiss } = usePreloader(6000);
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <AnimatePresence>
        {showPreloader && <Preloader onDismiss={dismiss} />}
      </AnimatePresence>

      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          id="main-content"
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex-1"
        >
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
