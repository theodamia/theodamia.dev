import type React from 'react';
import { STAGE_SCALE_CSS } from '@/scene/camera';
import { artUrl, CLOUDS, type Theme } from '@/scene/flats';
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

const THEMES: Theme[] = ['day', 'night'];

/**
 * Where each painted cloud drifts, in the order they were painted (largest first): its place on the stage and its
 * width in design units, so it keeps its size against the mountains on every screen. Placed in the open sky of the
 * hero at the 1440 × 900 reference: the big one above the title, clear of its first line, drifting behind the
 * peak's left flank; the middle one tucked behind the peak's right shoulder under the sun; the small one high on
 * the left. They pass behind the mountains (the stage draws them first), so a bigger peak later simply covers more.
 */
const CLOUD_PLACES = [
  { top: '1.5%', left: '44%', width: 230, drift: 'motion-safe:animate-drift' },
  { top: '10%', left: '68%', width: 150, drift: 'motion-safe:animate-drift-slow' },
  { top: '2.5%', left: '15%', width: 110, drift: 'motion-safe:animate-drift-slow' },
] as const;

/**
 * The sky's clouds: painted like the cloud sea below them, each a day and a night picture with one outline, drifting
 * slowly in place (a transform, so the compositor moves them). They stand behind the mountains, not in the world:
 * the sky is at infinity, so the climb does not move them. Their pictures show once decoded, like every painting.
 */
export function Clouds() {
  return (
    <div className='absolute inset-0' style={{ '--v': STAGE_SCALE_CSS } as React.CSSProperties}>
      {CLOUDS.slice(0, CLOUD_PLACES.length).map((cloud, i) => {
        const place = CLOUD_PLACES[i];

        return (
          <div
            key={cloud.art.day}
            className={cn('scene-cloud', place.drift)}
            style={{
              top: place.top,
              left: place.left,
              width: `calc(var(--v) * ${place.width})`,
              aspectRatio: `${cloud.w} / ${cloud.h}`,
            }}
          >
            {THEMES.map(theme => (
              <img
                key={theme}
                alt=''
                data-art={theme}
                data-src={artUrl(cloud.art[theme])}
                decoding='async'
                draggable={false}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
