'use client';

import type React from 'react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Altimeter } from '@/components/altimeter';
import { JobCard } from '@/components/job-card';
import { AscentStage } from '@/components/scene/ascent-stage';
import { CampDoor } from '@/components/scene/camp-door';
import { SceneryContext } from '@/components/scenery';
import { ScrollCue } from '@/components/scroll-cue';
import { JOBS } from '@/content/jobs';
import { useClimbScroll } from '@/hooks/use-climb-scroll';
import { useInView } from '@/hooks/use-in-view';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { morph } from '@/lib/view-morph';
import { LEG_WEIGHTS, SIDES, type SceneHandle } from '@/scene/world';
import { cn } from '@/utils/cn';

/** Scroll length of a leg of weight 1, in large viewport heights. */
const LEG_SCROLL_LVH = 140;
/** Room under the last card before the page's closing section. */
const LAST_CARD_LVH = 110;
/** The view transition that carries the closing card into today's camp and out again. */
const CARD_MORPH = 'closing-card';
/** How long the way back is shown after the card is set aside ("Today's note" under the camp's name), in ms. */
const HINT_MS = 3200;

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
 * The same jobs, read plainly and newest first, are a page of their own at /cv.
 */
export function Climb({ hero, children }: ClimbProps) {
  const scene = useRef<SceneHandle>(null);
  const track = useRef<HTMLDivElement>(null);
  const climb = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const walked = useRef<HTMLSpanElement>(null);
  const closing = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  /* the closing card in view is what "the climb is over" means: the last job is behind you and the summit is off
     the top of the screen, so the label up there has nothing left to point at */
  const climbOver = useInView(closing);
  /* taking in the view: the closing card set aside into today's camp (components/scenery.tsx) */
  const [viewing, setViewing] = useState(false);
  const card = useRef<HTMLElement>(null);
  const door = useRef<HTMLButtonElement>(null);
  const returning = useRef(false);
  const hint = useRef(0);
  const { stop, year, moving, scrollToStop } = useClimbScroll({
    scene,
    track,
    climb,
    rail,
    needle,
    walked,
  });

  /* the card goes into the camp, or comes back out of it; the camp's name shows the way back for a moment */
  const fold = (next: boolean) => {
    returning.current = !next;
    morph(
      next ? card.current : door.current,
      () => (next ? door.current : card.current),
      () => {
        flushSync(() => setViewing(next));
        if (!next) return;
        const el = door.current;
        el?.focus({ preventScroll: true });
        el?.setAttribute('data-hint', '');
        window.clearTimeout(hint.current);
        hint.current = window.setTimeout(() => el?.removeAttribute('data-hint'), HINT_MS);
      },
      CARD_MORPH
    );
  };

  const unfold = useEffectEvent(() => fold(false));

  /* the scene shows the summit's line again while the card is set aside */
  useEffect(() => {
    document.documentElement.toggleAttribute('data-scenery', viewing);

    return () => document.documentElement.removeAttribute('data-scenery');
  }, [viewing]);

  /* Escape takes the card out again, and leaving the summit puts it back for the next arrival */
  useEffect(() => {
    if (!viewing) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        unfold();
      }
    };

    const away = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) return;
      returning.current = false;
      setViewing(false);
    });

    window.addEventListener('keydown', onKey);

    if (card.current) {
      away.observe(card.current);
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      away.disconnect();
    };
  }, [viewing]);

  useEffect(() => () => window.clearTimeout(hint.current), []);

  return (
    <main className='grid'>
      <AscentStage
        ref={scene}
        reducedMotion={reducedMotion}
        stop={stop}
        climbOver={climbOver}
        doorRef={door}
      />

      <div
        ref={track}
        className='max-wide:px-4 relative z-[2] col-start-1 row-start-1 mx-auto w-full max-w-[1180px] px-7'
      >
        {hero}
        <ol
          ref={climb}
          id='climb'
          aria-label='Experience, oldest first'
          className='clear-of-altimeter'
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
              <JobCard job={job} index={i} />
            </li>
          ))}
        </ol>
        <SceneryContext value={{ viewing, fold, cardRef: card, returningRef: returning }}>
          <div ref={closing}>{children}</div>
        </SceneryContext>
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
      <CampDoor open={viewing} onOpen={() => fold(false)} ref={door} />
    </main>
  );
}
