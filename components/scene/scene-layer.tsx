import type React from 'react';
import { sceneLayers, scenePalette, type SceneLayer } from '@/scene/scenery';
import { SUMMIT_LINE } from '@/content/site';
import { starField } from '@/scene/stars';
import { WORLD } from '@/scene/world';
import { cn } from '@/utils/cn';

/**
 * Painted once per module load. Both scene components are client components on purpose: the drawing is
 * generated from code on the server (for the HTML) and again in the browser, instead of travelling a second
 * time inside the RSC payload.
 */
export const SCENE_LAYERS: SceneLayer[] = sceneLayers(SUMMIT_LINE);
/* after sceneLayers(), which is what registers the colours it defines */
const PALETTE = scenePalette();
const STARS = starField();

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

/** Dawn at the trailhead by day, dusk by night: the same layer, its colours are theme tokens. */
export function Sky() {
  return (
    <div className='from-dawn-top via-dawn-mid to-dawn-low absolute inset-0 bg-linear-to-b via-55%' />
  );
}

/** Daylight fades in over the dawn as the climb goes on; at night it is the midnight over the dusk. */
export function Daylight({
  className,
  ref,
}: {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        'from-day-top via-day-mid to-day-low absolute inset-0 bg-linear-to-b via-55%',
        className
      )}
    />
  );
}

/**
 * The stars: fixed in the sky (it is at infinity, so they take no part in the parallax) and painted before the
 * mountains, which pass in front of them. Invisible by day. Each is one of the reveal's `data-wave` targets, so it
 * comes out as the night reaches it (the rules are under `.star` in globals.css).
 */
export function Stars() {
  return (
    <div className='absolute inset-0'>
      {STARS.map(star => (
        <span
          key={star.cell}
          data-wave
          data-tier={star.tier}
          data-twinkle={star.twinkle ? '' : undefined}
          className='star'
          style={
            {
              left: `${star.x.toFixed(2)}%`,
              top: `${star.y.toFixed(2)}%`,
              '--size': `${star.size.toFixed(2)}px`,
              '--alpha': star.alpha,
              '--star-lag': `${star.lag}ms`,
              '--twinkle': `${star.twinkle.toFixed(2)}s`,
              '--phase': `-${star.phase.toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * The sun by day, the moon by night: the same body. When the night reaches it, it cools and the earth's shadow
 * slides over it, leaving a crescent (see `.celestial` in globals.css). The shadow is a dark disc underneath that
 * the bright one is cut away from, so the moon hides the stars behind it.
 */
export function Celestial({ className }: { className?: string }) {
  return (
    <div data-wave className={cn('celestial absolute', className)}>
      <span className='celestial-glow' />
      <span className='celestial-shadow' />
      <span className='celestial-disc' />
    </div>
  );
}
