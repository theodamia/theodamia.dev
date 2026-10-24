import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { BACKDROP, CLOUDS, FLAG, FLATS, type Theme } from '@/scene/flats';

const PUBLIC = path.resolve(__dirname, '../../public/scene');
const THEMES: Theme[] = ['day', 'night'];
/** What one visit downloads for the scene, per theme: the other theme loads only when idle. */
const BUDGET = { DESKTOP: 1_500_000, PHONE: 800_000 };
const bytes = (file?: string) => (file ? statSync(path.join(PUBLIC, file)).size : 0);

/**
 * A shipped tile, decoded, as the steps between neighbouring columns (premultiplied grey plus alpha, averaged down
 * the column): `steps[x]` is the change from column x - 1 to x.
 */
async function columnSteps(file: string) {
  const { data, info } = await sharp(path.join(PUBLIC, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const value = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    const a = data[i + 3] / 255;

    return { grey: (0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]) * a, a: data[i + 3] };
  };

  const difference = (x0: number, x1: number) => {
    let sum = 0;

    for (let y = 0; y < height; y++) {
      const [p, q] = [value(x0, y), value(x1, y)];
      sum += Math.abs(p.grey - q.grey) + Math.abs(p.a - q.a);
    }

    return sum / height;
  };

  return { width, difference };
}

describe('painted flats', () => {
  it('ships every file the manifest names, in both themes', () => {
    for (const flat of FLATS) {
      for (const theme of THEMES) {
        for (const file of Object.values(flat.art[theme])) {
          expect(existsSync(path.join(PUBLIC, file)), file).toBe(true);
        }
      }
    }

    for (const theme of THEMES) {
      expect(existsSync(path.join(PUBLIC, FLAG.art[theme].pole))).toBe(true);
      expect(existsSync(path.join(PUBLIC, FLAG.art[theme].cloth))).toBe(true);
    }

    /* the sky's clouds: painted, each with a night picture of the same outline */
    expect(CLOUDS.length).toBeGreaterThanOrEqual(2);

    for (const cloud of CLOUDS) {
      for (const theme of THEMES) {
        expect(existsSync(path.join(PUBLIC, cloud.art[theme])), cloud.art[theme]).toBe(true);
      }
    }
  });

  it('gives every ridge ahead a far version, and the far world and the trailhead none', () => {
    /* the camera starts at the trailhead, so the village is never seen from further than its stop */
    for (const flat of FLATS) {
      expect(Boolean(flat.art.day.far), flat.id).toBe(flat.kind === 'camp' && flat.camp !== 0);
    }
  });

  it('repeats the backdrop without a seam, and overlaps its copies on identical paint', async () => {
    const tile = BACKDROP.tile!;
    expect(BACKDROP.boxPhone).toEqual(BACKDROP.box);

    for (const theme of THEMES) {
      for (const file of [BACKDROP.art[theme].near, BACKDROP.art[theme].nearPhone]) {
        const { width, difference } = await columnSteps(file);
        /* the same share of bleed in both files: the phone's is 7 px on a 1456 px period */
        const bleed = Math.round((width * tile.bleed) / (tile.period + tile.bleed));
        const period = width - bleed;
        const ordinary = Array.from({ length: period - 1 }, (_, x) => difference(x, x + 1)).sort(
          (a, b) => a - b
        );
        /* a joined seam is one more ordinary column; the unjoined one stepped 7 times the 99th percentile */
        const p99 = ordinary[Math.floor(ordinary.length * 0.99)];

        /* from the period's last column to its first, as the next copy lays it */
        expect(difference(period - 1, 0), `${file} seam`).toBeLessThanOrEqual(p99);

        for (let x = 0; x < bleed; x++) {
          expect(difference(period + x, x), `${file} bleed column ${x}`).toBeLessThan(4);
        }
      }
    }
  });

  it('keeps the phone version inside the desktop one', () => {
    for (const flat of FLATS) {
      const [x, y, w, h] = flat.box;
      const [px, py, pw, ph] = flat.boxPhone;
      expect(px).toBeGreaterThanOrEqual(x - 0.01);
      expect(px + pw).toBeLessThanOrEqual(x + w + 0.01);
      expect([py, ph]).toEqual([y, h]);
    }
  });

  it('stays within the scene budget for a visit, per theme and device', () => {
    for (const theme of THEMES) {
      const flag =
        bytes(FLAG.art[theme].pole) +
        bytes(FLAG.art[theme].cloth) +
        CLOUDS.reduce((sum, cloud) => sum + bytes(cloud.art[theme]), 0);
      const desktop = FLATS.reduce(
        (sum, flat) => sum + bytes(flat.art[theme].near) + bytes(flat.art[theme].far),
        flag
      );
      const phone = FLATS.reduce(
        (sum, flat) => sum + bytes(flat.art[theme].nearPhone) + bytes(flat.art[theme].farPhone),
        flag
      );
      expect(desktop, `${theme} desktop`).toBeLessThanOrEqual(BUDGET.DESKTOP);
      expect(phone, `${theme} phone`).toBeLessThanOrEqual(BUDGET.PHONE);
    }
  });
});
