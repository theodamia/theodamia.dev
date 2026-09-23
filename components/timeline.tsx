import { JobCard } from '@/components/job-card';
import { ViewLink } from '@/components/view-link';
import { JOBS } from '@/lib/jobs';
import { LIST_ATTR } from '@/lib/view';
import { cn } from '@/utils/cn';

/** Newest first, the way a CV is read, while the climb keeps telling it from the beginning. */
const STOPS = JOBS.map((job, index) => ({ job, index })).reverse();
const NOW = JOBS.length - 1;

/**
 * The climb read plainly: the same cards down one rail, newest first, with nothing to scroll through to reach
 * them. Hidden until `data-view` says otherwise, so the choice is made in CSS before the first paint and the
 * reader never sees the other view flash past.
 */
export function Timeline({ className }: { className?: string }) {
  return (
    <div className={cn('pt-2 pb-4', className)}>
      <p className='text-ink-3 mb-7 text-[15px]'>
        The same ten years, newest first. <ViewLink>Back to the climb</ViewLink>
      </p>

      <ol
        {...{ [LIST_ATTR]: 'timeline' }}
        aria-label='Experience, newest first'
        className='max-w-[720px]'
      >
        {STOPS.map(({ job, index }) => (
          <li key={job.start} className='grid grid-cols-[12px_minmax(0,1fr)] gap-x-5'>
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
                idPrefix='timeline'
                className='mt-3 w-full max-w-[620px]'
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
