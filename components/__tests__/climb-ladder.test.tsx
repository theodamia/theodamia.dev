import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClimbLadder } from '@/components/climb-ladder';
import { MILESTONES } from '@/lib/milestones';

describe('ClimbLadder', () => {
  it('lists every milestone summit first', () => {
    render(<ClimbLadder onSelect={vi.fn()} />);

    const rows = screen.getAllByRole('button');
    expect(rows).toHaveLength(MILESTONES.length);
    expect(rows[0]).toHaveTextContent(MILESTONES[MILESTONES.length - 1].title);
    expect(rows[rows.length - 1]).toHaveTextContent(MILESTONES[0].title);
  });

  it('reports the index of the tapped step', async () => {
    const onSelect = vi.fn();
    render(<ClimbLadder onSelect={onSelect} />);

    await userEvent.click(screen.getAllByRole('button')[0]);

    expect(onSelect).toHaveBeenCalledWith(MILESTONES.length - 1);
  });
});
