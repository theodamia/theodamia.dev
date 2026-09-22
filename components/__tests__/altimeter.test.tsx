import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Altimeter } from '@/components/altimeter';
import { JOBS, TRAILHEAD } from '@/lib/jobs';
import { SUMMIT_LINE } from '@/lib/site';

function renderAltimeter(job: number, onJump = vi.fn()) {
  const { container } = render(
    <Altimeter
      job={job}
      year={job < 0 ? TRAILHEAD.year : JOBS[job].start}
      onJump={onJump}
      railRef={null}
      needleRef={null}
      walkedRef={null}
    />
  );
  const rail = screen.getByRole('navigation', { name: 'Jump to a year on the climb' });

  return { onJump, rail, container };
}

describe('Altimeter', () => {
  it('marks the start and every stop with its year and where it was', () => {
    const { rail } = renderAltimeter(1);

    const marks = within(rail).getAllByRole('button');
    expect(marks).toHaveLength(JOBS.length + 1);
    expect(marks[0]).toHaveTextContent(`${TRAILHEAD.year}${TRAILHEAD.label}`);
    JOBS.forEach((job, i) => {
      expect(marks[i + 1]).toHaveTextContent(String(job.start));
      expect(marks[i + 1]).toHaveTextContent(job.place);
    });
    expect(
      within(rail).getByRole('button', { name: /^2018, Frontend Software Engineer at Geekbot/ })
    ).toBe(marks[3]);
  });

  it('lights the current stop and fills the nodes of the stops reached', () => {
    const { rail, container } = renderAltimeter(1);

    expect(within(rail).getByRole('button', { name: /^2016,/ })).toHaveAttribute(
      'aria-current',
      'true'
    );
    expect(within(rail).getByRole('button', { name: /^2018,/ })).not.toHaveAttribute(
      'aria-current'
    );
    const nodes = [...container.querySelectorAll('[data-reached]')].map(node =>
      node.getAttribute('data-reached')
    );
    expect(nodes).toEqual(['true', 'true', 'true', 'false', 'false', 'false']);
  });

  it('lights the start while still at the trailhead', () => {
    const { rail, container } = renderAltimeter(-1);

    expect(rail.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(within(rail).getByRole('button', { name: /start of the trail/ })).toHaveAttribute(
      'aria-current',
      'true'
    );
    expect(container.querySelectorAll('[data-reached="true"]')).toHaveLength(1);
  });

  it('says Now on the present, with no separate card for it', () => {
    const { rail } = renderAltimeter(0);

    const now = within(rail).getByRole('button', { name: /^Now:/ });
    expect(now).toHaveTextContent(`Now · ${JOBS[JOBS.length - 1].start}`);
    expect(screen.getAllByRole('button', { name: /^Now/ })).toHaveLength(1);
    expect(screen.getByText(SUMMIT_LINE)).toBeInTheDocument();
  });

  it('jumps to a stop, or back to the start', async () => {
    const { onJump, rail } = renderAltimeter(0);

    await userEvent.click(within(rail).getByRole('button', { name: /^2018,/ }));
    expect(onJump).toHaveBeenCalledWith(2);

    await userEvent.click(within(rail).getByRole('button', { name: /start of the trail/ }));
    expect(onJump).toHaveBeenCalledWith(-1);
  });

  it('tells narrow screens the year and where they are', () => {
    renderAltimeter(3);
    expect(screen.getAllByText(JOBS[3].place).length).toBeGreaterThan(1);
  });
});
