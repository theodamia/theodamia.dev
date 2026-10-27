import type React from 'react';
import { PaintedClouds, Stars, type CloudWind } from '@/components/scene/sky';
import { ThemePicture } from '@/components/scene/theme-picture';
import { aiUrl, aspectOf, FINALE_SCENE } from '@/scene/ai';

/** High and few, as over /about's ending: the content stands in the sky below them. */
const FORK_CLOUDS: CloudWind[] = [
  { cloud: 0, top: '5%', width: 20, at: 0.7, cross: 240, billow: 19 },
  { cloud: 2, top: '10%', width: 11, at: 0.15, cross: 340, billow: 13 },
];

/**
 * A last screen at the summit with the giant at a fork in the trail along its bottom edge, waiting, not choosing
 * (scene/ai.ts). /ai ends on it, the Contact card above being the reader's move; the 404 stands on it, the reader
 * having lost the trail and the ways on being the links. The sky comes in from the page above; the content stands
 * near the top and on the left, clear of the giant in the scene's right third, though it may stand over the far
 * range; the scene spans the width (`cqw`). On phones it is just the content.
 */
export function ForkScene({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='summit-finale'
      style={{ '--scene-aspect': aspectOf(FINALE_SCENE) } as React.CSSProperties}
    >
      <div aria-hidden='true' className='summit-sky fork-sky max-wide:hidden print:hidden'>
        <Stars />
        <PaintedClouds winds={FORK_CLOUDS} />
        <ThemePicture
          className='fork-scene'
          pictures={{ day: aiUrl(FINALE_SCENE.day), night: aiUrl(FINALE_SCENE.night) }}
        />
      </div>
      <div className='max-wide:px-4 relative mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-7'>
        {children}
        <div aria-hidden='true' className='fork-band max-wide:hidden' />
        <div aria-hidden='true' className='fork-foot max-wide:hidden' />
      </div>
    </div>
  );
}
