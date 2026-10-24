'use client';

import { useEffect, useRef } from 'react';
import { readTheme } from '@/lib/theme';
import { AURORA, artUrl } from '@/scene/flats';

/** Only a pointer that can hover calls the aurora; a phone never downloads it. */
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';
/** The top of the screen that counts as sky, as a share of its height. */
const SKY_SHARE = 0.42;
/** How far the aurora leans toward the pointer, as a share of the pointer's distance from the middle. */
const LEAN = 0.08;
/** How long it lingers after the pointer leaves the sky before it starts to fade. */
const LINGER_MS = 2400;
/** Safari has no idle callback: a short timeout stands in. */
const IDLE_FALLBACK_MS = 1500;

type IdleWindow = Window & { requestIdleCallback?: (callback: () => void) => number };

/**
 * The aurora: by night, while the pointer is over the sky, it glows in across the top of it, leans a little toward
 * the pointer and ripples slowly; when the pointer leaves it lingers, then fades. Two painted layers moving against
 * each other (`.aurora` in globals.css), on the compositor, paused whenever it is not showing.
 *
 * It lives in the sky, behind the summit and the clouds, so the mountains stand in front of it and the stars show
 * through. Its paintings are fetched only on a screen with a hovering pointer, when the browser is idle at night
 * (or at the first hover), and each shows once it is decoded.
 */
export function Aurora() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia(HOVER_QUERY).matches) return;
    const idle = window as IdleWindow;
    let frame = 0;
    let linger = 0;
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      el.querySelectorAll<HTMLImageElement>('img[data-src]').forEach(img => {
        img.src = img.dataset.src!;
        void img.decode().then(
          () => {
            img.dataset.ready = '';
          },
          () => undefined
        );
      });
    };

    const warm = () => {
      if (readTheme() !== 'dark') return;

      if (idle.requestIdleCallback) {
        idle.requestIdleCallback(load);
      } else {
        window.setTimeout(load, IDLE_FALLBACK_MS);
      }
    };

    const fade = () => {
      if (el.dataset.lit === undefined || linger) return;
      linger = window.setTimeout(() => {
        delete el.dataset.lit;
        linger = 0;
      }, LINGER_MS);
    };

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;

        if (readTheme() !== 'dark' || event.clientY > window.innerHeight * SKY_SHARE) {
          fade();

          return;
        }

        load();
        window.clearTimeout(linger);
        linger = 0;
        el.dataset.lit = '';
        el.style.setProperty(
          '--lean',
          `${((event.clientX - window.innerWidth / 2) * LEAN).toFixed(1)}px`
        );
      });
    };

    warm();
    const themes = new MutationObserver(warm);
    themes.observe(document.documentElement, { attributeFilter: ['data-theme'] });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', fade);

    return () => {
      themes.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', fade);
      cancelAnimationFrame(frame);
      window.clearTimeout(linger);
    };
  }, []);

  return (
    <div ref={root} className='aurora'>
      {AURORA.map((layer, i) => (
        <img
          key={layer.art}
          alt=''
          data-layer={i + 1}
          data-src={artUrl(layer.art)}
          className='aurora-curtain'
          decoding='async'
          draggable={false}
        />
      ))}
    </div>
  );
}
