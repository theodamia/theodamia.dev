import { useEffect, useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY } from '@/constants';
import { applyView, readView, storedView, type View } from '@/lib/view';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-view'] });

  return () => observer.disconnect();
}

/**
 * The view on <html>. As with the theme, the server does not know it (the script in <head> sets it before the
 * first paint), so the server render says climb and the client corrects it right after hydration. Anything that
 * must be right from the first paint is styled with the `timeline:` variant instead, and anything that acts on
 * the view outside React reads the attribute itself.
 */
export function useView(): View {
  return useSyncExternalStore(subscribe, readView, () => 'climb');
}

/** Until someone picks a view, follow the system: asking for less motion asks for the plain reading. */
export function useFollowSystemView() {
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);

    const follow = () => {
      if (storedView()) return;
      applyView(query.matches ? 'timeline' : 'climb');
    };

    query.addEventListener('change', follow);

    return () => query.removeEventListener('change', follow);
  }, []);
}
