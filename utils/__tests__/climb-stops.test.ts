import { describe, expect, it } from 'vitest';
import { stopPositions } from '@/utils/climb-stops';
import { JOBS } from '@/content/jobs';

/** A card standing `top` pixels below the top of the viewport. */
function card(top: number): HTMLElement {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({ top }) as DOMRect;

  return el;
}

const viewport = { wide: true, innerHeight: 800, scrollY: 0 };

describe('stopPositions', () => {
  it('puts the trailhead at the top of the page and one stop per card', () => {
    const stops = stopPositions(
      JOBS.map((_, i) => card(1000 + i * 1400)),
      viewport
    );

    expect(stops).toHaveLength(JOBS.length + 1);
    expect(stops[0]).toBe(0);
  });

  it('keeps the stops strictly increasing, even when two cards measure the same', () => {
    const stops = stopPositions([card(1000), card(1000), card(1000)], viewport);

    stops.slice(1).forEach((stop, i) => expect(stop).toBeGreaterThan(stops[i]));
  });

  it('reaches a camp later on a phone, where the card comes from further down', () => {
    const [, wide] = stopPositions([card(2000)], viewport);
    const [, phone] = stopPositions([card(2000)], { ...viewport, wide: false });

    expect(phone).not.toBe(wide);
  });

  it('measures from the page, not the viewport, so scrolling does not move a stop', () => {
    const [, resting] = stopPositions([card(2000)], viewport);
    const [, scrolled] = stopPositions([card(1400)], { ...viewport, scrollY: 600 });

    expect(scrolled).toBe(resting);
  });
});
