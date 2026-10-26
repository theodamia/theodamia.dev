import type React from 'react';
import { STAGE_SCALE_CSS } from '@/scene/camera';
import { ThemePicture } from '@/components/scene/theme-picture';
import { artUrl, CLOUDS, THEMES, type Cloud } from '@/scene/flats';
import { starField, twinkleKeyframes, twinkleLevel } from '@/scene/stars';
import { cn } from '@/utils/cn';

/** Painted once per module load: the same field on the server and in the browser. */
const STARS = starField();
const TWINKLE_CSS = twinkleKeyframes();

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
      {/* the twinkle's keyframes, generated with the field (scene/stars.ts); React hoists and dedupes them */}
      <style href='scene-twinkle' precedence='default'>
        {TWINKLE_CSS}
      </style>
      {STARS.map(star => (
        <span
          key={star.cell}
          data-wave
          data-tier={star.tier}
          data-twinkle={star.twinkle ? '' : undefined}
          data-tint={star.tint}
          data-depth={star.twinkle ? twinkleLevel(star.depth) : undefined}
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

/** A cloud on the wind: which painting, how high, how wide, where across it opens, and its times in seconds. */
export type CloudWind = {
  cloud: number;
  top: string;
  width: number;
  at: number;
  cross: number;
  billow: number;
};

/**
 * Where a cloud stands and how the wind carries it (`cloud-cross`, `cloud-billow` in globals.css), its width in the
 * caller's unit: the climb sizes clouds against its mountains, a still page against the screen.
 */
function windStyle(wind: CloudWind, cloud: Cloud, width: string) {
  return {
    top: wind.top,
    width,
    aspectRatio: `${cloud.w} / ${cloud.h}`,
    '--at': wind.at,
    '--cross': `${wind.cross}s`,
    '--billow': `${wind.billow}s`,
  } as React.CSSProperties;
}

/**
 * The wind. Every cloud crosses the whole sky from left to right and comes round again, at a steady speed: the
 * farther (smaller) it is, the slower. `at` is how far across it stands when the page opens, so the hero keeps its
 * composition (at 1440 × 900: the big one above the title clear of its first line, the middle one behind the peak's
 * right shoulder under the sun, the small one high on the left); the two farthest are copies of the smaller
 * paintings, smaller still. Each also billows slowly, as a cumulus does. Widths are design units, so a cloud keeps
 * its size against the mountains; times are seconds, `cross` for the whole sky and `billow` for one swell.
 */
const CLOUD_WIND: readonly CloudWind[] = [
  { cloud: 0, top: '1.5%', width: 230, at: 0.5, cross: 200, billow: 19 },
  { cloud: 1, top: '10%', width: 150, at: 0.72, cross: 260, billow: 15 },
  { cloud: 2, top: '2.5%', width: 110, at: 0.24, cross: 320, billow: 13 },
  { cloud: 1, top: '5.5%', width: 100, at: 0.02, cross: 300, billow: 17 },
  { cloud: 2, top: '14%', width: 80, at: 0.88, cross: 360, billow: 11 },
] as const;

/**
 * The sky's clouds: painted like the cloud sea below them, each a day and a night picture with one outline. They
 * move on the compositor (`translate` for the wind, `scale` for the billow; see `.scene-cloud` in globals.css) and
 * stand behind the mountains, not in the world: the sky is at infinity, so the climb does not move them. With
 * reduced motion each simply stays where it stands when the page opens.
 */
export function Clouds() {
  return (
    <div className='absolute inset-0' style={{ '--v': STAGE_SCALE_CSS } as React.CSSProperties}>
      {CLOUD_WIND.map(wind => {
        const cloud = CLOUDS[wind.cloud];
        if (!cloud) return null;

        return (
          <div
            key={`${wind.cloud}-${wind.top}`}
            className='scene-cloud'
            style={windStyle(wind, cloud, `calc(var(--v) * ${wind.width})`)}
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

/**
 * The climb's clouds on its wind, in the sky of a still page (/cv's valley, /about's opening and ending). They cross
 * their sky from edge to edge in `cqw`, so their parent is a container; their widths are in `vh`, so they keep their
 * size against a scene that fills the screen. With reduced motion each stays where it opens.
 */
export function PaintedClouds({ winds }: { winds: readonly CloudWind[] }) {
  return winds.map(wind => {
    const cloud = CLOUDS[wind.cloud];
    if (!cloud) return null;

    return (
      <div
        key={`${wind.cloud}-${wind.top}`}
        className='sky-cloud'
        style={windStyle(wind, cloud, `${wind.width}vh`)}
      >
        <ThemePicture pictures={{ day: artUrl(cloud.art.day), night: artUrl(cloud.art.night) }} />
      </div>
    );
  });
}

/**
 * Shooting stars: rare, brief, only at night, in the open sky right of the summit (left of it the hero's words
 * and their wash would hide them). Each starts at (x, y) in % of the sky, runs `dx`, `dy` px along its
 * heading (`angle`, degrees; the run is worked out here once, not with trigonometry at render, so server and
 * browser write the same markup) and comes round every `cycle` seconds, `at` seconds into it when the page opens.
 * Cycles that share no beat keep the two from ever settling into a rhythm.
 */
const METEORS = [
  /* over the moon, toward the altimeter */
  { x: 72, y: 1.5, angle: 24, dx: 238, dy: 106, cycle: 37, at: 9 },
  /* just above the summit's tip, burning out at the moon */
  { x: 60, y: 0.5, angle: 14, dx: 223, dy: 56, cycle: 53, at: 31 },
] as const;

/** The shooting stars' layer: two streaks that cross the night sky now and then (`.meteor` in globals.css). */
export function Meteors() {
  return (
    <div className='absolute inset-0'>
      {METEORS.map(meteor => (
        <span
          key={meteor.cycle}
          className='meteor'
          style={
            {
              left: `${meteor.x}%`,
              top: `${meteor.y}%`,
              rotate: `${meteor.angle}deg`,
              '--dx': `${meteor.dx}px`,
              '--dy': `${meteor.dy}px`,
              '--cycle': `${meteor.cycle}s`,
              '--at': `-${meteor.at}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
