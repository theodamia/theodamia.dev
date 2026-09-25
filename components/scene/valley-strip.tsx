'use client';

import type React from 'react';
import { CampMark } from '@/components/scene/camp-mark';
import {
  Daylight,
  SCENE_LAYERS,
  SceneLayerSvg,
  ScenePalette,
  Sky,
  Stars,
} from '@/components/scene/scene-layer';
import { Village } from '@/components/scene/village';
import { TRAILHEAD } from '@/content/jobs';
import { campArtKey } from '@/scene/camp-layout';

const NEAR_DEPTH = 1;

/** Only the layers this view draws. The rest sit on a horizon it never reaches, so they would be bytes for nothing. */
const VALLEY_LAYERS = ['near', 'trail', 'front'];

/**
 * How far down the world the band looks. `.scene-layer` maps 10 world units to 1lvh, so a band `S` vh tall shows
 * world Y `[5000 · depth · cam, + 10 · S]`. The trailhead is at 5620, so `--cam: 1` ends a 58vh band at 5580 and
 * misses it; 1.05 lands the village two thirds down. Past 1.084 the world runs out and the band shows through.
 */
const VALLEY_CAM = 1.05;

/**
 * The foot of the world at the foot of /cv: the village, the signpost, the first dotted steps. The counterpart to
 * the summit strip on /about — the other end of the same mountain.
 *
 * A band in the page's flow, not a backdrop: the opaque Contact card above would cut a backdrop in half. Its
 * height stays in `vh`, since that is what the window above is measured in — a pixel `min-height` on a short
 * screen widens it past the bottom of the world. Nothing here moves.
 */
export function ValleyStrip({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className='relative h-[58vh] overflow-clip print:hidden'
      style={{ '--cam': VALLEY_CAM } as React.CSSProperties}
    >
      {/* the signpost's name is drawn as <text>: down here the page's own words do that work */}
      <div aria-hidden='true' className='absolute inset-0 [&_text]:hidden'>
        <ScenePalette />
        <Sky />
        <Daylight />
        <Stars />
        {SCENE_LAYERS.filter(layer => VALLEY_LAYERS.includes(layer.key)).map(layer => (
          <SceneLayerSvg
            key={layer.key}
            depth={layer.depth}
            height={layer.height}
            markup={layer.markup}
          />
        ))}
        <div className='scene-layer' style={{ '--d': NEAR_DEPTH } as React.CSSProperties}>
          <Village />
          {/* camp 0 is the trailhead: a signpost, no flag to raise, always "reached" */}
          <CampMark
            index={0}
            artKey={campArtKey(0)}
            name={TRAILHEAD.label}
            tent='signpost'
            reached
          />
        </div>
      </div>

      <div className='from-page to-page/0 absolute inset-x-0 top-0 h-[62%] bg-linear-to-b' />
      {children && <div className='relative pt-12 text-center'>{children}</div>}
    </div>
  );
}
