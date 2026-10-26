import type { Metadata } from 'next';
import { AiFinale } from '@/components/ai-finale';
import { AiHero } from '@/components/ai-hero';
import { LogEntry } from '@/components/log-entry';
import { PageSection } from '@/components/page-section';
import { Heading } from '@/components/ui/text';
import { AI_LIMITS, AI_PLACES, AI_PRACTICES, type AiPoint } from '@/content/ai';
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
    <ul className='wide:grid-cols-2 grid max-w-[880px] gap-x-12 gap-y-8'>
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
 * the draft, not the decisions"), which links here. Built like /about, its neighbour at the summit: the header /cv
 * and /about share, on the summit's sky, with the giant looking at a range still half a draft (AiHero); the sections
 * read on the page; it ends on the giant at a fork, not choosing, under the Contact card (AiFinale). It is not in
 * the dock, which keeps to the three pages and Contact, so it is sent as a link or reached from /about.
 */
export default function Ai() {
  return (
    <main className='bg-page relative'>
      <AiHero />

      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <PageSection id='practice' name='Practice' title='What I set up'>
          <PointList points={AI_PRACTICES} />
        </PageSection>

        <PageSection id='where' name='Where' title='Three places, the same rules'>
          <ol className='max-w-[680px]'>
            {/* the first entry starts level with the section's title, so it needs no hairline above it */}
            {AI_PLACES.map((place, index) => (
              <li key={place.id}>
                <LogEntry
                  entry={place}
                  level={3}
                  className={index === 0 ? 'border-t-0 pt-0' : undefined}
                />
              </li>
            ))}
          </ol>
        </PageSection>

        <PageSection id='limits' name='Limits' title='What I don’t hand over'>
          <PointList points={AI_LIMITS} />
        </PageSection>
      </div>

      <AiFinale />
    </main>
  );
}
