'use client';

import { useEffect, useRef } from 'react';
import { REDUCED_MOTION_QUERY, REVEAL } from '@/constants';

/**
 * Fades an element up into place the first time it scrolls into view.
 * Returns a ref to attach directly to the element — no wrapper, so grid spans survive.
 *
 * The motion is a CSS transition rather than a JS-driven one: a frame-driven animation
 * that never gets its frames (background tab, throttled renderer) leaves the content
 * stuck at opacity 0 and an unreadable page is a worse outcome than a missing fade.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    // Anything already on screen is left alone — only content scrolled to is revealed.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.classList.add(REVEAL.CLASS);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(REVEAL.VISIBLE_CLASS);
          observer.unobserve(entry.target);
        });
      },
      { threshold: REVEAL.THRESHOLD, rootMargin: REVEAL.ROOT_MARGIN }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
