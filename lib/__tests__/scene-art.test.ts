import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WIDE_QUERY } from '@/constants';
import { prepareArt, watchArt } from '@/lib/scene-art';

/** A painting as the stage renders it: no `src`, both files named. */
function painting(theme: 'day' | 'night', phone = true) {
  const img = document.createElement('img');
  img.dataset.art = theme;
  img.dataset.src = `/scene/${theme}.webp`;

  if (phone) {
    img.dataset.srcPhone = `/scene/${theme}-phone.webp`;
  }

  return img;
}

/** A screen: wide (1440 × 900) or a phone held upright (390 × 844), or any size given. */
function wide(matches: boolean, [width, height] = matches ? [1440, 900] : [390, 844]) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query === WIDE_QUERY && matches,
    media: query,
  })) as unknown as typeof window.matchMedia;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

const tick = () => new Promise<void>(resolve => setTimeout(resolve, 0));

describe('scene art', () => {
  const original = {
    matchMedia: window.matchMedia,
    decode: Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode')!,
  };
  let decodes = 0;
  let root: HTMLElement;

  beforeEach(() => {
    decodes = 0;
    Object.defineProperty(HTMLImageElement.prototype, 'decode', {
      configurable: true,
      value(this: HTMLImageElement) {
        decodes++;

        return this.src.includes('broken') ? Promise.reject(new Error('404')) : Promise.resolve();
      },
    });
    root = document.createElement('div');
    document.body.append(root);
  });

  afterEach(() => {
    window.matchMedia = original.matchMedia;
    Object.defineProperty(HTMLImageElement.prototype, 'decode', original.decode);
    root.remove();
    delete document.documentElement.dataset.theme;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 });
    vi.useRealTimers();
  });

  it('picks the phone file on a phone and the full one on a wide screen, once', async () => {
    const [onPhone, onlyFull] = [painting('day'), painting('day', false)];
    root.append(onPhone, onlyFull);
    wide(false);

    await prepareArt(root, 'day');
    expect(onPhone.getAttribute('src')).toBe('/scene/day-phone.webp');
    expect(onPhone.dataset.variant).toBe('phone');
    expect(onlyFull.getAttribute('src')).toBe('/scene/day.webp');

    /* turning the phone sideways never swaps a painting already chosen */
    wide(true);
    await prepareArt(root, 'day');
    expect(onPhone.getAttribute('src')).toBe('/scene/day-phone.webp');
    expect(decodes).toBe(2);
  });

  it('gives a phone on its side the full files: it sees far more than their middle', async () => {
    const onSide = painting('day');
    root.append(onSide);
    wide(false, [844, 390]);

    await prepareArt(root, 'day');

    expect(onSide.getAttribute('src')).toBe('/scene/day.webp');
  });

  it("leaves the other theme's paintings unfetched", async () => {
    const [day, night] = [painting('day'), painting('night')];
    root.append(day, night);
    wide(true);

    await prepareArt(root, 'night');

    expect(night.getAttribute('src')).toBe('/scene/night.webp');
    expect(day).not.toHaveAttribute('src');
  });

  it('shows a painting only once it is decoded, and lets a broken one go without holding the rest', async () => {
    const [good, broken] = [painting('day'), painting('day')];
    broken.dataset.src = '/scene/broken.webp';
    root.append(good, broken);
    wide(true);

    const ready = prepareArt(root, 'day');
    expect(good).not.toHaveAttribute('data-ready');

    await expect(ready).resolves.toBeUndefined();
    expect(good).toHaveAttribute('data-ready');
    expect(broken).not.toHaveAttribute('data-ready');
  });

  it('warms the other theme when the browser is idle, and loads a new theme as soon as it is picked', async () => {
    vi.useFakeTimers();
    const [day, night] = [painting('day'), painting('night')];
    root.append(day, night);
    wide(true);

    const stop = watchArt(root);
    await vi.advanceTimersByTimeAsync(0);
    expect(day).toHaveAttribute('data-ready');
    expect(night).not.toHaveAttribute('src');

    await vi.advanceTimersByTimeAsync(2000);
    expect(night).toHaveAttribute('data-ready');
    stop();
  });

  it('follows a switch to night before the idle warm-up gets there', async () => {
    const [day, night] = [painting('day'), painting('night')];
    root.append(day, night);
    wide(true);

    const stop = watchArt(root);
    document.documentElement.dataset.theme = 'dark';
    await tick();

    expect(night).toHaveAttribute('data-ready');
    stop();
  });
});
