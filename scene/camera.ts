import { FLAG, FLATS, type Flat } from '@/scene/flats';
import { CAMP_COUNT, LEG_WEIGHTS, SIDES } from '@/scene/world';

/**
 * The forward climb's camera, as pure maths: it runs on the server, in the browser and in jsdom.
 *
 * Scrolling walks the camera forward along the route. Every flat sits at a depth; its scale is
 * `p = 1 / (its depth − the camera's)`, which is exactly 1 when the camera stands at its stop, and every point of it
 * lands at `focus + p · v · (its offset from the focus)`. The focus of expansion is the foot of the peak: the
 * route converges below the summit, so no ridge ever covers it. Values are design units (one is one pixel at the
 * 1440 × 900 reference); `v` turns them into pixels. The numbers are the design system's camera sheet.
 */

/** The story column: the stage scale makes this fit the screen; everything outside it is painted falloff. */
export const COLUMN = { WIDTH: 560, HEIGHT: 900 } as const;
/** Depth per unit of leg weight: long jobs sit deeper and scroll longer, so the camera keeps one speed. */
const DEPTH_PER_WEIGHT = 1.2;
/** A ridge's box is authored at this times its stop size, so the scale written is always 1 or less. */
export const HEADROOM = 1.15;
/** The peak and the far ranges at the last camp: closer, and never reached. */
const PEAK_END = 1.6;
const FAR_END = 1.08;
/** Where a camp stands at its stop, as a share of the screen height: beside its card, or above it on phones. */
const CAMP_LINE = { WIDE: 0.58, PHONE: 0.42 } as const;
/** How far below the focus the camp line sits, at the trailhead and at the last camp: the far world sinks. */
const FOCUS_DEPTH = { START: 290, END: 204 } as const;
/** The summit's tip above the focus, at scale 1. */
export const SUMMIT_HEIGHT = 168;
/** A camp's distance from the centre line at its stop, on the side away from its card. */
const CAMP_OFFSET = 150;
/** Phones: the camera leans toward each camp, so it lands near the middle of a narrow screen. */
const PHONE_LEAN = 125;
/** Wide screens: at the hero the focus stands right of centre, so the title's half stays calm. */
const HERO_FOCUS_X = 0.64;
/** A flat's life, by its scale: fades in far ahead, sharpens from its far version, fades out once passed. */
const LIFE = {
  APPEAR: [0.22, 0.3],
  DETAIL: [0.62, 0.82],
  PASS: [2.4, 3.4],
} as const;
/** Labels are shown only near: for the camp at hand and the next one. */
const LABEL_SHOWN = [0.5, 0.75] as const;
/** How high above its camp a label sits, and how far toward the outer side. */
const LABEL_RISE = { CAMP: 98, TRAILHEAD: 92 } as const;
const LABEL_SHIFT = -6;
/** The summit line comes in over the last stretch of the climb. */
const SUMMIT_FADE = [4.35, 4.95] as const;
/** Where the summit line sits from the tip, in units at scale 1: left of it on wide screens, on the snow on phones. */
const SUMMIT_LINE = { WIDE: [-40, 30], PHONE: [0, 70] } as const;
/** A flat this close to the camera (or behind it) is gone. */
const NEAR_LIMIT = 0.02;
/** The shared flag: the pole's height in units, the pennant's scale against it, and how far the pole sinks. */
const FLAG_SIZE = { HEIGHT: 104, CLOTH: 0.72, SINK: 6 } as const;

const LAST = CAMP_COUNT - 1;

/** The far world: the backdrop every other flat stands in front of, and the one that must always fill the screen. */
const BACKDROP = FLATS.find(flat => flat.kind === 'back')!;
/** Units the backdrop keeps beyond each side of the screen, so its edge never shows, even after pixel snapping. */
const BACKDROP_MARGIN = 2;
/** How far the backdrop reaches left and right of the focus (where it is anchored), in units at scale 1. */
const BACKDROP_REACH = {
  LEFT: -BACKDROP.box[0] - BACKDROP_MARGIN,
  RIGHT: BACKDROP.box[0] + BACKDROP.box[2] - BACKDROP_MARGIN,
} as const;

export const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/** Hermite smoothstep from `a` to `b`. */
export function smoothstep(a: number, b: number, x: number): number {
  const t = clamp((x - a) / (b - a), 0, 1);

  return t * t * (3 - 2 * t);
}

/** Arrives at half speed rather than stopping dead, so a stop never feels like the scroll is stuck. */
export const ease = (f: number) => 0.5 * f + 0.5 * f * f * (3 - 2 * f);

/** Each camp's depth: the leg weights, summed. */
export const CAMP_Z: number[] = LEG_WEIGHTS.reduce(
  (depths, weight) => [...depths, depths[depths.length - 1] + DEPTH_PER_WEIGHT * weight],
  [0]
);
/** Where the camera stands at each stop: one unit in front of that camp, so the camp is at scale 1. */
const CAMERA_AT = CAMP_Z.map(z => z - 1);
/** The peak and the far ranges sit at the depths that give them PEAK_END and FAR_END at the last camp. */
const depthFor = (end: number) => (end * CAMERA_AT[LAST] - CAMERA_AT[0]) / (end - 1);
const PEAK_Z = depthFor(PEAK_END);
const FAR_Z = depthFor(FAR_END);

/** `u` runs 0 (the trailhead) to the last camp; between stops the camera eases in at half speed. */
const legOf = (u: number) => {
  const leg = Math.min(Math.floor(clamp(u, 0, LAST)), LAST - 1);

  return { leg, f: clamp(u - leg, 0, 1) };
};

/** The camera's depth at station `u`. */
export function cameraZ(u: number): number {
  const { leg, f } = legOf(u);

  return CAMERA_AT[leg] + (CAMERA_AT[leg + 1] - CAMERA_AT[leg]) * ease(f);
}

/** How far below the focus the camp line sits at camp `k`. */
const focusDepth = (k: number) =>
  FOCUS_DEPTH.START + ((FOCUS_DEPTH.END - FOCUS_DEPTH.START) * k) / LAST;

/** The screen the stage fills, and (wide only) the middle of the gap between the two card lanes. */
export type View = { width: number; height: number; wide: boolean; laneGap: number | null };

/** The backdrop's whole width: a screen wider than this at scale 1 needs a larger scale to stay covered. */
const BACKDROP_SPAN = BACKDROP_REACH.LEFT + BACKDROP_REACH.RIGHT;

/**
 * Design units to pixels: the story column fits the screen. Only a screen wider than the backdrop itself (32:9
 * and beyond) is scaled up past that, because there no focus could keep both of the backdrop's ends out of view.
 */
export const stageScale = (width: number, height: number) =>
  Math.max(Math.min(width / COLUMN.WIDTH, height / COLUMN.HEIGHT), width / BACKDROP_SPAN);

/** The same scale in CSS, as a length per unit, for anything sized by stylesheet (needs a size container). */
export const STAGE_SCALE_CSS = `max(min(100cqw / ${COLUMN.WIDTH}, 100cqh / ${COLUMN.HEIGHT}), 100cqw / ${BACKDROP_SPAN})`;

/** Phones lean toward the camp ahead; the trailhead stands in the middle. */
const lean = (k: number) => (k < 1 ? 0 : SIDES[Math.min(k, LAST)]);

/**
 * The focus of expansion on screen, in pixels, and the stage scale `v`.
 *
 * The focus is also where the backdrop is anchored, so it is kept where the backdrop still reaches both edges of
 * the screen. That only ever binds near the hero on a wide, short screen (about 1.9:1 and wider), where the focus
 * stands right of centre and the backdrop's left end would otherwise show as a bare strip of sky.
 */
export function focusAt(u: number, view: View) {
  const { width, height, wide } = view;
  const v = stageScale(width, height);
  const { leg, f } = legOf(u);
  const e = ease(f);
  const depth = focusDepth(leg) + (focusDepth(leg + 1) - focusDepth(leg)) * e;
  const y = (wide ? CAMP_LINE.WIDE : CAMP_LINE.PHONE) * height - depth * v;
  const lane = view.laneGap ?? width / 2;
  const x = wide
    ? lane + (HERO_FOCUS_X * width - lane) * (1 - smoothstep(0, 1, u))
    : width / 2 - (lean(leg) + (lean(leg + 1) - lean(leg)) * e) * PHONE_LEAN * v;
  const reach = scaleOf(BACKDROP, cameraZ(u)) * v;

  return {
    x: clamp(x, width - BACKDROP_REACH.RIGHT * reach, BACKDROP_REACH.LEFT * reach),
    y,
    v,
  };
}

/** The scale a flat's box is authored at: the largest it is ever shown. */
export function maxScale(flat: Flat): number {
  if (flat.kind === 'peak') return PEAK_END;
  if (flat.kind === 'back') return FAR_END;

  return HEADROOM;
}

/** The point a flat grows about: its camp on a ridge, the focus itself for the far world. */
export function anchorOf(flat: Flat): readonly [number, number] {
  if (flat.kind !== 'camp' || flat.camp === undefined) return [0, 0];

  return [(flat.side ?? 0) * CAMP_OFFSET, focusDepth(flat.camp)];
}

/** A flat's scale `p` with the camera at depth `z`. */
function scaleOf(flat: Flat, z: number): number {
  if (flat.kind === 'peak') return (PEAK_Z - CAMERA_AT[0]) / (PEAK_Z - z);
  if (flat.kind === 'back') return (FAR_Z - CAMERA_AT[0]) / (FAR_Z - z);
  const ahead = CAMP_Z[flat.camp ?? 0] - z;

  return ahead > NEAR_LIMIT ? 1 / ahead : Number.POSITIVE_INFINITY;
}

export type FlatPose = {
  id: string;
  /** Pixels: where the box's top-left corner goes, and the scale written (always 1 or less). */
  x: number;
  y: number;
  scale: number;
  opacity: number;
  /** The near painting's opacity; the far version stays fully opaque under it until the near one is. */
  near: number;
  far: number;
};

export type LabelPose = { camp: number; x: number; y: number; opacity: number };

export type Pose = {
  focus: { x: number; y: number; v: number };
  flats: FlatPose[];
  labels: LabelPose[];
  summit: { x: number; y: number; opacity: number };
  /** Dawn turns to day as you climb (dusk to midnight by night). */
  daylight: number;
};

/** One moment of the climb: everything the stage writes, in pixels. */
export function poseAt(u: number, view: View): Pose {
  const focus = focusAt(u, view);
  const { x: fx, y: fy, v } = focus;
  const z = cameraZ(u);
  const labels: LabelPose[] = [];
  let peakScale = 1;

  const flats = FLATS.map(flat => {
    const p = scaleOf(flat, z);
    const max = maxScale(flat);
    const s = Math.min(p, max) / max;
    const [ax, ay] = anchorOf(flat);
    const [bx, by] = flat.box;
    /* the anchor follows p even once the box stops growing at its headroom, so a passed ridge slides out below */
    const x = fx + (Number.isFinite(p) ? p * v * ax : 0) - s * max * v * (ax - bx);
    const y = fy + (Number.isFinite(p) ? p * v * ay : 0) - s * max * v * (ay - by);

    if (flat.kind === 'peak') {
      peakScale = p;
    }

    if (flat.kind !== 'camp') {
      return { id: flat.id, x, y, scale: s, opacity: 1, near: 1, far: 0 };
    }

    const opacity = Number.isFinite(p)
      ? smoothstep(LIFE.APPEAR[0], LIFE.APPEAR[1], p) *
        (1 - smoothstep(LIFE.PASS[0], LIFE.PASS[1], p))
      : 0;
    const near = smoothstep(LIFE.DETAIL[0], LIFE.DETAIL[1], p);
    const camp = flat.camp ?? 0;
    const rise = camp === 0 ? LABEL_RISE.TRAILHEAD : LABEL_RISE.CAMP;
    const [lx, ly] = [ax + (flat.side ?? 0) * LABEL_SHIFT, ay - rise];
    /* placed in the box, like the flag: once the box stops growing, a name scaled by p would leave its tent */
    labels.push({
      camp,
      x: x + s * max * v * (lx - bx),
      y: y + s * max * v * (ly - by),
      opacity: opacity * smoothstep(LABEL_SHOWN[0], LABEL_SHOWN[1], p),
    });

    return { id: flat.id, x, y, scale: s, opacity, near, far: near >= 1 ? 0 : 1 };
  });

  const tip = fy - peakScale * v * SUMMIT_HEIGHT;
  const [sx, sy] = view.wide ? SUMMIT_LINE.WIDE : SUMMIT_LINE.PHONE;

  return {
    focus,
    flats,
    labels: labels.sort((a, b) => a.camp - b.camp),
    summit: {
      x: fx + sx * peakScale * v,
      y: tip + sy * peakScale * v,
      opacity: smoothstep(SUMMIT_FADE[0], SUMMIT_FADE[1], u),
    },
    daylight: smoothstep(0, LAST, u),
  };
}

/** The flats (and which version of each) on screen at the hero: what must be decoded before the first frame. */
export const FIRST_POSE: { id: string; lod: 'near' | 'far' }[] = poseAt(0, {
  width: 1440,
  height: 900,
  wide: true,
  laneGap: null,
}).flats.flatMap(pose => {
  if (!pose.opacity) return [];

  return [{ id: pose.id, lod: pose.near > 0 ? 'near' : 'far' }];
});

/** A rectangle as percentages of a flat's box. */
export type BoxShare = { left: number; top: number; width: number; height: number };

/**
 * Where a camp's flag stands, as shares of its flat's box, so it scales and fades with the ridge: the pole beside
 * the trail point (`flagDx`), the pennant hung just under the pole's cap. Undefined for flats without a flag.
 */
export function flagLayout(flat: Flat): { pole: BoxShare; cloth: BoxShare } | undefined {
  if (flat.kind !== 'camp' || !flat.camp || flat.flagDx === undefined) return undefined;

  const { pole, cloth } = FLAG;
  const unit = FLAG_SIZE.HEIGHT / pole.h;
  const clothUnit = unit * FLAG_SIZE.CLOTH;
  const [ax, ay] = anchorOf(flat);
  const [bx, by, bw, bh] = flat.box;
  const poleLeft = ax + flat.flagDx - pole.ax * unit;
  const poleTop = ay + FLAG_SIZE.SINK - pole.h * unit;
  const share = (x: number, y: number, w: number, h: number): BoxShare => ({
    left: ((x - bx) / bw) * 100,
    top: ((y - by) / bh) * 100,
    width: (w / bw) * 100,
    height: (h / bh) * 100,
  });

  return {
    pole: share(poleLeft, poleTop, pole.w * unit, pole.h * unit),
    cloth: share(
      poleLeft + pole.ax * unit - cloth.hx * clothUnit,
      poleTop + pole.ay * unit - cloth.hy * clothUnit,
      cloth.w * clothUnit,
      cloth.h * clothUnit
    ),
  };
}
