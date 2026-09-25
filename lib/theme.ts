import {
  DARK_SCHEME_QUERY,
  REDUCED_MOTION_QUERY,
  THEME_REVEAL,
  THEME_STORAGE_KEY,
} from '@/constants';
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

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);

    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

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
 * Switches day and night from a button, and remembers the choice.
 *
 * The new theme spreads from the button's centre as a soft-edged circle: a view transition keeps the old page
 * still and shows the new one through a radial mask whose radius (`--reveal-r`) grows from 0 to past the farthest
 * corner. The new view is the live page, so anything that transitions in it shows through the circle. Before
 * switching, every `[data-wave]` element gets a `--wave-delay`: when the edge will be half way across it. The sun
 * turns into the moon, and each star comes out, just as the night reaches it.
 *
 * With reduced motion it is the browser's own short cross-fade and no wave. Without view transitions the colours
 * switch at once, but the sky still changes on the wave.
 */
export function switchTheme(from: HTMLElement): Theme {
  const root = document.documentElement;
  const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';

  const flip = () => {
    root.dataset.theme = next;
  };

  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* private mode: the choice lasts until the page is left */
  }

  running?.skipTransition();
  const canReveal = typeof document.startViewTransition === 'function';

  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    clearWave(root);

    if (canReveal) {
      track(document.startViewTransition(flip));
    } else {
      flip();
    }

    return next;
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

    return next;
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

  return next;
}
