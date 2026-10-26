import { Climb } from '@/components/climb';
import { ClosingCard } from '@/components/closing-card';
import { Hero } from '@/components/hero';
import { buttonVariants } from '@/components/ui/button';
import { personSchema } from '@/lib/person-schema';

/** The climb: the hero, one card per job up the mountain, and the summit that is never reached. */
export default function Home() {
  return (
    <Climb hero={<Hero />}>
      {/* who this is, stated for machines: only on `/`, which is the page that stands for the person */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <ClosingCard />

      <footer className='pb-[130px] text-center'>
        <a href='#top' className={buttonVariants({ variant: 'quiet', size: 'sm' })}>
          Back down to the start
        </a>
      </footer>
    </Climb>
  );
}
