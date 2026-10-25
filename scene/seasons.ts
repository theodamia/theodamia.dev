import { JOBS } from '@/content/jobs';
import type { Theme } from '@/scene/flats';
import { rnd } from '@/scene/noise';
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
 * Each season's weather: a few petals in spring, slow motes rising in summer, larch needles twirling down in
 * autumn, snow in winter. Few and slow on purpose: it is weather beside a list somebody is reading.
 */
export type WeatherKind = 'petal' | 'mote' | 'needle' | 'flake';

type WeatherSpec = {
  kind: WeatherKind;
  seed: number;
  count: number;
  /** One pass across the screen, in seconds; a mote's is upward. */
  pass: [number, number];
  /** Px across, and the opacity range. */
  size: [number, number];
  alpha: [number, number];
};

const WEATHER: Record<Season, WeatherSpec> = {
  winter: { kind: 'flake', seed: 7100, count: 30, pass: [9, 16], size: [3.5, 6], alpha: [0.75, 1] },
  spring: {
    kind: 'petal',
    seed: 7300,
    count: 14,
    pass: [11, 19],
    size: [6, 8],
    alpha: [0.75, 0.95],
  },
  summer: {
    kind: 'mote',
    seed: 7500,
    count: 10,
    pass: [16, 26],
    size: [2.5, 3.5],
    alpha: [0.5, 0.8],
  },
  autumn: {
    kind: 'needle',
    seed: 7700,
    count: 18,
    pass: [11, 19],
    size: [8, 10],
    alpha: [0.85, 1],
  },
};

/** Each kind has this many paths, so neighbours never drift in step. */
export const WEATHER_PATHS = 4;

/**
 * Passes in one animation cycle. A bit runs on the compositor, but the browser wakes the main thread each time a
 * cycle ends (the climb's snow, scene/snow.ts), so one cycle carries it across twice, in two lanes.
 */
const PASSES_PER_CYCLE = 2;
/** The second pass of a cycle runs this many px to the side of the first. */
const LANE = 31;
/** Where a fall starts and ends, as a share of the weather box's height: just above it, and just below it. */
const FALL_FROM = -0.1;
const FALL_TO = 1.06;

export type WeatherBit = {
  key: number;
  kind: WeatherKind;
  /** Which of its kind's paths it follows, from 1. */
  path: number;
  /** Across the weather box, in %. */
  x: number;
  size: number;
  alpha: number;
  /** One cycle, and how far into it the bit starts, in seconds. */
  cycle: number;
  phase: number;
};

const between = ([low, high]: [number, number], t: number) => low + (high - low) * t;

/** One season's weather. Deterministic, like the stars and the snow, so server and browser agree. */
export function weatherField(season: Season): WeatherBit[] {
  const spec = WEATHER[season];

  return Array.from({ length: spec.count }, (_, i) => {
    const r = (draw: number) => rnd(spec.seed + i * 13 + draw);
    const cycle = between(spec.pass, r(1)) * PASSES_PER_CYCLE;

    return {
      key: i,
      kind: spec.kind,
      path: 1 + Math.floor(r(2) * WEATHER_PATHS),
      x: r(0) * 100,
      size: between(spec.size, r(3)),
      alpha: between(spec.alpha, r(4)),
      cycle,
      /* anywhere in its cycle, so the sky has weather from the first frame */
      phase: cycle * r(5),
    };
  });
}

/** Sideways drift over one pass, px, per kind and path: snow drifts least, petals and needles most. */
const DRIFT: Record<WeatherKind, number[]> = {
  flake: [34, 52, 70, 88],
  petal: [76, 98, 120, 142],
  mote: [40, 62, -30, -52],
  needle: [70, 92, 114, 136],
};

/**
 * The weather's keyframes, one set per kind and path. Heights are in `cqh` (the weather box is a size container),
 * every value a plain number. Each set carries a bit across PASSES_PER_CYCLE times; the jump back is between two
 * stops a hair apart, outside the box. Needles turn as they fall; motes rise.
 */
export function weatherKeyframes(): string {
  const rules: string[] = [];

  (Object.keys(DRIFT) as WeatherKind[]).forEach(kind => {
    DRIFT[kind].forEach((drift, p) => {
      const rise = kind === 'mote';
      const [from, to] = rise ? [FALL_TO, 0.2] : [FALL_FROM, FALL_TO];
      const stops: string[] = [];

      for (let pass = 0; pass < PASSES_PER_CYCLE; pass++) {
        const start = (pass / PASSES_PER_CYCLE) * 100;
        const end = ((pass + 1) / PASSES_PER_CYCLE) * 100 - 0.01;
        const lane = pass * LANE;
        const turn = kind === 'needle' ? ` rotate: ${pass * 720}deg;` : '';
        const turned = kind === 'needle' ? ` rotate: ${(pass + 1) * 720}deg;` : '';
        stops.push(
          `${start.toFixed(2)}% { translate: ${lane}px ${(from * 100).toFixed(1)}cqh;${turn} }`
        );
        stops.push(
          `${end.toFixed(2)}% { translate: ${lane + drift}px ${(to * 100).toFixed(1)}cqh;${turned} }`
        );

        /* a mote stops rising in mid-air, so it fades in and out instead of popping */
        if (rise) {
          const span = end - start;
          stops.push(`${start.toFixed(2)}%, ${end.toFixed(2)}% { opacity: 0; }`);
          stops.push(
            `${(start + span * 0.2).toFixed(2)}%, ${(start + span * 0.75).toFixed(2)}% { opacity: 1; }`
          );
        }
      }

      rules.push(`@keyframes weather-${kind}-${p + 1} { ${stops.join(' ')} }`);
    });
  });

  return rules.join('\n');
}
