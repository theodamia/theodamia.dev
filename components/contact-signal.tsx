'use client';

import { useEffect, useRef } from 'react';

/**
 * The easter egg's trigger. When the reader makes contact (copies the address or presses "Email me": anything in
 * the finale marked `data-contact-action`), the finale gets `data-contact` and CSS plays the saucer's visit, once:
 * the attribute stays, so the animation does not run again. Nothing else listens, nothing re-renders.
 */
export function ContactSignal() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finale = marker.current?.closest<HTMLElement>('[data-finale]');
    if (!finale) return;

    const onClick = ({ target }: MouseEvent) => {
      if (!(target instanceof Element)) return;
      if (!target.closest('[data-contact-action]')) return;
      finale.dataset.contact = '';
    };

    finale.addEventListener('click', onClick);

    return () => finale.removeEventListener('click', onClick);
  }, []);

  return <span ref={marker} hidden />;
}
