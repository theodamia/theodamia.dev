import type { Metadata } from 'next';
import { ContactRows } from '@/components/contact-rows';
import { LogEntry } from '@/components/log-entry';
import { PageHeader } from '@/components/page-header';
import { PageSection } from '@/components/page-section';
import { SectionCard } from '@/components/section-card';
import { TrailLink } from '@/components/trail-link';
import { buttonVariants, quietLinkVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/text';
import {
  AI_CONTACT_TITLE,
  AI_LIMITS,
  AI_PAGE,
  AI_PLACES,
  AI_PRACTICES,
  type AiPoint,
} from '@/content/ai';
import { SITE } from '@/content/site';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  title: `Working with AI | ${SITE.name}`,
  description:
    'How I set AI up for frontend teams: the rules it works by, the reviews it joins, the skills the team shares and code written for people to read.',
  path: '/ai',
});

/** A few short points, each a name and a sentence or two: two columns on wide screens, one on phones. */
function PointList({ points }: { points: AiPoint[] }) {
  return (
    <ul className='wide:grid-cols-2 mt-9 grid max-w-[880px] gap-x-12 gap-y-8'>
      {points.map(point => (
        <li key={point.name}>
          <Heading as='h3' size='sub'>
            {point.name}
          </Heading>
          <p className='text-ink-2 mt-2 text-[16.5px] leading-[1.55] text-pretty'>{point.text}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * How I work with AI, for the reader weighing me for a team that is bringing it in: what I set up, where I did it
 * (in /cv's log language) and what I do not hand over. Evidence, not opinion: the opinion is /about's ("AI writes
 * the draft, not the decisions"), which links here. A plain reading page, with the header /cv and /about share; it
 * is not in the dock, which keeps to the three pages and Contact, so it is sent as a link or reached from /about.
 */
export default function Ai() {
  return (
    <main className='bg-page relative'>
      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <PageHeader
          eyebrow={AI_PAGE.eyebrow}
          title={AI_PAGE.title}
          lede={AI_PAGE.lede}
          className='max-wide:pb-6 pb-[clamp(24px,4vh,40px)]'
        >
          <div className='flex flex-wrap items-center gap-x-[22px] gap-y-4 print:hidden'>
            <a href={`mailto:${SITE.email}`} className={buttonVariants({ size: 'sm' })}>
              Email me
            </a>
            <TrailLink href='/about' className={quietLinkVariants({ standalone: true })}>
              <span aria-hidden='true'>←</span> Back to About
            </TrailLink>
          </div>
        </PageHeader>

        <PageSection id='practice' name='Practice' title='What I set up'>
          <PointList points={AI_PRACTICES} />
        </PageSection>

        <PageSection id='where' name='Where' title='Three places, the same rules'>
          <ol className='mt-9 max-w-[680px]'>
            {AI_PLACES.map(place => (
              <li key={place.id}>
                <LogEntry entry={place} level={3} />
              </li>
            ))}
          </ol>
        </PageSection>

        <PageSection id='limits' name='Limits' title='What I don’t hand over'>
          <PointList points={AI_LIMITS} />
        </PageSection>

        <SectionCard
          id='contact'
          eyebrow='Contact'
          title={AI_CONTACT_TITLE}
          className='mx-0 mb-[140px] max-w-none print:hidden'
        >
          <ContactRows />
        </SectionCard>
      </div>
    </main>
  );
}
