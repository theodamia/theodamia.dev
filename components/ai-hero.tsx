import type React from 'react';
import { PageHeader } from '@/components/page-header';
import { PaintedClouds, Stars, type CloudWind } from '@/components/scene/sky';
import { ThemePicture } from '@/components/scene/theme-picture';
import { TrailLink } from '@/components/trail-link';
import { buttonVariants, quietLinkVariants } from '@/components/ui/button';
import { AI_PAGE } from '@/content/ai';
import { SITE } from '@/content/site';
import { aiUrl, aspectOf, HEADER_SCENE } from '@/scene/ai';

/** Two small clouds, high on the left, above the title's words: the right of the sky is the giant's. */
const HEADER_CLOUDS: CloudWind[] = [
  { cloud: 1, top: '6%', width: 15, at: 0.22, cross: 300, billow: 15 },
  { cloud: 2, top: '2%', width: 10, at: 0.5, cross: 340, billow: 13 },
];

/**
 * The opening of /ai: the summit's sky, as at the top of /about (the two pages up there), with the page's header on
 * it. At the sky's foot, flush with the screen's right edge and cropped by it, the giant sits looking at a range
 * that turns from a wireframe draft into paint: the page's title, "AI writes the draft, not the decisions", as a
 * place. It is sized to start right of the title at every wide width, and its left end dissolves into the sky.
 * On phones it is just the words.
 */
export function AiHero() {
  return (
    <div className='relative isolate'>
      <div
        aria-hidden='true'
        className='summit-sky max-wide:hidden print:hidden'
        style={{ '--scene-aspect': aspectOf(HEADER_SCENE) } as React.CSSProperties}
      >
        <Stars />
        <PaintedClouds winds={HEADER_CLOUDS} />
        <ThemePicture
          className='ai-giant'
          pictures={{ day: aiUrl(HEADER_SCENE.day), night: aiUrl(HEADER_SCENE.night) }}
        />
      </div>

      <div className='max-wide:px-4 mx-auto w-full max-w-[1180px] px-7'>
        <PageHeader
          eyebrow={AI_PAGE.eyebrow}
          title={AI_PAGE.title}
          lede={AI_PAGE.lede}
          className='max-wide:pb-10 pb-[clamp(88px,13vh,136px)]'
        >
          <div className='flex flex-wrap items-center gap-x-[22px] gap-y-4 print:hidden'>
            <a href={`mailto:${SITE.email}`} className={buttonVariants({ size: 'sm' })}>
              Email me
            </a>
            <TrailLink href='/about' className={quietLinkVariants({ standalone: true })}>
              <span aria-hidden='true'>←</span> Back to About
            </TrailLink>
          </div>
        </PageHeader>
      </div>
    </div>
  );
}
