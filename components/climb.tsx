'use client';

import type React from 'react';
import { useRef } from 'react';
import { Altimeter } from '@/components/altimeter';
import { JobCard } from '@/components/job-card';
import { AscentStage } from '@/components/scene/ascent-stage';
import { ScrollCue } from '@/components/scroll-cue';
import { Timeline } from '@/components/timeline';
import { LAST_CARD_LVH, LEG_SCROLL_LVH } from '@/constants';
import { useClimbScroll } from '@/hooks/use-climb-scroll';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useFollowSystemView, useView } from '@/hooks/use-view';
import { JOBS } from '@/lib/jobs';
import { LEG_WEIGHTS, SIDES, type SceneHandle } from '@/lib/scene/world';
import { LIST_ATTR } from '@/lib/view';
import { cn } from '@/utils/cn';

type ClimbProps = {
  hero: React.ReactNode;
  /** Whatever follows the last stop. */
  children: React.ReactNode;
};

/** Camp 0 is the trailhead, which has no card: job `i` stands at camp `i + 1`. */
const campOf = (job: number) => job + 1;

/** A job's stop is as tall as the leg that leaves its camp is long; the last job has no leg, only some room. */
const legLvhOf = (job: number) => {
  const weight = LEG_WEIGHTS[campOf(job)];

  return weight === undefined ? LAST_CARD_LVH : weight * LEG_SCROLL_LVH;
};

/**
 * The main page: a sticky stage with the mountain, and over it (same grid cell, normal flow) the hero and one
 * card per job. Cards never live inside the moving world, so focus and scrolling behave like any other page.
 *
 * The same jobs are also laid out as a plain timeline, and `data-view` on <html> decides which of the two is
 * shown. Both are rendered so the choice costs no flash: CSS swaps them before the first paint, and only then
 * does the scroll controller learn which one it is driving.
 */
export function Climb({ hero, children }: ClimbProps) {
  const scene = useRef<SceneHandle>(null);
  const track = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const climbList = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const walked = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  useFollowSystemView();
  const { stop, year, moving, scrollToStop } = useClimbScroll({
    enabled: useView() === 'climb',
    scene,
    track,
    anchor,
    climbList,
    rail,
    needle,
    walked,
  });

  return (
    <main className='grid'>
      <AscentStage ref={scene} reducedMotion={reducedMotion} stop={stop} />

      <div
        ref={track}
        className='max-wide:px-4 relative z-[2] col-start-1 row-start-1 mx-auto w-full max-w-[1180px] px-7'
      >
        {hero}
        {/* the anchor the dock scrolls to; it stays measurable whichever view is hidden */}
        <div ref={anchor} id='climb'>
          <ol
            ref={climbList}
            {...{ [LIST_ATTR]: 'climb' }}
            aria-label='Experience, oldest first'
            className='clear-of-altimeter timeline:hidden'
          >
            {JOBS.map((job, i) => (
              <li
                key={job.start}
                className={cn(
                  'max-wide:justify-center flex items-start',
                  SIDES[campOf(i)] > 0 ? 'justify-start' : 'justify-end'
                )}
                style={{ minHeight: `${legLvhOf(i)}lvh` }}
              >
                <JobCard job={job} index={i} idPrefix='climb' />
              </li>
            ))}
          </ol>
          <Timeline className='timeline:block hidden' />
        </div>
        {children}
      </div>

      <Altimeter
        job={stop - 1}
        year={year}
        onJump={job => scrollToStop(campOf(job))}
        railRef={rail}
        needleRef={needle}
        walkedRef={walked}
      />
      <ScrollCue gone={moving} onStart={() => scrollToStop(campOf(0))} />
    </main>
  );
}
