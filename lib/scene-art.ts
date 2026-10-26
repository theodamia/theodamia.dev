import { WIDE_QUERY } from '@/constants';
import { usesPhoneArt } from '@/scene/camera';
import type { Theme } from '@/scene/flats';
import { readTheme } from '@/lib/theme';

/**
 * Loading the scene's paintings: where the browser's image loading meets the climb.
 *
 * Every painting is an `<img data-art="day|night">` rendered without a `src`, carrying `data-src` (desktop) and,
 * for the near paintings, `data-src-phone` (the middle a phone can see). Nothing is fetched until this picks the
 * source, once, for the screen the visit starts on, and nothing is shown until its own `decode()` has finished:
 * the image gets `data-ready` and CSS displays it (see "The forward climb" in globals.css). So a painting is never
 * drawn half-decoded in the middle of a scroll, and one that fails to load simply never appears.
 */

const decoded = new WeakMap<HTMLImageElement, Promise<void>>();

/** The scene's theme for what <html> shows. */
export const sceneTheme = (): Theme => (readTheme() === 'dark' ? 'night' : 'day');

/** Fetch and decode one painting, once; marks it ready when it can be drawn. */
function prepareImage(
  img: HTMLImageElement,
  phone: boolean,
  priority: 'high' | 'low'
): Promise<void> {
  const cached = decoded.get(img);
  if (cached) return cached;

  const usePhone = phone && Boolean(img.dataset.srcPhone);
  const source = usePhone ? img.dataset.srcPhone : img.dataset.src;
  if (!source) return Promise.resolve();

  img.dataset.variant = usePhone ? 'phone' : 'desktop';
  img.fetchPriority = priority;
  img.src = source;
  const ready = img.decode().then(
    () => {
      img.dataset.ready = '';
    },
    /* a painting that cannot load is left out; the climb goes on without it */
    () => undefined
  );
  decoded.set(img, ready);

  return ready;
}

/**
 * Decode one theme's paintings under `root`, optionally only those `pick` chooses. Resolves when every one has
 * settled, loaded or not, so a missing file never holds the climb.
 */
export function prepareArt(
  root: ParentNode,
  theme: Theme,
  pick: (img: HTMLImageElement) => boolean = () => true,
  priority: 'high' | 'low' = 'high'
): Promise<void> {
  const phone = usesPhoneArt({
    width: window.innerWidth,
    height: window.innerHeight,
    wide: window.matchMedia(WIDE_QUERY).matches,
  });
  const images = Array.from(root.querySelectorAll<HTMLImageElement>(`img[data-art='${theme}']`));

  return Promise.allSettled(
    images.filter(pick).map(img => prepareImage(img, phone, priority))
  ).then(() => undefined);
}

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** Safari has no idle callback: a short timeout stands in. */
const IDLE_FALLBACK_MS = 1200;

/**
 * After the first frame: the rest of the visit's theme at low priority, the other theme when the browser is idle
 * (so switching day and night finds it decoded), and the new theme first whenever it changes. Returns a cleanup.
 */
export function watchArt(root: ParentNode): () => void {
  const idle = window as IdleWindow;
  const theme = sceneTheme();
  void prepareArt(root, theme, undefined, 'low');
  const other: Theme = theme === 'day' ? 'night' : 'day';
  const warm = () => void prepareArt(root, other, undefined, 'low');
  const handle = idle.requestIdleCallback
    ? idle.requestIdleCallback(warm)
    : window.setTimeout(warm, IDLE_FALLBACK_MS);

  const observer = new MutationObserver(() => void prepareArt(root, sceneTheme()));
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });

  return () => {
    observer.disconnect();

    if (idle.cancelIdleCallback) {
      idle.cancelIdleCallback(handle);
    } else {
      window.clearTimeout(handle);
    }
  };
}
