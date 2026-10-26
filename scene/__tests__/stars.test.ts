import { describe, expect, it } from 'vitest';
import {
  STAR_FIELD,
  starField,
  TWINKLE_DEPTHS,
  twinkleKeyframes,
  twinkleLevel,
  type StarTier,
} from '@/scene/stars';

const stars = starField();
const ofTier = (tier: StarTier) => stars.filter(star => star.tier === tier);

describe('starField', () => {
  it('is deterministic, so server and browser place the same stars', () => {
    expect(starField()).toEqual(stars);
  });

  it('fills most of its grid, in the top of the sky only', () => {
    const cells = STAR_FIELD.COLUMNS * STAR_FIELD.ROWS;
    expect(stars.length).toBeGreaterThan(cells * 0.7);
    expect(stars.length).toBeLessThanOrEqual(cells);
    stars.forEach(star => {
      expect(star.x).toBeGreaterThan(0);
      expect(star.x).toBeLessThan(100);
      expect(star.y).toBeGreaterThan(0);
      expect(star.y).toBeLessThan(STAR_FIELD.SKY_SHARE * 100);
    });
  });

  it('has a few bright stars among many faint ones', () => {
    expect(ofTier('bright').length).toBeGreaterThan(0);
    expect(ofTier('bright').length).toBeLessThan(ofTier('mid').length);
    expect(ofTier('mid').length).toBeLessThan(ofTier('faint').length);
  });

  it('brings the brightest out first and the faintest last', () => {
    const lags = (tier: StarTier) => ofTier(tier).map(star => star.lag);
    expect(Math.max(...lags('bright'))).toBeLessThan(Math.min(...lags('mid')));
    expect(Math.max(...lags('mid'))).toBeLessThan(Math.min(...lags('faint')));
    expect(Math.max(...lags('faint'))).toBeLessThanOrEqual(STAR_FIELD.LAG_MAX_MS);
  });

  it('twinkles every bright and mid star and some of the faint ones, each to its own beat', () => {
    expect([...ofTier('bright'), ...ofTier('mid')].every(star => star.twinkle > 0)).toBe(true);
    const faint = ofTier('faint').filter(star => star.twinkle > 0).length;
    expect(faint).toBeGreaterThan(0);
    expect(faint).toBeLessThan(ofTier('faint').length);
    stars.forEach(star => expect(star.phase).toBeLessThanOrEqual(star.twinkle));
    expect(new Set(stars.map(star => star.twinkle.toFixed(2))).size).toBeGreaterThan(
      stars.length / 2
    );
  });

  it('twinkles harder low in the sky, where the light crosses more air, and fainter stars harder', () => {
    const mean = (list: number[]) => list.reduce((sum, value) => sum + value, 0) / list.length;
    const faint = ofTier('faint');
    const middle = STAR_FIELD.SKY_SHARE * 50;
    expect(mean(faint.filter(star => star.y > middle).map(star => star.depth))).toBeGreaterThan(
      mean(faint.filter(star => star.y < middle).map(star => star.depth))
    );
    expect(mean(faint.map(star => star.depth))).toBeGreaterThan(
      mean(ofTier('bright').map(star => star.depth))
    );
    stars.forEach(star => expect(star.depth).toBeLessThan(1));
  });

  it('tints most stars white, some blue and a few warm', () => {
    const count = (tint: string) => stars.filter(star => star.tint === tint).length;
    expect(count('white')).toBeGreaterThan(count('cool'));
    expect(count('cool')).toBeGreaterThan(count('warm'));
    expect(count('warm')).toBeGreaterThan(0);
  });

  it('keeps each twinkle cycle long, so the browser seldom has to wake for a cycle ending', () => {
    stars
      .filter(star => star.twinkle)
      .forEach(star => expect(star.twinkle).toBeGreaterThanOrEqual(12));
  });

  it('writes the twinkle as plain-number keyframes, deeper at each level, with rays for the brightest', () => {
    const css = twinkleKeyframes();
    expect(twinkleKeyframes()).toBe(css);
    expect(css).not.toContain('var(');

    const lowest = TWINKLE_DEPTHS.map((_, i) => {
      const block = css.match(new RegExp(`@keyframes scintillate-${i + 1}\\{(.*?)\\}\\}`))![1];
      const values = [...block.matchAll(/opacity:([\d.]+)/g)].map(match => Number(match[1]));
      expect(values.length).toBeGreaterThan(30);
      values.forEach(value => expect(value).toBeGreaterThanOrEqual(0));

      return Math.min(...values);
    });
    expect(lowest[0]).toBeGreaterThan(lowest[1]);
    expect(lowest[1]).toBeGreaterThan(lowest[2]);
    expect(css).toContain('@keyframes beam');
  });

  it('puts every star on its nearest twinkle depth', () => {
    expect(twinkleLevel(0.1)).toBe(1);
    expect(twinkleLevel(0.5)).toBe(2);
    expect(twinkleLevel(0.9)).toBe(3);
    const used = new Set(stars.filter(star => star.twinkle).map(star => twinkleLevel(star.depth)));
    expect(used.size).toBe(TWINKLE_DEPTHS.length);
  });
});
