import { JobCard } from '@/components/job-card';
import { JOBS } from '@/lib/jobs';
import { cn } from '@/utils/cn';

/** Newest first, the way a CV is read, while the climb keeps telling it from the beginning. */
const STOPS = JOBS.map((job, index) => ({ job, index })).reverse();
const NOW = JOBS.length - 1;

/** Every job down one rail: the year, a dot, and the same card the climb carries. */
export function Timeline() {
  return (
    <ol aria-label='Experience, newest first' className='max-w-[720px]'>
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
            <JobCard job={job} index={index} className='mt-3 w-full max-w-[620px]' />
          </div>
        </li>
      ))}
    </ol>
  );
}
