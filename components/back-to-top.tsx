'use client';

import { useEffect, useState } from 'react';
import { REDUCED_MOTION_QUERY, SCROLL_THRESHOLD } from '@/constants';
import { cn } from '@/utils/cn';

/** Climbs back to the masthead. Only the climb view scrolls, so only it needs this. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD.BACK_TO_TOP_VISIBLE);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type='button'
      onClick={scrollToTop}
      aria-label='Back to top'
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'border-ink bg-card shadow-card ease-draw fixed right-6 bottom-6 z-[100] flex size-11 cursor-pointer items-center justify-center rounded-[4px] border-2 transition-[opacity,transform] duration-300',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <span aria-hidden='true' className='text-ink-strong font-mono text-[17px] leading-none'>
        ↑
      </span>
    </button>
  );
}
