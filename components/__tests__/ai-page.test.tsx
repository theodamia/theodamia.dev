import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Ai from '@/app/ai/page';
import { AI_CONTACT_TITLE, AI_LIMITS, AI_PAGE, AI_PLACES, AI_PRACTICES } from '@/content/ai';

describe('/ai', () => {
  it('opens on the header /cv and /about share, with the one action and the way back', () => {
    render(<Ai />);

    const header = screen.getByRole('banner');
    expect(within(header).getByText(AI_PAGE.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: AI_PAGE.title })).toBeInTheDocument();
    expect(within(header).getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:/)
    );
    expect(within(header).getByRole('link', { name: /Back to About/ })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('says what I set up and what I do not hand over, each point under its own heading', () => {
    render(<Ai />);

    const practice = screen.getByRole('region', { name: 'What I set up' });
    AI_PRACTICES.forEach(point =>
      expect(within(practice).getByRole('heading', { name: point.name })).toBeInTheDocument()
    );
    const limits = screen.getByRole('region', { name: 'What I don’t hand over' });
    AI_LIMITS.forEach(point =>
      expect(within(limits).getByRole('heading', { name: point.name })).toBeInTheDocument()
    );
  });

  it('tells each place as a log entry, named by its title, under the section heading', () => {
    render(<Ai />);

    const where = screen.getByRole('region', { name: 'Three places, the same rules' });
    AI_PLACES.forEach(place => {
      const entry = within(where).getByRole('article', { name: place.title });
      expect(
        within(entry).getByRole('heading', { level: 3, name: place.title })
      ).toBeInTheDocument();
    });
    expect(within(where).getByRole('link', { name: /DeepSea\.ai/ })).toHaveAttribute(
      'href',
      'https://www.deepsea.ai/'
    );
  });

  it('ends on how to reach me', () => {
    render(<Ai />);

    expect(screen.getByRole('heading', { name: AI_CONTACT_TITLE })).toBeInTheDocument();
  });
});
