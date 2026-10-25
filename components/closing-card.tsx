'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { SectionCard } from '@/components/section-card';
import { useScenery } from '@/components/scenery';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

/** The quiet dotted links under the card's button. */
const QUIET_LINK =
  'text-ink-3 hover:text-ink cursor-pointer text-[15px] font-semibold underline decoration-dotted underline-offset-4';

/**
 * The card at the top of the climb, and a way to set it aside: "Take in the view" shrinks it into a cairn by the
 * path above today's camp, kept there like a note under a stone until the cairn is clicked and the card comes back
 * out (the climb owns the state and the cairn: components/climb.tsx, components/scene/cairn.tsx).
 *
 * Under the button, two quieter ways on, side by side as one group rather than two "Or…" lines in a row: the
 * same ten years on one page, named as the hero names it ("Every role, on one page"), and the view.
 *
 * Set aside, the card keeps its place in the page (hidden and inert, not removed), so the page's length, and with
 * it the climb's last stop, never move. When the reader brings it back, focus returns to the link they left from.
 */
export function ClosingCard() {
  const { viewing, fold, cardRef, returningRef } = useScenery();
  const aside = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (viewing || !returningRef.current) return;
    returningRef.current = false;
    aside.current?.focus({ preventScroll: true });
  }, [viewing, returningRef]);

  return (
    <div inert={viewing} className={cn(viewing && 'invisible')}>
      <SectionCard
        ref={cardRef}
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
        {/* whoever walked the whole climb can still have the short version, or simply stay for the view;
            a row on wide screens, stacked on phones, where the dot between them would dangle */}
        <div className='max-wide:flex-col mt-5 flex items-center justify-center gap-x-3 gap-y-2.5'>
          <Link href='/cv' className={QUIET_LINK}>
            Every role, on one page
          </Link>
          <span aria-hidden='true' className='text-ink-3 max-wide:hidden'>
            ·
          </span>
          <button ref={aside} type='button' className={QUIET_LINK} onClick={() => fold(true)}>
            Take in the view
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
