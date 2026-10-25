import type React from 'react';
import { Stars } from '@/components/scene/sky';
import type { Theme } from '@/scene/flats';
import { YearFade } from '@/components/scene/year-fade';
import { YearWeather } from '@/components/scene/year-weather';
import {
  GROUND_SHARE,
  GROVE_ASPECT,
  SEASON_ART,
  SEASONS,
  seasonOf,
  seasonUrl,
  YEAR_STATES,
} from '@/scene/seasons';

const THEMES: Theme[] = ['day', 'night'];
const STATES = Array.from({ length: YEAR_STATES }, (_, k) => k);
/** The columns of the year: picture `j` of every state belongs to the year that starts in SEASONS[j]. */
const COLUMNS = SEASONS.map((_, j) => j);

/**
 * State `k`'s sky: one gradient per column of the year. Only the column the year starts in is ever shown (CSS, from
 * `data-year-start` on <html>), and only the shown one's colours matter; by night every season shares one sky.
 */
export function YearSky({ k }: { k: number }) {
  return COLUMNS.map(j => (
    <div key={j} className='year-season year-sky' data-j={j} data-season={seasonOf(j, k)} />
  ));
}

/**
 * State `k`'s land: per column of the year, the meadow repeated across the bottom and the grove on the right, by
 * day and by night. Pictures are CSS backgrounds on purpose: a hidden column, a theme
 * not on screen and a state still waiting for the page to load are `display: none`, which downloads nothing.
 */
export function YearLand({ k }: { k: number }) {
  return COLUMNS.map(j => {
    const season = seasonOf(j, k);

    return (
      <div key={j} className='year-season year-lands' data-j={j} data-season={season}>
        {THEMES.map(theme => (
          <div key={theme} className='year-land' data-art={theme}>
            <div
              className='year-meadow'
              style={{ backgroundImage: `url(${seasonUrl(SEASON_ART[season][theme].meadow)})` }}
            />
            <div
              className='year-grove'
              style={{
                backgroundImage: `url(${seasonUrl(SEASON_ART[season][theme].grove)})`,
                aspectRatio: GROVE_ASPECT,
              }}
            />
          </div>
        ))}
      </div>
    );
  });
}

/**
 * The landscape behind /cv on wide screens (scene/seasons.ts): fixed behind the whole page, the season's sky, the
 * stars by night, a meadow across the bottom and the edge of a larch wood on the right, while the year turns with
 * the hairlines of the log. The log reads on a veil that fades out just right of its column and eases off over the
 * meadow, so the ground runs edge to edge without the list ever sitting on a busy painting. The weather falls only
 * right of the list. Phones have no room beside it: they look through windows instead (season-window.tsx).
 */
export function YearBackdrop() {
  return (
    <div
      aria-hidden='true'
      className='year-backdrop max-wide:hidden print:hidden'
      style={{ '--year-ground': `${(GROUND_SHARE * 100).toFixed(1)}vh` } as React.CSSProperties}
    >
      <div className='year-stack'>
        {STATES.map(k => (
          <YearFade key={k} k={k}>
            <YearSky k={k} />
          </YearFade>
        ))}
      </div>
      <Stars />
      <div className='year-stack'>
        {STATES.map(k => (
          <YearFade key={k} k={k}>
            <YearLand k={k} />
          </YearFade>
        ))}
      </div>
      <YearWeather />
      <div className='year-veil' />
    </div>
  );
}
