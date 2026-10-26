import { existsSync } from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import {
  CLOUD_LINE,
  DAYPART_SCRIPT,
  DAYPARTS,
  dayPartAt,
  RANGE_ART,
  RANGE_RISE,
  SAUCER,
  SUMMIT,
} from '@/scene/about';

const HOURS: [number, string][] = [
  [0, 'night'],
  [4, 'night'],
  [5, 'morning'],
  [9, 'morning'],
  [10, 'midday'],
  [15, 'midday'],
  [16, 'evening'],
  [19, 'evening'],
  [20, 'night'],
  [23, 'night'],
];

const onDisk = (file: string) => existsSync(path.join(process.cwd(), 'public/about', file));

describe('/about as numbers', () => {
  it.each(HOURS)('%i o’clock is %s', (hour, part) => {
    expect(dayPartAt(hour)).toBe(part);
  });

  it.each(HOURS)('the pre-paint script agrees at %i o’clock', (hour, part) => {
    const html = { dataset: {} as Record<string, string> };
    runInNewContext(DAYPART_SCRIPT, {
      document: { documentElement: html },
      Date: class {
        getHours() {
          return hour;
        }
      },
    });

    expect(html.dataset.daypart).toBe(part);
  });

  it('names every part of the day the script can write', () => {
    for (let hour = 0; hour < 24; hour++) {
      expect(DAYPARTS).toContain(dayPartAt(hour));
    }
  });

  it('has the range in its three lights and the saucer in both themes, all on disk', () => {
    for (const file of [...Object.values(RANGE_ART), SAUCER.day, SAUCER.night]) {
      expect(onDisk(file)).toBe(true);
    }
  });

  it('measured the range: its summit stands above its cloud line', () => {
    expect(SUMMIT).toBeGreaterThan(0);
    expect(SUMMIT).toBeLessThan(CLOUD_LINE);
    expect(RANGE_RISE).toBeGreaterThan(0);
  });

  it('found the saucer’s running lights inside its box', () => {
    expect(SAUCER.lights.length).toBeGreaterThanOrEqual(3);

    for (const [x, y] of SAUCER.lights) {
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(1);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(1);
    }
  });
});
