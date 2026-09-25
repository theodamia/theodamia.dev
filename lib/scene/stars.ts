import { STAR_FIELD } from '@/constants';
import { rnd } from '@/lib/scene/noise';

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
};

const SEED = 5100;
/** Share of a cell a star may wander from its centre, so the grid never shows. */
const JITTER = 0.8;
const TIERS: Record<StarTier, { size: [number, number]; alpha: number; lag: [number, number] }> = {
  faint: { size: [1, 1.4], alpha: 0.5, lag: [0.55, 1] },
  mid: { size: [1.5, 2], alpha: 0.78, lag: [0.2, 0.5] },
  bright: { size: [2.1, 2.6], alpha: 1, lag: [0, 0.08] },
};
const TWINKLE_S: [number, number] = [2.6, 5.2];

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
      const twinkles = tier === 'bright' || (tier === 'mid' && r(5) < STAR_FIELD.MID_TWINKLE_SHARE);
      const twinkle = twinkles ? between(TWINKLE_S, r(6)) : 0;
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
      });
    }
  }

  return stars;
}
