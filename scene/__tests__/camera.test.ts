import { describe, expect, it } from 'vitest';
import {
  anchorOf,
  ease,
  FIRST_POSE,
  flagLayout,
  HEADROOM,
  maxScale,
  poseAt,
  stageScale,
  type View,
} from '@/scene/camera';
import { campFlat, FLATS } from '@/scene/flats';
import { CAMP_COUNT, SIDES } from '@/scene/world';

const WIDE: View = { width: 1440, height: 900, wide: true, laneGap: 720 };
const PHONE: View = { width: 390, height: 844, wide: false, laneGap: null };
const LAST = CAMP_COUNT - 1;

/** Where a flat's anchor (its camp) lands on screen in a pose. */
function anchorOnScreen(id: string, u: number, view: View) {
  const flat = FLATS.find(item => item.id === id)!;
  const pose = poseAt(u, view);
  const at = pose.flats.find(item => item.id === id)!;
  const v = stageScale(view.width, view.height);
  const [ax, ay] = anchorOf(flat);
  const k = at.scale * maxScale(flat) * v;

  return { x: at.x + k * (ax - flat.box[0]), y: at.y + k * (ay - flat.box[1]), pose, at, v };
}

describe('camera', () => {
  it('has a painted ridge for every camp, on the side its card is not', () => {
    for (let k = 0; k < CAMP_COUNT; k++) {
      const flat = campFlat(k);
      expect(flat, `camp ${k}`).toBeDefined();
      expect(flat?.camp).toBe(k);
      expect(flat?.side).toBe(k === 0 ? 0 : SIDES[k]);
    }
  });

  it('brings each camp to its line, at scale 1, beside its card at its stop', () => {
    for (let k = 0; k < CAMP_COUNT; k++) {
      for (const view of [WIDE, PHONE]) {
        const { x, y, pose, at, v } = anchorOnScreen(campFlat(k)!.id, k, view);
        const side = k === 0 ? 0 : SIDES[k];
        expect(at.scale).toBeCloseTo(1 / HEADROOM, 5);
        expect(at.opacity).toBe(1);
        expect(at.near).toBe(1);
        expect(y).toBeCloseTo(view.height * (view.wide ? 0.58 : 0.42), 3);
        expect(x).toBeCloseTo(pose.focus.x + side * 150 * v, 3);
      }
    }
  });

  it('never writes a scale above 1, so no painting is ever enlarged past its pixels', () => {
    for (let u = 0; u <= LAST; u += 0.05) {
      for (const at of poseAt(u, WIDE).flats) {
        expect(at.scale).toBeLessThanOrEqual(1 + 1e-9);
      }
    }
  });

  it('brings the peak closer all the way up, to 1.6 times, and never reaches it', () => {
    const peak = (u: number) => poseAt(u, WIDE).flats.find(at => at.id === 'peak')!.scale * 1.6;
    expect(peak(0)).toBeCloseTo(1, 5);
    expect(peak(LAST)).toBeCloseTo(1.6, 5);

    for (let u = 0.1; u <= LAST; u += 0.1) {
      expect(peak(u)).toBeGreaterThan(peak(u - 0.1));
    }

    const far = poseAt(LAST, WIDE).flats.find(at => at.id === 'far')!;
    expect(far.scale).toBeCloseTo(1, 5);
  });

  it('shows ridges far ahead small and hazy, then drops them once passed', () => {
    const at = (id: string, u: number) => poseAt(u, WIDE).flats.find(item => item.id === id)!;
    /* from the trailhead the next camp is visible in its far version, the last camp not yet */
    expect(at('camp-2015', 0).opacity).toBe(1);
    expect(at('camp-2015', 0).near).toBeLessThan(1);
    expect(at('camp-2015', 0).far).toBe(1);
    expect(at(campFlat(LAST)!.id, 0).opacity).toBe(0);

    /* a passed camp is fading by the next stop (sliding out below) and gone by the one after */
    for (let k = 0; k < LAST; k++) {
      expect(at(campFlat(k)!.id, k + 1).opacity, `camp ${k}`).toBeLessThan(1);

      if (k + 2 <= LAST) {
        expect(at(campFlat(k)!.id, k + 2).opacity, `camp ${k}`).toBe(0);
      }
    }
  });

  it('arrives at each stop at half speed rather than stopping dead', () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect((ease(1) - ease(0.999)) / 0.001).toBeCloseTo(0.5, 2);
    expect((ease(0.001) - ease(0)) / 0.001).toBeCloseTo(0.5, 2);
  });

  it('starts the focus right of centre on wide screens and settles it between the card lanes', () => {
    expect(poseAt(0, WIDE).focus.x).toBeCloseTo(0.64 * 1440, 5);
    expect(poseAt(1, WIDE).focus.x).toBeCloseTo(720, 5);
    expect(poseAt(3, { ...WIDE, laneGap: 690 }).focus.x).toBeCloseTo(690, 5);
  });

  it('leans toward each camp on phones, and stands centred at the trailhead', () => {
    const v = stageScale(PHONE.width, PHONE.height);
    expect(poseAt(0, PHONE).focus.x).toBeCloseTo(195, 5);

    for (let k = 1; k < CAMP_COUNT; k++) {
      expect(poseAt(k, PHONE).focus.x).toBeCloseTo(195 - SIDES[k] * 125 * v, 5);
    }
  });

  it('keeps the summit in the frame and brings its line in at the end', () => {
    for (let u = 0; u <= LAST; u += 0.25) {
      const { focus } = poseAt(u, WIDE);
      const peak = poseAt(u, WIDE).flats.find(at => at.id === 'peak')!.scale * 1.6;
      expect(focus.y - peak * focus.v * 168).toBeGreaterThan(900 * 0.04);
    }

    expect(poseAt(4.3, WIDE).summit.opacity).toBe(0);
    expect(poseAt(LAST, WIDE).summit.opacity).toBe(1);
  });

  it('shows labels only for the camp at hand and the next one', () => {
    const labels = poseAt(2, WIDE).labels;
    expect(labels.find(label => label.camp === 2)?.opacity).toBe(1);
    expect(labels.find(label => label.camp === 5)?.opacity).toBe(0);
  });

  it("keeps a camp's name over its tent while the camp passes, after its box has stopped growing", () => {
    const camp = campFlat(4)!;

    /* the label's place in the box, in the box's own pixels */
    const inBox = (u: number) => {
      const pose = poseAt(u, WIDE);
      const flat = pose.flats.find(item => item.id === camp.id)!;
      const label = pose.labels.find(item => item.camp === 4)!;

      return [(label.x - flat.x) / flat.scale, (label.y - flat.y) / flat.scale, flat.scale];
    };

    const [arrived, passing] = [inBox(4), inBox(4.6)];

    expect(passing[2]).toBe(1);
    expect(passing[0]).toBeCloseTo(arrived[0], 6);
    expect(passing[1]).toBeCloseTo(arrived[1], 6);
  });

  it('knows what the first frame needs decoded', () => {
    expect(FIRST_POSE).toContainEqual({ id: 'far', lod: 'near' });
    expect(FIRST_POSE).toContainEqual({ id: 'peak', lod: 'near' });
    expect(FIRST_POSE).toContainEqual({ id: campFlat(0)!.id, lod: 'near' });
    expect(FIRST_POSE).toContainEqual({ id: campFlat(1)!.id, lod: 'far' });
    expect(FIRST_POSE.find(item => item.id === campFlat(LAST)!.id)).toBeUndefined();
  });

  it('stands a flag beside every job camp, and none at the trailhead', () => {
    expect(flagLayout(campFlat(0)!)).toBeUndefined();

    for (let k = 1; k < CAMP_COUNT; k++) {
      const layout = flagLayout(campFlat(k)!)!;
      expect(layout.pole.height).toBeGreaterThan(5);
      expect(layout.pole.left).toBeGreaterThan(0);
      expect(layout.pole.left + layout.pole.width).toBeLessThan(100);
      /* the pennant hangs from near the top of the pole */
      expect(layout.cloth.top).toBeLessThan(layout.pole.top + layout.pole.height * 0.2);
    }
  });
});
