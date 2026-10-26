import type { Theme } from '@/scene/flats';
import manifest from './about.json';

/**
 * /about as numbers. The page is "what's ahead": it opens on the sky of the visitor's time of day and ends, at
 * Contact, on the next range across a sea of clouds, where the sun comes up as the last screen scrolls in. The range
 * is one painting in three lights with one outline (scripts/process-about.mjs).
 */

/** The range's lights: the finale opens on the sunrise and turns to morning by day; by night it is the night. */
export type RangeLight = 'sunrise' | 'day' | 'night';

export const RANGE_ART: Record<RangeLight, string> = manifest.range;

/** The painting's width against its height. */
export const RANGE_ASPECT = manifest.canvas[0] / manifest.canvas[1];

/**
 * Where the range meets its sea of clouds (`cloudLine`) and where its highest summit's tip is (`summit`), as shares
 * of the painting's height. The page stands the cloud line a little above the screen's bottom edge and keeps the
 * Contact card clear of the summit, so both have to be known, not guessed.
 */
export const CLOUD_LINE = manifest.cloudLine;
export const SUMMIT = manifest.summit;

/**
 * How far the summit rises above the cloud line, as a share of the painting's width. The range spans the screen, so
 * this times the screen's width is how tall the mountains stand: the band the finale keeps for them.
 */
export const RANGE_RISE = (CLOUD_LINE - SUMMIT) / RANGE_ASPECT;

/** The saucer: its box in px, its pictures, and its running lights as shares of that box (they blink). */
export const SAUCER: {
  size: number[];
  lights: number[][];
} & Record<Theme, string> = manifest.saucer;

export const aboutUrl = (file: string) => `/about/${file}`;

/* ------------------------------------------------------------------------------------------------------------ */

/**
 * The time of day the page opens on, from the visitor's clock: a quiet change in the opening's sky, never a
 * different place. By day the light theme's morning, midday, late afternoon or (at night) the first light; by
 * night the dark theme's dusk, or deep night. Mirrored by DAYPART_SCRIPT, which a test holds to it.
 */
export const DAYPARTS = ['morning', 'midday', 'evening', 'night'] as const;
export type DayPart = (typeof DAYPARTS)[number];

/** The hour each part begins at, in order: morning at 5, midday at 10, evening at 16, night at 20. */
export const DAYPART_STARTS = [5, 10, 16, 20] as const;

export function dayPartAt(hour: number): DayPart {
  const index = DAYPART_STARTS.findLastIndex(start => hour >= start);

  return DAYPARTS[index === -1 ? DAYPARTS.length - 1 : index];
}

/**
 * Runs in <head> before the first paint, beside the theme's and the season's, and writes the visitor's time of day
 * to <html> as `data-daypart`. The page is built once and served for months, so the hour cannot come from the
 * build; and <html> outlives client navigation, so it is right on /about however the reader arrives.
 */
export const DAYPART_SCRIPT = `(function(){try{var h=new Date().getHours();document.documentElement.dataset.daypart=h>=20||h<5?'night':h>=16?'evening':h>=10?'midday':'morning'}catch(e){}})()`;
