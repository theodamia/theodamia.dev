'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { artUrl, CAIRN, THEMES } from '@/scene/flats';

type CairnProps = {
  /** Up while the closing card is set aside: the cairn stands by the path and answers a click. */
  open: boolean;
  /** The closing card is in view: fetch the pictures now, so the card has something to shrink into. */
  warm: boolean;
  onOpen: () => void;
  ref: React.Ref<HTMLButtonElement>;
};

/**
 * The way back to the closing card, in the world: a cairn, the little tower of stones climbers leave by a path to
 * mark the way, standing at the bend above today's camp. Setting the card aside shrinks it into the cairn (it is
 * kept there, like a note left under a stone); the cairn answers a click, or Enter, by bringing it back out.
 * Hovering or focusing it brightens the stones and shows "Today's note" above them, as it does for a moment after
 * the card goes in (`data-hint`), so the way back is shown once without being asked for.
 *
 * It is a real button, named for what it does, laid over the scene from the page rather than drawn inside the
 * stage: the stage is hidden from assistive technology and sits under the page, so nothing in it could be
 * clicked. The stage still owns where it stands (`todayCairn` in scene/camera.ts): it sizes it on resize and moves
 * it with the camp each frame, a transform like any other layer.
 *
 * Its pictures are fetched once the closing card comes into view (only whoever reaches the end needs them), and
 * decoded then, so the card never shrinks into an empty box.
 */
export function Cairn({ open, warm, onOpen, ref }: CairnProps) {
  const stones = useRef<HTMLSpanElement>(null);
  /* once fetched, kept: scrolling away from the end must not drop the pictures */
  const [fetched, setFetched] = useState(warm);

  if (warm && !fetched) {
    setFetched(true);
  }

  useEffect(() => {
    if (!fetched) return;
    stones.current?.querySelectorAll('img').forEach(img => {
      void img.decode().catch(() => undefined);
    });
  }, [fetched]);

  return (
    <button
      ref={ref}
      type='button'
      data-cairn
      hidden={!open}
      aria-label="Today's note: The ascent never stops"
      onClick={onOpen}
      className='cairn'
    >
      <span className='cairn-note' aria-hidden='true'>
        Today&apos;s note
      </span>
      <span ref={stones} data-cairn-stones className='cairn-stones' aria-hidden='true'>
        {THEMES.map(theme => (
          <img
            key={theme}
            alt=''
            data-art={theme}
            src={fetched ? artUrl(CAIRN.art[theme]) : undefined}
            decoding='async'
            draggable={false}
          />
        ))}
      </span>
    </button>
  );
}
