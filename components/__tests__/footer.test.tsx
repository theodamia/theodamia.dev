import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';

describe('Footer', () => {
  it('renders footer content', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Based in Thessaloniki, Central Macedonia, Greece/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/© 2025 Theodore Damianidis. All rights reserved./i)
    ).toBeInTheDocument();
  });

  it('renders as footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});

