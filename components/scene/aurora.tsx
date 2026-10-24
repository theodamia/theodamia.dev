'use client';

import { useEffect, useEffectEvent, useRef } from 'react';
import { readTheme } from '@/lib/theme';
import { AURORA, artUrl } from '@/scene/flats';

/** Only a pointer that can hover calls the aurora; a phone never downloads it. */
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';
/** The page over the scene that is not sky: cards and other surfaces (`data-surface`), and every control. */
const PAGE_SURFACE = 'a, button, [data-card], [data-surface]';
/** How far the aurora leans toward the pointer, as a share of the pointer's distance from the middle. */
const LEAN = 0.08;
/** How long it lingers after the pointer leaves the sky before it starts to fade. */
const LINGER_MS = 2400;
/** Safari has no idle callback: a short timeout stands in. */
const IDLE_FALLBACK_MS = 1500;

type IdleWindow = Window & { requestIdleCallback?: (callback: () => void) => number };

type AuroraProps = {
  /** Whether a point on the screen shows the sky right now, not a painting (the stage knows: `skyAt`). */
  isSky: (x: number, y: number) => boolean;
};

/**
 * Whether the pointer is over the page rather than the scene: a card, a control, or words floating over the scene
 * (the hero's). Words count only where they are drawn, not across the empty rest of their line, so the sky beside
 * a heading is still sky.
 */
function overPage(target: EventTarget | null, x: number, y: number): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest(PAGE_SURFACE)) return true;
  const range = document.createRange();

  return Array.from(target.childNodes).some(node => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return false;
    range.selectNodeContents(node);

    return Array.from(range.getClientRects()).some(
      box => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom
    );
  });
}

/**
 * The aurora: by night, while the pointer is over the sky, it glows in across the top of it, leans a little toward
 * the pointer and ripples slowly; when the pointer leaves it lingers, then fades. Two painted layers moving against
 * each other (`.aurora` in globals.css), on the compositor, paused whenever it is not showing.
 *
 * "Over the sky" means the open sky itself: not the mountains, ridges or cloud sea (the stage tells, from each
 * painting's skyline), and not the page laid over the scene. It is asked once per frame while the pointer moves;
 * scrolling under a still pointer changes nothing until it moves again.
 *
 * It lives in the sky, behind the summit and the clouds, so the mountains stand in front of it and the stars show
 * through. Its paintings are fetched only on a screen with a hovering pointer, when the browser is idle at night
 * (or at the first hover), and each shows once it is decoded.
 */
export function Aurora({ isSky }: AuroraProps) {
  const root = useRef<HTMLDivElement>(null);
  const skyAt = useEffectEvent((x: number, y: number) => isSky(x, y));

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

        const { clientX: x, clientY: y } = event;

        if (readTheme() !== 'dark' || overPage(event.target, x, y) || !skyAt(x, y)) {
          fade();

          return;
        }

        load();
        window.clearTimeout(linger);
        linger = 0;
        el.dataset.lit = '';
        el.style.setProperty('--lean', `${((x - window.innerWidth / 2) * LEAN).toFixed(1)}px`);
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
