import { useEffect, useSyncExternalStore } from 'react';
import { readSeason, seasonNow, storedSeason, type Season } from '@/lib/season';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-season'],
  });

  return () => observer.disconnect();
}

/**
 * The season on <html>. Like the theme, the server does not know it — the script in <head> sets it before the
 * first paint — so the server render says summer and the client corrects it right after hydration. Anything that
 * must be right from the very first paint is styled from `data-season` in CSS instead.
 */
export function useSeason(): Season {
  return useSyncExternalStore(subscribe, readSeason, () => 'summer');
}

/**
 * Keeps the mountain on the calendar while nobody has chosen: a page left open across midnight on the last day of
 * a season wakes up in the new one. One choice from the dial stops this for good.
 */
export function useFollowCalendar() {
  useEffect(() => {
    const check = () => {
      if (storedSeason()) return;
      document.documentElement.dataset.season = seasonNow();
    };

    /* an hour is far more often than a season turns, and costs nothing */
    const timer = setInterval(check, 3600_000);
    check();

    return () => clearInterval(timer);
  }, []);
}
