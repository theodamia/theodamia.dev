import { DARK_SCHEME_QUERY, REDUCED_MOTION_QUERY } from '@/constants';

/** Where an explicit day or night choice is kept. Until there is one, the site follows the system. */
export const THEME_STORAGE_KEY = 'theme';

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
import { timeAtProgress } from '@/utils/time-at-progress';

export type Theme = 'light' | 'dark';

/** The scene's colours are written with `light-dark()`; a browser without it stays in daylight. */
const NIGHT_TEST = "CSS.supports('color','light-dark(#000,#fff)')";

/**
 * Runs in <head> before the first paint, so the page never shows the wrong sky: the stored choice, or else the
 * system's. `data-theme` on <html> is the only switch; CSS derives everything else from it.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark')t=matchMedia('${DARK_SCHEME_QUERY}').matches?'dark':'light';if(!${NIGHT_TEST})t='light';d.dataset.theme=t}catch(e){d.dataset.theme='light'}})()`;

/** Marks <html> while the reveal runs; the view transition rules in globals.css are scoped to it. */
const REVEAL_CLASS = 'theme-reveal';
const REVEAL_PROPS = ['--reveal-x', '--reveal-y', '--reveal-feather'];
/** Things in the sky that change as the reveal's edge passes them rather than all at once: the sun, the stars. */
const WAVE_TARGETS = '[data-wave]';
const REVEAL_EASING = `cubic-bezier(${THEME_REVEAL.EASE.join(', ')})`;

let running: ViewTransition | null = null;

/** What the page is showing right now, read from <html> rather than from state, which may not exist yet. */
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** The choice someone made here before, or null if they never picked and the system still decides. */
export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);

    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Whether this browser can show the night at all. The scene's generated colours are written as `light-dark()`
 * pairs, so without it the mountain would keep its daylight while the interface went dark: the switch hides
 * instead (see the `not-supports-` classes on the dock) and the site stays in daylight.
 */
export function supportsNight(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports('color', 'light-dark(#000,#fff)');
}

function clearWave(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>(WAVE_TARGETS)
    .forEach(el => el.style.removeProperty('--wave-delay'));
}

/** A plain switch, everything at once: for the system's own changes. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  clearWave(root);
  root.dataset.theme = theme;
}

function track(transition: ViewTransition, cleanUp?: () => void) {
  running = transition;

  const done = () => {
    /* a newer switch has taken over and cleans up after itself */
    if (running !== transition) return;
    running = null;
    cleanUp?.();
  };

  transition.finished.then(done, done);
}

/**
 * Changes the world from a button: the theme, the season, anything that is one attribute on <html>.
 *
 * The new look spreads from the button as a soft-edged circle — a view transition holds the old page still and
 * masks the new one behind a radius (`--reveal-r`) growing past the farthest corner. The new view is the *live*
 * page, so anything transitioning in it shows through. Each `[data-wave]` element first gets a `--wave-delay` for
 * when the edge will reach it, which is how the sun turns to the moon and the stars come out in order.
 *
 * Reduced motion gets the browser's own cross-fade and no wave; without view transitions the colours switch at
 * once but the sky still waves. `flip` runs inside the transition and must only set the attribute.
 */
export function reveal(from: HTMLElement, flip: () => void): void {
  const root = document.documentElement;

  running?.skipTransition();
  const canReveal = typeof document.startViewTransition === 'function';

  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    clearWave(root);

    if (canReveal) {
      track(document.startViewTransition(flip));
    } else {
      flip();
    }

    return;
  }

  const box = from.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  const feather = Math.min(
    THEME_REVEAL.FEATHER_MAX_PX,
    Math.max(THEME_REVEAL.FEATHER_MIN_PX, radius * THEME_REVEAL.FEATHER_SHARE)
  );
  const reach = radius + feather;

  root.querySelectorAll<HTMLElement>(WAVE_TARGETS).forEach(el => {
    const rect = el.getBoundingClientRect();
    const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
    const share = timeAtProgress(THEME_REVEAL.EASE, (distance + feather / 2) / reach);
    el.style.setProperty('--wave-delay', `${Math.round(share * THEME_REVEAL.DURATION_MS)}ms`);
  });

  if (!canReveal) {
    flip();

    return;
  }

  root.classList.add(REVEAL_CLASS);
  root.style.setProperty('--reveal-x', `${x.toFixed(1)}px`);
  root.style.setProperty('--reveal-y', `${y.toFixed(1)}px`);
  root.style.setProperty('--reveal-feather', `${feather.toFixed(1)}px`);
  const transition = document.startViewTransition(flip);
  let reveal: Animation | undefined;
  transition.ready
    .then(() => {
      reveal = root.animate(
        { '--reveal-r': ['0px', `${reach.toFixed(1)}px`] },
        {
          duration: THEME_REVEAL.DURATION_MS,
          easing: REVEAL_EASING,
          /*
           * Hold the full circle once it is done. Without it the radius drops back to its resting 0px for the frame
           * or two before the browser tears the transition down, the new page is masked out again, and the old one
           * flashes.
           */
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {
      /* skipped by a newer switch before it started */
    });
  /* a filled animation never ends on its own: drop it once the transition is gone and nothing is masked any more */
  const dropReveal = () => reveal?.cancel();
  transition.finished.then(dropReveal, dropReveal);
  track(transition, () => {
    root.classList.remove(REVEAL_CLASS);
    REVEAL_PROPS.forEach(prop => root.style.removeProperty(prop));
    clearWave(root);
  });
}

/**
 * Whether a reveal is sweeping the page right now. The new view a reveal shows is the live page, not a snapshot,
 * so something changed while one is running is carried by that sweep — a caller can use this to change the world
 * again without cutting the sweep short and starting another.
 */
export function isRevealing(): boolean {
  return running !== null;
}

/** Remembers a choice, where the browser allows it. In private mode it lasts until the page is left. */
export function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: the choice lasts until the page is left */
  }
}

/** Switches day and night from a button, and remembers the choice. */
export function switchTheme(from: HTMLElement): Theme {
  const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
  remember(THEME_STORAGE_KEY, next);
  reveal(from, () => {
    document.documentElement.dataset.theme = next;
  });

  return next;
}
