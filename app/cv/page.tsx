import type { Metadata } from 'next';
import { TrailLink } from '@/components/trail-link';
import { ContactRows } from '@/components/contact-rows';
import { FieldLog } from '@/components/field-log';
import { PageHeader } from '@/components/page-header';
import { YearBackdrop } from '@/components/scene/year-backdrop';
import { YearReady } from '@/components/scene/year-ready';
import { SectionCard } from '@/components/section-card';
import { SocialLinks } from '@/components/social-links';
import { quietLinkVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/text';
import { EDUCATION, SUMMARY_FACTS } from '@/content/about';
import { dockLabel } from '@/content/dock-items';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE } from '@/content/site';
import { YEAR_TIMELINES } from '@/scene/seasons';
import { bareUrl } from '@/utils/bare-url';

export const metadata: Metadata = pageMetadata({
  title: `Experience | ${SITE.name}`,
  description:
    'Ten years of software engineering, newest first: every role, what it was and what I did.',
  path: '/cv',
});

/** The quiet links on the page: the climb from the header, and back to it at the end. */
const QUIET_LINK = quietLinkVariants();

/**
 * The same ten years the climb tells, read plainly: the facts a CV is scanned for, then a field log of every job,
 * newest first, and how to reach me. On wide screens, the valley at the foot of the climb's mountain is behind it,
 * where the year turns as you read (components/scene/year-backdrop.tsx): the season it is today at the top, the next
 * one at every hairline. On phones it is just the journal.
 *
 * `timeline-scope` is here because the hairlines that drive the year are in the log and the year is not: the
 * backdrop can only find a view timeline named by an element outside its own ancestors through a shared ancestor.
 */
export default function Cv() {
  return (
    <main
      className='relative min-h-screen print:min-h-0'
      style={{ timelineScope: YEAR_TIMELINES.join(', ') }}
    >
      <YearBackdrop />
      <YearReady />

      <div className='max-wide:px-4 relative z-1 mx-auto w-full max-w-[1180px] px-7 print:px-0'>
        <div className='max-w-[620px] pb-[140px] print:max-w-none print:pb-0'>
          {/* the role under the name, where a CV puts it; where I am is in the facts below */}
          <PageHeader
            eyebrow={dockLabel('cv')}
            title={SITE.name}
            oneLine
            lede={SITE.title}
            facts={SUMMARY_FACTS}
          >
            <SocialLinks className='mt-0 print:hidden' />
            {/* those tiles are three unreadable logos on paper, and contact belongs on sheet one: spell them out */}
            <p className='text-ink-2 hidden text-[13.5px] leading-[1.7] print:block'>
              {[SITE.email, bareUrl(SITE.linkedin.url), bareUrl(SITE.github.url)].join(' · ')}
            </p>
          </PageHeader>

          {/* the years say the order on paper, and the climb is not somewhere a sheet of paper can go */}
          <p className='text-ink-3 mt-7 mb-9 text-[15px] print:hidden'>
            Newest first ·{' '}
            <TrailLink href='/' className={QUIET_LINK}>
              Walk the same ten years as a climb
            </TrailLink>
          </p>

          <FieldLog />

          {/* where the degree goes on a CV: under the jobs. On screen it stays on /about, with the rest of the background */}
          {EDUCATION && (
            <section className='mt-10 hidden print:block'>
              <Heading as='h2' size='sub' className='print:text-[20px]'>
                {EDUCATION.label}
              </Heading>
              <p className='text-ink-2 mt-1 text-[15px]'>{EDUCATION.value}</p>
            </section>
          )}

          {/* on paper the header already carries all three channels: this card would only repeat them, with two
              buttons nobody can press and a location the facts row has said */}
          <SectionCard
            eyebrow='Contact'
            title='Putting a team together?'
            className='mx-0 mt-[72px] max-w-none print:hidden'
          >
            <ContactRows />
          </SectionCard>

          <p className='text-ink-3 mt-10 text-[15px] print:hidden'>
            <TrailLink href='/' className={QUIET_LINK}>
              <span aria-hidden='true'>←</span> Back to the climb
            </TrailLink>
          </p>
        </div>
      </div>
    </main>
  );
}
