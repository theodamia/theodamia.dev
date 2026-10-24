import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Aurora } from '@/components/scene/aurora';
import { AURORA } from '@/scene/flats';

/** A screen with a hovering pointer, or without one (a phone). */
function pointer(hover: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: hover && query.includes('hover: hover'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const move = (clientX: number, clientY: number) =>
  act(async () => {
    window.dispatchEvent(new MouseEvent('pointermove', { clientX, clientY }));
    await new Promise(resolve => setTimeout(resolve, 0));
  });

describe('Aurora', () => {
  const original = { matchMedia: window.matchMedia, raf: window.requestAnimationFrame };

  beforeEach(() => {
    window.requestAnimationFrame = (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(0), 0);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
  });

  afterEach(() => {
    window.matchMedia = original.matchMedia;
    window.requestAnimationFrame = original.raf;
    delete document.documentElement.dataset.theme;
  });

  it('holds its painted layers without fetching them', () => {
    pointer(true);
    const { container } = render(<Aurora />);
    const images = container.querySelectorAll('img');

    expect(images).toHaveLength(AURORA.length);
    images.forEach(img => expect(img).not.toHaveAttribute('src'));
  });

  it('glows in by night while the pointer is over the sky, and leans toward it', async () => {
    pointer(true);
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<Aurora />);
    const aurora = container.querySelector<HTMLElement>('.aurora')!;

    await move(1200, 120);
    expect(aurora).toHaveAttribute('data-lit');
    expect(aurora.style.getPropertyValue('--lean')).toBe(`${((1200 - 720) * 0.08).toFixed(1)}px`);
    container.querySelectorAll('img').forEach(img => expect(img).toHaveAttribute('src'));
  });

  it('lingers after the pointer leaves the sky, then fades', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    pointer(true);
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<Aurora />);
    const aurora = container.querySelector<HTMLElement>('.aurora')!;

    await act(async () => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 400, clientY: 100 }));
      await vi.advanceTimersByTimeAsync(20);
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 400, clientY: 700 }));
      await vi.advanceTimersByTimeAsync(20);
    });
    expect(aurora).toHaveAttribute('data-lit');

    await act(() => vi.advanceTimersByTimeAsync(3000));
    expect(aurora).not.toHaveAttribute('data-lit');
    vi.useRealTimers();
  });

  it('stays dark by day, and on a screen without a hovering pointer', async () => {
    pointer(true);
    const day = render(<Aurora />);
    await move(700, 100);
    expect(day.container.querySelector('.aurora')).not.toHaveAttribute('data-lit');
    day.unmount();

    pointer(false);
    document.documentElement.dataset.theme = 'dark';
    const phone = render(<Aurora />);
    await move(700, 100);
    expect(phone.container.querySelector('.aurora')).not.toHaveAttribute('data-lit');
    phone.container.querySelectorAll('img').forEach(img => expect(img).not.toHaveAttribute('src'));
  });
});
