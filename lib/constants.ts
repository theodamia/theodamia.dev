/** Hand-drawn series palette, shared by every figure that needs to cycle colours. */
export const CHART_COLORS = [
  '#b3762f',
  '#a8552f',
  '#3f7c8c',
  '#7a8352',
  '#c79a4b',
  '#6b5a8e',
] as const;

/** The step ladder walks the palette in a different order so adjacent rows contrast. */
export const LADDER_COLORS = [
  '#6b5a8e',
  '#3f7c8c',
  '#a8552f',
  '#b3762f',
  '#c79a4b',
  '#7a8352',
] as const;

/** chart.xkcd writes this straight into `style="font-family: …"`, so a var() resolves fine. */
export const CHART_FONT = 'var(--font-patrick-hand)';

/**
 * Geometry for Fig. 1. The overlays (mountains, role bands, landmarks) are positioned
 * against the *measured* plot box, but the data-space -> unit-space maths uses these.
 */
export const CLIMB = {
  FIRST_YEAR: 2014,
  YEAR_SPAN: 12,
  TOP_LEVEL: 5.6,
  LEVEL_SPAN: 4.6,
  CHART_HEIGHT: 330,
  /** How far above the plot box the summit peak rises, so the last dot sits on its slope. */
  SUMMIT_RISE: 58,
  /** Stroke of the plotted line — the anchor used to find and measure the plot box. */
  LINE_COLOR: CHART_COLORS[0],
} as const;

/** Landmark dot sizes, in px. */
export const LANDMARK_DOT = {
  DEFAULT: 15,
  MINOR: 10,
  HOVER: 20,
} as const;

export const PIE_INNER_RADIUS = 0.45;

/** Phones swap Fig. 1 for the step ladder; the chart must not mount below this width. */
export const PHONE_QUERY = '(max-width: 640px)';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const SCROLL_THRESHOLD = {
  /** How far down the climb you have to be before the back-to-top arrow appears. */
  BACK_TO_TOP_VISIBLE: 400,
} as const;

export const TIMING = {
  /** Window resize debounce before charts are redrawn. */
  RESIZE_DEBOUNCE_MS: 250,
  /** Retry delay when chart.xkcd has not produced a usable line path yet. */
  CHART_RETRY_MS: 250,
  /** Give up after this many retries rather than spinning forever. */
  CHART_MAX_RETRIES: 8,
} as const;

export const REVEAL = {
  THRESHOLD: 0.12,
  ROOT_MARGIN: '0px 0px -8% 0px',
  CLASS: 'reveal',
  VISIBLE_CLASS: 'reveal-in',
} as const;

/** Tooltip flips to the left of its landmark once the point is past this share of the plot. */
export const TOOLTIP_FLIP_RATIO = 0.6;
/** Below this level the tooltip is drawn above the dot instead of below it. */
export const TOOLTIP_ABOVE_LEVEL = 3;
