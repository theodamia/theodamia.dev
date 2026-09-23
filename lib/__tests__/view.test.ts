import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY, VIEW_STORAGE_KEY } from '@/constants';
import { LIST_ATTR, readView, storedView, switchView, VIEW_SCRIPT } from '@/lib/view';

const root = document.documentElement;

/**
 * Runs the <head> script with the media query answering as told. It is run as a function rather than as a real
 * <script>: jsdom executes inline scripts in a realm of its own, where `matchMedia` does not exist and nothing
 * can be injected, so the script would only ever reach its `catch`.
 */
function runScript(reducedMotion: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    query => ({ matches: query === REDUCED_MOTION_QUERY && reducedMotion }) as MediaQueryList
  );
  /* eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call --
     the script is this module's own constant, and running the real thing is the point of the test */
  new Function(VIEW_SCRIPT)();
}

describe('the view script', () => {
  beforeEach(() => {
    localStorage.clear();
    root.removeAttribute('data-view');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    root.removeAttribute('data-view');
  });

  it('starts on the climb', () => {
    runScript(false);

    expect(root.dataset.view).toBe('climb');
  });

  it('starts on the timeline for anyone who asked for less motion', () => {
    runScript(true);

    expect(root.dataset.view).toBe('timeline');
  });

  it('lets a stored choice win over the system', () => {
    localStorage.setItem(VIEW_STORAGE_KEY, 'climb');
    runScript(true);

    expect(root.dataset.view).toBe('climb');
    expect(storedView()).toBe('climb');
  });

  it('ignores a stored value it does not recognise', () => {
    localStorage.setItem(VIEW_STORAGE_KEY, 'mountain');
    runScript(false);

    expect(root.dataset.view).toBe('climb');
    expect(storedView()).toBeNull();
  });

  it('reads anything but the timeline as the climb', () => {
    root.dataset.view = 'timeline';
    expect(readView()).toBe('timeline');

    root.removeAttribute('data-view');
    expect(readView()).toBe('climb');
  });
});

/** The page as the switch sees it: two lists of cards, one of them hidden by CSS the test does not load. */
function twoViews(climbTops: number[], timelineTops: number[]) {
  const list = (view: string, tops: number[], reversed: boolean) => {
    const ol = document.createElement('ol');
    ol.setAttribute(LIST_ATTR, view);
    tops.forEach((top, i) => {
      const card = document.createElement('article');
      card.dataset.card = '';
      card.dataset.job = String(reversed ? tops.length - 1 - i : i);
      card.getBoundingClientRect = () => ({ top }) as DOMRect;
      ol.append(card);
    });
    document.body.append(ol);
  };

  list('climb', climbTops, false);
  list('timeline', timelineTops, true);
}

describe('switching', () => {
  beforeEach(() => {
    localStorage.clear();
    root.dataset.view = 'climb';
    window.scrollTo = vi.fn();
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    root.removeAttribute('data-view');
    document.body.innerHTML = '';
  });

  it('takes the job you were on into the timeline', () => {
    /* jobs 0 and 1 are above the probe line; 2 is not, so job 1 is where the reader is */
    twoViews([-900, -200, 700], [2000, 1200, 400]);

    switchView();

    expect(root.dataset.view).toBe('timeline');
    /* job 1 is the second from the end of a list that runs newest first */
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1172, behavior: 'instant' });
  });

  it('starts the climb at the beginning, wherever they were in the list', () => {
    twoViews([-900, -200, 700], [-500, -100, 400]);
    root.dataset.view = 'timeline';

    switchView();

    expect(root.dataset.view).toBe('climb');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });

  it('leaves the scroll alone when the reader is still above the first card', () => {
    twoViews([900, 1600, 2300], [900, 1600, 2300]);

    switchView();

    expect(root.dataset.view).toBe('timeline');
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
