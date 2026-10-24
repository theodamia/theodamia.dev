import type React from 'react';
import { sceneLayers, scenePalette, type SceneLayer } from '@/scene/scenery';
import { WORLD } from '@/scene/world';

/**
 * Painted once per module load. Both scene components are client components on purpose: the drawing is
 * generated from code on the server (for the HTML) and again in the browser, instead of travelling a second
 * time inside the RSC payload.
 */
export const SCENE_LAYERS: SceneLayer[] = sceneLayers();
/* after sceneLayers(), which is what registers the colours it defines */
const PALETTE = scenePalette();

/**
 * The scene's generated colours, as CSS variables. The drawing names them rather than spelling them out, so one
 * set of shapes can wear more than one set of colours. Rendered once by every piece that draws the scene.
 */
export function ScenePalette() {
  return <style dangerouslySetInnerHTML={{ __html: PALETTE }} />;
}

type SceneLayerSvgProps = {
  depth: number;
  height: number;
  markup: string;
  ref?: React.Ref<SVGSVGElement>;
};

/** One parallax layer. `--d` sizes it (see `.scene-layer` in globals.css); the stage moves it as a whole. */
export function SceneLayerSvg({ depth, height, markup, ref }: SceneLayerSvgProps) {
  return (
    <svg
      ref={ref}
      className='scene-layer'
      data-depth={depth}
      style={{ '--d': depth } as React.CSSProperties}
      viewBox={`0 0 ${WORLD.WIDTH} ${height}`}
      preserveAspectRatio='none'
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
