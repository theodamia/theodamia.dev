import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VIEW_STORAGE_KEY } from '@/constants';
import { ViewToggle } from '@/components/view-toggle';

const root = document.documentElement;

describe('ViewToggle', () => {
  beforeEach(() => {
    root.dataset.view = 'climb';
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    root.removeAttribute('data-view');
    document.body.innerHTML = '';
  });

  it('switches the page to the timeline and remembers it', async () => {
    render(<ViewToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Show the plain timeline' }));

    expect(root.dataset.view).toBe('timeline');
    expect(localStorage.getItem(VIEW_STORAGE_KEY)).toBe('timeline');
    /* the name follows the store, so it now offers the way back */
    expect(await screen.findByRole('button', { name: 'Show the climb' })).toBeInTheDocument();
  });

  it('switches back', async () => {
    root.dataset.view = 'timeline';
    render(<ViewToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Show the climb' }));

    expect(root.dataset.view).toBe('climb');
    expect(localStorage.getItem(VIEW_STORAGE_KEY)).toBe('climb');
  });

  it('keeps both icons out of the accessibility tree, and names itself', () => {
    const { container } = render(<ViewToggle />);

    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    icons.forEach(icon => expect(icon).toHaveAttribute('aria-hidden', 'true'));
    expect(screen.getByRole('button', { name: 'Show the plain timeline' })).toBeInTheDocument();
  });
});
