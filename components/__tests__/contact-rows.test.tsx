import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactRows } from '@/components/contact-rows';
import { SITE } from '@/lib/site';

describe('ContactRows', () => {
  it('puts email first, with a way to write straight away', () => {
    render(<ContactRows />);

    const [first] = screen.getAllByRole('listitem');
    expect(first).toHaveTextContent(SITE.email);
    expect(screen.getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      `mailto:${SITE.email}`
    );
  });

  it('opens the two profiles in a new tab', () => {
    render(<ContactRows />);

    [
      { name: `LinkedIn ${SITE.linkedin.handle} (opens in a new tab)`, href: SITE.linkedin.url },
      { name: `GitHub ${SITE.github.handle} (opens in a new tab)`, href: SITE.github.url },
    ].forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('copies the address and says so', async () => {
    const user = userEvent.setup();
    render(<ContactRows />);

    await user.click(screen.getByRole('button', { name: 'Copy email address' }));

    expect(await navigator.clipboard.readText()).toBe(SITE.email);
    expect(screen.getByRole('button', { name: 'Copy email address' })).toHaveTextContent('Copied');
    expect(screen.getByRole('status')).toHaveTextContent('Email address copied');
  });
});
