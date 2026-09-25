import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialLinks } from '@/components/social-links';
import { SITE } from '@/content/site';

describe('SocialLinks', () => {
  /*
   * `getByRole(..., { name })` computes the accessible name the way a screen reader does, which is the whole point
   * here: with the warning back inside the link as an `sr-only` span, these names would be bare "LinkedIn" and
   * "GitHub" again, and this test would fail.
   */
  it('carries the new-tab warning in the name, since the tiles have no text of their own', () => {
    render(<SocialLinks />);

    expect(screen.getByRole('link', { name: 'LinkedIn (opens in a new tab)' })).toHaveAttribute(
      'target',
      '_blank'
    );
    expect(screen.getByRole('link', { name: 'GitHub (opens in a new tab)' })).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );
  });

  it('does not warn about the mail link, which opens no tab', () => {
    render(<SocialLinks />);

    const mail = screen.getByRole('link', { name: `Email ${SITE.email}` });
    expect(mail).toHaveAttribute('href', `mailto:${SITE.email}`);
    expect(mail).not.toHaveAttribute('target');
  });
});
