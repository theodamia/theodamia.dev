import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Climb } from '@/components/climb';
import { JOBS } from '@/lib/jobs';

const root = document.documentElement;
const climbList = () => screen.getByRole('list', { name: 'Experience, oldest first' });
const timeline = () => screen.getByRole('list', { name: 'Experience, newest first' });
const rail = () => screen.getByRole('navigation', { name: 'Jump to a year on the climb' });

describe('Climb', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    root.dataset.view = 'climb';
  });

  afterEach(() => {
    root.removeAttribute('data-view');
  });

  it('lists every job in order, in normal flow over a hidden scene', () => {
    const { container } = render(<Climb hero={<h1>Hero</h1>}>after</Climb>);

    const list = climbList();
    expect(list.querySelectorAll('[data-card]')).toHaveLength(JOBS.length);
    expect(
      within(list)
        .getAllByRole('heading', { level: 2 })
        .map(heading => heading.textContent)
    ).toEqual(JOBS.map(job => job.role));
    expect(container.querySelector('[aria-hidden="true"] svg.scene-layer')).toBeInTheDocument();
  });

  it('makes each stop as tall as the leg that leaves its camp, so long stays scroll longer', () => {
    render(<Climb hero={null}>after</Climb>);

    const heights = [...climbList().querySelectorAll(':scope > li')].map(stop =>
      parseFloat((stop as HTMLElement).style.minHeight)
    );
    expect(heights).toHaveLength(JOBS.length);
    /* six months, one year, three and a half years, four years */
    expect(heights[0]).toBeLessThan(heights[1]);
    expect(heights[1]).toBeLessThan(heights[2]);
    expect(heights[2]).toBeLessThan(heights[3]);
  });

  it('publishes the first stop for the dock once it has measured, and drives the rail', () => {
    const { container } = render(<Climb hero={null}>after</Climb>);

    expect(container.querySelector('#climb')).toHaveAttribute('data-scroll-y');
    expect(rail().querySelectorAll('[style*="transform"]').length).toBeGreaterThan(0);
  });

  it('shows what I did for every job without a click', () => {
    render(<Climb hero={null}>after</Climb>);

    JOBS.flatMap(job => job.highlights).forEach(point =>
      expect(within(climbList()).getByText(point)).toBeInTheDocument()
    );
  });

  it('starts the climb from the scroll cue', async () => {
    render(<Climb hero={null}>after</Climb>);

    await userEvent.click(screen.getByRole('button', { name: /Scroll to climb/ }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: expect.any(Number) });
  });

  it('carries the same jobs as a timeline, newest first', () => {
    render(<Climb hero={null}>after</Climb>);

    const years = [...timeline().querySelectorAll(':scope > li')].map(stop =>
      Number(stop.textContent?.slice(0, 4))
    );
    expect(years).toEqual([...JOBS].reverse().map(job => job.start));
    /* the same card, so the two views never disagree about a job */
    expect(timeline().querySelectorAll('[data-card]')).toHaveLength(JOBS.length);
  });

  it('gives the two copies of a job different element ids', () => {
    const { container } = render(<Climb hero={null}>after</Climb>);

    const ids = [...container.querySelectorAll('[id]')].map(el => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe('in the timeline', () => {
    beforeEach(() => {
      root.dataset.view = 'timeline';
    });

    it('drives nothing: no published position, no transforms left behind', () => {
      const { container } = render(<Climb hero={null}>after</Climb>);

      expect(container.querySelector('#climb')).not.toHaveAttribute('data-scroll-y');
      expect(rail().querySelectorAll('[style*="transform"]')).toHaveLength(0);
    });
  });
});
