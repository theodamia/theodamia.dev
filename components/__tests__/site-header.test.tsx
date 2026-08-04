import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteHeader } from '@/components/site-header';

describe('SiteHeader', () => {
  it('marks the active view as pressed', () => {
    render(<SiteHeader view='words' onViewChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'The words' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'The climb' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('reports the picked view', async () => {
    const onViewChange = vi.fn();
    render(<SiteHeader view='climb' onViewChange={onViewChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'The words' }));

    expect(onViewChange).toHaveBeenCalledWith('words');
  });

  it('sends the wordmark back to the default view from anywhere', async () => {
    const onViewChange = vi.fn();
    render(<SiteHeader view='words' onViewChange={onViewChange} />);

    const wordmark = screen.getByRole('link', { name: 'T. Damianidis' });
    expect(wordmark).toHaveAttribute('href', '#top');

    await userEvent.click(wordmark);

    expect(onViewChange).toHaveBeenCalledWith('climb');
  });
});
