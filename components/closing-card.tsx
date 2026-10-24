'use client';

import { ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { SectionCard } from '@/components/section-card';
import { buttonVariants } from '@/components/ui/button';
import { REDUCED_MOTION_QUERY } from '@/constants';
import { cn } from '@/utils/cn';

/** The view transition's name for the card and the tab it folds into, set only while one runs. */
const MORPH = 'closing-card';
/** The quiet dotted links under the card's button. */
const QUIET_LINK =
  'text-ink-3 hover:text-ink cursor-pointer text-[15px] font-semibold underline decoration-dotted underline-offset-4';

/**
 * Swaps the card and its tab, letting the browser carry one into the other (a view transition with the same name
 * on both), so you see where the card went and where it comes back from. Without view transitions, or with reduced
 * motion, it simply swaps. The name is only set for the length of the transition: the day/night reveal uses view
 * transitions too, and a named element would step out of its circle.
 */
function morph(from: HTMLElement | null, to: () => HTMLElement | null, swap: () => void) {
  if (!from || typeof document.startViewTransition !== 'function') {
    swap();

    return;
  }

  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    swap();

    return;
  }

  from.style.viewTransitionName = MORPH;
  const transition = document.startViewTransition(() => {
    from.style.viewTransitionName = '';
    swap();
    const target = to();

    if (target) {
      target.style.viewTransitionName = MORPH;
    }
  });
  void transition.finished.finally(() => {
    const target = to();

    if (target) {
      target.style.viewTransitionName = '';
    }
  });
}

/**
 * The card at the top of the climb, and a way to set it aside: "Or just take in the view" folds it into a small tab
 * at the foot of the screen (the card's own title, with an arrow), so the summit and its sky have the screen, and
 * the summit's line comes back over the peak (`data-scenery` on <html>). The tab unfolds it again; so does Escape,
 * and so does leaving the summit: scroll away and the card is back where it was the next time you arrive.
 *
 * Folded, the card keeps its place in the page (hidden and inert, not removed), so the page's length, and with it
 * the climb's last stop, never move. Focus follows: onto the tab when the card folds, back to the link when it
 * opens.
 */
export function ClosingCard() {
  const [viewing, setViewing] = useState(false);
  const card = useRef<HTMLElement>(null);
  const tab = useRef<HTMLButtonElement>(null);
  const aside = useRef<HTMLButtonElement>(null);
  const changed = useRef(false);
  const id = useId();

  const fold = (next: boolean) => {
    changed.current = true;
    morph(
      next ? card.current : tab.current,
      () => (next ? tab.current : card.current),
      () => flushSync(() => setViewing(next))
    );
  };

  /* the scene shows the summit's line again while the card is set aside */
  useEffect(() => {
    document.documentElement.toggleAttribute('data-scenery', viewing);

    return () => document.documentElement.removeAttribute('data-scenery');
  }, [viewing]);

  useEffect(() => {
    if (!changed.current) return;
    (viewing ? tab : aside).current?.focus({ preventScroll: true });
  }, [viewing]);

  const unfold = useEffectEvent(() => fold(false));

  /* Escape opens it again, and leaving the summit puts it back for the next arrival */
  useEffect(() => {
    if (!viewing) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        unfold();
      }
    };

    const away = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        changed.current = false;
        setViewing(false);
      }
    });

    window.addEventListener('keydown', onKey);

    if (card.current) {
      away.observe(card.current);
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      away.disconnect();
    };
  }, [viewing]);

  return (
    <>
      <div inert={viewing} className={cn(viewing && 'invisible')}>
        <SectionCard
          ref={card}
          id={id}
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
          {/* whoever walked the whole climb can still have the short version, or simply stay for the view */}
          <p className='mt-5'>
            <Link href='/cv' className={QUIET_LINK}>
              Or read the same ten years as a plain list
            </Link>
          </p>
          <p className='mt-2.5'>
            <button
              ref={aside}
              type='button'
              aria-controls={id}
              aria-expanded={!viewing}
              className={QUIET_LINK}
              onClick={() => fold(true)}
            >
              Or just take in the view
            </button>
          </p>
        </SectionCard>
      </div>

      <button
        ref={tab}
        type='button'
        hidden={!viewing}
        aria-controls={id}
        aria-expanded={!viewing}
        onClick={() => fold(false)}
        className='border-line shadow-soft text-ink hover:border-ink bg-card ease-soft fixed bottom-[114px] left-1/2 z-[80] inline-flex min-h-11 -translate-x-1/2 cursor-pointer items-center gap-[9px] rounded-full border px-5 text-[15.5px] font-semibold whitespace-nowrap transition-[border-color] duration-[180ms] motion-reduce:transition-none'
      >
        The ascent never stops
        <ChevronUp size={17} strokeWidth={2.25} aria-hidden='true' className='text-accent-text' />
      </button>
    </>
  );
}
