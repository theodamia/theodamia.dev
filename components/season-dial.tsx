'use client';

import type React from 'react';
import { Leaf, Snowflake, Sprout, Sun } from 'lucide-react';
import { DOCK_ICON_STROKE } from '@/constants';
import { useFollowCalendar, useSeason } from '@/hooks/use-season';
import { switchSeason, type Season } from '@/lib/season';
import { cn } from '@/utils/cn';

type Wedge = {
  season: Season;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  /** The triangle from the middle to one side of the square; the round clip turns it into a wedge. */
  clip: string;
  /** Where the icon sits inside that wedge, as a share of the box. */
  at: string;
};

/**
 * Clockwise from the top, the way a year goes. Each wedge is a triangle from the centre out to one edge; the
 * circle the four of them sit in is what makes the two diagonals read as an X rather than as four corners.
 */
const WEDGES: Wedge[] = [
  { season: 'winter', icon: Snowflake, clip: '50% 50%, 0 0, 100% 0', at: 'top-[11%] left-1/2' },
  { season: 'spring', icon: Sprout, clip: '50% 50%, 100% 0, 100% 100%', at: 'top-1/2 left-[89%]' },
  { season: 'summer', icon: Sun, clip: '50% 50%, 100% 100%, 0 100%', at: 'top-[89%] left-1/2' },
  { season: 'autumn', icon: Leaf, clip: '50% 50%, 0 100%, 0 0', at: 'top-1/2 left-[11%]' },
];

/**
 * The season, as a circle with an X through it: four wedges, one per season, the one you are in filled.
 *
 * It lives on the climb, where the mountain is, but the choice it makes is kept and followed everywhere the world
 * appears — the summit strip on /about and the valley band on /cv change with it.
 *
 * The wedges are ordinary buttons clipped to triangles, not SVG paths, so each one has a real hit area and a real
 * focus ring; the round container is what cuts their outer edges into arcs. They are toggle buttons rather than
 * radios: four of them are visible at once with one pressed, which `aria-pressed` says plainly and without the
 * roving focus a radio group would owe its reader.
 */
export function SeasonDial({ className }: { className?: string }) {
  const season = useSeason();
  useFollowCalendar();

  return (
    <div
      role='group'
      aria-label='Season'
      className={cn(
        'border-line shadow-dock bg-card/96 max-wide:size-[76px] fixed bottom-4 left-4 z-[85] size-[92px] overflow-hidden rounded-full border max-[560px]:bottom-[84px] print:hidden',
        className
      )}
    >
      {/* the X: drawn once, under the wedges, so the hairlines meet exactly in the middle */}
      <svg
        aria-hidden='true'
        viewBox='0 0 2 2'
        className='stroke-line absolute inset-0 size-full'
        strokeWidth={0.02}
      >
        <path d='M0,0 L2,2 M2,0 L0,2' />
      </svg>

      {WEDGES.map(({ season: which, icon: Icon, clip, at }) => {
        const on = which === season;

        return (
          <button
            key={which}
            type='button'
            aria-label={which}
            aria-pressed={on}
            onClick={event => switchSeason(event.currentTarget, which)}
            style={{ clipPath: `polygon(${clip})` }}
            className={cn(
              'ease-soft absolute inset-0 cursor-pointer transition-colors duration-300 motion-reduce:transition-none',
              on ? 'bg-ink' : 'hover:bg-ice'
            )}
          >
            <Icon
              strokeWidth={DOCK_ICON_STROKE}
              className={cn(
                'absolute size-[18px] -translate-x-1/2 -translate-y-1/2',
                at,
                on ? 'text-on-ink' : 'text-ink-2'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
