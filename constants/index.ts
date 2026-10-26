/**
 * Values more than one module needs, or that must match something in `globals.css`. A constant only one module
 * uses lives with that module instead — otherwise this file becomes a drawer, and the number ends up far from the
 * arithmetic that gives it meaning.
 */

/** Gap kept above a section when the dock scrolls to it. Matches `scroll-padding-top` in globals.css. */
export const SECTION_SCROLL_OFFSET_PX = 28;

/** Every dock icon is drawn at this weight, a touch lighter than Lucide's 2, so the icons sit quietly beside text. */
export const DOCK_ICON_STROKE = 1.75;

/** From this width the cards sit beside the trail and the altimeter shows its full rail. Pairs with `--breakpoint-wide`. */
export const WIDE_QUERY = '(min-width: 900px)';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
