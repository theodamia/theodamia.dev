import { describe, expect, it } from 'vitest';
import { JOBS } from '@/content/jobs';
import { CAMP_COUNT, LEG_WEIGHT, LEG_WEIGHTS, legWeight, railShare, SIDES } from '@/scene/world';

describe('world', () => {
  it('has a stop for the trailhead and one per job', () => {
    expect(CAMP_COUNT).toBe(JOBS.length + 1);
  });

  it('sizes legs by tenure, compressed: longer stays walk further, within limits', () => {
    expect(legWeight(0)).toBe(LEG_WEIGHT.MIN);
    expect(legWeight(40)).toBe(LEG_WEIGHT.MAX);
    expect(legWeight(4)).toBeGreaterThan(legWeight(1));
    /* eight times the tenure is nowhere near eight times the road */
    expect(legWeight(4) / legWeight(0.5)).toBeLessThan(2);
    expect(LEG_WEIGHTS).toHaveLength(JOBS.length);
    expect(LEG_WEIGHTS[0]).toBe(LEG_WEIGHT.INTRO);
  });

  it('alternates the cards either side of the climb', () => {
    expect(SIDES).toHaveLength(CAMP_COUNT);
    SIDES.slice(1).forEach((side, i) => expect(side).toBe(-SIDES[i]));
  });

  it('maps the climb onto the altimeter: trailhead at the foot, room above the last camp', () => {
    expect(railShare(0, 0)).toBe(1);
    const marks = Array.from({ length: CAMP_COUNT }, (_, camp) => railShare(camp, 0));
    marks.slice(1).forEach((mark, i) => expect(mark).toBeLessThan(marks[i]));
    /* the present camp stops short of the summit mark */
    expect(marks[marks.length - 1]).toBeGreaterThan(0);
    expect(marks[marks.length - 1]).toBeLessThan(0.1);
  });

  it('moves the needle by leg weight, so a leg ends exactly where the next begins', () => {
    LEG_WEIGHTS.forEach((_, leg) => {
      expect(railShare(leg, 1)).toBeCloseTo(railShare(leg + 1, 0), 10);
      expect(railShare(leg, 0.5)).toBeCloseTo((railShare(leg, 0) + railShare(leg, 1)) / 2, 10);
    });
  });
});
