import Link from 'next/link';
import { Climb } from '@/components/climb';
import { Hero } from '@/components/hero';
import { SectionCard } from '@/components/section-card';
import { buttonVariants } from '@/components/ui/button';
import { ViewLink } from '@/components/view-link';

export default function Home() {
  return (
    <Climb hero={<Hero />}>
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
        {/* the cue's offer is long gone by now, and the dock is tight on a small phone */}
        <p className='timeline:hidden mt-5'>
          <ViewLink>Read the same ten years as a timeline</ViewLink>
        </p>
      </SectionCard>

      <footer className='pb-[130px] text-center'>
        <a href='#top' className={buttonVariants({ variant: 'quiet', size: 'sm' })}>
          Back down to the start
        </a>
      </footer>
    </Climb>
  );
}
