import { LEG_WEIGHT } from '@/constants';
import { JOBS } from '@/lib/jobs';

/**
 * The mountain as numbers. This file and `SceneHandle` are everything the rest of the app knows about the
 * scene, so a different renderer (WebGL, say) can replace the SVG stage without touching cards, dock or
 * altimeter. Pure maths only: it runs on the server, in the browser and in jsdom.
 *
 * World units: 2400 wide, one viewport is 1000 tall, the camera travels 5000, so the near layer is 6000 tall.
 */
export const WORLD = {
  WIDTH: 2400,
  CENTER_X: 1200,
  VIEW: 1000,
  TRAVEL: 5000,
  /** Points sampled along each leg; the climber is interpolated between them. */
  LEG_SAMPLES: 48,
} as const;

/** World Y of the trailhead and the height between it and the highest camp. */
const TRAILHEAD_Y = 5620;
const CLIMB_HEIGHT = 4920;
/** How far a camp sits from the trail's centre line, and how far the trail swings between camps. */
const CAMP_OFFSET_X = 130;
const SWING_OUT_X = 150;
const SWING_BACK_X = 110;
/** Line segments used to measure a Bézier segment before resampling it by length. */
const FLATTEN_STEPS = 40;

export type Point = readonly [x: number, y: number];

/** What a renderer needs to draw one moment of the climb. */
export type SceneFrame = {
  /** World Y at the top of the viewport, 0 (summit in view) to WORLD.TRAVEL (trailhead). */
  yTop: number;
  /** Index of the leg being walked, 0 to LEGS.length - 1. */
  leg: number;
  /** Progress along that leg, 0 to 1. */
  f: number;
};

export type SceneHandle = {
  /** Draw one frame. Must only write transforms and opacity: no layout reads, no re-renders. */
  applyFrame: (frame: SceneFrame) => void;
  /** Re-read the stage size. Called on resize, never while scrolling. */
  resize: () => void;
};

/** Camps are waypoints: the trailhead, then one per job. */
export const CAMP_COUNT = JOBS.length + 1;

/** How long a leg is for a tenure in years. See LEG_WEIGHT. */
export function legWeight(years: number): number {
  const weight =
    LEG_WEIGHT.BASE + LEG_WEIGHT.GAIN * Math.sqrt(Math.max(0, years) / LEG_WEIGHT.REFERENCE_YEARS);

  return Math.min(LEG_WEIGHT.MAX, Math.max(LEG_WEIGHT.MIN, weight));
}

/**
 * Weight of the leg leaving each camp: the intro walk from the trailhead, then each job's tenure. The last job
 * has no leg: the pitch above it is never walked.
 */
export const LEG_WEIGHTS: number[] = [
  LEG_WEIGHT.INTRO,
  ...JOBS.slice(0, -1).map(job => legWeight(job.years)),
];

const TOTAL_WEIGHT = LEG_WEIGHTS.reduce((sum, weight) => sum + weight, 0);

/** +1: the tent sits right of the trail's centre and the card sits left; they alternate up the mountain. */
export const SIDES: number[] = Array.from({ length: CAMP_COUNT }, (_, i) => (i % 2 === 0 ? 1 : -1));

/** Height is time, compressed: each camp stands as far above the last as its leg is long. */
export const CAMP_Y: number[] = (() => {
  let walked = 0;

  return Array.from({ length: CAMP_COUNT }, (_, i) => {
    if (i) walked += LEG_WEIGHTS[i - 1];

    return TRAILHEAD_Y - (walked / TOTAL_WEIGHT) * CLIMB_HEIGHT;
  });
})();

export const CAMP_X: number[] = SIDES.map(side => WORLD.CENTER_X + side * CAMP_OFFSET_X);

export const SUMMIT = { x: WORLD.CENTER_X + 50, y: 250 } as const;

/** Camps plus two swing points per leg: the trail's control polygon. */
function trailPoints(): Point[] {
  const points: Point[] = [];
  CAMP_X.forEach((x, i) => {
    points.push([x, CAMP_Y[i]]);
    if (i === CAMP_X.length - 1) return;
    const side = SIDES[i];
    const rise = CAMP_Y[i + 1] - CAMP_Y[i];
    points.push([WORLD.CENTER_X - side * SWING_OUT_X, CAMP_Y[i] + rise * 0.33]);
    points.push([WORLD.CENTER_X + side * SWING_BACK_X, CAMP_Y[i] + rise * 0.66]);
  });

  return points;
}

type Cubic = readonly [Point, Point, Point, Point];

/** Catmull-Rom through the trail points, as three cubic Béziers per leg. */
function legCubics(): Cubic[][] {
  const points = trailPoints();
  const at = (j: number) => points[Math.min(points.length - 1, Math.max(0, j))];
  const legs: Cubic[][] = [];

  for (let leg = 0; leg < CAMP_X.length - 1; leg++) {
    const cubics: Cubic[] = [];

    for (let j = 3 * leg; j < 3 * leg + 3; j++) {
      const [p0, p1, p2, p3] = [at(j - 1), at(j), at(j + 1), at(j + 2)];
      cubics.push([
        p1,
        [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
        [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
        p2,
      ]);
    }

    legs.push(cubics);
  }

  return legs;
}

function cubicAt([a, b, c, d]: Cubic, t: number): Point {
  const u = 1 - t;
  const [w0, w1, w2, w3] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];

  return [
    w0 * a[0] + w1 * b[0] + w2 * c[0] + w3 * d[0],
    w0 * a[1] + w1 * b[1] + w2 * c[1] + w3 * d[1],
  ];
}

function cubicsToPath(cubics: Cubic[]): string {
  const fmt = (p: Point) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

  return cubics.reduce(
    (d, [, b, c, end]) => `${d} C${fmt(b)} ${fmt(c)} ${fmt(end)}`,
    `M${fmt(cubics[0][0])}`
  );
}

/** Evenly spaced points along a leg, by length, so the climber moves at a steady pace. */
function sampleByLength(cubics: Cubic[], samples: number): Point[] {
  const dense: Point[] = [cubics[0][0]];
  cubics.forEach(cubic => {
    for (let n = 1; n <= FLATTEN_STEPS; n++) dense.push(cubicAt(cubic, n / FLATTEN_STEPS));
  });
  const lengths = [0];

  for (let n = 1; n < dense.length; n++) {
    const [dx, dy] = [dense[n][0] - dense[n - 1][0], dense[n][1] - dense[n - 1][1]];
    lengths.push(lengths[n - 1] + Math.sqrt(dx * dx + dy * dy));
  }

  const total = lengths[lengths.length - 1];
  const out: Point[] = [];
  let seg = 1;

  for (let n = 0; n <= samples; n++) {
    const target = (total * n) / samples;
    while (seg < dense.length - 1 && lengths[seg] < target) seg++;
    const span = lengths[seg] - lengths[seg - 1];
    const k = span === 0 ? 0 : (target - lengths[seg - 1]) / span;
    out.push([
      dense[seg - 1][0] + (dense[seg][0] - dense[seg - 1][0]) * k,
      dense[seg - 1][1] + (dense[seg][1] - dense[seg - 1][1]) * k,
    ]);
  }

  return out;
}

type Leg = {
  /** SVG path data for the leg. */
  d: string;
  /** WORLD.LEG_SAMPLES + 1 points, camp to camp. */
  points: Point[];
};

/** The walked legs, one between each pair of camps. */
export const LEGS: Leg[] = legCubics().map(cubics => ({
  d: cubicsToPath(cubics),
  points: sampleByLength(cubics, WORLD.LEG_SAMPLES),
}));

/** The dotted pitch stops this far below the very top, so its last dot sits on the peak, not in the sky above it. */
const SUMMIT_PITCH_STOP = 36;

/** The pitch above the last camp. Dotted, never walked: the summit is still ahead. */
export const SUMMIT_PITCH_D = (() => {
  const last = CAMP_X.length - 1;
  const [x, y] = [CAMP_X[last], CAMP_Y[last]];
  const top = SUMMIT.y + SUMMIT_PITCH_STOP;

  return `M${x},${y} C${x + 150},${y - 120} ${SUMMIT.x - 90},${SUMMIT.y + 190} ${SUMMIT.x},${top}`;
})();

type CampAnchors = { FIRST: number; MIDDLE: number; LAST: number };

/** Where camp `i` should sit on screen (0 top, 1 bottom): the first and last camps have their own place. */
export function campAnchor(i: number, anchors: CampAnchors): number {
  if (i === 0) return anchors.FIRST;

  return i >= CAMP_Y.length - 1 ? anchors.LAST : anchors.MIDDLE;
}

/** World Y at the top of the viewport when camp `i` sits at `anchor` (0 top, 1 bottom) on screen. */
export function cameraKnot(i: number, anchor: number): number {
  return CAMP_Y[i] - anchor * WORLD.VIEW;
}

/** Where the climber is on a leg, interpolated between the sampled points. */
export function climberAt(leg: number, f: number): Point {
  const points = LEGS[leg].points;
  const u = Math.min(1, Math.max(0, f)) * (points.length - 1);
  const j = Math.min(points.length - 2, Math.floor(u));
  const k = u - j;

  return [
    points[j][0] + (points[j + 1][0] - points[j][0]) * k,
    points[j][1] + (points[j + 1][1] - points[j][1]) * k,
  ];
}
