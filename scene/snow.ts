import { rnd } from '@/scene/noise';

/**
 * The snow of the heights. The upper mountain is painted snowy, so from the Lead camp upward it snows (the camera
 * fades it in, `poseAt(...).snow` in scene/camera.ts), and a second, thicker fall comes in toward the summit. Below
 * the snowline the sky is clear: the green meadows get no weather.
 *
 * Flakes fall at three depths, which is most of what makes snow look deep rather than like dust on the glass: far
 * flakes small, faint and slow; near ones big, soft and quick. All of them ride the clouds' wind, left to right,
 * and flutter either side of it as they fall.
 */
export type SnowDepth = 'far' | 'mid' | 'near';

type Depth = {
  seed: number;
  /** Flakes in the snow of the heights, and the extra ones in the thicker fall near the summit. */
  count: number;
  squall: number;
  /** Diameter, px. */
  size: [number, number];
  /** One fall, from above the top of the screen to below its foot, in seconds. */
  fall: [number, number];
  alpha: [number, number];
  /** Px sideways over one fall: the wind's carry, and the flutter either side of it. */
  wind: number;
  sway: number;
};

const DEPTHS: Record<SnowDepth, Depth> = {
  far: {
    seed: 9100,
    count: 70,
    squall: 40,
    size: [2.2, 3.4],
    fall: [16, 22],
    alpha: [0.5, 0.75],
    wind: 40,
    sway: 6,
  },
  mid: {
    seed: 9300,
    count: 45,
    squall: 30,
    size: [3.8, 5.6],
    fall: [10, 14],
    alpha: [0.7, 0.92],
    wind: 70,
    sway: 12,
  },
  near: {
    seed: 9500,
    count: 16,
    squall: 12,
    size: [7, 11],
    fall: [6, 8.5],
    alpha: [0.8, 0.95],
    wind: 110,
    sway: 20,
  },
};

/**
 * Falls in one animation cycle. A flake runs on the compositor, but the browser wakes the main thread each time a
 * cycle ends (the star twinkle taught this), so one cycle carries a flake down three times, each time in a lane a
 * little to the side, before it starts over.
 */
const FALLS_PER_CYCLE = 3;
/** Each depth has this many paths, so neighbouring flakes never flutter in step. */
export const SNOW_PATHS = 2;
/** Keyframe stops per fall, and flutters per fall. */
const STEPS_PER_FALL = 12;
const SWAYS_PER_FALL = 2.5;
/** Where a fall starts and ends, in vh: just above the top of the screen and just below its foot. */
const FALL_FROM = -8;
const FALL_TO = 108;
/** Px each later fall in a cycle is moved sideways, so a flake does not come down the same lane three times. */
const LANES = [0, 37, -29];

export type Flake = {
  /** Unique, and the key the page renders it under. */
  key: number;
  depth: SnowDepth;
  /** Which of its depth's paths it follows, from 1. */
  path: number;
  /** Part of the thicker fall near the summit. */
  squall: boolean;
  /** Across the sky, in % of its width. */
  x: number;
  /** Diameter in px. */
  size: number;
  /** One cycle (FALLS_PER_CYCLE falls), and how far into it the flake starts, in seconds. */
  cycle: number;
  phase: number;
  alpha: number;
};

const between = ([low, high]: [number, number], t: number) => low + (high - low) * t;

/** Every flake of the heights, the thicker fall's included. Deterministic, like the stars and the weather. */
export function snowField(): Flake[] {
  const flakes: Flake[] = [];
  let key = 0;

  (Object.keys(DEPTHS) as SnowDepth[]).forEach(depth => {
    const spec = DEPTHS[depth];

    for (let i = 0; i < spec.count + spec.squall; i++) {
      const r = (draw: number) => rnd(spec.seed + i * 17 + draw);
      const cycle = between(spec.fall, r(3)) * FALLS_PER_CYCLE;
      flakes.push({
        key: key++,
        depth,
        path: 1 + Math.floor(r(5) * SNOW_PATHS),
        squall: i >= spec.count,
        x: r(0) * 100,
        size: between(spec.size, r(2)),
        cycle,
        /* anywhere in its cycle, so the sky is full from the first frame */
        phase: cycle * r(4),
        alpha: between(spec.alpha, r(6)),
      });
    }
  });

  return flakes;
}

/**
 * A smooth wave, -1 to 1 over one period, from arithmetic only: a triangle wave rounded at its turns. No
 * trigonometry, so the server and every browser write exactly the same keyframes. /cv's weather sways on it too.
 */
export function wave(u: number): number {
  const triangle = 1 - 2 * Math.abs(2 * (u - Math.floor(u)) - 1);

  return triangle * (1.5 - 0.5 * triangle * triangle);
}

/**
 * The fall, as CSS keyframes: one set per depth and path, each carrying a flake down FALLS_PER_CYCLE times (the
 * jump back to the top is between two stops a hair apart, off screen). Every value is a plain number.
 */
export function snowKeyframes(): string {
  const sets: string[] = [];

  (Object.keys(DEPTHS) as SnowDepth[]).forEach(depth => {
    const { wind, sway } = DEPTHS[depth];

    for (let path = 1; path <= SNOW_PATHS; path++) {
      const stops: string[] = [];

      for (let fall = 0; fall < FALLS_PER_CYCLE; fall++) {
        for (let step = 0; step <= STEPS_PER_FALL; step++) {
          const t = step / STEPS_PER_FALL;
          const flutter = wave(SWAYS_PER_FALL * t + path / SNOW_PATHS + fall * 0.37);
          const x = LANES[fall] + wind * t + sway * flutter;
          const y = FALL_FROM + (FALL_TO - FALL_FROM) * t;
          /* the first stop of a later fall sits just after the last one of the fall before: the jump */
          const at = ((fall + t) / FALLS_PER_CYCLE) * 100 + (step === 0 && fall > 0 ? 0.01 : 0);
          stops.push(`${at.toFixed(2)}%{translate:${x.toFixed(1)}px ${y.toFixed(1)}vh}`);
        }
      }

      sets.push(`@keyframes snow-${depth}-${path}{${stops.join('')}}`);
    }
  });

  return sets.join('');
}
