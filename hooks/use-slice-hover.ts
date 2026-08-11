'use client';

import { type RefObject, useCallback, useState } from 'react';
import { ARC_SELECTOR } from '@/constants';

export type SliceHover = {
  index: number;
  /** Cursor position, relative to the wrapper the tooltip is positioned inside. */
  x: number;
  y: number;
  /** Measured alongside the cursor so the tooltip can be clamped without reading a ref. */
  containerWidth: number;
  containerHeight: number;
};

/**
 * Tracks which donut slice the cursor is over. The arcs are drawn by chart.xkcd rather
 * than React, so the listeners are attached in the chart's `afterDraw` pass — a redraw
 * throws the old arcs away with their listeners still on them.
 */
export function useSliceHover(wrapperRef: RefObject<HTMLElement | null>) {
  const [hover, setHover] = useState<SliceHover | null>(null);

  const clearHover = useCallback(() => setHover(null), []);

  const bindArcs = useCallback(
    (svg: SVGSVGElement) => {
      setHover(null);

      svg.querySelectorAll<SVGPathElement>(ARC_SELECTOR).forEach((arc, index) => {
        arc.style.cursor = 'help';

        arc.addEventListener('mousemove', event => {
          const wrapper = wrapperRef.current;
          if (!wrapper) return;
          const bounds = wrapper.getBoundingClientRect();
          setHover({
            index,
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
            containerWidth: bounds.width,
            containerHeight: bounds.height,
          });
        });

        arc.addEventListener('mouseleave', clearHover);
      });
    },
    [wrapperRef, clearHover]
  );

  return { hover, bindArcs, clearHover };
}
