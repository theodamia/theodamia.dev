import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isRevealing, reveal } from '@/lib/theme';

/* the reveal itself belongs to the theme and is tested there; what matters here is which of the two paths is taken */
vi.mock('@/lib/theme', () => ({
  isRevealing: vi.fn(() => false),
  reveal: vi.fn(),
  remember: vi.fn((key: string, value: string) => localStorage.setItem(key, value)),
}));
import {
  SEASON_BY_MONTH,
  SEASON_SCRIPT,
  SEASONS,
  seasonOfMonth,
  southernHemisphere,
  switchSeason,
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

describe('switchSeason', () => {
  const wedge = () => document.createElement('button');

  beforeEach(() => {
    vi.mocked(isRevealing).mockReturnValue(false);
    vi.mocked(reveal).mockReset();
  });

  afterEach(() => {
    delete document.documentElement.dataset.season;
  });

  it('sweeps the page when nothing else is', () => {
    switchSeason(wedge(), 'winter');

    expect(reveal).toHaveBeenCalledTimes(1);
    /* the reveal sets the attribute from inside the transition, so run what it was handed */
    vi.mocked(reveal).mock.calls[0][1]();
    expect(document.documentElement.dataset.season).toBe('winter');
  });

  /*
   * A second choice mid-sweep must not start another. Starting one skips the first, which finishes it at once and
   * snaps the mountain to the season just left; the sweep shows the live page, so it carries the new one instead.
   */
  it('joins a sweep already running instead of cutting it short', () => {
    vi.mocked(isRevealing).mockReturnValue(true);

    switchSeason(wedge(), 'autumn');

    expect(reveal).not.toHaveBeenCalled();
    expect(document.documentElement.dataset.season).toBe('autumn');
  });

  it('remembers the choice either way, so the calendar stops deciding', () => {
    vi.mocked(isRevealing).mockReturnValue(true);
    switchSeason(wedge(), 'spring');

    expect(localStorage.getItem('season')).toBe('spring');
  });
});
