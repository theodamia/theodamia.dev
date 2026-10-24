import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ClosingCard } from '@/components/closing-card';

const card = () =>
  screen.getByRole('heading', { name: 'The ascent never stops' }).closest('section')!;
const folded = () => card().parentElement!.hasAttribute('inert');

describe('ClosingCard', () => {
  afterEach(() => document.documentElement.removeAttribute('data-scenery'));

  it('offers the next page, the plain list, and the view', () => {
    render(<ClosingCard />);

    expect(screen.getByRole('link', { name: 'About and skills' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getByRole('link', { name: /plain list/ })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('button', { name: 'Or just take in the view' })).toBeInTheDocument();
    /* the tab only exists for a folded card */
    expect(screen.queryByRole('button', { name: 'The ascent never stops' })).toBeNull();
  });

  it('folds into a tab that brings it back, with the summit line showing meanwhile', async () => {
    render(<ClosingCard />);

    await userEvent.click(screen.getByRole('button', { name: 'Or just take in the view' }));
    expect(folded()).toBe(true);
    expect(document.documentElement).toHaveAttribute('data-scenery');
    const tab = screen.getByRole('button', { name: 'The ascent never stops' });
    expect(tab).toHaveFocus();
    expect(tab).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(tab);
    expect(folded()).toBe(false);
    expect(document.documentElement).not.toHaveAttribute('data-scenery');
    expect(screen.getByRole('button', { name: 'Or just take in the view' })).toHaveFocus();
  });

  it('opens again on Escape', async () => {
    render(<ClosingCard />);

    await userEvent.click(screen.getByRole('button', { name: 'Or just take in the view' }));
    await act(async () => {
      await userEvent.keyboard('{Escape}');
    });

    expect(folded()).toBe(false);
  });

  it('keeps its place in the page while folded, so the page never changes length', async () => {
    render(<ClosingCard />);

    await userEvent.click(screen.getByRole('button', { name: 'Or just take in the view' }));

    expect(card()).toBeInTheDocument();
    expect(card().parentElement).toHaveClass('invisible');
  });
});
