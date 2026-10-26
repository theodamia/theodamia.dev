'use client';

import { useEffect } from 'react';

type Seen = 'day' | 'night';

/**
 * Marks on <html> the themes that have been on screen (`data-theme-seen`), on every page. The still pages'
 * paintings are CSS backgrounds that download only once displayed (`.theme-art` in globals.css), so a theme seen
 * once stays displayed underneath the other: the day/night switch then shows the old painting until the new one
 * arrives, never an empty sky. It lives in the layout because every painted page needs it, from the first switch.
 */
export function ThemeSeen() {
  useEffect(() => {
    const root = document.documentElement;
    const seen = new Set(root.dataset.themeSeen?.split(' ') ?? []);

    const note = () => {
      seen.add((root.dataset.theme === 'dark' ? 'night' : 'day') satisfies Seen);
      root.dataset.themeSeen = [...seen].join(' ');
    };

    note();
    const themes = new MutationObserver(note);
    themes.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    return () => themes.disconnect();
  }, []);

  return null;
}
