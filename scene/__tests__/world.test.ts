import { describe, expect, it } from 'vitest';
import { JOBS } from '@/content/jobs';
import {
  CAMP_COUNT,
  cameraKnot,
  CAMP_X,
  CAMP_Y,
  climberAt,
  LEGS,
  LEG_WEIGHT,
  LEG_WEIGHTS,
  legWeight,
  SIDES,
  SUMMIT,
  WORLD,
} from '@/scene/world';

describe('world', () => {
  it('places the trailhead and one camp per job, each higher than the last and below the summit', () => {
    expect(CAMP_Y).toHaveLength(JOBS.length + 1);
    expect(CAMP_COUNT).toBe(JOBS.length + 1);
    CAMP_Y.slice(1).forEach((y, i) => expect(y).toBeLessThan(CAMP_Y[i]));
    expect(CAMP_Y[CAMP_Y.length - 1]).toBeGreaterThan(SUMMIT.y);
  });

  it('keeps every camp inside the near layer', () => {
    CAMP_Y.forEach(y => {
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(WORLD.VIEW + WORLD.TRAVEL);
    });
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

  it('makes height follow the legs, with room for a camp between any two', () => {
    const gaps = CAMP_Y.slice(1).map((y, i) => CAMP_Y[i] - y);
    const total = LEG_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
    gaps.forEach((gap, i) => {
      expect(gap / (CAMP_Y[0] - CAMP_Y[CAMP_Y.length - 1])).toBeCloseTo(LEG_WEIGHTS[i] / total, 5);
      expect(gap).toBeGreaterThan(560);
    });
  });

  it('alternates camps either side of the trail', () => {
    SIDES.slice(1).forEach((side, i) => expect(side).toBe(-SIDES[i]));
    CAMP_X.forEach((x, i) => expect(Math.sign(x - WORLD.CENTER_X)).toBe(SIDES[i]));
  });

  it('draws one leg between each pair of camps, sampled camp to camp', () => {
    expect(LEGS).toHaveLength(JOBS.length);
    LEGS.forEach((leg, i) => {
      expect(leg.points).toHaveLength(WORLD.LEG_SAMPLES + 1);
      const [first, last] = [leg.points[0], leg.points[leg.points.length - 1]];
      expect(first[0]).toBeCloseTo(CAMP_X[i], 3);
      expect(first[1]).toBeCloseTo(CAMP_Y[i], 3);
      expect(last[0]).toBeCloseTo(CAMP_X[i + 1], 3);
      expect(last[1]).toBeCloseTo(CAMP_Y[i + 1], 3);
      expect(leg.d.startsWith(`M${CAMP_X[i].toFixed(1)},${CAMP_Y[i].toFixed(1)}`)).toBe(true);
    });
  });

  it('spaces the samples evenly, so the climber keeps a steady pace', () => {
    LEGS.forEach(leg => {
      const steps = leg.points.slice(1).map((p, i) => {
        const [dx, dy] = [p[0] - leg.points[i][0], p[1] - leg.points[i][1]];

        return Math.sqrt(dx * dx + dy * dy);
      });
      const mean = steps.reduce((sum, step) => sum + step, 0) / steps.length;
      steps.forEach(step => expect(Math.abs(step - mean) / mean).toBeLessThan(0.05));
    });
  });

  it('only ever climbs: the trail never turns back downhill', () => {
    LEGS.forEach(leg => {
      leg.points.slice(1).forEach((p, i) => expect(p[1]).toBeLessThanOrEqual(leg.points[i][1]));
    });
  });

  it('interpolates the climber and clamps outside the leg', () => {
    expect(climberAt(0, 0)).toEqual([...LEGS[0].points[0]]);
    expect(climberAt(0, 1)).toEqual([...LEGS[0].points[WORLD.LEG_SAMPLES]]);
    expect(climberAt(0, -1)).toEqual(climberAt(0, 0));
    expect(climberAt(0, 2)).toEqual(climberAt(0, 1));
    const [, y] = climberAt(1, 0.5);
    expect(y).toBeLessThan(CAMP_Y[1]);
    expect(y).toBeGreaterThan(CAMP_Y[2]);
  });

  it('keeps the camera inside its travel for the anchors in use', () => {
    [0.62, 0.7].forEach(anchor => expect(cameraKnot(0, anchor)).toBeLessThanOrEqual(WORLD.TRAVEL));
    expect(cameraKnot(JOBS.length, 0.6)).toBeGreaterThanOrEqual(0);
  });
});
