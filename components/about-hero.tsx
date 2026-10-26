import { FactItem } from '@/components/fact-item';
import { PaintedClouds, Stars, type CloudWind } from '@/components/scene/sky';
import { TrailLink } from '@/components/trail-link';
import { buttonVariants, quietLinkVariants } from '@/components/ui/button';
import { Eyebrow, Heading, Lede } from '@/components/ui/text';
import { HERO_FACTS } from '@/content/about';
import { SITE } from '@/content/site';

/** Fewer and higher than the climb's: they sit above the title, never behind its words. */
const HERO_CLOUDS: CloudWind[] = [
  { cloud: 0, top: '4%', width: 26, at: 0.6, cross: 240, billow: 19 },
  { cloud: 1, top: '11%', width: 17, at: 0.86, cross: 300, billow: 15 },
  { cloud: 2, top: '2%', width: 12, at: 0.28, cross: 340, billow: 13 },
];

/**
 * The opening: the climb's sky at the visitor's time of day (`data-daypart` on <html>, scene/about.ts), its
 * clouds on its wind and, by night, its stars; no sun or moon here, the sun is the page's ending. On it, in the
 * page's own ink, the title and, still in the first screen, what a recruiter scans for first and the one action.
 * The sky eases into the page below. On phones it is just the words.
 */
export function AboutHero() {
  return (
    <header className='relative isolate'>
      <div aria-hidden='true' className='about-sky max-wide:hidden print:hidden'>
        <Stars />
        <PaintedClouds winds={HERO_CLOUDS} />
      </div>

      <div className='max-wide:px-4 max-wide:pt-[72px] max-wide:pb-10 mx-auto w-full max-w-[1180px] px-7 pt-[clamp(104px,15vh,168px)] pb-[clamp(56px,8vh,80px)] print:pt-0'>
        <Eyebrow className='text-[17px]'>
          {SITE.name} · {SITE.title}
        </Eyebrow>
        <Heading
          as='h1'
          size='hero'
          className='mt-3.5 max-w-[860px] text-[clamp(56px,8.4vw,120px)] leading-[0.92] tracking-[-0.035em] text-balance'
        >
          Behind the climb
        </Heading>
        <Lede className='mt-6 max-w-[32ch] text-[clamp(19px,1.6vw,22px)] leading-[1.45]'>
          Who carries the pack, how the work gets done and what is in it.
        </Lede>

        <div className='border-line max-wide:mt-10 mt-[clamp(56px,9vh,96px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-7 border-t pt-7'>
          <dl className='flex flex-wrap gap-x-14 gap-y-5'>
            {HERO_FACTS.map(fact => (
              <FactItem key={fact.label} fact={fact} className='max-w-[26ch]' />
            ))}
          </dl>
          <div className='flex items-center gap-[22px] print:hidden'>
            <a href={`mailto:${SITE.email}`} className={buttonVariants({ size: 'sm' })}>
              Email me
            </a>
            <TrailLink href='/' className={quietLinkVariants({ standalone: true })}>
              <span aria-hidden='true'>←</span> Back to the climb
            </TrailLink>
          </div>
        </div>
      </div>
    </header>
  );
}
