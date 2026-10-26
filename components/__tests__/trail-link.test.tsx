import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TrailLink, trailDirection } from '@/components/trail-link';

describe('trailDirection', () => {
  it('goes up toward the summit and down toward the valley', () => {
    expect(trailDirection('/cv', '/')).toBe('trail-up');
    expect(trailDirection('/', '/about')).toBe('trail-up');
    expect(trailDirection('/cv', '/about')).toBe('trail-up');
    expect(trailDirection('/about', '/')).toBe('trail-down');
    expect(trailDirection('/', '/cv')).toBe('trail-down');
  });

  it('reads /ai beside the summit, across from /about', () => {
    expect(trailDirection('/about', '/ai')).toBe('trail-across');
    expect(trailDirection('/', '/ai')).toBe('trail-up');
  });

  it('counts a page off the map as the climb itself', () => {
    expect(trailDirection('/somewhere', '/')).toBe('trail-across');
  });
});

describe('TrailLink', () => {
  const push = vi.fn();

  beforeEach(() => {
    push.mockClear();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(usePathname).mockReturnValue('/');
  });

  it('walks to another page through the router', () => {
    render(<TrailLink href='/cv'>Every role</TrailLink>);

    fireEvent.click(screen.getByRole('link', { name: 'Every role' }));
    expect(push).toHaveBeenCalledWith('/cv');
  });

  it('keeps the section of the page it goes to', () => {
    render(<TrailLink href='/about#skills'>Skills</TrailLink>);

    fireEvent.click(screen.getByRole('link', { name: 'Skills' }));
    expect(push).toHaveBeenCalledWith('/about#skills');
  });

  it('leaves a link to the page it is on, and a click for a new tab, to the link itself', () => {
    render(
      <>
        <TrailLink href='/#top'>Top</TrailLink>
        <TrailLink href='/cv'>Every role</TrailLink>
      </>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Top' }));
    fireEvent.click(screen.getByRole('link', { name: 'Every role' }), { metaKey: true });
    expect(push).not.toHaveBeenCalled();
  });

  it('lets its own click handler settle the click first', () => {
    render(
      <TrailLink href='/cv' onClick={event => event.preventDefault()}>
        Every role
      </TrailLink>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Every role' }));
    expect(push).not.toHaveBeenCalled();
  });
});
