import type React from 'react';
import { CAMP_ANCHORS } from '@/constants';
import { Eyebrow } from '@/components/ui/text';
import { JOBS, TRAILHEAD } from '@/lib/jobs';
import { SUMMIT_LINE } from '@/lib/site';
import { cameraKnot, campAnchor, WORLD } from '@/lib/scene/world';
import { cn } from '@/utils/cn';

type AltimeterProps = {
  /** Index of the job the climber has reached, or -1 while still at the trailhead. */
  job: number;
  year: number;
  /** Jump to a job's stop; -1 is the trailhead. */
  onJump: (job: number) => void;
  railRef: React.Ref<HTMLElement>;
  needleRef: React.Ref<HTMLSpanElement>;
  walkedRef: React.Ref<HTMLSpanElement>;
};

/** Where a stop sits on the rail: the camera position at its camp, as a share of the whole climb. */
function stopTop(job: number): string {
  /* camp 0 is the trailhead, so job `i` stands at camp `i + 1` */
  const camp = job + 1;
  const knot = cameraKnot(camp, campAnchor(camp, CAMP_ANCHORS.WIDE));
  return `${Math.min(100, (knot / WORLD.TRAVEL) * 100).toFixed(1)}%`;
}

/** Every stop on the rail: the trailhead, then one per job. `job` is what `onJump` takes, `top` where it sits. */
const STOPS = [
  {
    job: -1,
    year: TRAILHEAD.year,
    place: TRAILHEAD.label,
    label: `${TRAILHEAD.year}, the start of the trail`,
    top: stopTop(-1),
  },
  ...JOBS.map((job, i) => ({
    job: i,
    year: job.start,
    place: job.place,
    label: `${job.start}, ${job.role} at ${job.company}`,
    top: stopTop(i),
  })),
];
/** The last job in `lib/jobs.ts` is the present one: its mark says "Now". */
const NOW = JOBS.length - 1;

/**
 * The trail in miniature, fixed on the right: the summit it leads to at the top, the start at the bottom, and a mark
 * for every stop that says when and where it was: plain right-aligned text with a soft halo, and an ink pill only
 * for the stop you are at. It speaks the scene's language: walked is solid ink, still to
 * climb is dotted. The needle and the walked bar are moved by the scroll controller (transforms only); the lit mark
 * and the filled nodes change only when a new stop is reached. Only the marks take pointer events.
 *
 * On narrow screens a small pill with the year being passed and where you are replaces the rail.
 */
export function Altimeter({
  job: reached,
  year,
  onJump,
  railRef,
  needleRef,
  walkedRef,
}: AltimeterProps) {
  return (
    <div className='max-wide:top-3.5 max-wide:right-3 max-wide:bottom-auto pointer-events-none fixed top-[22px] right-[22px] bottom-10 z-[6] flex flex-col items-end gap-5'>
      {/* the top of the rail: the summit the trail leads to and never reaches, because the climb goes on */}
      <p className='text-ink-3 max-wide:hidden mr-[5px] flex items-center gap-1.5 text-[12.5px] leading-none font-semibold'>
        {SUMMIT_LINE}
        <svg aria-hidden='true' viewBox='0 0 12 10' width='12' height='10' className='shrink-0'>
          <path
            d='M1 9 L6 1.5 L11 9 Z'
            className='fill-card stroke-ink-3'
            strokeWidth='1.4'
            strokeLinejoin='round'
          />
        </svg>
      </p>

      <div
        aria-hidden='true'
        className='border-line shadow-soft bg-card/94 max-wide:flex hidden items-baseline gap-2 rounded-full border px-3.5 pt-1.5 pb-[7px]'
      >
        <span className='font-display text-[20px] leading-none font-semibold tracking-[-0.02em]'>
          {year}
        </span>
        <Eyebrow>{reached < 0 ? TRAILHEAD.label : JOBS[reached].place}</Eyebrow>
      </div>

      <nav
        ref={railRef}
        aria-label='Jump to a year on the climb'
        className='max-wide:hidden relative mr-2.5 w-[3px] flex-1'
      >
        {/* still to climb: dotted, like the trail ahead in the scene */}
        <span
          aria-hidden='true'
          className='absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-ink)_42%,transparent)_1.1px,transparent_1.6px)] bg-size-[3px_8px] bg-repeat-y'
        />
        {/* walked: solid ink from the start up to the needle; the scroll controller scales it */}
        <span
          ref={walkedRef}
          aria-hidden='true'
          className='bg-ink absolute inset-0 origin-bottom [transform:scaleY(0)] rounded-[3px] will-change-transform'
        />

        {STOPS.map(stop => (
          <span
            key={`node-${stop.year}`}
            aria-hidden='true'
            data-reached={stop.job <= reached}
            style={{ top: stop.top }}
            className={cn(
              'absolute left-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full',
              stop.job <= reached
                ? 'bg-ink shadow-[0_0_0_2px_var(--color-card)]'
                : 'bg-card shadow-[0_0_0_1.5px_color-mix(in_oklab,var(--color-ink)_40%,transparent)]'
            )}
          />
        ))}

        {STOPS.map(stop => {
          const current = stop.job === reached;
          const now = stop.job === NOW;
          return (
            <button
              key={stop.year}
              type='button'
              style={{ top: stop.top }}
              aria-label={now ? `Now: ${stop.label}` : stop.label}
              aria-current={current ? 'true' : undefined}
              onClick={() => onJump(stop.job)}
              className={cn(
                'pointer-events-auto absolute right-3.5 -translate-y-1/2 cursor-pointer rounded-[10px] border border-transparent px-2 pt-[3px] pb-1 text-right leading-tight whitespace-nowrap transition-colors duration-[180ms] motion-reduce:transition-none',
                /* only where you are is a pill; the rest is quiet text, which a pill appears behind on hover */
                current
                  ? 'bg-ink text-on-ink'
                  : 'text-ink text-shadow-halo hover:bg-card/92 hover:text-shadow-none'
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-end gap-1.5 text-[13.5px] font-semibold',
                  now && !current && 'text-accent-text'
                )}
              >
                {now && <span aria-hidden='true' className='bg-accent size-[7px] rounded-full' />}
                {now ? `Now · ${stop.year}` : stop.year}
              </span>
              <span
                className={cn(
                  'block text-[12px] font-medium',
                  current ? 'text-on-ink/75' : 'text-ink-2'
                )}
              >
                {stop.place}
              </span>
            </button>
          );
        })}

        <span
          ref={needleRef}
          aria-hidden='true'
          className='bg-accent border-card absolute top-0 left-1/2 -mt-[9px] -ml-[9px] size-[18px] rounded-full border-[3px] shadow-[0_2px_8px_color-mix(in_oklab,var(--color-shade)_45%,transparent)] will-change-transform'
        />
      </nav>
    </div>
  );
}
