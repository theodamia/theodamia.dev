import type React from 'react';
import { starField } from '@/scene/stars';
import { cn } from '@/utils/cn';

/** Painted once per module load: the same field on the server and in the browser. */
const STARS = starField();

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

/** A cloud from three pills: the body and two bumps that inherit its colour. */
export function Cloud({ className }: { className: string }) {
  return (
    <div
      className={cn(
        'bg-cloud/70 absolute h-[26px] rounded-full before:absolute before:bottom-[35%] before:left-[20%] before:h-[150%] before:w-[42%] before:rounded-full before:bg-inherit after:absolute after:bottom-[35%] after:left-[48%] after:h-[105%] after:w-[30%] after:rounded-full after:bg-inherit',
        className
      )}
    />
  );
}
