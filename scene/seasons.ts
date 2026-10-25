import { JOBS } from '@/content/jobs';
import type { Theme } from '@/scene/flats';
import { rnd } from '@/scene/noise';
import { wave } from '@/scene/snow';
import manifest from './seasons.json';

/**
 * The year behind /cv. The page is a field log of the jobs, newest first, and behind it one place, a meadow at the
 * edge of a larch wood, while the year turns as you read: the top of the page shows the season it is today, and
 * every hairline between two entries passed turns to the next one. Reading ten years plays about a year and a half
 * of seasons. The seasons are a mood, never a comment on a role, so no picture ever sits beside a particular job.
 */
export const SEASONS = ['winter', 'spring', 'summer', 'autumn'] as const;
export type Season = (typeof SEASONS)[number];

/** One state per stretch of reading: the header, every job, the foot of the rail. */
export const YEAR_STATES = JOBS.length + 2;

/** The view timeline the hairline above state `k` names; state `k` fades in on it, state `k - 1` out. */
export const yearTimeline = (k: number) => `--year-${k}`;

/** Every hairline's timeline, for `timeline-scope` on the page that holds both the log and the backdrop. */
export const YEAR_TIMELINES = Array.from({ length: YEAR_STATES - 1 }, (_, i) =>
  yearTimeline(i + 1)
);

/**
 * The season on a date, as its index in SEASONS: meteorological seasons in the northern hemisphere (Greece),
 * December to February is winter. Mirrored by SEASON_SCRIPT, which a test holds to it.
 */
export const seasonIndexOn = (date: Date) => Math.floor(((date.getMonth() + 1) % 12) / 3);

/**
 * Runs in <head> before the first paint, like the theme's script, and writes today's season to <html> as
 * `data-year-start`. The page is built once and served for months, so the season cannot come from the build;
 * and <html> outlives client navigation, so it is right on /cv however the reader arrives.
 */
export const SEASON_SCRIPT = `(function(){try{document.documentElement.dataset.yearStart=String(Math.floor(((new Date().getMonth()+1)%12)/3))}catch(e){}})()`;

/** Where the year starts when no script ran: summer, the picture with the most green in it. */
export const DEFAULT_START = 2;

/**
 * The season state `k` shows in its picture `j`. Every state carries all four pictures and CSS shows the one whose
 * `j` is the year's start, so the start picks a whole column of the year at once: one rule per season, not one
 * per season and state, and nothing re-rendered when the date decides.
 */
export const seasonOf = (j: number, k: number): Season => SEASONS[(j + k) % SEASONS.length];

export type SeasonArt = { grove: string; meadow: string };

/** The paintings (scripts/process-seasons.mjs): a grove and a repeating meadow per season and time. */
export const SEASON_ART: Record<Season, Record<Theme, SeasonArt>> = manifest.art;

/** The meadow's top edge, as a share of the screen's height from the bottom (the paintings fill the screen). */
export const GROUND_SHARE = manifest.ground;

/** The grove's width and the meadow tile's, each against its height. */
export const GROVE_ASPECT = manifest.canvas[0] / manifest.canvas[1];
export const MEADOW_ASPECT = manifest.tile / manifest.canvas[1];

export const seasonUrl = (file: string) => `/seasons/${file}`;

/* ------------------------------------------------------------------------------------------------------------ */

/**
 * Each season's weather, painted (scripts/process-seasons.mjs packs the kit into one small atlas per theme):
 * cherry petals and small blossoms in spring, dandelion seeds rising off the meadow in summer, golden larch tufts and
 * leaves in autumn, snow in winter. Few and slow on purpose: it is weather beside a list somebody is reading.
 */
export type WeatherKind = 'petal' | 'seed' | 'leaf' | 'flake';

/** The kit's atlas: its files, its size in px, the square every sprite was fitted into, and each season's boxes. */
export type WeatherAtlas = {
  atlas: Record<Theme, string>;
  size: [number, number];
  sprite: number;
  sprites: Record<Season, [x: number, y: number, w: number, h: number][]>;
};

export const WEATHER_ATLAS = manifest.weather as WeatherAtlas;

type WeatherSpec = {
  kind: WeatherKind;
  seed: number;
  count: number;
  /** One pass across the screen, in seconds; a seed's is upward. */
  pass: [number, number];
  /** On-screen size of the sprite's longest side, px: the smaller, the further off, and the fainter. */
  size: [number, number];
};

const WEATHER: Record<Season, WeatherSpec> = {
  winter: { kind: 'flake', seed: 7100, count: 32, pass: [10, 17], size: [10, 19] },
  spring: { kind: 'petal', seed: 7300, count: 20, pass: [12, 20], size: [17, 27] },
  summer: { kind: 'seed', seed: 7500, count: 12, pass: [22, 32], size: [24, 34] },
  autumn: { kind: 'leaf', seed: 7700, count: 22, pass: [11, 18], size: [19, 30] },
};

/** Each kind has this many paths, so neighbours never fall in step. */
export const WEATHER_PATHS = 4;

/**
 * Passes in one animation cycle. A bit runs on the compositor, but the browser wakes the main thread each time a
 * cycle ends (the climb's snow, scene/snow.ts), so one cycle carries it across twice, in two lanes.
 */
const PASSES_PER_CYCLE = 2;
/** Keyframe stops per pass: enough for the sway to read as a curve. */
const STEPS_PER_PASS = 12;
/** The second pass of a cycle runs this many px to the side of the first. */
const LANE = 31;

export type WeatherBit = {
  key: number;
  kind: WeatherKind;
  /** Which of its kind's paths it follows, from 1. */
  path: number;
  /** Which of its season's sprites it is. */
  sprite: number;
  /** Across the weather box, in %. */
  x: number;
  /** Its sprite's longest side on screen, px. */
  size: number;
  /** Its strength: smaller bits are further off, so fainter. */
  alpha: number;
  /** One cycle, and how far into it the bit starts, in seconds. */
  cycle: number;
  phase: number;
};

const between = ([low, high]: [number, number], t: number) => low + (high - low) * t;

/** One season's weather. Deterministic, like the stars and the snow. */
export function weatherField(season: Season): WeatherBit[] {
  const spec = WEATHER[season];
  const sprites = WEATHER_ATLAS.sprites[season].length;

  return Array.from({ length: spec.count }, (_, i) => {
    const r = (draw: number) => rnd(spec.seed + i * 13 + draw);
    const cycle = between(spec.pass, r(1)) * PASSES_PER_CYCLE;
    const near = r(3);

    return {
      key: i,
      kind: spec.kind,
      path: 1 + Math.floor(r(2) * WEATHER_PATHS),
      sprite: Math.floor(r(6) * sprites),
      x: r(0) * 100,
      size: between(spec.size, near),
      alpha: 0.7 + 0.3 * near,
      cycle,
      /* anywhere in its cycle, so the sky has weather from the first frame */
      phase: cycle * r(5),
    };
  });
}

type Motion = {
  /** Sideways travel over one pass, px, per path. */
  drift: number[];
  /** The sway either side of that travel, px, and how many sways a pass. */
  sway: number;
  sways: number;
  /** Degrees turned over one pass, about each path's axis: a tilted axis makes a flat thing flip as it falls. */
  spin: number;
  axes: [number, number, number][];
  /** Where a pass starts and ends, as shares of the weather box's height. */
  from: number;
  to: number;
  /** A seed rises in mid-air and settles back, so it fades in and out instead of popping. */
  fades?: boolean;
};

const MOTION: Record<WeatherKind, Motion> = {
  petal: {
    drift: [60, 90, 120, 150],
    sway: 26,
    sways: 2.5,
    spin: 540,
    axes: [
      [1, 0.4, 0.2],
      [0.3, 1, 0.15],
      [0.6, 0.6, 0.5],
      [1, 0.15, 0.6],
    ],
    from: -0.1,
    to: 1.06,
  },
  leaf: {
    drift: [70, 100, 130, 160],
    sway: 36,
    sways: 2,
    spin: 720,
    axes: [
      [0.8, 1, 0.3],
      [1, 0.3, 0.4],
      [0.4, 0.8, 0.8],
      [1, 0.6, 0.1],
    ],
    from: -0.1,
    to: 1.06,
  },
  seed: {
    drift: [180, 230, -160, -210],
    sway: 18,
    sways: 1.5,
    spin: 0,
    axes: [[0, 0, 1]],
    from: 0.95,
    to: 0.2,
    fades: true,
  },
  flake: {
    drift: [30, 46, 62, 78],
    sway: 14,
    sways: 2,
    spin: 180,
    axes: [[0, 0, 1]],
    from: -0.08,
    to: 1.06,
  },
};

/** A seed does not spin: it rocks under its parachute, this many degrees either way. */
const SEED_ROCK = 16;

const n = (value: number, digits = 1) => Number(value.toFixed(digits));

/**
 * The weather's keyframes, one set per kind and path. Heights are in `cqh` (the weather box is a size container),
 * every value a plain number. Each set carries a bit across PASSES_PER_CYCLE times, swaying either side of its drift
 * (scene/snow.ts's `wave`) and turning about its path's axis; the jump back is between two stops a hair apart,
 * outside the box.
 */
export function weatherKeyframes(): string {
  const rules: string[] = [];

  (Object.keys(MOTION) as WeatherKind[]).forEach(kind => {
    const motion = MOTION[kind];

    motion.drift.forEach((drift, p) => {
      const [ax, ay, az] = motion.axes[p % motion.axes.length];
      const stops: string[] = [];

      for (let pass = 0; pass < PASSES_PER_CYCLE; pass++) {
        for (let step = 0; step <= STEPS_PER_PASS; step++) {
          const t = step / STEPS_PER_PASS;
          const at = ((pass + t) / PASSES_PER_CYCLE) * 100 - (step === STEPS_PER_PASS ? 0.01 : 0);
          const x = pass * LANE + drift * t + motion.sway * wave(t * motion.sways + p * 0.25);
          const y = (motion.from + (motion.to - motion.from) * t) * 100;
          const turn =
            kind === 'seed'
              ? `rotate: ${n(SEED_ROCK * wave(t * motion.sways + 0.25))}deg;`
              : `rotate: ${ax} ${ay} ${az} ${n((pass + t) * motion.spin)}deg;`;
          const fade = motion.fades ? ` opacity: ${n(Math.min(1, t * 5, (1 - t) * 4), 2)};` : '';
          stops.push(`${n(at, 2)}% { translate: ${n(x)}px ${n(y)}cqh; ${turn}${fade} }`);
        }
      }

      rules.push(`@keyframes weather-${kind}-${p + 1} { ${stops.join(' ')} }`);
    });
  });

  return rules.join('\n');
}
