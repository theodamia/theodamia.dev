'use client';

import type React from 'react';
import { Leaf, Snowflake, Sprout, Sun } from 'lucide-react';
import { useState } from 'react';
import { useFollowCalendar, useSeason } from '@/hooks/use-season';
import { switchSeason, type Season } from '@/lib/season';
import { cn } from '@/utils/cn';
import { turnToward } from '@/utils/turn-toward';

type Wedge = {
  season: Season;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  /** The triangle from the middle out to one side of the square; the round clip turns it into a wedge. */
  clip: string;
  /**
   * Where the icon sits: a quarter-circle's centre of area, six tenths of the way out along its bisector, which on
   * this box is 30% from the middle — so 20% and 80%. Do not nudge it inward to "centre" it better. The wedge
   * narrows toward the hub, and an icon moved in there has its lower corners eaten by the seam.
   */
  at: string;
};

/** A quarter turn per season, clockwise from the top: the marker rides round to whichever is chosen. */
const TURN = 90;

/** Clockwise from the top, the way a year goes. */
const WEDGES: Wedge[] = [
  { season: 'winter', icon: Snowflake, clip: '50% 50%, 0 0, 100% 0', at: 'top-[20%] left-1/2' },
  { season: 'spring', icon: Sprout, clip: '50% 50%, 100% 0, 100% 100%', at: 'top-1/2 left-[80%]' },
  { season: 'summer', icon: Sun, clip: '50% 50%, 100% 100%, 0 100%', at: 'top-[80%] left-1/2' },
  { season: 'autumn', icon: Leaf, clip: '50% 50%, 0 100%, 0 0', at: 'top-1/2 left-[20%]' },
];

/*
 * In the 72-unit box below. The seam has to be wide enough to cover the stepped edge a clipped triangle leaves
 * along its diagonal — that step is what made the first dial look ragged — and the hub gives the four wedges
 * somewhere to meet other than a pinch.
 */
const SEAM = 4.5;
const HUB = 5.5;

/**
 * The season, as a circle with an X through it: four wedges, one per season, the one you are in filled with the
 * site's one warm colour — the same accent that marks Contact in the dock and "Now" on the altimeter, which is
 * what keeps a control this small from reading as another grey instrument.
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
  const facing = WEDGES.findIndex(wedge => wedge.season === season) * TURN;
  const [angle, setAngle] = useState(facing);
  const [turned, setTurned] = useState(season);
  useFollowCalendar();

  /*
   * Adjusted while rendering rather than in an effect, which is what React asks for when state has to follow
   * something that changed: it re-renders before painting, so the marker never shows at the old angle first.
   *
   * The angle is a running total rather than one of four fixed values, so the marker always takes the short way
   * round: from autumn back to winter it turns a quarter forward, not three quarters back.
   */
  if (turned !== season) {
    setTurned(season);
    setAngle(from => turnToward(from, facing));
  }

  return (
    <div
      role='group'
      aria-label='Season'
      className={cn(
        'season-dial border-line bg-card/92 max-wide:hidden fixed top-4 left-4 z-[85] size-[72px] overflow-hidden rounded-full border backdrop-blur-md print:hidden',
        className
      )}
    >
      {/*
        One filled wedge for all four seasons, turned to the chosen one. Rotating a single marker is what makes the
        change read as a dial rather than as one square going out and another coming on — and a rotation is a
        transform, so it costs the compositor nothing.
      */}
      <div
        aria-hidden='true'
        className='season-marker'
        style={{ rotate: `${angle}deg`, clipPath: `polygon(${WEDGES[0].clip})` }}
      />

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
              'season-wedge group absolute inset-0 cursor-pointer',
              !on && 'hover:bg-accent-wash'
            )}
          >
            <Icon
              strokeWidth={1.85}
              className={cn(
                'ease-pop absolute size-4 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-[1.08] motion-reduce:transition-none',
                at,
                on ? 'text-on-ink' : 'text-ink-2 group-hover:text-accent-text'
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
        viewBox='0 0 72 72'
        fill='none'
        className='pointer-events-none absolute inset-0 size-full'
      >
        <path d='M0,0 L72,72 M72,0 L0,72' className='stroke-card' strokeWidth={SEAM} />
        <path d='M0,0 L72,72 M72,0 L0,72' className='stroke-line' strokeWidth={1} />
        <circle cx='36' cy='36' r={HUB} className='fill-card stroke-line' strokeWidth={1} />
      </svg>
    </div>
  );
}
