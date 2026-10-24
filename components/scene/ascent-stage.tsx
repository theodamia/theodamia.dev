'use client';

import type React from 'react';
import { useEffect, useEffectEvent, useImperativeHandle, useRef } from 'react';
import { Aurora } from '@/components/scene/aurora';
import { SceneFlat } from '@/components/scene/scene-flat';
import { SnowLayer } from '@/components/scene/snow-layer';
import { Celestial, Clouds, Daylight, Meteors, Sky, Stars } from '@/components/scene/sky';
import { WIDE_QUERY } from '@/constants';
import { JOBS, TRAILHEAD } from '@/content/jobs';
import { SUMMIT_LINE } from '@/content/site';
import { prepareArt, sceneTheme, watchArt } from '@/lib/scene-art';
import { FIRST_POSE, poseAt, SNOWLINE_CAMP, STAGE_SCALE_CSS, type View } from '@/scene/camera';
import { FLATS } from '@/scene/flats';
import type { SceneFrame, SceneHandle, SceneLayout } from '@/scene/world';

/** Reduced motion: the scene changes between stops under a veil in the sky's colour, never by moving. */
const VEIL_MS = 130;
/** The camps by index, as the labels name them: the trailhead, then one per job. */
const CAMPS = [
  { place: TRAILHEAD.label, year: TRAILHEAD.year },
  ...JOBS.map(job => ({ place: job.place, year: job.start })),
];

type AscentStageProps = {
  /** With reduced motion nothing moves per frame: each stop is a still, swapped under a veil. */
  reducedMotion: boolean;
  /** Index of the camp the climber has reached (0 is the trailhead): its flag is up, its name lit. */
  stop: number;
  /** True once the climb is over and the closing card is up: the summit's line fades out. */
  climbOver: boolean;
  ref: React.Ref<SceneHandle>;
};

type Layers = {
  flats: { id: string; el: HTMLElement; near: HTMLElement | null; far: HTMLElement | null }[];
  labels: HTMLElement[];
};

/**
 * The scene's renderer: a sticky, screen-sized stage of whole painted flats that the camera walks into (see
 * scene/camera.ts). It implements `SceneHandle`, so the rest of the app only hands it a frame.
 *
 * A frame writes device-pixel-snapped transforms and opacities on whole layers, each only when it changes: no CSS
 * variables, no layout reads, no React state. That is what keeps the scroll smooth. Nothing moves until the
 * paintings of the first view are decoded; after that each painting shows as soon as its own decode finishes.
 */
export function AscentStage({ reducedMotion, stop, climbOver, ref }: AscentStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const day = useRef<HTMLDivElement>(null);
  const summit = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const snow = useRef<HTMLDivElement>(null);
  const squall = useRef<HTMLDivElement>(null);
  const layers = useRef<Layers>({ flats: [], labels: [] });
  const view = useRef<View>({ width: 0, height: 0, wide: true, laneGap: null });
  const snap = useRef((value: number) => value);
  /** The last value written per element and property, so an unchanged layer is left alone. */
  const written = useRef(new Map<HTMLElement, Record<string, string>>());
  /** Frames wait for the first view's paintings; the latest one is painted when they are ready. */
  const ready = useRef(false);
  const pending = useRef<SceneFrame | null>(null);
  const decoding = useRef<Promise<void> | null>(null);

  const write = (el: HTMLElement | null, property: 'transform' | 'opacity', value: string) => {
    if (!el) return;
    const last = written.current.get(el) ?? {};
    if (last[property] === value) return;

    last[property] = value;
    written.current.set(el, last);
    el.style[property] = value;
  };

  const paint = (u: number) => {
    if (!view.current.height) return;
    const pose = poseAt(u, view.current);
    const px = (value: number) => `${snap.current(value)}px`;

    pose.flats.forEach((flat, i) => {
      const layer = layers.current.flats[i];
      if (!layer) return;

      write(
        layer.el,
        'transform',
        `translate3d(${px(flat.x)},${px(flat.y)},0) scale(${flat.scale.toFixed(5)})`
      );
      write(layer.el, 'opacity', flat.opacity.toFixed(3));

      if (layer.far) {
        write(layer.near, 'opacity', flat.near.toFixed(3));
        write(layer.far, 'opacity', flat.far.toFixed(0));
      }
    });

    pose.labels.forEach(label => {
      const el = layers.current.labels[label.camp];
      write(el, 'transform', `translate3d(${px(label.x)},${px(label.y)},0)`);
      write(el, 'opacity', label.opacity.toFixed(3));
    });

    write(summit.current, 'transform', `translate3d(${px(pose.summit.x)},${px(pose.summit.y)},0)`);
    write(summit.current, 'opacity', pose.summit.opacity.toFixed(3));
    write(snow.current, 'opacity', pose.snow.falling.toFixed(3));
    write(squall.current, 'opacity', pose.snow.thick.toFixed(3));
    /* dawn turns to day as you climb (by night, dusk to midnight) */
    write(day.current, 'opacity', pose.daylight.toFixed(3));
  };

  /* no dependency array: every frame must see the current props, and the rest lives in refs */
  useImperativeHandle(ref, () => ({
    resize({ laneGap }: SceneLayout) {
      const root = stage.current;
      if (!root) return;

      view.current = {
        width: root.clientWidth,
        height: root.clientHeight,
        wide: window.matchMedia(WIDE_QUERY).matches,
        laneGap,
      };
      const dpr = window.devicePixelRatio || 1;
      snap.current = (value: number) => Math.round(value * dpr) / dpr;
      written.current = new Map();
      layers.current = {
        flats: FLATS.map(flat => {
          const el = root.querySelector<HTMLElement>(`[data-scene-flat='${flat.id}']`)!;

          return {
            id: flat.id,
            el,
            near: el.querySelector<HTMLElement>(":scope > [data-lod='near']"),
            far: el.querySelector<HTMLElement>(":scope > [data-lod='far']"),
          };
        }),
        labels: Array.from(root.querySelectorAll<HTMLElement>('[data-scene-label]')),
      };
    },
    applyFrame(frame: SceneFrame) {
      pending.current = frame;
      if (!ready.current || reducedMotion) return;

      paint(frame.leg + frame.f);
    },
  }));

  /* the gate opens: paint the latest frame (with reduced motion, the stop), show the stage, load the rest */
  const open = useEffectEvent((root: HTMLElement) => {
    ready.current = true;
    const frame = pending.current;
    paint(reducedMotion || !frame ? stop : frame.leg + frame.f);
    root.dataset.posed = '';

    return watchArt(root);
  });

  const still = useEffectEvent(() => paint(stop));

  /* the gate: the first view's paintings, in the visit's theme, decoded before anything moves */
  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    let active = true;

    let stopWatching = () => {};

    const firstView = new Set(FIRST_POSE.map(item => `${item.id}:${item.lod}`));

    decoding.current ??= prepareArt(root, sceneTheme(), img => {
      const flat = img.closest<HTMLElement>('[data-scene-flat]')?.dataset.sceneFlat;
      const lod = img.closest<HTMLElement>('[data-lod]')?.dataset.lod;

      /* the clouds are small and in view from the start: they are part of the first frame too */
      if (img.closest('.scene-cloud')) return true;

      return firstView.has(`${flat}:${lod}`) && !img.closest('.scene-flag-part');
    });

    decoding.current.then(
      () => {
        if (!active) return;

        stopWatching = open(root);
      },
      () => undefined
    );

    return () => {
      active = false;
      stopWatching();
    };
  }, []);

  /* reduced motion: when the stop changes, swap the whole scene for that stop's still under a short veil */
  useEffect(() => {
    if (!reducedMotion || !ready.current) return;
    const cover = veil.current;
    cover?.setAttribute('data-on', '');
    const timer = window.setTimeout(() => {
      still();
      cover?.removeAttribute('data-on');
    }, VEIL_MS);

    return () => window.clearTimeout(timer);
  }, [stop, reducedMotion]);

  return (
    <div
      ref={stage}
      aria-hidden='true'
      className='scene-stage [container-type:size] sticky top-0 col-start-1 row-start-1 h-lvh self-start overflow-clip contain-[layout_paint]'
    >
      <Sky />
      <Daylight ref={day} className='opacity-0 will-change-[opacity]' />
      <Stars />
      <Meteors />
      {/* a fixed place at the top right, where the light comes from: just left of the altimeter's card.
          Phones have no clear sky up there, so no sun or moon */}
      <Celestial className='top-[6%] right-[19%] max-sm:hidden' />
      {/* in the air, so in front of the moon and behind the clouds and the mountains */}
      <Aurora />
      <Clouds />

      <div
        data-scene-flats
        className='absolute inset-0'
        style={{ '--v': STAGE_SCALE_CSS } as React.CSSProperties}
      >
        {FLATS.map(flat => (
          <SceneFlat key={flat.id} flat={flat} reached={(flat.camp ?? 0) <= stop} />
        ))}
      </div>

      {/* in front of the ridges, behind the labels; from the camp below the snowline on, the flakes are falling
          already when they come into view */}
      <SnowLayer running={stop >= SNOWLINE_CAMP - 1} snowRef={snow} squallRef={squall} />

      {CAMPS.map((camp, i) => (
        <div key={camp.year} data-scene-label={i} data-reached={i <= stop} className='scene-label'>
          <span>
            {camp.place} <b>{camp.year}</b>
          </span>
        </div>
      ))}

      <div ref={summit} className='scene-summit'>
        <span data-gone={climbOver}>{SUMMIT_LINE}</span>
      </div>

      <div ref={veil} className='scene-veil' />
    </div>
  );
}
