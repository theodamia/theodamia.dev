import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordsView } from '@/components/words-view';
import { PANELS } from '@/lib/panels';

describe('WordsView', () => {
  it('opens on the About panel', () => {
    render(<WordsView />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('About');
    expect(screen.getByText(PANELS.about.kicker)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  });

  it('swaps the panel without scrolling the page', async () => {
    render(<WordsView />);

    await userEvent.click(screen.getByRole('button', { name: 'Contact' }));

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact');
    expect(screen.getByText(PANELS.contact.body[0])).toBeInTheDocument();
    PANELS.contact.chips.forEach(chip => {
      expect(screen.getByText(chip)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'About' })).not.toHaveAttribute('aria-current');
  });
});
