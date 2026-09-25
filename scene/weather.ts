import { rnd } from '@/scene/noise';

/** What falls in a season. Summer has none: a clear day is the summer weather. */
export type WeatherKind = 'snow' | 'leaf' | 'petal';

type Bit = {
  /** Unique across all kinds, and the key the page renders it under. */
  key: number;
  kind: WeatherKind;
  /** Across the sky, in % of its width. */
  x: number;
  /** Across, in px, over one fall: which way the wind is taking it. */
  drift: number;
  /** Diameter in px. */
  size: number;
  /** How long one fall takes, in seconds. */
  fall: number;
  /** How far into that fall it starts, in seconds, so the sky is never empty and never lands all at once. */
  phase: number;
  /** Degrees turned over one fall; 0 for snow, which does not tumble. */
  spin: number;
  /** 0 to 1. */
  alpha: number;
};

/**
 * One kind's weather. `seed` keeps each kind's stream apart, and the ranges are what make snow drift and leaves
 * tumble without either needing its own code.
 */
type Fall = {
  seed: number;
  count: number;
  size: [number, number];
  fall: [number, number];
  drift: [number, number];
  spin: [number, number];
  alpha: [number, number];
};

const FALLS: Record<WeatherKind, Fall> = {
  /* small, slow and nearly straight down */
  snow: {
    seed: 8100,
    count: 60,
    size: [3, 6.5],
    fall: [9, 17],
    drift: [-46, 46],
    spin: [0, 0],
    alpha: [0.5, 1],
  },
  /* bigger, quicker, and blown much further sideways as they turn over */
  leaf: {
    seed: 8300,
    count: 34,
    size: [7, 11.5],
    fall: [7, 13],
    drift: [-120, 120],
    spin: [200, 620],
    alpha: [0.72, 1],
  },
  /* blossom: the lightest things here, slow and wide, and thick enough in the air to read as a tree letting go */
  petal: {
    seed: 8500,
    count: 40,
    size: [7, 12],
    fall: [10, 18],
    drift: [-95, 95],
    spin: [60, 300],
    alpha: [0.6, 0.95],
  },
};

const between = ([low, high]: [number, number], t: number) => low + (high - low) * t;

/**
 * Everything that falls, for every season at once. The page renders the lot and CSS shows the season's own, so the
 * weather is in the served HTML and needs no JavaScript to start — the same bargain the stars take.
 *
 * Deterministic in the same way as the star field: one stream per bit, and each draw index reserved for one
 * property, so adding a tenth thing to read cannot shift any of the nine before it.
 */
export function weatherField(): Bit[] {
  const bits: Bit[] = [];
  let key = 0;

  (Object.keys(FALLS) as WeatherKind[]).forEach(kind => {
    const spec = FALLS[kind];

    for (let i = 0; i < spec.count; i++) {
      const r = (draw: number) => rnd(spec.seed + i * 17 + draw);
      const fall = between(spec.fall, r(3));
      bits.push({
        key: key++,
        kind,
        x: r(0) * 100,
        drift: between(spec.drift, r(1)),
        size: between(spec.size, r(2)),
        fall,
        /* a whole cycle's worth, so at any moment they are spread the full height of the fall */
        phase: fall * r(4),
        spin: between(spec.spin, r(5)),
        alpha: between(spec.alpha, r(6)),
      });
    }
  });

  return bits;
}
