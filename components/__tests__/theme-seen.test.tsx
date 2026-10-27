import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeSeen } from '@/components/theme-seen';

const root = document.documentElement;

describe('ThemeSeen', () => {
  afterEach(() => {
    delete root.dataset.theme;
    delete root.dataset.themeSeen;
  });

  it('notes the theme on screen, and every theme switched to after it, on any page', async () => {
    root.dataset.theme = 'light';
    render(<ThemeSeen />);

    expect(root.dataset.themeSeen).toBe('day');

    await act(async () => {
      root.dataset.theme = 'dark';
      /* the observer reports on the next microtask */
      await Promise.resolve();
    });

    expect(root.dataset.themeSeen?.split(' ').sort()).toEqual(['day', 'night']);
  });
});
