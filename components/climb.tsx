'use client';

import type React from 'react';
import { useRef } from 'react';
import { Altimeter } from '@/components/altimeter';
import { JobCard } from '@/components/job-card';
import { AscentStage } from '@/components/scene/ascent-stage';
import { ScrollCue } from '@/components/scroll-cue';
import { LAST_CARD_LVH, LEG_SCROLL_LVH } from '@/constants';
import { useClimbScroll } from '@/hooks/use-climb-scroll';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { JOBS } from '@/lib/jobs';
import { LEG_WEIGHTS, SIDES, type SceneHandle } from '@/lib/scene/world';

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
 */
export function Climb({ hero, children }: ClimbProps) {
  const scene = useRef<SceneHandle>(null);
  const track = useRef<HTMLDivElement>(null);
  const climb = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const walked = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const { stop, year, moving, scrollToStop } = useClimbScroll({
    scene,
    track,
    climb,
    rail,
    needle,
    walked,
  });

  return (
    <main className='grid'>
      <AscentStage ref={scene} reducedMotion={reducedMotion} stop={stop} />

      <div
        ref={track}
        className='relative z-[2] col-start-1 row-start-1 mx-auto w-full max-w-[1180px] px-7 max-[899px]:px-4'
      >
        {hero}
        <ol
          ref={climb}
          id='climb'
          aria-label='Experience, oldest first'
          className='clear-of-altimeter'
        >
          {JOBS.map((job, i) => (
            <JobCard
              key={job.start}
              job={job}
              index={i}
              side={SIDES[campOf(i)] > 0 ? 'left' : 'right'}
              legLvh={legLvhOf(i)}
            />
          ))}
        </ol>
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
