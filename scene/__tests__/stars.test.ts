import { describe, expect, it } from 'vitest';
import { STAR_FIELD, starField, type StarTier } from '@/scene/stars';

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

  it('twinkles every bright star, some mid ones and never a faint one', () => {
    expect(ofTier('bright').every(star => star.twinkle > 0)).toBe(true);
    expect(ofTier('faint').every(star => star.twinkle === 0)).toBe(true);
    stars.forEach(star => expect(star.phase).toBeLessThanOrEqual(star.twinkle));
  });
});
