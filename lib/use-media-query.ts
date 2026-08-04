'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Media query as reactive state. Server-renders as `false`, which keeps the desktop
 * layout as the SSR default and lets phones swap in after hydration — the phone-only
 * Fig. 1 ladder needs a real mount/unmount, not `display: none`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
