import { JobCard } from '@/components/job-card';
import { JOBS, TRAILHEAD } from '@/content/jobs';
import { SUMMIT_LINE } from '@/content/site';
import { cn } from '@/utils/cn';

/** Newest first, the way a CV is read, while the climb keeps telling it from the beginning. */
const STOPS = JOBS.map((job, index) => ({ job, index })).reverse();
const NOW = JOBS.length - 1;

/** The rail and its gutter: the same two columns for a job and for the two ends that close them. */
const RAIL = 'grid grid-cols-[12px_minmax(0,1fr)] gap-x-5';
/** Quiet text for the two ends of the rail, which are places rather than jobs. */
const END = 'text-ink-3 text-[15px]';

/**
 * Every job down one rail: the year, a dot, and the same card the climb carries. The rail is bounded the way the
 * altimeter is — the summit that is never reached at the top, the trailhead at the foot — so the list runs the
 * same way round as the mountain beside it, even though it is read newest first.
 */
export function Timeline() {
  return (
    <div className='max-w-[720px]'>
      {/* the top of the rail: the same summit mark the altimeter carries, still out of reach */}
      <div className={RAIL}>
        <span aria-hidden='true' className='relative'>
          <svg
            viewBox='0 0 12 10'
            width='12'
            height='10'
            className='absolute top-[6px] left-1/2 -translate-x-1/2'
          >
            <path
              d='M1 9 L6 1.5 L11 9 Z'
              className='fill-page stroke-ink-3'
              strokeWidth='1.4'
              strokeLinejoin='round'
            />
          </svg>
          <span className='bg-line absolute top-[17px] bottom-0 left-1/2 w-px -translate-x-1/2' />
        </span>
        <div className='pb-9'>
          <p className={END}>{SUMMIT_LINE}</p>
        </div>
      </div>

      <ol aria-label='Experience, newest first'>
        {STOPS.map(({ job, index }) => (
          <li key={job.start} className={RAIL}>
            {/* the rail: the line runs the whole stop, the dot marks where the card starts */}
            <span aria-hidden='true' className='relative'>
              <span className='bg-line absolute inset-y-0 left-1/2 w-px -translate-x-1/2' />
              <span
                className={cn(
                  'border-page absolute top-[9px] left-1/2 size-2.5 -translate-x-1/2 rounded-full border-2',
                  index === NOW ? 'bg-accent' : 'bg-ink'
                )}
              />
            </span>

            <div className='pb-10'>
              <p className='font-display text-ink flex items-center gap-2.5 text-[20px] font-semibold'>
                {job.start}
                {index === NOW && (
                  <span className='bg-ink text-on-ink rounded-full px-2 py-0.5 text-[12.5px] font-semibold'>
                    Now
                  </span>
                )}
              </p>
              <JobCard
                job={job}
                index={index}
                className='mt-3 w-full max-w-[620px] print:break-inside-avoid'
              />
            </div>
          </li>
        ))}
      </ol>

      {/* where the trail starts: a place, not a job, so it closes the rail from outside the list */}
      <div className={RAIL}>
        <span aria-hidden='true' className='relative'>
          <span className='bg-line absolute top-0 left-1/2 h-2.5 w-px -translate-x-1/2' />
          <span className='border-line bg-page absolute top-[6px] left-1/2 size-2 -translate-x-1/2 rounded-full border' />
        </span>
        <p className={END}>{TRAILHEAD.year} · where the trail starts</p>
      </div>
    </div>
  );
}
