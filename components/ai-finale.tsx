import type React from 'react';
import { ContactRows } from '@/components/contact-rows';
import { PaintedClouds, Stars, type CloudWind } from '@/components/scene/sky';
import { ThemePicture } from '@/components/scene/theme-picture';
import { SectionCard } from '@/components/section-card';
import { AI_CONTACT_TITLE } from '@/content/ai';
import { aiUrl, aspectOf, FINALE_SCENE } from '@/scene/ai';

/** High and few, as over /about's ending: the card stands in the sky below them. */
const FINALE_CLOUDS: CloudWind[] = [
  { cloud: 0, top: '5%', width: 20, at: 0.7, cross: 240, billow: 19 },
  { cloud: 2, top: '10%', width: 11, at: 0.15, cross: 340, billow: 13 },
];

/**
 * The end of /ai, as /about ends: one screen, the page's last, the card near the top, a band of open sky, and a
 * scene along the bottom edge, cropped by the screen's sides. The scene closes the page's idea: the giant has
 * stopped at a fork in the trail and waits, not choosing the way; the card above it is where the reader makes the
 * next move. The card stays on the left, clear of the giant in the scene's right third, so it may stand over the
 * scene's far range; the scene spans the width, so how tall it stands is a share of that width (`cqw`). On phones
 * it is just the card.
 */
export function AiFinale() {
  return (
    <div
      className='ai-finale'
      style={{ '--scene-aspect': aspectOf(FINALE_SCENE) } as React.CSSProperties}
    >
      <div aria-hidden='true' className='summit-sky ai-finale-sky max-wide:hidden print:hidden'>
        <Stars />
        <PaintedClouds winds={FINALE_CLOUDS} />
        <ThemePicture
          className='ai-fork'
          pictures={{ day: aiUrl(FINALE_SCENE.day), night: aiUrl(FINALE_SCENE.night) }}
        />
      </div>
      <div className='max-wide:px-4 relative mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-7'>
        <SectionCard
          id='contact'
          eyebrow='Contact'
          title={AI_CONTACT_TITLE}
          className='mx-0 max-w-[720px] print:hidden'
        >
          <ContactRows />
        </SectionCard>
        <div aria-hidden='true' className='ai-band max-wide:hidden' />
        <div aria-hidden='true' className='ai-foot max-wide:hidden' />
      </div>
    </div>
  );
}
