'use client';

import { useEffect } from 'react';

/**
 * Marks <html> with `data-year-ready` once the page has loaded: the year's later states may show from then on.
 * Until then only today's season is displayed, so the first screen gets its one season's paintings to itself, and
 * the others follow while the reader is still on the header. (The theme seen, which keeps the old paintings under
 * the new ones on the day/night switch, is every page's: components/theme-seen.tsx.)
 */
export function YearReady() {
  useEffect(() => {
    const root = document.documentElement;

    const ready = () => {
      root.dataset.yearReady = '';
    };

    if (document.readyState === 'complete') {
      ready();

      return;
    }

    window.addEventListener('load', ready, { once: true });

    return () => window.removeEventListener('load', ready);
  }, []);

  return null;
}
