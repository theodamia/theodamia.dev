import { useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY } from '@/constants';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
}

/** True when the visitor asked for less motion. False on the server, so motion is the default render. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}
