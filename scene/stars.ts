/**
 * The night sky: a jittered grid over the upper part of the sky, one chance of a star per cell. Tiers are faint,
 * mid and bright; the brightest come out first, the faintest up to `LAG_MAX_MS` later, like at dusk.
 */
export const STAR_FIELD = {
  COLUMNS: 15,
  ROWS: 7,
  /** Share of the sky's height the stars cover, from the top. */
  SKY_SHARE: 0.64,
  /** Chance that a cell holds a star. */
  DENSITY: 0.86,
  /** Share of stars in the mid and bright tiers; the rest are faint. */
  MID_SHARE: 0.3,
  BRIGHT_SHARE: 0.1,
  LAG_MAX_MS: 600,
  /** Of the faint tier, this share twinkles too; every bright and mid star does. */
  FAINT_TWINKLE_SHARE: 0.45,
} as const;
import { rnd } from '@/scene/noise';

export type StarTier = 'faint' | 'mid' | 'bright';

type Star = {
  /** Its cell in the grid below: unique, and the key the page renders it under. */
  cell: number;
  /** Position, in % of the sky's width and height. */
  x: number;
  y: number;
  /** Diameter in px. */
  size: number;
  tier: StarTier;
  /** Brightness, 0 to 1. */
  alpha: number;
  /** How long after the night reaches it the star comes out, in ms: the brightest first, like at dusk. */
  lag: number;
  /** Twinkle period in seconds; 0 for a steady star. */
  twinkle: number;
  /** How far into its cycle the twinkle starts, in seconds, so no two pulse together. */
  phase: number;
  /** How deep its twinkle dips, 0 to 1: more for fainter stars, and more the lower it sits in the sky. */
  depth: number;
  /** Its colour: most stars are white, some lean blue and a few warm, as real ones do. */
  tint: StarTint;
};

type StarTint = 'cool' | 'white' | 'warm';

const SEED = 5100;
/** Share of a cell a star may wander from its centre, so the grid never shows. */
const JITTER = 0.8;
const TIERS: Record<
  StarTier,
  { size: [number, number]; alpha: number; lag: [number, number]; depth: number }
> = {
  faint: { size: [1, 1.4], alpha: 0.5, lag: [0.55, 1], depth: 0.7 },
  mid: { size: [1.5, 2], alpha: 0.78, lag: [0.2, 0.5], depth: 0.5 },
  bright: { size: [2.1, 2.6], alpha: 1, lag: [0, 0.08], depth: 0.35 },
};
/**
 * A twinkle is quick and uneven, not a slow pulse: the air bends starlight several times a second. So one cycle
 * holds TWINKLE_FLICKERS uneven flickers (`twinkleKeyframes`) and lasts this long, different for every star: about
 * a third of a second to half a second per flicker. The cycle is long on purpose. The browser runs each twinkle on
 * the compositor, but wakes the main thread whenever a cycle ends; sixty stars on two-second cycles woke it on
 * almost every frame, while on fifteen-second ones it hardly stirs.
 */
const TWINKLE_S: [number, number] = [12, 22];
const TWINKLE_FLICKERS = 40;
/** How deep a twinkle dips, in three steps (each its own keyframes): every star takes the nearest. */
export const TWINKLE_DEPTHS = [0.3, 0.5, 0.75] as const;
/** Low in the sky the light crosses more air, so it twinkles harder: the depth at the top and at the bottom. */
const HORIZON_DEPTH: [number, number] = [0.7, 1.3];
/** Shares of blue-leaning and warm stars; the rest are white. */
const TINTS = { COOL: 0.35, WARM: 0.2 } as const;

const between = ([low, high]: [number, number], t: number) => low + (high - low) * t;

/**
 * The night sky: one chance of a star per cell of a jittered grid over the top of the sky, so they spread evenly
 * without looking planted. Rows are squeezed toward the top, where the sky is darkest and the mountains never
 * reach. Deterministic, like the rest of the scene, so server and browser agree.
 */
export function starField(): Star[] {
  const { COLUMNS, ROWS, SKY_SHARE, DENSITY, MID_SHARE, BRIGHT_SHARE, LAG_MAX_MS } = STAR_FIELD;
  const stars: Star[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const cell = row * COLUMNS + column;
      const r = (i: number) => rnd(SEED + cell * 17 + i);
      if (r(0) > DENSITY) continue;
      const pick = r(1);
      let tier: StarTier = 'faint';

      if (pick < BRIGHT_SHARE) {
        tier = 'bright';
      } else if (pick < BRIGHT_SHARE + MID_SHARE) {
        tier = 'mid';
      }

      const look = TIERS[tier];
      const down = (row + (1 - JITTER) / 2 + r(3) * JITTER) / ROWS;
      const twinkles = tier !== 'faint' || r(5) < STAR_FIELD.FAINT_TWINKLE_SHARE;
      const twinkle = twinkles ? between(TWINKLE_S, r(6)) : 0;
      const tone = r(9);
      let tint: StarTint = 'white';

      if (tone < TINTS.COOL) {
        tint = 'cool';
      } else if (tone > 1 - TINTS.WARM) {
        tint = 'warm';
      }

      stars.push({
        cell,
        x: ((column + (1 - JITTER) / 2 + r(2) * JITTER) / COLUMNS) * 100,
        y: down * (0.55 + 0.45 * down) * SKY_SHARE * 100,
        size: between(look.size, r(4)),
        tier,
        alpha: look.alpha,
        lag: Math.round(between(look.lag, r(7)) * LAG_MAX_MS),
        twinkle,
        phase: twinkle * r(8),
        depth: Math.min(0.9, look.depth * between(HORIZON_DEPTH, down)),
        tint,
      });
    }
  }

  return stars;
}

/** Which of the TWINKLE_DEPTHS a star's depth is nearest to, counting from 1 (its keyframes' name). */
export function twinkleLevel(depth: number): number {
  let nearest = 0;

  TWINKLE_DEPTHS.forEach((level, i) => {
    if (Math.abs(level - depth) < Math.abs(TWINKLE_DEPTHS[nearest] - depth)) {
      nearest = i;
    }
  });

  return nearest + 1;
}

/**
 * The twinkle, as CSS keyframes: for each depth, one long cycle of uneven flickers (mostly small dips, now and then
 * a deep one, never a smooth pulse), and the brightest stars' rays, which shrink as their star dims. Opacity runs
 * relative to 1 (a star's own brightness is in its colour) and every value is a plain number, so nothing in them
 * keeps the animation off the compositor. Deterministic, like the field.
 */
export function twinkleKeyframes(): string {
  const step = (i: number) => `${((i / TWINKLE_FLICKERS) * 100).toFixed(2)}%`;
  const dips = (seed: number) =>
    Array.from({ length: TWINKLE_FLICKERS }, (_, i) => (i === 0 ? 0 : rnd(seed + i) ** 1.6));
  const frames = (name: string, values: string[]) =>
    `@keyframes ${name}{${values.map((value, i) => `${step(i)}{${value}}`).join('')}100%{${values[0]}}}`;

  const levels = TWINKLE_DEPTHS.map((depth, level) =>
    frames(
      `scintillate-${level + 1}`,
      dips(SEED + 900 + level * 97).map(dip => `opacity:${(1 - depth * dip).toFixed(3)}`)
    )
  );
  const rays = frames(
    'beam',
    dips(SEED + 900).map(
      dip => `opacity:${(0.6 - 0.45 * dip).toFixed(3)};scale:${(1.1 - 0.6 * dip).toFixed(3)}`
    )
  );

  return [...levels, rays].join('');
}
