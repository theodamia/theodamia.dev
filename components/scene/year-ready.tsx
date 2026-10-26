'use client';

import { useEffect } from 'react';

type Seen = 'day' | 'night';

/**
 * Two marks on <html> for the year's paintings, which download only once they are displayed:
 *
 * - `data-year-ready`, once the page has loaded: the year's later states may show from then on. Until then only
 *   today's season is displayed, so the first screen gets its one season's paintings to itself, and the others
 *   follow while the reader is still on the header.
 * - `data-year-seen`, the themes that have been on screen: a theme seen once stays underneath the other, so the
 *   day/night switch shows the old paintings until the new ones arrive instead of a meadow with no wood.
 */
export function YearReady() {
  useEffect(() => {
    const root = document.documentElement;
    const seen = new Set(root.dataset.yearSeen?.split(' ') ?? []);

    const note = () => {
      seen.add((root.dataset.theme === 'dark' ? 'night' : 'day') satisfies Seen);
      root.dataset.yearSeen = [...seen].join(' ');
    };

    const ready = () => {
      root.dataset.yearReady = '';
    };

    note();
    const themes = new MutationObserver(note);
    themes.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    if (document.readyState === 'complete') {
      ready();

      return () => themes.disconnect();
    }

    window.addEventListener('load', ready, { once: true });

    return () => {
      themes.disconnect();
      window.removeEventListener('load', ready);
    };
  }, []);

  return null;
}
