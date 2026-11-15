'use client';

import { useEffect } from 'react';

/** How long the browser may wait for an idle moment before a painting is decoded anyway. */
const IDLE_TIMEOUT = 2000;

/** The year's paintings for one theme, as the URLs their layers carry (each once, though every state repeats them). */
function paintingsFor(theme: string) {
  const layers = document.querySelectorAll<HTMLElement>(
    `.year-backdrop .theme-art[data-art='${theme}'] [style*='background-image']`
  );
  const urls = new Set<string>();

  for (const layer of layers) {
    const url = /url\(["']?([^"')]+)["']?\)/.exec(layer.style.backgroundImage)?.[1];

    if (url) {
      urls.add(url);
    }
  }

  return [...urls];
}

/** Runs `run` when the browser is idle; Safari has no idle callback, so there it is the next task. */
function whenIdle(run: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT });

    return;
  }

  window.setTimeout(run, 0);
}

/**
 * Decodes every season's paintings for the theme on screen, one at a time when the browser is idle, and keeps them,
 * so a season shown for the first time is already a picture when its hairline fades it in. A season is otherwise
 * decoded on the frame it first becomes visible, half-way into its fade, and pops. Only on wide screens: on phones
 * the backdrop is not displayed and none of it is downloaded.
 */
function warm(theme: string, kept: HTMLImageElement[], stopped: () => boolean) {
  const backdrop = document.querySelector<HTMLElement>('.year-backdrop');
  if (!backdrop || getComputedStyle(backdrop).display === 'none') return;
  const queue = paintingsFor(theme);

  const next = () => {
    const url = queue.shift();
    if (!url || stopped()) return;
    const image = new Image();
    image.src = url;
    kept.push(image);
    image
      .decode()
      .catch(() => undefined)
      .finally(() => whenIdle(next));
  };

  whenIdle(next);
}

/**
 * Marks <html> with `data-year-ready` once the page has loaded: the year's later states may show from then on.
 * Until then only today's season is displayed, so the first screen gets its one season's paintings to itself, and
 * the others follow while the reader is still on the header, decoded ahead of their turn (and again for the other
 * theme when the switch is pressed). (The theme seen, which keeps the old paintings under the new ones on the
 * day/night switch, is every page's: components/theme-seen.tsx.)
 */
export function YearReady() {
  useEffect(() => {
    const root = document.documentElement;
    const kept: HTMLImageElement[] = [];
    const warmed = new Set<string>();
    let stopped = false;

    const warmTheme = () => {
      const theme = root.dataset.theme === 'dark' ? 'night' : 'day';
      if (warmed.has(theme)) return;
      warmed.add(theme);
      warm(theme, kept, () => stopped);
    };

    const ready = () => {
      root.dataset.yearReady = '';
      warmTheme();
    };

    const themes = new MutationObserver(() => {
      if (root.dataset.yearReady === undefined) return;
      warmTheme();
    });

    themes.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    if (document.readyState === 'complete') {
      ready();
    } else {
      window.addEventListener('load', ready, { once: true });
    }

    return () => {
      stopped = true;
      themes.disconnect();
      window.removeEventListener('load', ready);
      kept.length = 0;
    };
  }, []);

  return null;
}
