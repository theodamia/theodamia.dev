import type { Metadata } from 'next';
import { AboutFinale } from '@/components/about-finale';
import { AboutHero } from '@/components/about-hero';
import { AboutSection } from '@/components/about-section';
import { FactItem } from '@/components/fact-item';
import { OpinionList } from '@/components/opinion-list';
import { SkillColumns } from '@/components/skill-columns';
import { WeekBar } from '@/components/week-bar';
import { ABOUT_PARAGRAPHS, FACTS, OPINIONS, WEEK } from '@/content/about';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE } from '@/content/site';
import { SKILL_GROUPS } from '@/content/skill-groups';

export const metadata: Metadata = pageMetadata({
  title: `About | ${SITE.name}`,
  description:
    'Who carries the pack, how the work gets done and what is in it: about, skills and contact.',
  path: '/about',
});

/**
 * The page at the top of the mountain: what's ahead. It opens on the sky at the visitor's time of day, reads on the
 * page itself (About, How I work, Skills), and ends at Contact on the next range across a sea of clouds, where the
 * sun comes up as the last screen scrolls in. Everything read is on the page; only the title stands on the sky.
 */
export default function About() {
  const [lead, ...rest] = ABOUT_PARAGRAPHS;

  return (
    <main className='bg-page relative'>
      <AboutHero />

      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <AboutSection id='background' name='Background' title='Building things that have to last'>
          <div className='wide:grid-cols-[minmax(0,1fr)_220px] mt-9 grid gap-x-14 gap-y-7'>
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
        </AboutSection>

        <AboutSection id='work' name='How I work' title='What ten years have settled into'>
          <OpinionList opinions={OPINIONS} />
          <WeekBar week={WEEK} />
        </AboutSection>

        <AboutSection id='skills' name='Skills' title='What is in the pack'>
          <SkillColumns groups={SKILL_GROUPS} />
        </AboutSection>
      </div>

      <AboutFinale />
    </main>
  );
}
