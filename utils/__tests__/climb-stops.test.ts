import { describe, expect, it } from 'vitest';
import { cardLaneGap, stopPositions } from '@/utils/climb-stops';
import { JOBS } from '@/content/jobs';

/** A card standing `top` pixels below the top of the viewport, `left` to `left + width` across it. */
function card(top: number, left = 0, width = 400): HTMLElement {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({ top, left, width, right: left + width }) as DOMRect;

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

  it('brings every card to the same line, whatever its camp', () => {
    const stops = stopPositions([card(2000), card(5000)], viewport);

    expect(stops[2] - stops[1]).toBe(3000);
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

describe('cardLaneGap', () => {
  it('finds the middle of the gap between the two lanes', () => {
    const cards = [card(0, 100, 400), card(0, 900, 400), card(0, 120, 360)];

    /* the left lane ends at 500 and the right begins at 900 */
    expect(cardLaneGap(cards, 1440)).toBe(700);
  });

  it('follows a lopsided gap, as when the altimeter pads the right lane', () => {
    const even = cardLaneGap([card(0, 120, 400), card(0, 920, 400)], 1440);
    const padded = cardLaneGap([card(0, 120, 400), card(0, 840, 400)], 1440);

    expect(padded).toBeLessThan(even!);
  });

  it('has no gap when the cards share one lane', () => {
    expect(cardLaneGap([card(0, 16, 358), card(0, 16, 358)], 390)).toBeNull();
    expect(cardLaneGap([], 1440)).toBeNull();
  });
});
