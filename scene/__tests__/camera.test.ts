import { describe, expect, it } from 'vitest';
import {
  anchorOf,
  BACKDROP_TILES,
  ease,
  FILLED_ASPECT,
  FIRST_POSE,
  flagLayout,
  FOOT_END,
  HEADROOM,
  maxScale,
  PAINTED_ASPECT,
  poseAt,
  SNOWLINE_CAMP,
  stageScale,
  todayDoor,
  usesPhoneArt,
  type View,
} from '@/scene/camera';
import { BACKDROP, campFlat, FLATS } from '@/scene/flats';
import { CAMP_COUNT, SIDES } from '@/scene/world';

const WIDE: View = { width: 1440, height: 900, wide: true, laneGap: 720 };
const PHONE: View = { width: 390, height: 844, wide: false, laneGap: null };
const LAST = CAMP_COUNT - 1;

/** Wide screens from 0.6:1 up to `maxAspect`, at a few heights, with and without two card lanes. */
function wideScreens(maxAspect: number): View[] {
  const views: View[] = [];

  for (const height of [600, 875, 1080, 1440]) {
    for (let tenth = 6; tenth <= Math.round(maxAspect * 10); tenth++) {
      const width = Math.round((tenth / 10) * height);
      if (width < 900) continue;
      views.push({ width, height, wide: true, laneGap: null });
      views.push({ width, height, wide: true, laneGap: Math.round(width * 0.46) });
    }
  }

  return views;
}

/** Below the breakpoint: phones upright and on their side, tablets, a short window. */
const NARROW: View[] = [
  [390, 844],
  [360, 840],
  [820, 1180],
  [880, 1000],
  [844, 390],
  [850, 500],
].map(([width, height]) => ({ width, height, wide: false, laneGap: null }));

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

  it('never leaves the screen bare below the cloud sea, on any screen up to the filled envelope', () => {
    for (const view of [...wideScreens(FILLED_ASPECT), ...NARROW]) {
      for (let step = 0; step <= LAST * 20; step++) {
        const pose = poseAt(step / 20, view);
        const far = pose.flats.find(at => at.id === BACKDROP.id)!;
        /* screen pixels per unit of the backdrop's box, and its period on screen */
        const k = far.scale * maxScale(BACKDROP) * pose.focus.v;
        const period = BACKDROP.box[2] * k;
        const label = `${view.width}×${view.height} at ${step / 20}`;

        expect(far.x + BACKDROP_TILES[0] * period, label).toBeLessThanOrEqual(0);
        expect(far.x + (BACKDROP_TILES.at(-1)! + 1) * period, label).toBeGreaterThanOrEqual(
          view.width
        );
        expect(far.y + (FOOT_END - BACKDROP.box[1]) * k, label).toBeGreaterThanOrEqual(view.height);
      }
    }
  });

  it('paints the ground at the trailhead from edge to edge on every screen in the painted envelope', () => {
    const village = campFlat(0)!;
    const tall = [
      { width: 360, height: 840 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
    ].map(size => ({ ...size, wide: false, laneGap: null }));

    for (const view of [...wideScreens(PAINTED_ASPECT.WIDE), ...tall]) {
      expect(view.width / view.height).toBeGreaterThanOrEqual(PAINTED_ASPECT.TALL - 1e-9);
      const pose = poseAt(0, view);
      const at = pose.flats.find(item => item.id === village.id)!;
      const k = at.scale * maxScale(village) * pose.focus.v;
      const [left, right] = usesPhoneArt(view) ? village.solidPhone! : village.solid!;
      const label = `${view.width}×${view.height}`;

      expect(at.x + (left - village.box[0]) * k, label).toBeLessThanOrEqual(0);
      expect(at.x + (right - village.box[0]) * k, label).toBeGreaterThanOrEqual(view.width);
      expect(at.y + village.box[3] * k, label).toBeGreaterThanOrEqual(view.height);
    }
  });

  it('keeps the composition it was drawn at: the camera never bends to fit a screen', () => {
    expect(stageScale(1440, 900)).toBe(1);
    expect(poseAt(0, WIDE).focus.x).toBeCloseTo(0.64 * 1440, 5);
    /* a wide, short window sees more world, not a moved one */
    const laptop = { width: 1728, height: 875, wide: true, laneGap: null };
    expect(poseAt(0, laptop).focus.x).toBeCloseTo(0.64 * 1728, 5);
    expect(stageScale(5120, 1440)).toBe(1440 / 900);
  });

  it('gives the phone files only to screens that see no more than their middle', () => {
    expect(usesPhoneArt(PHONE)).toBe(true);
    expect(usesPhoneArt({ width: 820, height: 1180, wide: false })).toBe(true);
    /* a phone on its side is narrow in pixels, but sees far more of the world than a phone file keeps */
    expect(usesPhoneArt({ width: 844, height: 390, wide: false })).toBe(false);
    expect(usesPhoneArt(WIDE)).toBe(false);
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

  it('brings the snow in on the approach to the snowline, and thickens it toward the summit', () => {
    expect(poseAt(SNOWLINE_CAMP - 1, WIDE).snow.falling).toBe(0);
    expect(poseAt(SNOWLINE_CAMP - 0.25, WIDE).snow.falling).toBeGreaterThan(0);
    expect(poseAt(SNOWLINE_CAMP, WIDE).snow.falling).toBe(1);
    expect(poseAt(SNOWLINE_CAMP, WIDE).snow.thick).toBe(0);
    expect(poseAt(LAST, WIDE).snow).toEqual({ falling: 1, thick: 1 });
  });

  it("stands each camp's name just above its tent, cabin or chalets, centred on them, at its stop", () => {
    for (let k = 0; k < CAMP_COUNT; k++) {
      const flat = campFlat(k)!;
      const { x, y, v, pose } = anchorOnScreen(flat.id, k, WIDE);
      const label = pose.labels.find(item => item.camp === k)!;
      const [dx, dy] = flat.label!;

      expect(label.x).toBeCloseTo(x + dx * v, 3);
      /* above the camp's top, with a little air between */
      expect(label.y).toBeLessThan(y + dy * v);
      expect(label.y).toBeGreaterThan(y + (dy - 30) * v);
    }
  });

  it("keeps today's door on its camp, the lamp in the doorway and the name inside the box", () => {
    for (const view of [WIDE, PHONE]) {
      const flat = campFlat(LAST)!;
      const { x, y, v } = anchorOnScreen(flat.id, LAST, view);
      const pose = poseAt(LAST, view);
      expect(pose.today.x).toBeCloseTo(x, 3);
      expect(pose.today.y).toBeCloseTo(y, 3);

      const { box, lamp } = todayDoor(view)!;
      const [x0, y0, x1, y1] = flat.tent!;
      /* the box covers the whole tent, and the name above it */
      expect(box.left).toBeLessThanOrEqual(x0 * v + 0.01);
      expect(box.left + box.width).toBeGreaterThanOrEqual(x1 * v - 0.01);
      expect(box.top).toBeLessThan(y0 * v);
      expect(box.top + box.height).toBeGreaterThanOrEqual(y1 * v - 0.01);
      /* the lamp burns inside the tent */
      expect(lamp.x).toBeGreaterThan(x0 * v);
      expect(lamp.x).toBeLessThan(x1 * v);
      expect(lamp.y).toBeGreaterThan(y0 * v);
      expect(lamp.y).toBeLessThan(y1 * v);
    }
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
