'use client';

import type React from 'react';
import { useSyncExternalStore } from 'react';
import { YearFade } from '@/components/scene/year-fade';
import {
  DEFAULT_START,
  seasonOf,
  weatherField,
  weatherKeyframes,
  YEAR_STATES,
  type Season,
} from '@/scene/seasons';

const STATES = Array.from({ length: YEAR_STATES }, (_, k) => k);
const WEATHER_CSS = weatherKeyframes();

/** The year's start never changes while the page is open: nothing to subscribe to. */
const subscribe = () => () => {};

const readStart = () => Number(document.documentElement.dataset.yearStart ?? DEFAULT_START);
const noStart = () => null;

/** One season's weather, in the box right of the list (`.year-weather`). */
function Weather({ season }: { season: Season }) {
  return (
    <div className='year-weather'>
      {weatherField(season).map(bit => (
        <span
          key={bit.key}
          data-kind={bit.kind}
          className='weather-bit'
          style={
            {
              left: `${bit.x.toFixed(2)}%`,
              '--size': `${bit.size.toFixed(2)}px`,
              '--alpha': bit.alpha.toFixed(2),
              animationName: `weather-${bit.kind}-${bit.path}`,
              animationDuration: `${bit.cycle.toFixed(2)}s`,
              animationDelay: `-${bit.phase.toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * The year's weather, one stack of states over the land, each with its own season's: petals, motes, larch needles,
 * snow. Drawn in the browser only, once the year's start is known (`data-year-start`, written before the first
 * paint), so each state carries the one season it shows: rendered on the server it would have to carry all four,
 * a few hundred particles twice over (the HTML and React's payload) for weather nobody needs before it is seen.
 */
export function YearWeather() {
  const start = useSyncExternalStore(subscribe, readStart, noStart);
  if (start === null) return null;

  return (
    <div className='year-stack'>
      {/* the weather's keyframes, generated with the fields; React hoists and dedupes them */}
      <style href='year-weather' precedence='default'>
        {WEATHER_CSS}
      </style>
      {STATES.map(k => (
        <YearFade key={k} k={k}>
          <Weather season={seasonOf(start, k)} />
        </YearFade>
      ))}
    </div>
  );
}
