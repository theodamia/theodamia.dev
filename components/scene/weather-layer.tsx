import type React from 'react';
import { weatherField } from '@/scene/weather';

/** Painted once per module load, like the star field, and for the same reason. */
const BITS = weatherField();

/**
 * What falls out of the sky, for all four seasons at once: CSS shows the season's own and leaves the rest
 * `display: none`, so nothing but the current weather is ever animated and the whole lot is in the served HTML
 * without needing JavaScript to begin.
 *
 * It mounts inside the stage between the near slopes and the foreground, so snow falls in front of the mountain
 * and behind the framing pines. That is the one thing a canvas laid over the page could not do, and the reason
 * this is a few dozen spans rather than a particle library.
 *
 * Each bit moves on `translate` and `rotate` — never `transform` — because those are separate properties the
 * compositor carries on its own, and because the stage writes `transform` on the layers around it.
 *
 * `belowFirstCamp` is what stops leaves and blossom above the treeline: they come off trees, and the trees are
 * down at the trailhead. Snow ignores it and falls the whole way up. It changes when a camp is reached, not every
 * frame, so the fade costs one opacity on one element and the bits underneath simply pause.
 */
export function WeatherLayer({ belowFirstCamp }: { belowFirstCamp: boolean }) {
  return (
    <div
      aria-hidden='true'
      data-low={belowFirstCamp ? '' : undefined}
      className='weather-layer pointer-events-none absolute inset-0 overflow-clip'
    >
      {BITS.map(bit => (
        <span
          key={bit.key}
          data-kind={bit.kind}
          className='weather-bit'
          style={
            {
              left: `${bit.x.toFixed(2)}%`,
              '--size': `${bit.size.toFixed(2)}px`,
              '--drift': `${bit.drift.toFixed(1)}px`,
              '--fall': `${bit.fall.toFixed(2)}s`,
              '--phase': `-${bit.phase.toFixed(2)}s`,
              '--spin': `${bit.spin.toFixed(0)}deg`,
              '--alpha': bit.alpha.toFixed(2),
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
