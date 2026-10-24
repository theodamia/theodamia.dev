import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Climb } from '@/components/climb';
import { ClosingCard } from '@/components/closing-card';

const card = () =>
  screen.getByRole('heading', { name: 'The ascent never stops' }).closest('section')!;
const setAside = () => card().parentElement!.hasAttribute('inert');
const cairn = () => screen.queryByRole('button', { name: /Today's note/ });

function climb() {
  return render(
    <Climb hero={null}>
      <ClosingCard />
    </Climb>
  );
}

describe('ClosingCard', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => document.documentElement.removeAttribute('data-scenery'));

  it('offers the next page, the plain list, and the view, and no way back until it is set aside', () => {
    climb();

    expect(screen.getByRole('link', { name: 'About and skills' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getByRole('link', { name: /plain list/ })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('button', { name: 'Or just take in the view' })).toBeInTheDocument();
    expect(cairn()).toBeNull();
  });

  it("goes into the cairn by today's camp, and the cairn brings it back out", async () => {
    climb();

    await userEvent.click(screen.getByRole('button', { name: 'Or just take in the view' }));
    expect(setAside()).toBe(true);
    expect(document.documentElement).toHaveAttribute('data-scenery');
    expect(cairn()).toHaveFocus();
    /* the way back is named once, over the cairn, for a moment */
    expect(cairn()).toHaveAttribute('data-hint');

    await userEvent.click(cairn()!);
    expect(setAside()).toBe(false);
    expect(cairn()).toBeNull();
    expect(document.documentElement).not.toHaveAttribute('data-scenery');
    expect(screen.getByRole('button', { name: 'Or just take in the view' })).toHaveFocus();
  });

  it('comes back on Escape', async () => {
    climb();

    await userEvent.click(screen.getByRole('button', { name: 'Or just take in the view' }));
    await act(async () => {
      await userEvent.keyboard('{Escape}');
    });

    expect(setAside()).toBe(false);
  });

  it('keeps its place in the page while set aside, so the page never changes length', async () => {
    climb();

    await userEvent.click(screen.getByRole('button', { name: 'Or just take in the view' }));

    expect(card()).toBeInTheDocument();
    expect(card().parentElement).toHaveClass('invisible');
  });
});
