import { useEffect, useSyncExternalStore } from 'react';
import { DARK_SCHEME_QUERY } from '@/constants';
import { applyTheme, readTheme, storedTheme, supportsNight, type Theme } from '@/lib/theme';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/**
 * The theme on <html>. The server does not know it (the script in <head> sets it before the first paint), so the
 * server render says day and the client corrects it right after hydration. Anything that must be right from the
 * first paint is styled with the `dark:` variant instead.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'light');
}

/** Until someone picks a theme, follow the system's as it changes (an evening switch to dark, say). */
export function useFollowSystemTheme() {
  useEffect(() => {
    const query = window.matchMedia(DARK_SCHEME_QUERY);
    const follow = () => {
      if (storedTheme() || !supportsNight()) return;
      applyTheme(query.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', follow);
    return () => query.removeEventListener('change', follow);
  }, []);
}
