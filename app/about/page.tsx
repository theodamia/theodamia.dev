import type { Metadata } from 'next';
import { AboutFinale } from '@/components/about-finale';
import { PageSection } from '@/components/page-section';
import type { CloudWind } from '@/components/scene/sky';
import { FactItem } from '@/components/fact-item';
import { OpinionList } from '@/components/opinion-list';
import { SkillColumns } from '@/components/skill-columns';
import { SummitHeader } from '@/components/summit-header';
import { WeekBar } from '@/components/week-bar';
import { ABOUT_PARAGRAPHS, FACTS, OPINIONS, WEEK } from '@/content/about';
import { dockLabel } from '@/content/dock-items';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE } from '@/content/site';
import { SKILL_GROUPS } from '@/content/skill-groups';

export const metadata: Metadata = pageMetadata({
  title: `About | ${SITE.name}`,
  description:
    'Who carries the pack, how the work gets done and what is in it: about, skills and contact.',
  path: '/about',
});

/** Fewer and higher than the climb's: they sit above the title, never behind its words. */
const HEADER_CLOUDS: CloudWind[] = [
  { cloud: 0, top: '4%', width: 26, at: 0.6, cross: 240, billow: 19 },
  { cloud: 1, top: '11%', width: 17, at: 0.86, cross: 300, billow: 15 },
  { cloud: 2, top: '2%', width: 12, at: 0.28, cross: 340, billow: 13 },
];

/**
 * The page at the top of the mountain: what's ahead. It opens on the sky at the visitor's time of day, reads on the
 * page itself (About, How I work, Skills), and ends at Contact on the next range across a sea of clouds, where the
 * sun comes up as the last screen scrolls in. Everything read is on the page; only the title stands on the sky.
 */
export default function About() {
  const [lead, ...rest] = ABOUT_PARAGRAPHS;

  return (
    <main className='bg-page relative'>
      {/* no sun or moon in this sky: the sun is the page's ending */}
      <SummitHeader
        eyebrow={dockLabel('about')}
        title='Behind the climb'
        lede='Who carries the pack, how the work gets done and what is in it.'
        clouds={HEADER_CLOUDS}
        back={{ href: '/', label: 'Back to the climb' }}
        className='max-wide:pb-10 pb-[clamp(56px,9vh,96px)]'
      />

      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <PageSection id='background' name='Background' title='Building things that have to last'>
          <div className='wide:grid-cols-[minmax(0,1fr)_220px] grid gap-x-14 gap-y-7'>
            <div className='flex max-w-[62ch] flex-col gap-[18px]'>
              {/* the first paragraph is the introduction: a size up, in ink */}
              <p className='text-ink text-[20px] leading-[1.5] text-pretty'>{lead}</p>
              {rest.map(paragraph => (
                <p key={paragraph} className='text-ink-2 text-[17.5px] leading-[1.62] text-pretty'>
                  {paragraph}
                </p>
              ))}
            </div>
            <dl className='flex flex-col gap-5 pt-1.5'>
              {FACTS.map(fact => (
                <FactItem key={fact.label} fact={fact} className='max-w-[26ch]' />
              ))}
            </dl>
          </div>
        </PageSection>

        <PageSection id='work' name='How I work' title='What ten years have settled into'>
          <OpinionList opinions={OPINIONS} />
          <WeekBar week={WEEK} />
        </PageSection>

        <PageSection id='skills' name='Skills' title='What is in the pack'>
          <SkillColumns groups={SKILL_GROUPS} />
        </PageSection>
      </div>

      <AboutFinale />
    </main>
  );
}
