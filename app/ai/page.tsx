import type { Metadata } from 'next';
import type React from 'react';
import { ContactRows } from '@/components/contact-rows';
import { LogEntry } from '@/components/log-entry';
import { PageSection } from '@/components/page-section';
import { ForkScene } from '@/components/scene/fork-scene';
import type { CloudWind } from '@/components/scene/sky';
import { ThemePicture } from '@/components/scene/theme-picture';
import { SectionCard } from '@/components/section-card';
import { SummitHeader } from '@/components/summit-header';
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
import { aiUrl, aspectOf, HEADER_SCENE } from '@/scene/ai';

export const metadata: Metadata = pageMetadata({
  title: `Working with AI | ${SITE.name}`,
  description:
    'How I set AI up for software teams: the rules it works by, the reviews it joins, the skills the team shares and code written for people to read.',
  path: '/ai',
  card: '/ai/opengraph-image',
});

/** Two small clouds, high on the left, above the title's words: the right of the sky is the giant's. */
const HEADER_CLOUDS: CloudWind[] = [
  { cloud: 1, top: '6%', width: 15, at: 0.22, cross: 300, billow: 15 },
  { cloud: 2, top: '2%', width: 10, at: 0.5, cross: 340, billow: 13 },
];

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
 * the draft, not the decisions"), which links here. Built like /about, its neighbour at the summit: the summit's
 * sky and the header every reading page opens on (SummitHeader), with the giant at the sky's foot looking at a range
 * still half a draft, flush with the screen's right edge and sized to start right of the title (`.ai-giant`); the
 * sections read on the page; it ends on the giant at a fork, not choosing, under the Contact card (ForkScene). It is
 * not in the dock, which keeps to the three pages and Contact, so it is sent as a link or reached from /about.
 */
export default function Ai() {
  return (
    <main className='bg-page relative'>
      <SummitHeader
        eyebrow={AI_PAGE.eyebrow}
        title={AI_PAGE.title}
        lede={AI_PAGE.lede}
        clouds={HEADER_CLOUDS}
        back={{ href: '/about', label: 'Back to About' }}
        scene={
          <ThemePicture
            className='ai-giant'
            pictures={{ day: aiUrl(HEADER_SCENE.day), night: aiUrl(HEADER_SCENE.night) }}
          />
        }
        sceneStyle={{ '--scene-aspect': aspectOf(HEADER_SCENE) } as React.CSSProperties}
        className='max-wide:pb-10 pb-[clamp(88px,13vh,136px)]'
      />

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

      <ForkScene>
        <SectionCard
          id='contact'
          eyebrow='Contact'
          title={AI_CONTACT_TITLE}
          className='mx-0 max-w-[720px] print:hidden'
        >
          <ContactRows />
        </SectionCard>
      </ForkScene>
    </main>
  );
}
