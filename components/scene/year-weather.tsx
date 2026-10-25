'use client';

import type React from 'react';
import { useSyncExternalStore } from 'react';
import { YearFade } from '@/components/scene/year-fade';
import {
  DEFAULT_START,
  seasonOf,
  seasonUrl,
  WEATHER_ATLAS,
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

const px = (value: number) => `${value.toFixed(2)}px`;

/**
 * One season's weather, in the box right of the list (`.year-weather`): each bit is one sprite of the painted kit,
 * cut from the atlas by its background's position and size, scaled so its longest side is the bit's size; winter's
 * are the climb's soft flakes instead.
 */
function Weather({ season }: { season: Season }) {
  const [atlasW, atlasH] = WEATHER_ATLAS.size;

  return (
    <div className='year-weather'>
      {weatherField(season).map(bit => {
        const timing = {
          animationName: `weather-${bit.kind}-${bit.path}`,
          animationDuration: `${bit.cycle.toFixed(2)}s`,
          animationDelay: `-${bit.phase.toFixed(2)}s`,
        };

        /* winter's snow is the climb's: a soft round flake, drawn in CSS (`.weather-flake`) */
        if (bit.sprite < 0) {
          return (
            <span
              key={bit.key}
              data-kind={bit.kind}
              className='weather-bit weather-flake'
              style={
                {
                  left: `${bit.x.toFixed(2)}%`,
                  '--size': px(bit.size),
                  opacity: bit.alpha,
                  ...timing,
                } as React.CSSProperties
              }
            />
          );
        }

        const [x, y, w, h] = WEATHER_ATLAS.sprites[season][bit.sprite];
        const scale = bit.size / WEATHER_ATLAS.sprite;

        return (
          <span
            key={bit.key}
            data-kind={bit.kind}
            className='weather-bit'
            style={{
              left: `${bit.x.toFixed(2)}%`,
              width: px(w * scale),
              height: px(h * scale),
              backgroundPosition: `${px(-x * scale)} ${px(-y * scale)}`,
              backgroundSize: `${px(atlasW * scale)} ${px(atlasH * scale)}`,
              /* a seed's keyframes fade it in and out, which would overwrite this */
              opacity: bit.kind === 'seed' ? undefined : bit.alpha,
              ...timing,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * The year's weather, one stack of states over the land, each with its own season's: sakura petals, dandelion
 * seeds, yellow leaves, snow. Drawn in the browser only, once the year's start is known (`data-year-start`, written before the first
 * paint), so each state carries the one season it shows: rendered on the server it would have to carry all four,
 * a few hundred particles twice over (the HTML and React's payload) for weather nobody needs before it is seen.
 */
export function YearWeather() {
  const start = useSyncExternalStore(subscribe, readStart, noStart);
  if (start === null) return null;

  return (
    <div
      className='year-stack'
      style={
        {
          '--atlas-day': `url(${seasonUrl(WEATHER_ATLAS.atlas.day)})`,
          '--atlas-night': `url(${seasonUrl(WEATHER_ATLAS.atlas.night)})`,
        } as React.CSSProperties
      }
    >
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
