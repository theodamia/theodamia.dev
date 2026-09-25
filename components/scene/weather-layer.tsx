import type React from 'react';
import { weatherField } from '@/scene/weather';

/** Painted once per module load, like the star field, and for the same reason. */
const BITS = weatherField();

/**
 * Every season's weather at once; CSS shows one kind and leaves the rest `display: none`, so only the current
 * weather animates and it all arrives in the served HTML without JavaScript.
 *
 * Mounted between the near slopes and the foreground, so it falls in front of the mountain and behind the framing
 * pines — the thing a canvas over the page could not do, and why this is spans rather than a particle library.
 * Each bit moves on `translate` and `rotate`, never `transform`, which the stage writes on the layers either side.
 *
 * `belowFirstCamp` stops the leaves and blossom above the treeline; snow ignores it. It follows the camp reached,
 * not the scroll, so crossing it costs one opacity and the bits underneath pause rather than restart.
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
