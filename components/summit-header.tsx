import type React from 'react';
import { PageHeader } from '@/components/page-header';
import { PaintedClouds, Stars, type CloudWind } from '@/components/scene/sky';
import { TrailLink } from '@/components/trail-link';
import { buttonVariants, quietLinkVariants } from '@/components/ui/button';
import { SITE } from '@/content/site';

type SummitHeaderProps = {
  eyebrow: string;
  title: string;
  lede: string;
  /** The climb's clouds, on its wind: high, so they never sit behind the title's words. */
  clouds: CloudWind[];
  /** The way back down, beside "Email me". */
  back: { href: string; label: string };
  /** What stands at the sky's foot, if anything (/ai's giant), and the custom properties it is sized by. */
  scene?: React.ReactNode;
  sceneStyle?: React.CSSProperties;
  /** The room under the words: how much of the sky shows below them. */
  className?: string;
};

/**
 * The opening of a page at the summit (/about, /ai): the climb's sky at the visitor's time of day
 * (`.summit-sky`, mixed by `data-daypart` on <html>), its clouds on its wind and, by night, its stars, easing into
 * the page below. On it, the header every reading page opens on, with the one action and the way back. A page may
 * stand a painting at the sky's foot. On phones it is just the words.
 */
export function SummitHeader({
  eyebrow,
  title,
  lede,
  clouds,
  back,
  scene,
  sceneStyle,
  className,
}: SummitHeaderProps) {
  return (
    <div className='relative isolate'>
      <div
        aria-hidden='true'
        className='summit-sky max-wide:hidden print:hidden'
        style={sceneStyle}
      >
        <Stars />
        <PaintedClouds winds={clouds} />
        {scene}
      </div>

      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <PageHeader eyebrow={eyebrow} title={title} lede={lede} className={className}>
          <div className='flex flex-wrap items-center gap-x-[22px] gap-y-4 print:hidden'>
            <a href={`mailto:${SITE.email}`} className={buttonVariants({ size: 'sm' })}>
              Email me
            </a>
            <TrailLink href={back.href} className={quietLinkVariants({ standalone: true })}>
              <span aria-hidden='true'>←</span> {back.label}
            </TrailLink>
          </div>
        </PageHeader>
      </div>
    </div>
  );
}
