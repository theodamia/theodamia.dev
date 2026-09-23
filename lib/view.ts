import {
  DOCK_PROBE_RATIO,
  REDUCED_MOTION_QUERY,
  SECTION_SCROLL_OFFSET_PX,
  VIEW_STORAGE_KEY,
} from '@/constants';
import { anchorJobIndex } from '@/lib/climb-stops';

/** The climb is the page; the timeline is the same jobs read plainly, newest first. */
export type View = 'climb' | 'timeline';

/** Each list marks itself, so the switch can measure the one being left and the one being entered. */
export const LIST_ATTR = 'data-list';

/**
 * Runs in <head> before the first paint, so a returning reader never sees the other view flash past: the stored
 * choice, else the timeline for anyone who asked for less motion, else the climb. The climb is also what any
 * failure lands on, which is why the CSS treats it as the base state and only overrides for the timeline.
 */
export const VIEW_SCRIPT = `(function(){var d=document.documentElement;try{var v=localStorage.getItem('${VIEW_STORAGE_KEY}');if(v!=='climb'&&v!=='timeline')v=matchMedia('${REDUCED_MOTION_QUERY}').matches?'timeline':'climb';d.dataset.view=v}catch(e){d.dataset.view='climb'}})()`;

export function readView(): View {
  return document.documentElement.dataset.view === 'timeline' ? 'timeline' : 'climb';
}

/** The choice that was made, if one was: null means the site is still deciding for them. */
export function storedView(): View | null {
  try {
    const value = localStorage.getItem(VIEW_STORAGE_KEY);

    return value === 'climb' || value === 'timeline' ? value : null;
  } catch {
    return null;
  }
}

export function applyView(view: View) {
  document.documentElement.dataset.view = view;
}

const listOf = (view: View) => document.querySelector<HTMLElement>(`[${LIST_ATTR}='${view}']`);

/** Where a job's card sits in the timeline, with the same gap above it that an anchor jump leaves. */
function timelineTop(job: number): number | null {
  const card = listOf('timeline')?.querySelector<HTMLElement>(`[data-job='${job}']`);

  return card ? card.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET_PX : null;
}

/**
 * Flip the attribute, and land somewhere that makes sense in the view being entered. The two run in opposite
 * directions, so carrying the reader's place across only works one way:
 *
 * - to the timeline, the job they were on, measured after the swap because a hidden list has no geometry;
 * - to the climb, the beginning. It is a story, and the job they were reading in the list is usually near its
 *   end: dropping someone at the summit is not taking them on the climb.
 *
 * Doing it here rather than in an effect is what keeps the scroll inside the view transition, so the page is
 * already in the right place when the new state is captured.
 */
function flip(next: View) {
  if (next === 'climb') {
    applyView(next);
    window.scrollTo({ top: 0, behavior: 'instant' });

    return;
  }

  const job = anchorJobIndex(listOf('climb'), DOCK_PROBE_RATIO);
  applyView(next);
  /* no card had passed the probe: the reader is in the hero, which the timeline answers with its own header */
  if (job === null) return;
  const top = timelineTop(job);
  if (top !== null) window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
}

let running: ViewTransition | null = null;

function track(transition: ViewTransition) {
  running = transition;

  const done = () => {
    /* a newer switch has taken over */
    if (running === transition) running = null;
  };

  transition.finished.then(done, done);
}

/**
 * Switches the climb for the timeline, and remembers the choice. The swap itself is CSS, so a plain cross-fade
 * is the whole animation: the same page, arranged differently. Reduced motion keeps it — a fade is not motion,
 * and these are the readers most likely to be here. Without view transitions the layouts swap at once.
 */
export function switchView(): View {
  const next: View = readView() === 'timeline' ? 'climb' : 'timeline';

  try {
    localStorage.setItem(VIEW_STORAGE_KEY, next);
  } catch {
    /* private mode: the choice lasts until the page is left */
  }

  running?.skipTransition();
  const swap = () => flip(next);

  if (typeof document.startViewTransition === 'function') track(document.startViewTransition(swap));
  else swap();

  return next;
}
