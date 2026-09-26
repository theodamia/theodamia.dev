import { useEffect, useState, type RefObject } from 'react';

/**
 * True while any part of the element is in the viewport. One observer, no scroll listener and no layout reads, so
 * it costs nothing per frame: the browser reports the crossing and React re-renders only when the answer changes.
 *
 * It starts false, including in the frame before the observer has reported, so a caller should read it as "known
 * to be in view" rather than "not known to be out of it".
 */
export function useInView(target: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = target.current;

    if (!element) return;

    const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting));
    observer.observe(element);

    return () => observer.disconnect();
  }, [target]);

  return inView;
}
