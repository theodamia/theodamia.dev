import { describe, expect, it } from 'vitest';
import { THEME_REVEAL } from '@/constants';
import { timeAtProgress } from '@/utils/time-at-progress';

const EASE = THEME_REVEAL.EASE;

/** The forward curve, sampled finely: the progress reached at a share of the time. */
function progressAt(time: number): number {
  const [x1, y1, x2, y2] = EASE;
  const at = (p1: number, p2: number, s: number) =>
    3 * (1 - s) ** 2 * s * p1 + 3 * (1 - s) * s * s * p2 + s ** 3;
  let s = 0;
  while (s < 1 && at(x1, x2, s) < time) s += 1e-5;
  return at(y1, y2, s);
}

describe('timeAtProgress', () => {
  it('starts at the start and ends at the end, clamping beyond them', () => {
    expect(timeAtProgress(EASE, 0)).toBeCloseTo(0, 5);
    expect(timeAtProgress(EASE, 1)).toBeCloseTo(1, 5);
    expect(timeAtProgress(EASE, -0.5)).toBeCloseTo(0, 5);
    expect(timeAtProgress(EASE, 2)).toBeCloseTo(1, 5);
  });

  it('never goes back in time as progress grows', () => {
    const times = Array.from({ length: 21 }, (_, i) => timeAtProgress(EASE, i / 20));
    times.slice(1).forEach((time, i) => expect(time).toBeGreaterThan(times[i]));
  });

  it('inverts the curve: the progress at the time it returns is the progress asked for', () => {
    [0.1, 0.35, 0.6, 0.9].forEach(progress => {
      expect(progressAt(timeAtProgress(EASE, progress))).toBeCloseTo(progress, 3);
    });
  });

  it('is an ease-out: half the way is covered in well under half the time', () => {
    expect(timeAtProgress(EASE, 0.5)).toBeLessThan(0.35);
  });
});
