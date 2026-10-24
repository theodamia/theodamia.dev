import { REDUCED_MOTION_QUERY } from '@/constants';

/**
 * Swaps two things on the page and lets the browser carry one into the other: a view transition with the same
 * name on both, so the eye follows where it went. Without view transitions, or with reduced motion, it simply
 * swaps. The name is only set for the length of the transition, because the day/night reveal uses view
 * transitions too, and a named element would step out of its circle.
 *
 * `to` is read after the swap, since what the thing turns into may only exist once it has.
 */
export function morph(
  from: HTMLElement | null,
  to: () => HTMLElement | null,
  swap: () => void,
  name: string
): void {
  if (
    !from ||
    typeof document.startViewTransition !== 'function' ||
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  ) {
    swap();

    return;
  }

  from.style.viewTransitionName = name;
  const transition = document.startViewTransition(() => {
    from.style.viewTransitionName = '';
    swap();
    const target = to();

    if (target) {
      target.style.viewTransitionName = name;
    }
  });
  void transition.finished.finally(() => {
    const target = to();

    if (target) {
      target.style.viewTransitionName = '';
    }
  });
}
