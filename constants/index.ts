/**
 * Values more than one module needs, or that must match something in `globals.css`. A constant only one module
 * uses lives with that module instead — otherwise this file becomes a drawer, and the number ends up far from the
 * arithmetic that gives it meaning.
 */

/**
 * Where each stop sits in the viewport when its card arrives (0 top, 1 bottom). The first and last stops
 * sit lower so the trailhead village and the unreached summit have room above them.
 */
export const CAMP_ANCHORS = {
  WIDE: { FIRST: 0.62, MIDDLE: 0.44, LAST: 0.6 },
  PHONE: { FIRST: 0.7, MIDDLE: 0.42, LAST: 0.6 },
} as const;

/** Gap kept above a section when the dock scrolls to it. Matches `scroll-padding-top` in globals.css. */
export const SECTION_SCROLL_OFFSET_PX = 28;

/** Every dock icon is drawn at this weight: the hand-drawn ice axe's, which the Lucide icons match. */
export const DOCK_ICON_STROKE = 1.75;

/** From this width the cards sit beside the trail and the altimeter shows its full rail. Pairs with `--breakpoint-wide`. */
export const WIDE_QUERY = '(min-width: 900px)';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
