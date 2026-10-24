import { describe, expect, it } from 'vitest';
import { snowField, snowKeyframes, SNOW_PATHS, type SnowDepth } from '@/scene/snow';

const flakes = snowField();
const ofDepth = (depth: SnowDepth) => flakes.filter(flake => flake.depth === depth);
const mean = (list: number[]) => list.reduce((sum, value) => sum + value, 0) / list.length;

describe('snowField', () => {
  it('draws the same snow twice, so the server and the browser agree', () => {
    expect(snowField()).toEqual(flakes);
    expect(snowKeyframes()).toBe(snowKeyframes());
  });

  it('falls at three depths: near flakes bigger, brighter and quicker, far ones the most', () => {
    const [far, mid, near] = (['far', 'mid', 'near'] as SnowDepth[]).map(ofDepth);
    expect(far.length).toBeGreaterThan(mid.length);
    expect(mid.length).toBeGreaterThan(near.length);
    expect(mean(near.map(f => f.size))).toBeGreaterThan(mean(mid.map(f => f.size)));
    expect(mean(mid.map(f => f.size))).toBeGreaterThan(mean(far.map(f => f.size)));
    expect(mean(near.map(f => f.cycle))).toBeLessThan(mean(far.map(f => f.cycle)));
    expect(mean(near.map(f => f.alpha))).toBeGreaterThan(mean(far.map(f => f.alpha)));
  });

  it('keeps a thicker fall apart for the summit, at every depth', () => {
    (['far', 'mid', 'near'] as SnowDepth[]).forEach(depth => {
      expect(ofDepth(depth).some(flake => flake.squall)).toBe(true);
      expect(ofDepth(depth).some(flake => !flake.squall)).toBe(true);
    });
  });

  it('keeps each cycle long, so the browser seldom wakes for a cycle ending', () => {
    flakes.forEach(flake => {
      expect(flake.cycle).toBeGreaterThanOrEqual(18);
      expect(flake.phase).toBeLessThanOrEqual(flake.cycle);
      expect(flake.path).toBeGreaterThanOrEqual(1);
      expect(flake.path).toBeLessThanOrEqual(SNOW_PATHS);
    });
  });

  it('writes the fall as plain-number keyframes that drift with the wind, left to right', () => {
    const css = snowKeyframes();
    expect(css).not.toContain('var(');
    expect(css).not.toMatch(/NaN|Infinity/);

    (['far', 'mid', 'near'] as SnowDepth[]).forEach(depth => {
      for (let path = 1; path <= SNOW_PATHS; path++) {
        const block = css.match(new RegExp(`@keyframes snow-${depth}-${path}\\{(.*?)\\}\\}`))![1];
        const stops = [...block.matchAll(/translate:(-?[\d.]+)px (-?[\d.]+)vh/g)].map(m => [
          Number(m[1]),
          Number(m[2]),
        ]);
        /* starts above the screen and ends below it, further right than it began */
        expect(stops[0][1]).toBeLessThan(0);
        expect(stops.at(-1)![1]).toBeGreaterThan(100);
        expect(stops.at(-1)![0]).toBeGreaterThan(stops[0][0]);
      }
    });
  });
});
