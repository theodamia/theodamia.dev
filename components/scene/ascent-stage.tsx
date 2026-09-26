'use client';

import type React from 'react';
import { useImperativeHandle, useRef } from 'react';
import { CampMark, tentFor } from '@/components/scene/camp-mark';
import { SummitLabel } from '@/components/scene/summit-label';
import { Village } from '@/components/scene/village';
import { WeatherLayer } from '@/components/scene/weather-layer';
import {
  Celestial,
  Daylight,
  SCENE_LAYERS,
  SceneLayerSvg,
  ScenePalette,
  Sky,
  Stars,
} from '@/components/scene/scene-layer';
import { walkedPathMarkup } from '@/scene/scenery';
import { cn } from '@/utils/cn';
import { JOBS, TRAILHEAD } from '@/content/jobs';
import { campArtKey } from '@/scene/camp-layout';
import { CAMP_Y, climberAt, WORLD, type SceneFrame, type SceneHandle } from '@/scene/world';

const WALKED_PATH = walkedPathMarkup();
/** The trail layer and everything after it paint above the walked path. */
const TRAIL_INDEX = SCENE_LAYERS.findIndex(layer => layer.key === 'trail');
const NEAR_DEPTH = 1;
/* camp 0 is the trailhead, so the first job's camp is 1: past it, the trees are behind you */
const FIRST_CAMP = 1;

/** A cloud from three pills: the body and two bumps that inherit its colour. */
function Cloud({ className }: { className: string }) {
  return (
    <div
      className={cn(
        'bg-cloud/70 absolute h-[26px] rounded-full before:absolute before:bottom-[35%] before:left-[20%] before:h-[150%] before:w-[42%] before:rounded-full before:bg-inherit after:absolute after:bottom-[35%] after:left-[48%] after:h-[105%] after:w-[30%] after:rounded-full after:bg-inherit',
        className
      )}
    />
  );
}

type AscentStageProps = {
  /** With reduced motion the whole path is shown at once instead of following the climber. */
  reducedMotion: boolean;
  /** Index of the camp the climber has reached (0 is the trailhead): camps up to it are conquered. */
  stop: number;
  /** True once the climb is over and the closing card is up: the summit's label fades out. */
  climbOver: boolean;
  ref: React.Ref<SceneHandle>;
};

/**
 * The scene's renderer: a sticky, screen-sized stage of parallax layers behind the page. It implements
 * `SceneHandle`, so the rest of the app only hands it a frame.
 *
 * A frame writes device-pixel-snapped transforms and one opacity, on whole layers — no CSS variables, no layout
 * reads, no SVG changes. That is what keeps the scroll smooth. Resting poses use the `transform` property rather
 * than Tailwind's translate utilities, which set `translate` and would add to those transforms instead of being
 * replaced by them.
 *
 * Camps are small SVGs of their own in a layer that moves with the mountain, so an arrival repaints only the camp.
 */
export function AscentStage({ reducedMotion, stop, climbOver, ref }: AscentStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const day = useRef<HTMLDivElement>(null);
  const camps = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const path = useRef<SVGSVGElement>(null);
  const climber = useRef<HTMLDivElement>(null);
  const layers = useRef<(SVGSVGElement | null)[]>([]);
  /** Last transform written per layer, so an unchanged layer is left alone. */
  const written = useRef<(number | null)[]>([]);
  const size = useRef({ width: 0, height: 0 });
  /** World units to pixels, and the rounding onto the device pixel grid: both fixed until the next resize. */
  const scaleRef = useRef(0);
  const snapRef = useRef((v: number) => v);

  /* no dependency array: every frame must see the current `reducedMotion`, and the rest lives in refs */
  useImperativeHandle(ref, () => ({
    resize() {
      if (!stage.current) return;
      size.current = { width: stage.current.clientWidth, height: stage.current.clientHeight };
      scaleRef.current = size.current.height / WORLD.VIEW;
      const dpr = window.devicePixelRatio || 1;
      snapRef.current = (v: number) => Math.round(v * dpr) / dpr;
      written.current = [];
    },
    applyFrame({ yTop, leg, f }: SceneFrame) {
      const { width, height } = size.current;
      if (!height) return;
      const scale = scaleRef.current;
      const snap = snapRef.current;

      /* the mountain: each layer slides by its own depth */
      let near = 0;
      SCENE_LAYERS.forEach((layer, i) => {
        const y = snap(-yTop * layer.depth * scale);

        if (layer.depth === NEAR_DEPTH) {
          near = y;
        }

        const el = layers.current[i];

        if (el && written.current[i] !== y) {
          written.current[i] = y;
          el.style.transform = `translate3d(-50%,${y}px,0)`;
        }
      });

      if (camps.current) {
        camps.current.style.transform = `translate3d(-50%,${near}px,0)`;
      }

      /* the climber, from points sampled once in scene/world */
      const [px, py] = climberAt(leg, f);
      const cx = snap(width / 2 + (px - WORLD.CENTER_X) * scale);
      const cy = snap(near + py * scale);

      if (climber.current) {
        climber.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      }

      /* the walked path: the window's top edge sits at the climber, and the drawing inside is shifted back by the same amount */
      const edge = reducedMotion ? snap(near + CAMP_Y[CAMP_Y.length - 1] * scale) : cy;

      if (clip.current) {
        clip.current.style.transform = `translate3d(0,${edge}px,0)`;
      }

      if (path.current) {
        path.current.style.transform = `translate3d(-50%,${snap(near - edge)}px,0)`;
      }

      /* dawn turns to day as you climb (by night, dusk to midnight) */
      if (day.current) {
        day.current.style.opacity = (1 - yTop / WORLD.TRAVEL).toFixed(3);
      }
    },
  }));

  const renderLayer = (index: number) => {
    const layer = SCENE_LAYERS[index];

    return (
      <SceneLayerSvg
        key={layer.key}
        ref={el => {
          layers.current[index] = el;
        }}
        depth={layer.depth}
        height={layer.height}
        markup={layer.markup}
      />
    );
  };

  return (
    <div
      ref={stage}
      aria-hidden='true'
      className='scene-stage sticky top-0 col-start-1 row-start-1 h-lvh self-start overflow-clip contain-[layout_paint]'
      style={{ '--cam': 1 } as React.CSSProperties}
    >
      <ScenePalette />
      <Sky />
      <Daylight ref={day} className='opacity-0 will-change-[opacity]' />
      <Stars />
      {/* a fixed place at the top right, just left of the altimeter's card and above where the cards come to rest.
          The massif may pass in front of it now and then. Phones have no clear sky up there, so no sun or moon */}
      <Celestial className='top-[6%] right-[19%] max-sm:hidden' />
      <Cloud className='motion-safe:animate-drift top-[7%] left-[40%] w-[190px]' />
      <Cloud className='motion-safe:animate-drift-slow top-[24%] left-[70%] w-[120px] opacity-80' />

      {Array.from({ length: TRAIL_INDEX }, (_, i) => renderLayer(i))}

      {/* the walked path is a finished drawing behind a window; the window's top edge follows the climber, so the line appears to be drawn without being redrawn */}
      <div
        ref={clip}
        className='scene-layer-window absolute inset-0 [transform:translate3d(0,100%,0)] overflow-clip'
      >
        <SceneLayerSvg
          ref={path}
          depth={NEAR_DEPTH}
          height={WORLD.VIEW + WORLD.TRAVEL}
          markup={WALKED_PATH}
        />
      </div>

      {renderLayer(TRAIL_INDEX)}

      <div ref={camps} className='scene-layer' style={{ '--d': NEAR_DEPTH } as React.CSSProperties}>
        <Village />
        <SummitLabel gone={climbOver} />
        {/* camp 0 is the trailhead: a signpost, no flag to raise, always "reached" */}
        <CampMark index={0} artKey={campArtKey(0)} name={TRAILHEAD.label} tent='signpost' reached />
        {JOBS.map((job, i) => (
          <CampMark
            key={job.start}
            index={i + 1}
            artKey={campArtKey(i + 1)}
            name={job.place}
            tent={tentFor(job.level)}
            reached={i + 1 <= stop}
          />
        ))}
      </div>

      <div
        ref={climber}
        className='absolute top-0 left-0 size-0 [transform:translate3d(-200px,-200px,0)] will-change-transform'
      >
        <span className='border-ink bg-card absolute -top-2.5 -left-2.5 size-5 rounded-full border-[3.5px] shadow-[0_0_0_8px_color-mix(in_oklab,var(--color-ink)_16%,transparent)]' />
      </div>

      {/* in front of the mountain and the camps, behind the framing pines the foreground layer carries */}
      <WeatherLayer belowFirstCamp={stop < FIRST_CAMP} />

      {Array.from({ length: SCENE_LAYERS.length - TRAIL_INDEX - 1 }, (_, i) =>
        renderLayer(TRAIL_INDEX + 1 + i)
      )}
    </div>
  );
}
