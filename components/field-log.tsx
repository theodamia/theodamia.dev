import { LogEntry } from '@/components/log-entry';
import { JOBS, TRAILHEAD } from '@/content/jobs';
import { SUMMIT_LINE } from '@/content/site';
import { YEAR_STATES, yearTimeline } from '@/scene/seasons';
import { cn } from '@/utils/cn';

/** Newest first, the way a CV is read, while the climb keeps telling it from the beginning. */
const ENTRIES = JOBS.map((job, index) => ({ job, index })).reverse();
const NOW = JOBS.length - 1;

/** The rail and its gutter: the same two columns for an entry and for the two ends that close the log. */
const RAIL = 'grid grid-cols-[12px_minmax(0,1fr)] gap-x-5 print:block';
/** The rail's line, through the whole of a stop. */
const LINE = 'bg-line absolute inset-y-0 left-1/2 w-px -translate-x-1/2';
/** A node on the rail, level with the date line. */
const NODE = 'absolute left-1/2 size-2.5 -translate-x-1/2 rounded-full';

/**
 * The field log on /cv: every job newest first down one hairline rail. The top of the rail is the entry not written
 * yet, "The peak is still ahead": the site's stance, as a log would put it. The
 * foot is where the trail starts, a place and not a job, so it closes the rail from outside the list.
 *
 * Every entry, and the foot, names the view timeline of the hairline above it (scene/seasons.ts): that is what turns
 * the year behind the page as the reader passes them. A picture never sits beside a particular job.
 */
export function FieldLog() {
  return (
    <div>
      <div className={RAIL}>
        <span aria-hidden='true' className='relative print:hidden'>
          <span className='absolute top-[12px] bottom-0 left-1/2 w-px -translate-x-1/2 bg-[repeating-linear-gradient(var(--color-line)_0_3px,transparent_3px_7px)]' />
          <span
            className={cn(NODE, 'bg-page outline-ink-3 top-[5px] outline-[1.5px] outline-dotted')}
          />
        </span>
        <p className='text-ink-3 pb-[22px] text-[14.5px] leading-[1.4] font-semibold print:hidden'>
          {SUMMIT_LINE}
        </p>
      </div>

      <ol aria-label='Experience, newest first'>
        {ENTRIES.map(({ job, index }, position) => (
          <li
            key={job.start}
            className={cn(RAIL, 'print:break-inside-avoid')}
            style={{ viewTimelineName: yearTimeline(position + 1) }}
          >
            <span aria-hidden='true' className='relative print:hidden'>
              <span className={LINE} />
              <span
                className={cn(
                  NODE,
                  'ring-page top-[33px] ring-2',
                  index === NOW ? 'bg-accent' : 'bg-ink'
                )}
              />
            </span>
            <LogEntry job={job} />
          </li>
        ))}
      </ol>

      <div
        className={cn(RAIL, 'print:hidden')}
        style={{ viewTimelineName: yearTimeline(YEAR_STATES - 1) }}
      >
        <span aria-hidden='true' className='relative'>
          <span className='bg-line absolute top-0 left-1/2 h-[34px] w-px -translate-x-1/2' />
          <span className={cn(NODE, 'border-line bg-page top-[33px] size-[9px] border')} />
        </span>
        <p className='border-line text-ink-3 border-t pt-7 text-[15px] leading-[1.4] font-medium'>
          {TRAILHEAD.year} · where the trail starts
        </p>
      </div>
    </div>
  );
}
