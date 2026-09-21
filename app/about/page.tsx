import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactRows } from '@/components/contact-rows';
import { FactList } from '@/components/fact-list';
import { OpinionBars } from '@/components/opinion-bars';
import { SummitStrip } from '@/components/scene/summit-strip';
import { SectionCard } from '@/components/section-card';
import { SkillGrid } from '@/components/skill-grid';
import { buttonVariants } from '@/components/ui/button';
import { Eyebrow, Heading } from '@/components/ui/text';
import { WeekSplit } from '@/components/week-split';
import { ABOUT_PARAGRAPHS, FACTS, OPINIONS, WEEK } from '@/lib/about';
import { SITE } from '@/lib/site';
import { SKILL_GROUPS } from '@/lib/skill-groups';

export const metadata: Metadata = {
  title: `About | ${SITE.name}`,
  description:
    'Who carries the pack, how the work gets done and what is in it: about, skills and contact.',
};

const TWO_COLUMNS =
  'grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-11 max-[899px]:grid-cols-1 max-[899px]:gap-7';

/** The quiet reading page under a still strip of the unreached summit. No moving scene here. */
export default function About() {
  return (
    <main className='bg-page relative min-h-screen'>
      <SummitStrip />

      <div className='relative z-[2] mx-auto w-full max-w-[1180px] px-7 max-[899px]:px-4'>
        <header className='mx-auto max-w-[980px] pt-[84px] pb-11 max-[899px]:pt-16 max-[899px]:pb-8'>
          <Eyebrow className='text-[17px]'>
            {SITE.name} · {SITE.title}
          </Eyebrow>
          {/* not "About": that is the first section's name, right below */}
          <Heading as='h1' size='page' className='mt-3'>
            Behind the climb
          </Heading>
          <p className='text-ink-2 mt-[18px] max-w-[480px] text-[19px] text-pretty max-[899px]:max-w-full max-[899px]:text-[18px]'>
            Who carries the pack, how the work gets done and what is in it.
          </p>
          <div className='mt-7'>
            <Link href='/' className={buttonVariants({ variant: 'quiet' })}>
              <span aria-hidden='true'>←</span> Back to the climb
            </Link>
          </div>
        </header>

        <div className='flex flex-col gap-9 max-[899px]:gap-5'>
          <SectionCard id='about' eyebrow='About' title='Building things that have to last'>
            <div className={`${TWO_COLUMNS} mt-[26px]`}>
              <div className='flex flex-col gap-4'>
                {ABOUT_PARAGRAPHS.map(paragraph => (
                  <p key={paragraph} className='text-ink-2 text-pretty'>
                    {paragraph}
                  </p>
                ))}
              </div>
              <FactList facts={FACTS} />
            </div>
          </SectionCard>

          <SectionCard id='work' eyebrow='How I work' title='What ten years have settled into'>
            <div className={`${TWO_COLUMNS} mt-[34px]`}>
              <OpinionBars opinions={OPINIONS} />
              <WeekSplit week={WEEK} />
            </div>
          </SectionCard>

          <SectionCard id='skills' eyebrow='Skills' title='What is in the pack'>
            <SkillGrid groups={SKILL_GROUPS} />
          </SectionCard>

          <SectionCard id='contact' eyebrow='Contact' title='Putting a team together?'>
            <p className='text-ink-2 mt-3.5 max-w-[620px] text-pretty'>
              Always open to a conversation: new opportunities, interesting challenges, or simply
              exchanging ideas. Replies within a day, usually less.
            </p>
            <ContactRows />
          </SectionCard>
        </div>

        <footer className='pt-14 pb-[130px] text-center'>
          <Link href='/' className={buttonVariants({ variant: 'quiet', size: 'sm' })}>
            <span aria-hidden='true'>←</span> Back to the climb
          </Link>
        </footer>
      </div>
    </main>
  );
}
