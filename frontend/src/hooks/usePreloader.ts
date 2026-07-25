import { useState, useEffect, useCallback } from 'react';

/**
 * Manages a session-level preloader / splash screen.
 * Shows on first visit within the session, then stays dismissed.
 */
export function usePreloader(durationMs = 2400): {
  showPreloader: boolean;
  dismiss: () => void;
} {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('preloader-seen') !== 'true';
  });

  const dismiss = useCallback(() => {
    setShow(false);
    sessionStorage.setItem('preloader-seen', 'true');
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(dismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [show, durationMs, dismiss]);

  return { showPreloader: show, dismiss };
}
