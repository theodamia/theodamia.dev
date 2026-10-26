import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePathname } from 'next/navigation';
import { Dock } from '@/components/dock';

/* test/setup.ts mocks usePathname to '/' */

describe('Dock', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.mocked(usePathname).mockReturnValue('/');
    document.body.innerHTML = '';
  });

  it('lights Experience on its own page, which has no sections to watch', () => {
    vi.mocked(usePathname).mockReturnValue('/cv');

    render(<Dock />);

    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'true'
    );
  });

  it('names its four icon links, the three pages and the one action', () => {
    render(<Dock />);

    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav.querySelectorAll('a')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.queryByRole('link', { name: 'Skills' })).not.toBeInTheDocument();
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

    const contact = screen.getByRole('link', { name: 'Contact' });
    expect(contact.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(contact.querySelector('span[aria-hidden="true"]')).toHaveTextContent('Contact');
  });

  it('goes back to the top from Home', async () => {
    render(<Dock />);

    await userEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('lights the page itself, from its header on, until one of its sections is reached', () => {
    vi.mocked(usePathname).mockReturnValue('/about');

    render(<Dock />);

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('lights the section under the middle of the screen, and only it', () => {
    vi.mocked(usePathname).mockReturnValue('/about');
    const contact = document.createElement('section');
    contact.id = 'contact';
    contact.getBoundingClientRect = () => ({ top: -100 }) as DOMRect;
    document.body.append(contact);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callback(0);

      return 1;
    });

    render(<Dock />);

    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
  });
});
