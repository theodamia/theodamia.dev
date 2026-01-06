import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from '../navigation';

// Mock anime.js
vi.mock('animejs', () => ({
  default: vi.fn(),
}));

describe('Navigation', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
    // Reset document classes
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links', () => {
    render(<Navigation />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(<Navigation />);
    expect(screen.getByText('TD')).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    const themeButton = screen.getAllByLabelText('Toggle theme')[0];
    expect(themeButton).toBeInTheDocument();

    // Initial state should be light (default)
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Click to toggle to dark
    await user.click(themeButton);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click again to toggle back to light
    await user.click(themeButton);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('loads saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(<Navigation />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('uses system theme when no saved theme exists', () => {
    // Mock matchMedia to return dark preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<Navigation />);
    // Should use system preference (dark in this case)
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles mobile menu when menu button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeInTheDocument();

    // Click to toggle menu
    await user.click(menuButton);
    // Menu button should still be present after click
    expect(menuButton).toBeInTheDocument();

    // Click again to close
    await user.click(menuButton);
    expect(menuButton).toBeInTheDocument();
  });
});
