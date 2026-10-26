import { PageHeader } from '@/components/page-header';
import { PaintedClouds, Stars, type CloudWind } from '@/components/scene/sky';
import { TrailLink } from '@/components/trail-link';
import { buttonVariants, quietLinkVariants } from '@/components/ui/button';
import { dockLabel } from '@/content/dock-items';
import { SITE } from '@/content/site';

/** Fewer and higher than the climb's: they sit above the title, never behind its words. */
const HERO_CLOUDS: CloudWind[] = [
  { cloud: 0, top: '4%', width: 26, at: 0.6, cross: 240, billow: 19 },
  { cloud: 1, top: '11%', width: 17, at: 0.86, cross: 300, billow: 15 },
  { cloud: 2, top: '2%', width: 12, at: 0.28, cross: 340, billow: 13 },
];

/**
 * The opening: the climb's sky at the visitor's time of day (`data-daypart` on <html>, scene/about.ts), its
 * clouds on its wind and, by night, its stars; no sun or moon here, the sun is the page's ending. On it, the page's
 * header, the same block as /cv's: the page's name, the title, what the page holds and the one action. The facts
 * live beside the About text below, so none of them is read twice. The sky eases into the page. On phones it is
 * just the words.
 */
export function AboutHero() {
  return (
    <div className='relative isolate'>
      <div aria-hidden='true' className='summit-sky max-wide:hidden print:hidden'>
        <Stars />
        <PaintedClouds winds={HERO_CLOUDS} />
      </div>

      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <PageHeader
          eyebrow={dockLabel('about')}
          title='Behind the climb'
          lede='Who carries the pack, how the work gets done and what is in it.'
          className='max-wide:pb-10 pb-[clamp(56px,9vh,96px)]'
        >
          <div className='flex flex-wrap items-center gap-x-[22px] gap-y-4 print:hidden'>
            <a href={`mailto:${SITE.email}`} className={buttonVariants({ size: 'sm' })}>
              Email me
            </a>
            <TrailLink href='/' className={quietLinkVariants({ standalone: true })}>
              <span aria-hidden='true'>←</span> Back to the climb
            </TrailLink>
          </div>
        </PageHeader>
      </div>
    </div>
  );
}
