'use client';

import { useEffect, useRef, useState } from 'react';
import { LADDER_COLORS, REDUCED_MOTION_QUERY } from '@/constants';
import { bandForLevel, MILESTONES } from '@/lib/milestones';

type ClimbLadderProps = {
  onSelect: (index: number) => void;
};

/** How far down the viewport the progress spine reaches for — 0 top, 1 bottom. */
const PROGRESS_VIEWPORT_RATIO = 0.62;
/** The track is inset 8px from the container's top and bottom. */
const TRACK_INSET = 8;

/**
 * Fig. 1 on phones. chart.xkcd's forced aspect ratio and the measured overlays do not
 * survive a narrow viewport, so the climb becomes a vertical timeline — summit first,
 * with a dashed spine that fills in as the section passes the lower third of the screen.
 */
export function ClimbLadder({ onSelect }: ClimbLadderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillHeight, setFillHeight] = useState(0);
  const steps = MILESTONES.map((milestone, index) => ({ milestone, index })).reverse();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    let frame: number | undefined;

    const update = () => {
      frame = undefined;

      const rect = container.getBoundingClientRect();
      const span = rect.height - TRACK_INSET * 2;
      if (span <= 0) return;

      if (reduceMotion) {
        setFillHeight(span);
        return;
      }

      const progress = (window.innerHeight * PROGRESS_VIEWPORT_RATIO - rect.top) / span;
      setFillHeight(Math.min(Math.max(progress, 0), 1) * span);
    };

    // Scroll fires far more often than a frame renders, so update at most once per frame.
    const scheduleUpdate = () => {
      if (frame === undefined) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return (
    <div ref={containerRef} className='relative mt-[22px] pl-8'>
      <div aria-hidden='true' className='ladder-track absolute top-2 bottom-2 left-[10px] w-0.5' />
      <div
        aria-hidden='true'
        className='bg-accent/70 absolute top-2 left-[9px] w-1 rounded-full'
        style={{ height: fillHeight }}
      />

      {steps.map(({ milestone, index }) => {
        const hue = LADDER_COLORS[index % LADDER_COLORS.length];
        return (
          <button
            key={milestone.year}
            type='button'
            onClick={() => onSelect(index)}
            className='border-ink/18 shadow-card relative mb-3.5 block w-full cursor-pointer rounded-[5px] border bg-white/70 px-[15px] pt-3.5 pb-[15px] text-left'
          >
            <span
              aria-hidden='true'
              className='border-card absolute top-[19px] -left-[29px] h-3.5 w-3.5 rounded-full border-2'
              style={{ background: hue, boxShadow: `0 0 0 2px ${hue}` }}
            />

            <span className='flex items-center gap-2.5'>
              <span className='text-ink-faint font-mono text-[10.5px] tracking-[0.16em]'>
                {milestone.year}
              </span>
              <span
                className='text-ink-body rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-[0.14em] uppercase'
                style={{ background: `${hue}22` }}
              >
                {bandForLevel(milestone.level)}
              </span>
            </span>

            <span className='font-hand text-ink-strong mt-1.5 block text-2xl leading-[1.1]'>
              {milestone.title}
            </span>
            <span className='text-ink-ghost mt-[3px] block font-mono text-[10px] tracking-[0.12em] uppercase'>
              {milestone.period}
            </span>
            <span className='text-ink-body mt-[9px] block text-[14.5px] leading-[1.55] text-pretty'>
              {milestone.text}
            </span>
            <span className='text-accent mt-2.5 block font-mono text-[10px] tracking-[0.16em] uppercase'>
              Full story →
            </span>
          </button>
        );
      })}
    </div>
  );
}
