import Link from 'next/link';
import { Climb } from '@/components/climb';
import { Hero } from '@/components/hero';
import { SeasonDial } from '@/components/season-dial';
import { SectionCard } from '@/components/section-card';
import { buttonVariants } from '@/components/ui/button';
import { personSchema } from '@/lib/person-schema';

export default function Home() {
  return (
    <Climb hero={<Hero />}>
      {/* who this is, stated for machines: only on `/`, which is the page that stands for the person */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <SectionCard
        eyebrow='Today'
        title='The ascent never stops'
        className='rise-in max-wide:mb-[14vh] mb-[18vh] max-w-[720px] text-center'
      >
        <p className='text-ink-2 mx-auto mt-3.5 max-w-[480px] text-pretty'>
          Every stop taught me something I carried up to the next and I am still learning on this
          one. Who I am, how I work and what is in my pack: it is all on the next page.
        </p>
        <div className='mt-7 flex flex-wrap items-center justify-center gap-2.5'>
          <Link href='/about' className={buttonVariants()}>
            About and skills
          </Link>
        </div>
        {/* whoever walked the whole climb can still have the short version */}
        <p className='mt-5'>
          <Link
            href='/cv'
            className='text-ink-3 hover:text-ink text-[15px] font-semibold underline decoration-dotted underline-offset-4'
          >
            Or read the same ten years as a plain list
          </Link>
        </p>
      </SectionCard>

      <SeasonDial />

      <footer className='pb-[130px] text-center'>
        <a href='#top' className={buttonVariants({ variant: 'quiet', size: 'sm' })}>
          Back down to the start
        </a>
      </footer>
    </Climb>
  );
}
