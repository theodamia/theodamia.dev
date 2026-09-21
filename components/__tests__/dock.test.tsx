import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Dock } from '@/components/dock';

/* test/setup.ts mocks usePathname to '/' */

describe('Dock', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('names its five icon links and points them across both pages', () => {
    render(<Dock />);

    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav.querySelectorAll('a')).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '/#climb');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about#about');
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '/about#skills');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/about#contact');
  });

  it('ends with the day and night switch, a setting kept outside the Sections landmark', () => {
    render(<Dock />);

    const nav = screen.getByRole('navigation', { name: 'Sections' });
    const toggle = screen.getByRole('button', { name: /^Switch to (night|day)$/ });
    expect(nav).not.toContainElement(toggle);
  });

  it('keeps icons and bubbles out of the accessibility tree', () => {
    render(<Dock />);

    const skills = screen.getByRole('link', { name: 'Skills' });
    expect(skills.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(skills.querySelector('span[aria-hidden="true"]')).toHaveTextContent('Skills');
  });

  it('scrolls to the first stop the climb published instead of navigating', async () => {
    const climb = document.createElement('ol');
    climb.id = 'climb';
    climb.dataset.scrollY = '452';
    document.body.append(climb);
    render(<Dock />);

    await userEvent.click(screen.getByRole('link', { name: 'Experience' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 452 });
  });

  it('goes back to the top from Home', async () => {
    render(<Dock />);

    await userEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('lights the section under the middle of the screen', () => {
    const climb = document.createElement('ol');
    climb.id = 'climb';
    climb.getBoundingClientRect = () => ({ top: -100 }) as DOMRect;
    document.body.append(climb);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callback(0);
      return 1;
    });

    render(<Dock />);

    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'true'
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
