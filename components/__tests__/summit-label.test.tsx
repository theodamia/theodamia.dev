import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummitLabel } from '@/components/scene/summit-label';
import { SUMMIT_LINE } from '@/content/site';

describe('SummitLabel', () => {
  it('draws the summit line, so the words over the peak come from content', () => {
    const { container } = render(<SummitLabel gone={false} />);

    expect(container.querySelector('.summit-label')?.textContent).toBe(SUMMIT_LINE);
  });

  /*
   * The fade is a CSS transition on `[data-gone='true']`; all the component owes it is the flag. It is its own
   * element rather than part of a layer precisely so this can change without repainting the mountain.
   */
  it('is marked gone once the climb is over, and not before', () => {
    const { container, rerender } = render(<SummitLabel gone={false} />);
    const label = container.querySelector('.summit-label');

    expect(label).toHaveAttribute('data-gone', 'false');

    rerender(<SummitLabel gone />);
    expect(label).toHaveAttribute('data-gone', 'true');
  });
});
