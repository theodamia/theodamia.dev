import { describe, expect, it } from 'vitest';
import {
  SEASON_BY_MONTH,
  SEASON_SCRIPT,
  SEASONS,
  seasonOfMonth,
  southernHemisphere,
} from '@/lib/season';

describe('seasonOfMonth', () => {
  it('puts the year in four seasons of three months each', () => {
    const north = SEASON_BY_MONTH.map((_, month) => seasonOfMonth(month, false));
    SEASONS.forEach(season => expect(north.filter(s => s === season)).toHaveLength(3));
  });

  it('reads the northern year the way the northern hemisphere does', () => {
    expect(seasonOfMonth(0, false)).toBe('winter'); // January
    expect(seasonOfMonth(3, false)).toBe('spring'); // April
    expect(seasonOfMonth(6, false)).toBe('summer'); // July
    expect(seasonOfMonth(9, false)).toBe('autumn'); // October
  });

  it('turns the year half round below the equator', () => {
    SEASON_BY_MONTH.forEach((_, month) => {
      expect(seasonOfMonth(month, true)).toBe(seasonOfMonth((month + 6) % 12, false));
    });
    expect(seasonOfMonth(6, true)).toBe('winter'); // July in Sydney
  });
});

describe('southernHemisphere', () => {
  /*
   * The test machine's own zone decides the answer, so this asserts the shape rather than the value: whichever it
   * says, it must say the same thing all year, or the mountain would change season on a date that is not one.
   */
  it('gives one answer for a year, whatever zone it is read in', () => {
    const answers = SEASON_BY_MONTH.map((_, month) =>
      southernHemisphere(new Date(2026, month, 15))
    );
    expect(new Set(answers).size).toBe(1);
  });
});

describe('SEASON_SCRIPT', () => {
  /*
   * The script carries its own copy of the month table, because it has to stand alone in <head> before any module
   * loads. This is what keeps the copy honest.
   */
  it('carries the same month table as the module', () => {
    expect(SEASON_SCRIPT).toContain(JSON.stringify(SEASON_BY_MONTH));
  });

  it('falls back to a season rather than leaving the mountain with none', () => {
    expect(SEASON_SCRIPT).toContain("dataset.season='summer'");
    expect(SEASON_SCRIPT).toContain('catch');
  });
});
