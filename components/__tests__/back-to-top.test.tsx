import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackToTop } from '@/components/back-to-top';
import { SCROLL_THRESHOLD } from '@/lib/constants';

function scrollTo(y: number) {
  window.scrollY = y;
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

afterEach(() => {
  window.scrollY = 0;
  vi.restoreAllMocks();
});

describe('BackToTop', () => {
  it('stays out of the tab order until the page is scrolled', () => {
    render(<BackToTop />);

    const button = screen.getByLabelText('Back to top');
    expect(button).toHaveAttribute('tabindex', '-1');
    expect(button).toHaveAttribute('aria-hidden', 'true');

    scrollTo(SCROLL_THRESHOLD.BACK_TO_TOP_VISIBLE + 1);

    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).toHaveAttribute('aria-hidden', 'false');
  });

  it('scrolls the page back to the masthead', async () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<BackToTop />);
    scrollTo(SCROLL_THRESHOLD.BACK_TO_TOP_VISIBLE + 1);

    await userEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
