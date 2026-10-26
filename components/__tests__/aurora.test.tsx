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

/** The sky for these tests: the top half of the screen, but for a peak standing up on the right. */
const sky = (x: number, y: number) => y < 450 && x < 1000;

/** A pointer move over the scene (the window) or over something on the page. */
const move = (clientX: number, clientY: number, over: EventTarget = window) =>
  act(async () => {
    over.dispatchEvent(new MouseEvent('pointermove', { clientX, clientY, bubbles: true }));
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
    const { container } = render(<Aurora isSky={sky} />);
    const images = container.querySelectorAll('img');

    expect(images).toHaveLength(AURORA.length);
    images.forEach(img => expect(img).not.toHaveAttribute('src'));
  });

  it('glows in by night while the pointer is over the sky, and leans toward it', async () => {
    pointer(true);
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<Aurora isSky={sky} />);
    const aurora = container.querySelector<HTMLElement>('.aurora')!;

    await move(900, 120);
    expect(aurora).toHaveAttribute('data-lit');
    expect(aurora.style.getPropertyValue('--lean')).toBe(`${((900 - 720) * 0.08).toFixed(1)}px`);
    container.querySelectorAll('img').forEach(img => expect(img).toHaveAttribute('src'));
  });

  it('lingers after the pointer leaves the sky, then fades', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    pointer(true);
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<Aurora isSky={sky} />);
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

  it('stays dark over the mountains, however high they stand', async () => {
    pointer(true);
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<Aurora isSky={sky} />);

    await move(1200, 60);
    expect(container.querySelector('.aurora')).not.toHaveAttribute('data-lit');
  });

  it('stays dark over the page laid on the scene: a card, a control, or words where they are drawn', async () => {
    pointer(true);
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(
      <>
        <Aurora isSky={sky} />
        <article data-card>
          <span>Geekbot</span>
        </article>
        <button type='button'>Start the climb</button>
        <h1>Theodore Damianidis</h1>
      </>
    );
    const aurora = container.querySelector('.aurora')!;
    const heading = container.querySelector('h1')!;
    /* jsdom lays nothing out: the heading's words are drawn from x 100 to 400, y 100 to 160 */
    const words = { left: 100, right: 400, top: 100, bottom: 160 } as DOMRect;
    Range.prototype.getClientRects = () => [words] as unknown as DOMRectList;

    await move(200, 120, container.querySelector('span')!);
    await move(200, 120, container.querySelector('button')!);
    await move(200, 120, heading);
    expect(aurora).not.toHaveAttribute('data-lit');

    /* the same line, past the end of its words, is the sky again */
    await move(700, 120, heading);
    expect(aurora).toHaveAttribute('data-lit');
    delete (Range.prototype as Partial<Range>).getClientRects;
  });

  it('stays dark by day, and on a screen without a hovering pointer', async () => {
    pointer(true);
    const day = render(<Aurora isSky={sky} />);
    await move(700, 100);
    expect(day.container.querySelector('.aurora')).not.toHaveAttribute('data-lit');
    day.unmount();

    pointer(false);
    document.documentElement.dataset.theme = 'dark';
    const phone = render(<Aurora isSky={sky} />);
    await move(700, 100);
    expect(phone.container.querySelector('.aurora')).not.toHaveAttribute('data-lit');
    phone.container.querySelectorAll('img').forEach(img => expect(img).not.toHaveAttribute('src'));
  });
});
