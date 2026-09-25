'use client';

import type React from 'react';
import { CampMark } from '@/components/scene/camp-mark';
import { Daylight, SCENE_LAYERS, SceneLayerSvg, Sky, Stars } from '@/components/scene/scene-layer';
import { Village } from '@/components/scene/village';
import { TRAILHEAD } from '@/content/jobs';
import { campArtKey } from '@/scene/camp-layout';

const NEAR_DEPTH = 1;

/**
 * Only the layers the foot of the world actually draws. The others are silhouettes on a horizon this view never
 * reaches: they would be paid for and never seen. `SCENE_LAYERS` is plain data, so the choice is made here and
 * the scene itself stays untouched.
 */
const VALLEY_LAYERS = ['near', 'trail', 'front'];

/**
 * How far down the world the band looks. `.scene-layer` (globals.css) maps 10 world units to 1lvh at every depth,
 * so a band `S` vh tall shows world Y `[5000 · depth · cam, + 10 · S]`. The trail starts at 5620 and the village
 * stands at 5622: at `--cam: 1` a 58vh band ends at 5580 and both sit just below its edge, unseen. 1.05 puts the
 * window at 5250–5830, which lands the village two thirds down with ground below it. Past 1.084 the world runs
 * out and the band shows through.
 */
const VALLEY_CAM = 1.05;

/**
 * The foot of the world, at the foot of the Experience page: the village where the trail starts, the signpost and
 * the dotted first steps of the climb. The counterpart to the summit strip on /about, and the other end of the
 * same mountain — that page is where the climb is going, this is where it began.
 *
 * It is a band in the page's flow rather than a backdrop behind it: the Contact card above is opaque, and a
 * backdrop tall enough to be worth drawing would run up behind it and be cut in half. Whatever it is given
 * (the way back to the climb) sits over the faded top, where the page is still the page.
 *
 * Nothing here moves. The band's height stays in `vh` on purpose: `S` is what the window above is measured in, so
 * a pixel `min-height` on a short screen would widen it past the bottom of the world.
 */
export function ValleyStrip({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className='relative h-[58vh] overflow-clip print:hidden'
      style={{ '--cam': VALLEY_CAM } as React.CSSProperties}
    >
      {/* the signpost's name is drawn as <text>: down here the page's own words do that work */}
      <div aria-hidden='true' className='absolute inset-0 [&_text]:hidden'>
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
