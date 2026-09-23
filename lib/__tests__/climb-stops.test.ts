import { describe, expect, it } from 'vitest';
import { DOCK_PROBE_RATIO } from '@/constants';
import { anchorJobIndex, stopPositions } from '@/lib/climb-stops';
import { JOBS } from '@/lib/jobs';

/** A card standing `top` pixels below the top of the viewport. */
function card(top: number, job?: number): HTMLElement {
  const el = document.createElement('div');
  if (job !== undefined) el.dataset.job = String(job);
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

describe('anchorJobIndex', () => {
  const list = (tops: number[]) => {
    const el = document.createElement('div');
    tops.forEach((top, job) => el.append(card(top, job)));

    return el;
  };

  it('is the last card that has passed the probe line', () => {
    expect(anchorJobIndex(list([-500, -100, 600]), DOCK_PROBE_RATIO)).toBe(1);
  });

  it('is nothing while the reader is still above the first card', () => {
    expect(anchorJobIndex(list([900, 1600]), DOCK_PROBE_RATIO)).toBeNull();
    expect(anchorJobIndex(null, DOCK_PROBE_RATIO)).toBeNull();
  });
});
