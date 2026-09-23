import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY, VIEW_STORAGE_KEY } from '@/constants';
import { readView, storedView, VIEW_SCRIPT } from '@/lib/view';

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
