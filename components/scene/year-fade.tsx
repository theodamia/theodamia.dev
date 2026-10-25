import type React from 'react';
import { YEAR_STATES, yearTimeline } from '@/scene/seasons';

/**
 * State `k` of the year, faded in by its hairline's view timeline and out by the next one's (the rules under
 * `.year-fade` in globals.css): one opacity on a whole layer, run by the browser's own scrolling. The first state
 * has nothing to fade in from, and the last nothing to give way to. Its own module, so the weather (a client
 * component) can share it without pulling the paintings' manifest into the browser's bundle.
 */
export function YearFade({ k, children }: { k: number; children: React.ReactNode }) {
  let node = (
    <div className='year-state' data-k={k}>
      {children}
    </div>
  );

  if (k > 0) {
    node = (
      <div className='year-fade' data-fade='in' style={{ animationTimeline: yearTimeline(k) }}>
        {node}
      </div>
    );
  }

  if (k < YEAR_STATES - 1) {
    node = (
      <div className='year-fade' data-fade='out' style={{ animationTimeline: yearTimeline(k + 1) }}>
        {node}
      </div>
    );
  }

  return node;
}
