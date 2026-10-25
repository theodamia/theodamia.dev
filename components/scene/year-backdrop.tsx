import type React from 'react';
import { Celestial, Stars } from '@/components/scene/sky';
import { YearFade } from '@/components/scene/year-fade';
import { YearWeather } from '@/components/scene/year-weather';
import { artUrl, BACKDROP, CLOUDS, FLATS, type Theme } from '@/scene/flats';
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
const PEAK = FLATS.find(flat => flat.kind === 'peak');

/**
 * The far ranges are the climb's backdrop tile, laid as copies a period apart, each overlapping the last on its
 * bleed. A period is the tile's box (its width against its height); its file is that plus the bleed. Two copies
 * cover any screen at the height they are drawn here.
 */
const RANGE_COPIES = [0, 1];
const RANGE_PERIOD = BACKDROP.box[2] / BACKDROP.box[3];
const RANGE_PAINTED = RANGE_PERIOD * (1 + BACKDROP.tile!.bleed / BACKDROP.tile!.period);

/**
 * The climb's sky clouds, on the climb's wind (`cloud-cross`, `cloud-billow`): which painting, how high, how wide
 * (vh), where across it stands when the page opens, and its crossing and billow times. Fewer and smaller than the
 * climb's, and high: from the valley most of the sky is above the trees.
 */
const YEAR_CLOUDS = [
  { cloud: 0, top: '5%', width: 30, at: 0.62, cross: 240, billow: 19 },
  { cloud: 1, top: '13%', width: 20, at: 0.86, cross: 300, billow: 15 },
  { cloud: 2, top: '3%', width: 14, at: 0.3, cross: 340, billow: 13 },
] as const;

/** One painted picture in both themes, as CSS backgrounds (`.year-art`: only the theme on screen downloads). */
function Art({ day, night }: Record<Theme, string>) {
  return THEMES.map(theme => (
    <div
      key={theme}
      className='year-art year-picture'
      data-art={theme}
      style={{ backgroundImage: `url(${theme === 'day' ? day : night})` }}
    />
  ));
}

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
 * The mountain the climb walks, seen from the valley at its foot: the climb's own far ranges and its summit, the same
 * paintings, rising behind the meadow. The meadow hides their cloud sea, all but a band of it, which from down here
 * reads as mist at the mountains' feet. Their snow lies all year, so they stand in every season.
 */
export function YearRange() {
  return (
    <div className='year-range'>
      {RANGE_COPIES.map(copy => (
        <div
          key={copy}
          className='year-far'
          style={
            {
              '--copy': copy,
              '--period': RANGE_PERIOD,
              aspectRatio: RANGE_PAINTED,
            } as React.CSSProperties
          }
        >
          <Art day={artUrl(BACKDROP.art.day.near)} night={artUrl(BACKDROP.art.night.near)} />
        </div>
      ))}
      {PEAK && (
        <div className='year-peak' style={{ aspectRatio: PEAK.box[2] / PEAK.box[3] }}>
          <Art day={artUrl(PEAK.art.day.near)} night={artUrl(PEAK.art.night.near)} />
        </div>
      )}
    </div>
  );
}

/** The climb's clouds, in the valley's sky. */
function YearClouds() {
  return YEAR_CLOUDS.map(wind => {
    const cloud = CLOUDS[wind.cloud];
    if (!cloud) return null;

    return (
      <div
        key={`${wind.cloud}-${wind.top}`}
        className='year-cloud'
        style={
          {
            top: wind.top,
            width: `${wind.width}vh`,
            aspectRatio: `${cloud.w} / ${cloud.h}`,
            '--at': wind.at,
            '--cross': `${wind.cross}s`,
            '--billow': `${wind.billow}s`,
          } as React.CSSProperties
        }
      >
        <Art day={artUrl(cloud.art.day)} night={artUrl(cloud.art.night)} />
      </div>
    );
  });
}

/**
 * State `k`'s land: per column of the year, the meadow repeated across the bottom and the grove on the right, by
 * day and by night. Pictures are CSS backgrounds on purpose: a hidden column, a theme not on screen and a state
 * still waiting for the page to load are `display: none`, which downloads nothing.
 */
export function YearLand({ k }: { k: number }) {
  return COLUMNS.map(j => {
    const season = seasonOf(j, k);

    return (
      <div key={j} className='year-season' data-j={j} data-season={season}>
        {THEMES.map(theme => (
          <div key={theme} className='year-art' data-art={theme}>
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
 * The landscape behind /cv on wide screens (scene/seasons.ts): the valley at the foot of the climb's mountain. Fixed
 * behind the whole page, back to front: the season's sky, the climb's stars by night and its sun that becomes the
 * moon, its clouds on its wind, its far ranges and summit, then the meadow across the bottom and the edge of a larch
 * wood on the right, which turn with the year as the log's hairlines pass. All at full strength, as on the climb:
 * the log reads on a solid sheet in front of it (app/cv/page.tsx), and the weather falls only right of that sheet.
 * Phones have no room beside it: they look through windows instead (season-window.tsx).
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
      <Celestial className='year-sun' />
      <YearClouds />
      <YearRange />
      <div className='year-stack'>
        {STATES.map(k => (
          <YearFade key={k} k={k}>
            <YearLand k={k} />
          </YearFade>
        ))}
      </div>
      <YearWeather />
    </div>
  );
}
