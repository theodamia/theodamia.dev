import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline } from '@/components/timeline';
import { JOBS } from '@/lib/jobs';

const newestFirst = [...JOBS].reverse();

describe('Timeline', () => {
  it('lists every job newest first, one card each', () => {
    render(<Timeline />);

    const list = screen.getByRole('list', { name: 'Experience, newest first' });
    expect(list.querySelectorAll('[data-card]')).toHaveLength(JOBS.length);
    expect(
      screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)
    ).toEqual(newestFirst.map(job => job.role));
  });

  it('marks the year of each stop, and says which one is now', () => {
    render(<Timeline />);

    const list = screen.getByRole('list', { name: 'Experience, newest first' });
    const stops = [...list.querySelectorAll(':scope > li')];
    expect(stops.map(stop => Number(stop.textContent?.slice(0, 4)))).toEqual(
      newestFirst.map(job => job.start)
    );
    expect(stops[0]).toHaveTextContent('Now');
  });

  it('shows what I did for every job without a click', () => {
    render(<Timeline />);

    JOBS.flatMap(job => job.highlights).forEach(point =>
      expect(screen.getByText(point)).toBeInTheDocument()
    );
  });
});
