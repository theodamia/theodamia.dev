import type React from 'react';
import {
  Celestial,
  Daylight,
  PaintedClouds,
  Sky,
  Stars,
  type CloudWind,
} from '@/components/scene/sky';
import { ThemePicture } from '@/components/scene/theme-picture';
import { aboutUrl, RANGE_ART, RANGE_ASPECT, SAUCER } from '@/scene/about';

/** High and few: the card stands in the sky below them. */
const DAWN_CLOUDS: CloudWind[] = [
  { cloud: 1, top: '3%', width: 15, at: 0.3, cross: 300, billow: 15 },
  { cloud: 0, top: '6%', width: 22, at: 0.72, cross: 240, billow: 19 },
  { cloud: 2, top: '12%', width: 11, at: 0.92, cross: 340, billow: 13 },
];

/**
 * The saucer of the page's one easter egg, between the sky and the range so the peaks can hide it. It waits out of
 * sight until contact is made (`data-contact` on the finale, components/contact-signal.tsx). Three wrappers, so its
 * path can curve: one moves it across, one up and down (and far away), one lets it hover. Its running lights are
 * glows of their own, at the points scripts/process-about.mjs found on the painting, so they can blink.
 */
function Saucer() {
  const [w, h] = SAUCER.size;

  return (
    <div className='about-saucer' style={{ aspectRatio: `${w} / ${h}` }}>
      <div className='about-saucer-across'>
        <div className='about-saucer-rise'>
          <div className='about-saucer-hover'>
            <ThemePicture pictures={{ day: aboutUrl(SAUCER.day), night: aboutUrl(SAUCER.night) }} />
            {SAUCER.lights.map(([x, y]) => (
              <i
                key={`${x}-${y}`}
                className='about-saucer-light'
                style={{ left: `${(x * 100).toFixed(2)}%`, top: `${(y * 100).toFixed(2)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The page's ending, behind the Contact card: the next range across a sea of clouds, the climb's own sky over it.
 * As the last screen scrolls in, dawn becomes morning (by night, dusk becomes midnight) and the climb's sun comes
 * up from behind the right-hand ridge (by night, its moon). The range stands along the bottom edge, its cloud line
 * a little above it; the card and the open sky under it are above the summit (`.about-finale` in globals.css).
 */
export function AboutDawn() {
  return (
    <div
      aria-hidden='true'
      className='about-dawn max-wide:hidden print:hidden'
      style={{ '--range-aspect': RANGE_ASPECT } as React.CSSProperties}
    >
      <Sky />
      <Daylight className='about-daylight' />
      <Stars />
      <PaintedClouds winds={DAWN_CLOUDS} />
      <Celestial className='about-sun' />
      <Saucer />
      <ThemePicture
        className='about-range'
        pictures={{ day: aboutUrl(RANGE_ART.sunrise), night: aboutUrl(RANGE_ART.night) }}
      />
      <div
        className='theme-art theme-picture about-range about-morning'
        data-art='day'
        style={{ backgroundImage: `url(${aboutUrl(RANGE_ART.day)})` }}
      />
    </div>
  );
}
