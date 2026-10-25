import { existsSync } from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { JOBS } from '@/content/jobs';
import {
  SEASON_ART,
  SEASON_SCRIPT,
  SEASONS,
  seasonIndexOn,
  WEATHER_ATLAS,
  seasonOf,
  weatherField,
  weatherKeyframes,
  YEAR_STATES,
  YEAR_TIMELINES,
} from '@/scene/seasons';

const MONTHS: [number, string][] = [
  [0, 'winter'],
  [1, 'winter'],
  [2, 'spring'],
  [4, 'spring'],
  [5, 'summer'],
  [7, 'summer'],
  [8, 'autumn'],
  [10, 'autumn'],
  [11, 'winter'],
];

const THEMES_ON_DISK = Object.values(WEATHER_ATLAS.atlas);

describe('the year behind /cv', () => {
  it.each(MONTHS)('month %i is %s', (month, season) => {
    expect(SEASONS[seasonIndexOn(new Date(2026, month, 15))]).toBe(season);
  });

  it('runs the pre-paint script to the same season as the page', () => {
    const html = { dataset: {} as Record<string, string> };
    runInNewContext(SEASON_SCRIPT, { document: { documentElement: html } });

    expect(html.dataset.yearStart).toBe(String(seasonIndexOn(new Date())));
  });

  it('has a state for the header, every job and the foot, and a timeline per hairline', () => {
    expect(YEAR_STATES).toBe(JOBS.length + 2);
    expect(YEAR_TIMELINES).toHaveLength(YEAR_STATES - 1);
    expect(new Set(YEAR_TIMELINES).size).toBe(YEAR_TIMELINES.length);
  });

  it('turns one season per state, from whichever season the year starts in', () => {
    SEASONS.forEach((start, j) => {
      expect(seasonOf(j, 0)).toBe(start);

      for (let k = 1; k < YEAR_STATES; k++) {
        const before = SEASONS.indexOf(seasonOf(j, k - 1));
        expect(seasonOf(j, k)).toBe(SEASONS[(before + 1) % SEASONS.length]);
      }
    });
  });

  it('ships a grove and a meadow for every season by day and by night', () => {
    SEASONS.forEach(season => {
      (['day', 'night'] as const).forEach(theme => {
        const { grove, meadow } = SEASON_ART[season][theme];
        expect(grove).toMatch(new RegExp(`^grove-${season}-${theme}\\.[0-9a-f]{8}\\.webp$`));
        expect(meadow).toMatch(new RegExp(`^meadow-${season}-${theme}\\.[0-9a-f]{8}\\.webp$`));
        expect(existsSync(path.join(process.cwd(), 'public/seasons', grove))).toBe(true);
        expect(existsSync(path.join(process.cwd(), 'public/seasons', meadow))).toBe(true);
      });
    });
  });

  it('draws the same weather every time, each bit on a path its kind has keyframes for', () => {
    const css = weatherKeyframes();

    SEASONS.forEach(season => {
      const field = weatherField(season);
      expect(field).toEqual(weatherField(season));

      field.forEach(bit => {
        expect(css).toContain(`@keyframes weather-${bit.kind}-${bit.path} `);
        expect(bit.x).toBeGreaterThanOrEqual(0);
        expect(bit.x).toBeLessThan(100);
        expect(bit.phase).toBeLessThanOrEqual(bit.cycle);
      });
    });
  });

  it("draws every bit from its own season's row of the painted kit, in both themes", () => {
    THEMES_ON_DISK.forEach(file =>
      expect(existsSync(path.join(process.cwd(), 'public/seasons', file))).toBe(true)
    );

    SEASONS.forEach(season => {
      const sprites = WEATHER_ATLAS.sprites[season];
      expect(sprites.length).toBeGreaterThan(0);

      weatherField(season).forEach(bit => {
        expect(bit.sprite).toBeGreaterThanOrEqual(0);
        expect(bit.sprite).toBeLessThan(sprites.length);
      });

      sprites.forEach(([x, y, w, h]) => {
        expect(x + w).toBeLessThanOrEqual(WEATHER_ATLAS.size[0]);
        expect(y + h).toBeLessThanOrEqual(WEATHER_ATLAS.size[1]);
        expect(Math.max(w, h)).toBe(WEATHER_ATLAS.sprite);
      });
    });
  });

  it('keeps every cycle long, so the main thread is rarely woken', () => {
    SEASONS.forEach(season => {
      weatherField(season).forEach(bit => expect(bit.cycle).toBeGreaterThanOrEqual(18));
    });
  });
});
