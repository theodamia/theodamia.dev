'use client';

import { useCallback, useState } from 'react';
import { SLICE_TOOLTIP } from '@/constants';
import type { Slice } from '@/lib/figures';

type SliceTooltipProps = {
  slice: Slice;
  color: string;
  x: number;
  y: number;
  /** Wrapper size, so the card stays inside the figure instead of spilling past its edge. */
  containerWidth: number;
  containerHeight: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/** Follows the cursor across a donut. Same napkin card as the Fig. 1 landmark tooltip. */
export function SliceTooltip({
  slice,
  color,
  x,
  y,
  containerWidth,
  containerHeight,
}: SliceTooltipProps) {
  const [halfHeight, setHalfHeight] = useState<number>(SLICE_TOOLTIP.FALLBACK_HALF_HEIGHT);

  // The note wraps to one or two lines depending on the slice, so measure rather than guess.
  // Callers key this component by slice, so the ref re-attaches whenever the copy changes.
  const measure = useCallback((card: HTMLDivElement | null) => {
    if (card?.offsetHeight) setHalfHeight(card.offsetHeight / 2);
  }, []);

  // Prefer the right of the cursor, fall back to its left, then clamp — the Fig. 2 card is
  // narrow enough that neither side fits on its own.
  const rightOfCursor = x + SLICE_TOOLTIP.OFFSET;
  const leftOfCursor = x - SLICE_TOOLTIP.OFFSET - SLICE_TOOLTIP.WIDTH;
  const fitsRight = rightOfCursor + SLICE_TOOLTIP.WIDTH <= containerWidth;

  const left = clamp(
    fitsRight ? rightOfCursor : leftOfCursor,
    0,
    containerWidth - SLICE_TOOLTIP.WIDTH
  );
  const top = clamp(y, halfHeight, containerHeight - halfHeight);

  return (
    <div
      ref={measure}
      aria-hidden='true'
      className='border-ink bg-tooltip shadow-tooltip pointer-events-none absolute z-[5] -translate-y-1/2 rounded-[4px] border-2 px-3.5 py-2.5'
      style={{ left, top, width: SLICE_TOOLTIP.WIDTH }}
    >
      <div className='flex items-center gap-2'>
        <span className='size-[11px] shrink-0 rounded-[2px]' style={{ background: color }} />
        <span className='font-hand text-ink text-[19px] leading-none'>{slice.label}</span>
      </div>
      <p className='text-ink-faint mt-1.5 font-mono text-[10.5px] tracking-[0.14em] uppercase'>
        {slice.detail}
      </p>
      <p className='text-ink-muted mt-2 text-[13.5px] leading-[1.5]'>{slice.note}</p>
    </div>
  );
}
