'use client';

import type React from 'react';
import {
  Celestial,
  Daylight,
  SCENE_LAYERS,
  SceneLayerSvg,
  ScenePalette,
  Sky,
  Stars,
} from '@/components/scene/scene-layer';

/** The quiet page's header: a still view of the unreached summit, fading into the page. Nothing moves. */
export function SummitStrip() {
  return (
    <div
      aria-hidden='true'
      /* the summit's label stays on the climb: here the page's own title sits where it would, and says as much */
      className='absolute inset-x-0 top-0 h-[58vh] min-h-[360px] overflow-clip [&_text]:hidden'
      style={{ '--cam': 0 } as React.CSSProperties}
    >
      <ScenePalette />
      <Sky />
      <Daylight />
      <Stars />
      <Celestial className='top-[12%] right-[15%]' />
      {SCENE_LAYERS.map(layer => (
        <SceneLayerSvg
          key={layer.key}
          depth={layer.depth}
          height={layer.height}
          markup={layer.markup}
        />
      ))}
      <div className='from-page/0 to-page absolute inset-0 bg-linear-to-b from-45%' />
    </div>
  );
}
