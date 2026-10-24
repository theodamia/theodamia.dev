import type React from 'react';
import { snowField, snowKeyframes, type Flake } from '@/scene/snow';

/** Painted once per module load, like the stars and the weather, and for the same reason. */
const FLAKES = snowField();
const SNOW_CSS = snowKeyframes();

function Flakes({ flakes }: { flakes: Flake[] }) {
  return flakes.map(flake => (
    <span
      key={flake.key}
      data-depth={flake.depth}
      className='snow-flake'
      style={
        {
          left: `${flake.x.toFixed(2)}%`,
          '--size': `${flake.size.toFixed(2)}px`,
          '--alpha': flake.alpha.toFixed(2),
          animationName: `snow-${flake.depth}-${flake.path}`,
          animationDuration: `${flake.cycle.toFixed(2)}s`,
          animationDelay: `-${flake.phase.toFixed(2)}s`,
        } as React.CSSProperties
      }
    />
  ));
}

type SnowLayerProps = {
  /** Flakes move only near the snowline and above it; below, they wait where they are, at no cost. */
  running: boolean;
  /** The two falls' layers, whose opacity the stage writes per frame: the snow, and the thicker fall above it. */
  snowRef: React.Ref<HTMLDivElement>;
  squallRef: React.Ref<HTMLDivElement>;
};

/**
 * The snow of the heights (scene/snow.ts): every flake in the served HTML, in two layers the stage fades with the
 * climb, one opacity each per frame, so the snow comes in over the approach to the Lead camp and thickens toward
 * the summit without a single flake being added or removed. Mounted with the weather: in front of the ridges,
 * behind the camps' names.
 */
export function SnowLayer({ running, snowRef, squallRef }: SnowLayerProps) {
  return (
    <div aria-hidden='true' data-snowing={running ? '' : undefined} className='snow-layer'>
      {/* the fall's keyframes, generated with the flakes; React hoists and dedupes them */}
      <style href='scene-snow' precedence='default'>
        {SNOW_CSS}
      </style>
      <div ref={snowRef} className='snow-density' style={{ opacity: 0 }}>
        <Flakes flakes={FLAKES.filter(flake => !flake.squall)} />
      </div>
      <div ref={squallRef} className='snow-density' style={{ opacity: 0 }}>
        <Flakes flakes={FLAKES.filter(flake => flake.squall)} />
      </div>
    </div>
  );
}
