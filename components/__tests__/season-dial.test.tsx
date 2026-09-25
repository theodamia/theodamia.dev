import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { SeasonDial } from '@/components/season-dial';
import { SEASONS, seasonNow } from '@/lib/season';

afterEach(() => {
  delete document.documentElement.dataset.season;

  try {
    localStorage.clear();
  } catch {
    /* nothing stored, nothing to clear */
  }
});

describe('SeasonDial', () => {
  it('offers all four seasons, each by name', () => {
    render(<SeasonDial />);

    SEASONS.forEach(season => {
      expect(screen.getByRole('button', { name: season })).toBeInTheDocument();
    });
  });

  it('presses the one the mountain is in, and only that one', async () => {
    /* stored, not just set: with nothing chosen the dial follows the calendar and would reclaim it */
    localStorage.setItem('season', 'winter');
    document.documentElement.dataset.season = 'winter';
    render(<SeasonDial />);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'winter' })).toHaveAttribute('aria-pressed', 'true')
    );
    ['spring', 'summer', 'autumn'].forEach(season => {
      expect(screen.getByRole('button', { name: season })).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('follows the calendar while nobody has chosen', async () => {
    document.documentElement.dataset.season = 'winter';
    render(<SeasonDial />);

    /* nothing stored, so the month decides and whatever was on the element is overruled */
    await waitFor(() => expect(document.documentElement.dataset.season).toBe(seasonNow()));
  });

  it('changes the season on the page, and remembers it', async () => {
    localStorage.setItem('season', 'summer');
    document.documentElement.dataset.season = 'summer';
    render(<SeasonDial />);

    await userEvent.click(screen.getByRole('button', { name: 'autumn' }));

    expect(document.documentElement.dataset.season).toBe('autumn');
    /* remembering is what stops the mountain going back to whatever month it is */
    expect(localStorage.getItem('season')).toBe('autumn');
  });
});
