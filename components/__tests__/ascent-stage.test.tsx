import { act, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AscentStage } from '@/components/scene/ascent-stage';
import { WIDE_QUERY } from '@/constants';
import { CAMP_COUNT, type SceneHandle } from '@/scene/world';
import { BACKDROP_TILES, FIRST_POSE, poseAt } from '@/scene/camera';
import { BACKDROP, CLOUDS, FLATS } from '@/scene/flats';

const VIEW = { width: 1440, height: 900 };

/** The decodes the stage waits on, released by hand so a test can look at the stage before and after. */
let release: () => void = () => {};

/** Layout reads: the stage may measure on resize, never during a frame. */
let layoutReads = 0;

function holdDecodes() {
  const gate = new Promise<void>(resolve => {
    release = resolve;
  });
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    value: () => gate,
  });
}

function stage(props: Partial<{ reducedMotion: boolean; stop: number; climbOver: boolean }> = {}) {
  const ref = createRef<SceneHandle>();
  const all = { reducedMotion: false, stop: 0, climbOver: false, ...props };
  const view = render(<AscentStage ref={ref} {...all} />);
  const root = view.container.firstElementChild as HTMLElement;
  const flat = (id: string) => root.querySelector<HTMLElement>(`[data-scene-flat='${id}']`)!;
  const rerender = (next: Partial<typeof all>) =>
    view.rerender(<AscentStage ref={ref} {...all} {...next} />);

  return { ref, root, flat, rerender, handle: () => ref.current! };
}

/** Every style write under `root` from now on, as [element, attribute value before] pairs. */
function recordWrites(root: HTMLElement) {
  const writes: MutationRecord[] = [];
  const observer = new MutationObserver(records => writes.push(...records));
  observer.observe(root, { subtree: true, attributeFilter: ['style'], attributeOldValue: true });

  return () => {
    writes.push(...observer.takeRecords());
    observer.disconnect();

    return writes;
  };
}

/** The style properties an element carries, by name. */
const propertiesOf = (el: Element) => Array.from((el as HTMLElement).style);

/** Let the decode promises and the effects that wait on them run. */
const settle = () => act(() => new Promise<void>(resolve => setTimeout(resolve, 0)));

describe('the climb stage', () => {
  const original = {
    matchMedia: window.matchMedia,
    decode: Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode')!,
    clientWidth: Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth')!,
    clientHeight: Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight')!,
  };

  beforeEach(() => {
    layoutReads = 0;
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === WIDE_QUERY,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => (layoutReads++, VIEW.width),
    });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get: () => (layoutReads++, VIEW.height),
    });
    holdDecodes();
  });

  afterEach(() => {
    window.matchMedia = original.matchMedia;
    Object.defineProperty(HTMLImageElement.prototype, 'decode', original.decode);
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', original.clientWidth);
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', original.clientHeight);
    delete document.documentElement.dataset.theme;
  });

  it("fetches only the hero's paintings and the sky's clouds, in the visit's theme, before anything moves", () => {
    document.documentElement.dataset.theme = 'dark';
    const { root } = stage();

    const fetched = Array.from(root.querySelectorAll<HTMLImageElement>('img[src]'));
    expect(fetched.length).toBeGreaterThan(0);
    fetched.forEach(img => {
      expect(img.dataset.art).toBe('night');
      if (img.closest('.scene-cloud')) return;
      const id = img.closest<HTMLElement>('[data-scene-flat]')!.dataset.sceneFlat;
      const lod = img.closest<HTMLElement>('[data-lod]')!.dataset.lod;
      expect(FIRST_POSE).toContainEqual({ id, lod });
    });
    expect(root.querySelector('.scene-flag-part img[src]')).toBeNull();
  });

  it('holds its pose until the first view is decoded, then paints the latest frame once', async () => {
    const { root, flat, handle } = stage();
    act(() => {
      handle().resize({ laneGap: null });
      handle().applyFrame({ leg: 0, f: 0.2 });
      handle().applyFrame({ leg: 0, f: 0.6 });
    });

    expect(flat(FLATS[0].id).style.transform).toBe('');
    expect(root).not.toHaveAttribute('data-posed');

    release();
    await settle();

    expect(root).toHaveAttribute('data-posed');
    const pose = poseAt(0.6, { ...VIEW, wide: true, laneGap: null });
    const peak = pose.flats.find(item => item.id === 'peak')!;
    expect(flat('peak').style.transform).toContain(`scale(${peak.scale.toFixed(5)})`);
    expect(flat('peak').style.transform).toContain(`translate3d(${Math.round(peak.x)}px`);
  });

  it('writes only transforms and opacities per frame, reads no layout, and skips what has not changed', async () => {
    const { root, handle } = stage();
    act(() => handle().resize({ laneGap: 720 }));
    release();
    await settle();

    const before = new Map(
      Array.from(root.querySelectorAll('[style]')).map(el => [el, propertiesOf(el)])
    );
    const reads = layoutReads;
    const stop = recordWrites(root);
    [0.5, 1.4, 2.75, 4.9].forEach(u => {
      handle().applyFrame({ leg: Math.floor(u), f: u % 1 });
    });
    const writes = stop();

    expect(writes.length).toBeGreaterThan(0);
    expect(layoutReads).toBe(reads);
    root.querySelectorAll('[style]').forEach(el => {
      const added = propertiesOf(el).filter(name => !(before.get(el) ?? []).includes(name));
      added.forEach(name => expect(['transform', 'opacity']).toContain(name));
    });

    const again = recordWrites(root);
    handle().applyFrame({ leg: 4, f: 0.9 });
    expect(again()).toHaveLength(0);
  });

  it('paints its clouds: a day and a night picture each, decoded with the first view', () => {
    document.documentElement.dataset.theme = 'dark';
    const { root } = stage();
    const clouds = Array.from(root.querySelectorAll('.scene-cloud'));

    /* the farthest clouds are smaller copies of the paintings: more sky, no more bytes */
    expect(clouds.length).toBeGreaterThan(CLOUDS.length);
    const sources = clouds.map(cloud => cloud.querySelector('img')!.dataset.src);
    expect(new Set(sources).size).toBe(CLOUDS.length);
    clouds.forEach(cloud => {
      expect(cloud.querySelectorAll("img[data-art='day']")).toHaveLength(1);
      expect(cloud.querySelector("img[data-art='night']")).toHaveAttribute('src');
    });
  });

  it('fades the snow in with the climb, and lets it fall only from the camp below the snowline', async () => {
    const { root, handle, rerender } = stage({ stop: 1 });
    act(() => handle().resize({ laneGap: null }));
    release();
    await settle();

    const layers = Array.from(root.querySelectorAll<HTMLElement>('.snow-density'));
    expect(layers).toHaveLength(2);
    expect(root.querySelector('.snow-layer')).not.toHaveAttribute('data-snowing');

    act(() => handle().applyFrame({ leg: 4, f: 0 }));
    expect(layers.map(layer => Number(layer.style.opacity))).toEqual([1, 0]);

    rerender({ stop: 3 });
    expect(root.querySelector('.snow-layer')).toHaveAttribute('data-snowing');
  });

  it("sizes today's door on resize and moves it with the camp by transform alone", async () => {
    const doorRef = { current: document.createElement('button') };
    document.body.append(doorRef.current);
    const ref = createRef<SceneHandle>();
    render(<AscentStage ref={ref} reducedMotion={false} stop={5} climbOver doorRef={doorRef} />);
    act(() => ref.current!.resize({ laneGap: null }));

    /* resize sets its box (layout-time); nothing has moved it yet */
    const sized = propertiesOf(doorRef.current);
    expect(sized).toEqual(expect.arrayContaining(['width', 'height', 'margin-left', 'margin-top']));
    expect(sized).not.toContain('transform');

    release();
    await settle();
    act(() => ref.current!.applyFrame({ leg: 4, f: 0.98 }));

    /* a frame adds only its transform */
    expect(propertiesOf(doorRef.current).filter(name => !sized.includes(name))).toEqual([
      'transform',
    ]);
    expect(doorRef.current.style.transform).toMatch(/^translate3d\(/);
    doorRef.current.remove();
  });

  it('lays the backdrop as copies of one picture over its haze fill', () => {
    const { flat } = stage();
    const copies = Array.from(flat(BACKDROP.id).querySelectorAll<HTMLElement>('[data-tile]'));

    expect(copies.map(copy => Number(copy.dataset.tile))).toEqual(BACKDROP_TILES);
    expect(flat(BACKDROP.id).querySelector('.scene-foot')).not.toBeNull();

    for (const theme of ['day', 'night']) {
      const sources = copies.map(copy => {
        const pictures = copy.querySelectorAll<HTMLImageElement>(`img[data-art='${theme}']`);
        expect(pictures).toHaveLength(1);

        return pictures[0].dataset.src;
      });
      /* one URL: one download and one decode for every copy */
      expect(new Set(sources).size).toBe(1);
    }
  });

  it('raises the flag and lights the name of every camp reached, and lowers them on the way down', () => {
    const { root, rerender } = stage({ stop: 0 });
    const labels = () =>
      Array.from(root.querySelectorAll('[data-scene-label]'), el =>
        el.getAttribute('data-reached')
      );
    /* by camp: the flats are painted farthest first, so the page order is the climb's in reverse */
    const pennants = () =>
      Array.from(root.querySelectorAll('.scene-pennant'), el => {
        const id = el.closest<HTMLElement>('[data-scene-flat]')!.dataset.sceneFlat;

        return [
          FLATS.find(item => item.id === id)!.camp!,
          el.getAttribute('data-reached'),
        ] as const;
      })
        .sort(([a], [b]) => a - b)
        .map(([, reached]) => reached);

    expect(labels()).toHaveLength(CAMP_COUNT);
    expect(labels()).toEqual(['true', ...Array<string>(CAMP_COUNT - 1).fill('false')]);
    /* the trailhead has no flag: one pennant per job camp */
    expect(pennants()).toHaveLength(CAMP_COUNT - 1);
    expect(pennants().every(reached => reached === 'false')).toBe(true);

    rerender({ stop: 2 });
    expect(labels().slice(0, 4)).toEqual(['true', 'true', 'true', 'false']);
    expect(pennants().slice(0, 3)).toEqual(['true', 'true', 'false']);

    rerender({ stop: 1 });
    expect(pennants().slice(0, 2)).toEqual(['true', 'false']);
  });

  it('with reduced motion, moves nothing per frame and changes stops under the veil', async () => {
    const { root, flat, handle, rerender } = stage({ reducedMotion: true, stop: 0 });
    act(() => handle().resize({ laneGap: null }));
    release();
    await settle();

    const atTrailhead = flat('peak').style.transform;
    expect(atTrailhead).not.toBe('');

    const frames = recordWrites(root);
    [0.3, 0.8, 1.2].forEach(u => handle().applyFrame({ leg: Math.floor(u), f: u % 1 }));
    expect(frames()).toHaveLength(0);

    rerender({ reducedMotion: true, stop: 1 });
    const veil = root.querySelector('.scene-veil')!;
    expect(veil).toHaveAttribute('data-on');

    await act(() => new Promise<void>(resolve => setTimeout(resolve, 200)));
    expect(veil).not.toHaveAttribute('data-on');
    expect(flat('peak').style.transform).not.toBe(atTrailhead);
  });
});
