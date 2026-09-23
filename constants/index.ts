/**
 * Where each stop sits in the viewport when its card arrives (0 top, 1 bottom). The first and last stops
 * sit lower so the trailhead village and the unreached summit have room above them.
 */
export const CAMP_ANCHORS = {
  WIDE: { FIRST: 0.62, MIDDLE: 0.44, LAST: 0.6 },
  PHONE: { FIRST: 0.7, MIDDLE: 0.42, LAST: 0.6 },
} as const;

/**
 * How far (in screen heights) a card's top is from its anchor when the climber reaches the camp. Negative on
 * wide screens because the card sits beside the tent, positive on phones where it sits below it.
 */
export const CARD_LEAD = { WIDE: -0.12, PHONE: 0.07 } as const;

/**
 * Legs are sized by tenure, compressed: weight = BASE + GAIN * sqrt(years / REFERENCE_YEARS), clamped. Strictly
 * proportional legs would make a six-month job a sliver no card fits in. The same weight sets how much height a
 * leg gains and how long it takes to scroll, so the camera keeps one speed all the way up.
 */
export const LEG_WEIGHT = {
  BASE: 0.45,
  GAIN: 0.6,
  REFERENCE_YEARS: 4,
  MIN: 0.62,
  MAX: 1.08,
  /** The walk from the trailhead to the first job. */
  INTRO: 0.55,
} as const;

/** Scroll length of a leg of weight 1, in large viewport heights. */
export const LEG_SCROLL_LVH = 140;
/** Room under the last card before the page's closing section. */
export const LAST_CARD_LVH = 110;

/** Share of a leg after which the next stop counts as reached. */
export const STOP_REACHED_AT = 0.97;
/**
 * Once reached, a stop stays reached until the climber has gone back below this share of the leg. Without the gap
 * a camp flips on and off while someone hovers around it, and everything that comes alive there restarts.
 */
export const STOP_LEFT_AT = 0.8;

/** The "Scroll to climb" cue fades once the page has moved this far. */
export const CUE_HIDE_AFTER_PX = 60;

/** Gap kept above a section when the dock scrolls to it. Matches `scroll-padding-top` in globals.css. */
export const SECTION_SCROLL_OFFSET_PX = 28;

/** A stop's scroll position is nudged past its knot so the frame lands on the stop, not just before it. */
export const STOP_SCROLL_NUDGE_PX = 2;

/** Every dock icon is drawn at this weight: the hand-drawn ice axe's, which the Lucide icons match. */
export const DOCK_ICON_STROKE = 1.75;

/** The dock lights the section under this share of the screen height. */
export const DOCK_PROBE_RATIO = 0.5;

/** From this width the cards sit beside the trail and the altimeter shows its full rail. */
export const WIDE_QUERY = '(min-width: 900px)';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/** Where an explicit day or night choice is kept. Until there is one, the site follows the system. */
export const THEME_STORAGE_KEY = 'theme';

/**
 * Where an explicit choice of climb or timeline is kept. Until there is one, the climb is the page, unless the
 * visitor asked for less motion.
 */
export const VIEW_STORAGE_KEY = 'view';

/**
 * The night (or the day) spreads from the toggle as a soft-edged circle. The radius eases out: the circle's area
 * grows with its square, so an ease-out covers the screen at a roughly even rate and starts right under the finger.
 * The feather is the width of the soft edge, as a share of the radius, within limits.
 */
export const THEME_REVEAL = {
  DURATION_MS: 1000,
  EASE: [0.3, 0.55, 0.35, 1],
  FEATHER_SHARE: 0.16,
  FEATHER_MIN_PX: 96,
  FEATHER_MAX_PX: 200,
} as const;

/**
 * The night sky: a jittered grid over the upper part of the sky, one chance of a star per cell. Tiers are faint,
 * mid and bright; the brightest come out first, the faintest up to `LAG_MAX_MS` later, like at dusk.
 */
export const STAR_FIELD = {
  COLUMNS: 13,
  ROWS: 6,
  /** Share of the sky's height the stars cover, from the top. */
  SKY_SHARE: 0.64,
  /** Chance that a cell holds a star. */
  DENSITY: 0.86,
  /** Share of stars in the mid and bright tiers; the rest are faint. */
  MID_SHARE: 0.3,
  BRIGHT_SHARE: 0.1,
  LAG_MAX_MS: 600,
  /** Of the mid tier, this share twinkles too; every bright star does. */
  MID_TWINKLE_SHARE: 0.2,
} as const;

/** Series colours for the two small charts on /about, in slice order. */
export const SERIES_COLORS = [
  'var(--color-accent)',
  'var(--color-lake-fill)',
  'var(--color-ink-2)',
  'var(--color-sun)',
  'var(--color-mist)',
] as const;
