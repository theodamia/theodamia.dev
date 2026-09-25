'use client';

import type React from 'react';
import { Leaf, Snowflake, Sprout, Sun } from 'lucide-react';
import { useFollowCalendar, useSeason } from '@/hooks/use-season';
import { switchSeason, type Season } from '@/lib/season';
import { cn } from '@/utils/cn';

type Wedge = {
  season: Season;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  /** The triangle from the middle out to one side of the square; the round clip turns it into a wedge. */
  clip: string;
  /**
   * Where the icon sits. A quarter-circle's centre of area is about six tenths of the way out along its bisector,
   * which on this box is 30% from the middle — so 20% and 80%, nudged in a little to keep it off the rim.
   */
  at: string;
};

/** Clockwise from the top, the way a year goes. */
const WEDGES: Wedge[] = [
  { season: 'winter', icon: Snowflake, clip: '50% 50%, 0 0, 100% 0', at: 'top-[24%] left-1/2' },
  { season: 'spring', icon: Sprout, clip: '50% 50%, 100% 0, 100% 100%', at: 'top-1/2 left-[76%]' },
  { season: 'summer', icon: Sun, clip: '50% 50%, 100% 100%, 0 100%', at: 'top-[76%] left-1/2' },
  { season: 'autumn', icon: Leaf, clip: '50% 50%, 0 100%, 0 0', at: 'top-1/2 left-[24%]' },
];

/** Thin enough to read as a seam rather than a frame, drawn in the dial's own surface colour. */
const SEAM = 3;
const HUB = 4.5;

/**
 * The season, as a circle with an X through it: four wedges, one per season, the one you are in filled.
 *
 * It mirrors the altimeter — same inset from the same top corner, on the opposite side — and stops above the
 * hero's first line, which is what keeps it clear of the name at every width it is shown at. Below the wide
 * breakpoint it is not shown: there is no room beside the text, and the mountain is mostly off screen anyway.
 *
 * It lives on the climb, where the mountain is, but the choice it makes is kept and followed everywhere the world
 * appears — the summit strip on /about and the valley band on /cv change with it.
 *
 * The wedges are ordinary buttons clipped to triangles, not SVG paths, so each one has a real hit area and a real
 * focus ring; the round container is what cuts their outer edges into arcs, and the seams are drawn over the top
 * so the four meet cleanly at a hub instead of in a pinch. They are toggle buttons rather than radios: four are
 * visible at once with one pressed, which `aria-pressed` says plainly and without the roving focus a radio group
 * would owe its reader.
 */
export function SeasonDial({ className }: { className?: string }) {
  const season = useSeason();
  useFollowCalendar();

  return (
    <div
      role='group'
      aria-label='Season'
      className={cn(
        'border-line shadow-soft bg-card/90 max-wide:hidden fixed top-[22px] left-[22px] z-[85] size-16 overflow-hidden rounded-full border backdrop-blur-sm print:hidden',
        className
      )}
    >
      {WEDGES.map(({ season: which, icon: Icon, clip, at }) => {
        const on = which === season;

        return (
          <button
            key={which}
            type='button'
            aria-label={which}
            aria-pressed={on}
            title={which}
            onClick={event => switchSeason(event.currentTarget, which)}
            style={{ clipPath: `polygon(${clip})` }}
            className={cn(
              'group ease-soft absolute inset-0 cursor-pointer transition-colors duration-300 motion-reduce:transition-none',
              on ? 'bg-ink' : 'hover:bg-ice'
            )}
          >
            <Icon
              strokeWidth={1.9}
              className={cn(
                'ease-pop absolute size-[15px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-115 motion-reduce:transition-none',
                at,
                on ? 'text-on-ink' : 'text-ink-2 group-hover:text-ink'
              )}
            />
          </button>
        );
      })}

      {/*
        The X, drawn over the wedges: a seam in the dial's own surface colour so a filled wedge is separated from
        its neighbours, and a hairline on top of that so the cross is there to see even when no two wedges differ.
        The hub gives the four somewhere to meet other than a pinch.
      */}
      <svg
        aria-hidden='true'
        viewBox='0 0 64 64'
        fill='none'
        className='pointer-events-none absolute inset-0 size-full'
      >
        <path d='M0,0 L64,64 M64,0 L0,64' className='stroke-card' strokeWidth={SEAM} />
        <path d='M0,0 L64,64 M64,0 L0,64' className='stroke-line' strokeWidth={1} />
        <circle cx='32' cy='32' r={HUB} className='fill-card stroke-line' strokeWidth={1} />
      </svg>
    </div>
  );
}
