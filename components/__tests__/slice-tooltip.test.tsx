import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SliceTooltip } from '@/components/slice-tooltip';
import { SLICE_TOOLTIP } from '@/lib/constants';
import type { Slice } from '@/lib/figures';

const SLICE: Slice = {
  label: 'Geekbot',
  value: 7.9,
  detail: '7.9 yrs',
  note: 'Two roles, one codebase, most of a decade.',
};

function renderAt(x: number, y: number, containerWidth = 400, containerHeight = 280) {
  const { container } = render(
    <SliceTooltip
      slice={SLICE}
      color='#b3762f'
      x={x}
      y={y}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
    />
  );
  return container.firstElementChild as HTMLElement;
}

describe('SliceTooltip', () => {
  it('shows the slice label and its quantity', () => {
    renderAt(20, 100);

    expect(screen.getByText('Geekbot')).toBeInTheDocument();
    expect(screen.getByText('7.9 yrs')).toBeInTheDocument();
  });

  it('sits to the right of the cursor when there is room', () => {
    const tooltip = renderAt(20, 100);

    expect(tooltip.style.left).toBe(`${20 + SLICE_TOOLTIP.OFFSET}px`);
  });

  it('flips to the left of the cursor near the right edge', () => {
    const tooltip = renderAt(380, 100);

    expect(tooltip.style.left).toBe(`${380 - SLICE_TOOLTIP.OFFSET - SLICE_TOOLTIP.WIDTH}px`);
  });

  it('never spills past either edge of a card too narrow for both sides', () => {
    const narrow = SLICE_TOOLTIP.WIDTH + 20;
    const rightmost = narrow - SLICE_TOOLTIP.WIDTH;

    [0, narrow / 2, narrow - 2, narrow].forEach(cursorX => {
      const left = Number.parseFloat(renderAt(cursorX, 100, narrow).style.left);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThanOrEqual(rightmost);
    });
  });

  it('keeps the card inside the figure vertically', () => {
    expect(renderAt(20, 0).style.top).toBe(`${SLICE_TOOLTIP.FALLBACK_HALF_HEIGHT}px`);
    expect(renderAt(20, 280).style.top).toBe(`${280 - SLICE_TOOLTIP.FALLBACK_HALF_HEIGHT}px`);
  });
});
