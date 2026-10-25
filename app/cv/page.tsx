import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactRows } from '@/components/contact-rows';
import { FieldLog } from '@/components/field-log';
import { SeasonWindow } from '@/components/scene/season-window';
import { YearBackdrop } from '@/components/scene/year-backdrop';
import { YearReady } from '@/components/scene/year-ready';
import { SectionCard } from '@/components/section-card';
import { SocialLinks } from '@/components/social-links';
import { buttonVariants } from '@/components/ui/button';
import { Eyebrow, Heading } from '@/components/ui/text';
import { EDUCATION, SUMMARY_FACTS } from '@/content/about';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE } from '@/content/site';
import { YEAR_STATES, YEAR_TIMELINES } from '@/scene/seasons';
import { bareUrl } from '@/utils/bare-url';

export const metadata: Metadata = pageMetadata({
  title: `Experience | ${SITE.name}`,
  description:
    'Ten years of software engineering, newest first: every role, what it was and what I did.',
  path: '/cv',
});

/** The quiet link to the climb, under the facts. */
const QUIET_LINK = 'hover:text-ink font-semibold underline decoration-dotted underline-offset-4';

/**
 * The sheet the header and the log read on, on wide screens: solid, in front of a landscape at full strength, the
 * way the climb's words sit on its cards. One sheet, not a card per job: the entries stay open text on their rail.
 * Below the wide breakpoint the page is the sheet, and on paper there is no sheet at all.
 */
const SHEET =
  'wide:rounded-section wide:border wide:border-line wide:bg-card wide:shadow-card wide:px-[52px] wide:pt-12 wide:pb-11';

/**
 * The same ten years the climb tells, read plainly: the facts a CV is scanned for, then a field log of every job,
 * newest first, and how to reach me. Behind it, the valley at the foot of the climb's mountain, where the year
 * turns as you read (components/scene/year-backdrop.tsx): the season it is today at the top, the next one at every
 * hairline. On phones the year shows through three windows in the page instead, and the last ends it in the meadow.
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
        <div className='wide:max-w-[724px] wide:pt-12 wide:pb-[140px] print:max-w-none print:p-0'>
          <div className={SHEET}>
            <header className='max-wide:pt-[84px] print:pt-0'>
              <Eyebrow className='text-[17px]'>
                {SITE.title} · {SITE.location}
              </Eyebrow>
              {/* one line on wide screens: at 72px the name is a little wider than the log's column, never than the sheet */}
              <Heading
                as='h1'
                size='page'
                className='wide:whitespace-nowrap mt-2 print:text-[34px]'
              >
                {SITE.name}
              </Heading>
              <SocialLinks className='print:hidden' />
              {/* those tiles are three unreadable logos on paper, and contact belongs on sheet one: spell them out */}
              <p className='text-ink-2 mt-3 hidden text-[13.5px] leading-[1.7] print:block'>
                {[SITE.email, bareUrl(SITE.linkedin.url), bareUrl(SITE.github.url)].join(' · ')}
              </p>

              <dl className='border-line max-wide:grid-cols-1 max-wide:gap-y-4 mt-10 grid grid-cols-3 gap-x-8 border-y py-6 print:mt-5 print:py-4'>
                {SUMMARY_FACTS.map(fact => (
                  <div key={fact.label}>
                    <dt>
                      <Eyebrow>{fact.label}</Eyebrow>
                    </dt>
                    <dd className='text-ink mt-1 text-[16.5px] leading-[1.45] font-medium'>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* the years say the order on paper, and the climb is not somewhere a sheet of paper can go */}
              <p className='text-ink-3 mt-7 mb-9 text-[15px] print:hidden'>
                Newest first ·{' '}
                <Link href='/' className={QUIET_LINK}>
                  Walk the same ten years as a climb
                </Link>
              </p>
            </header>

            <SeasonWindow k={0} className='-mx-4' />

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
          </div>

          {/* on paper the header already carries all three channels: this card would only repeat them, with two
              buttons nobody can press and a location the facts row has said */}
          <SectionCard
            eyebrow='Contact'
            title='Putting a team together?'
            className='max-wide:mt-[72px] mx-0 mt-6 max-w-none print:hidden'
          >
            <ContactRows />
          </SectionCard>

          {/* on the landscape on wide screens: a quiet button, which keeps its own ground under it */}
          <p className='mt-8 print:hidden'>
            <Link href='/' className={buttonVariants({ variant: 'quiet', size: 'sm' })}>
              <span aria-hidden='true'>←</span> Back to the climb
            </Link>
          </p>
        </div>
      </div>

      <SeasonWindow k={YEAR_STATES - 1} end className='mt-10' />
    </main>
  );
}
