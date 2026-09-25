import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DARK_SCHEME_QUERY, REDUCED_MOTION_QUERY } from '@/constants';
import { THEME_STORAGE_KEY } from '@/lib/theme';
import { ThemeToggle } from '@/components/theme-toggle';

const root = document.documentElement;

/** A matchMedia whose answers the test picks, keeping hold of every change listener. */
function mockMedia(matching: string[]) {
  const listeners: (() => void)[] = [];
  vi.spyOn(window, 'matchMedia').mockImplementation(
    query =>
      ({
        matches: matching.includes(query),
        media: query,
        addEventListener: (_: string, listener: () => void) => listeners.push(listener),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList
  );

  return listeners;
}

/** A stand-in for the browser's view transition: runs the switch at once, finishes when told to. */
function mockViewTransition() {
  let finish = () => {};

  const finished = new Promise<undefined>(resolve => {
    finish = () => resolve(undefined);
  });
  const start = vi.fn((update: () => void) => {
    update();

    return {
      ready: Promise.resolve(),
      finished,
      updateCallbackDone: Promise.resolve(),
      skipTransition: vi.fn(),
    };
  });
  Object.defineProperty(document, 'startViewTransition', { value: start, configurable: true });

  return { start, finish };
}

/** Something in the sky, at a given place on screen. */
function skyThing(x: number, y: number) {
  const el = document.createElement('span');
  el.dataset.wave = '';
  el.getBoundingClientRect = () => ({ left: x, top: y, width: 0, height: 0 }) as DOMRect;
  document.body.append(el);

  return el;
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    root.dataset.theme = 'light';
    localStorage.clear();
    vi.stubGlobal('CSS', { supports: () => true });
    mockMedia([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(document, 'startViewTransition');
    root.className = '';
    root.removeAttribute('style');
    document.body.innerHTML = '';
  });

  it('switches to night, remembers it and then offers the day', async () => {
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to night' }));

    expect(root.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(await screen.findByRole('button', { name: 'Switch to day' })).toBeInTheDocument();
  });

  it('keeps its icons out of the accessibility tree', () => {
    render(<ThemeToggle />);

    const svgs = screen.getByRole('button').querySelectorAll('svg');
    expect(svgs).toHaveLength(2);
    svgs.forEach(svg => expect(svg).toHaveAttribute('aria-hidden', 'true'));
  });

  it('spreads the night from the button, reaching the nearest things in the sky first', async () => {
    const { start, finish } = mockViewTransition();
    root.animate = vi.fn();
    const near = skyThing(120, 100);
    const far = skyThing(900, 40);
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Switch to night' });
    button.getBoundingClientRect = () =>
      ({ left: 100, top: 700, width: 44, height: 44 }) as DOMRect;

    await userEvent.click(button);

    expect(start).toHaveBeenCalledTimes(1);
    expect(root.dataset.theme).toBe('dark');
    expect(root).toHaveClass('theme-reveal');
    expect(root.style.getPropertyValue('--reveal-x')).toBe('122.0px');
    expect(root.style.getPropertyValue('--reveal-y')).toBe('722.0px');
    const delay = (el: HTMLElement) => parseInt(el.style.getPropertyValue('--wave-delay'), 10);
    expect(delay(near)).toBeGreaterThan(0);
    expect(delay(far)).toBeGreaterThan(delay(near));
    expect(root.animate).toHaveBeenCalledWith(
      { '--reveal-r': ['0px', expect.stringMatching(/px$/)] },
      /* held at the end: otherwise the radius drops to 0 before the transition ends and the old page flashes */
      expect.objectContaining({ pseudoElement: '::view-transition-new(root)', fill: 'forwards' })
    );

    await act(async () => finish());
    expect(root).not.toHaveClass('theme-reveal');
    expect(root.style.getPropertyValue('--reveal-x')).toBe('');
    expect(near.style.getPropertyValue('--wave-delay')).toBe('');
  });

  it('with reduced motion, leaves the browser a plain cross-fade: no circle, no wave', async () => {
    mockMedia([REDUCED_MOTION_QUERY]);
    const { start } = mockViewTransition();
    const star = skyThing(300, 50);
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to night' }));

    expect(start).toHaveBeenCalledTimes(1);
    expect(root.dataset.theme).toBe('dark');
    expect(root).not.toHaveClass('theme-reveal');
    expect(star.style.getPropertyValue('--wave-delay')).toBe('');
  });

  it('still switches, and still times the sky, where view transitions are missing', async () => {
    const star = skyThing(300, 50);
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to night' }));

    expect(root.dataset.theme).toBe('dark');
    expect(star.style.getPropertyValue('--wave-delay')).toMatch(/^\d+ms$/);
  });

  it('follows the system until someone picks, and not after', async () => {
    const listeners = mockMedia([DARK_SCHEME_QUERY]);
    render(<ThemeToggle />);

    act(() => listeners.forEach(listener => listener()));
    expect(root.dataset.theme).toBe('dark');

    await userEvent.click(await screen.findByRole('button', { name: 'Switch to day' }));
    act(() => listeners.forEach(listener => listener()));
    expect(root.dataset.theme).toBe('light');
  });
});
