import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Climb } from '@/components/climb';
import { JOBS } from '@/lib/jobs';

describe('Climb', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('lists every job in order, in normal flow over a hidden scene', () => {
    const { container } = render(<Climb hero={<h1>Hero</h1>}>after</Climb>);

    const list = screen.getByRole('list', { name: 'Experience, oldest first' });
    expect(list.querySelectorAll('[data-card]')).toHaveLength(JOBS.length);
    expect(screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)).toEqual(
      JOBS.map(job => job.role)
    );
    expect(container.querySelector('[aria-hidden="true"] svg.scene-layer')).toBeInTheDocument();
  });

  it('makes each stop as tall as the leg that leaves its camp, so long stays scroll longer', () => {
    render(<Climb hero={null}>after</Climb>);

    const heights = [
      ...screen
        .getByRole('list', { name: 'Experience, oldest first' })
        .querySelectorAll(':scope > li'),
    ].map(stop => parseFloat((stop as HTMLElement).style.minHeight));
    expect(heights).toHaveLength(JOBS.length);
    /* six months, one year, three and a half years, four years */
    expect(heights[0]).toBeLessThan(heights[1]);
    expect(heights[1]).toBeLessThan(heights[2]);
    expect(heights[2]).toBeLessThan(heights[3]);
  });

  it('publishes the first stop for the dock once it has measured', () => {
    render(<Climb hero={null}>after</Climb>);

    expect(screen.getByRole('list', { name: 'Experience, oldest first' })).toHaveAttribute(
      'data-scroll-y'
    );
  });

  it('shows what I did for every job without a click', () => {
    render(<Climb hero={null}>after</Climb>);

    JOBS.flatMap(job => job.highlights).forEach(point =>
      expect(screen.getByText(point)).toBeInTheDocument()
    );
  });

  it('starts the climb from the scroll cue', async () => {
    render(<Climb hero={null}>after</Climb>);

    await userEvent.click(screen.getByRole('button', { name: /Scroll to climb/ }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: expect.any(Number) });
  });
});
