import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { FLAG, FLATS, type Theme } from '@/scene/flats';

const PUBLIC = path.resolve(__dirname, '../../public/scene');
const THEMES: Theme[] = ['day', 'night'];
/** What one visit downloads for the scene, per theme: the other theme loads only when idle. */
const BUDGET = { DESKTOP: 1_500_000, PHONE: 800_000 };
const bytes = (file?: string) => (file ? statSync(path.join(PUBLIC, file)).size : 0);

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
  });

  it('gives every ridge ahead a far version, and the far world and the trailhead none', () => {
    /* the camera starts at the trailhead, so the village is never seen from further than its stop */
    for (const flat of FLATS) {
      expect(Boolean(flat.art.day.far), flat.id).toBe(flat.kind === 'camp' && flat.camp !== 0);
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
      const flag = bytes(FLAG.art[theme].pole) + bytes(FLAG.art[theme].cloth);
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
