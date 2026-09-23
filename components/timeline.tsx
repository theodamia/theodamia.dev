import { ContactRows } from '@/components/contact-rows';
import { JobCard } from '@/components/job-card';
import { SectionCard } from '@/components/section-card';
import { SocialLinks } from '@/components/social-links';
import { Eyebrow, Heading } from '@/components/ui/text';
import { ViewLink } from '@/components/view-link';
import { JOBS } from '@/lib/jobs';
import { SITE } from '@/lib/site';
import { LIST_ATTR } from '@/lib/view';
import { cn } from '@/utils/cn';

/** Newest first, the way a CV is read, while the climb keeps telling it from the beginning. */
const STOPS = JOBS.map((job, index) => ({ job, index })).reverse();
const NOW = JOBS.length - 1;

/**
 * The climb read plainly, and the whole page while it is on: who this is, every job newest first, and how to
 * reach me. No mountain, no hero holding the first screen, no closing card — someone who asked for the plain
 * reading is here for the facts, and the way back to the climb is one line at the top.
 *
 * Hidden until `data-view` says otherwise, so the choice is made in CSS before the first paint and the reader
 * never sees the other view flash past.
 */
export function Timeline({ className }: { className?: string }) {
  return (
    <div className={cn('max-wide:pt-[84px] pt-[92px] pb-[130px]', className)}>
      <header>
        <Eyebrow className='text-[17px]'>
          {SITE.title} · {SITE.location}
        </Eyebrow>
        <Heading as='h1' size='page' className='mt-2'>
          {SITE.name}
        </Heading>
        <SocialLinks />
      </header>

      <p className='text-ink-3 mt-10 mb-7 text-[15px]'>
        Ten years, newest first. <ViewLink>Or take the climb instead</ViewLink>
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

      <SectionCard
        eyebrow='Contact'
        title='Putting a team together?'
        className='mx-0 max-w-[720px]'
      >
        <ContactRows />
      </SectionCard>
    </div>
  );
}
