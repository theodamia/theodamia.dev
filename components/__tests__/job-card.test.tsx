import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JobCard } from '@/components/job-card';
import { JOBS, type Job } from '@/content/jobs';

const job = JOBS[2];

function renderCard(card: Job = job) {
  render(<JobCard job={card} index={2} />);
}

describe('JobCard', () => {
  it('shows what the job was: number, role, period and summary', () => {
    renderCard();

    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: job.role })).toBeInTheDocument();
    expect(screen.getByText(`${job.period} · ${job.duration}`)).toBeInTheDocument();
    expect(screen.getByText(job.summary)).toBeInTheDocument();
  });

  it('shows what I did in its own labelled panel, with nothing behind a button', () => {
    renderCard();

    const panel = screen.getByRole('region', { name: 'What I did' });
    job.highlights.forEach(point => expect(panel).toHaveTextContent(point));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText('Picked up here')).not.toBeInTheDocument();
  });

  it('links the company name once, and only when it has a site', () => {
    renderCard();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', job.url);
    expect(links[0]).toHaveAccessibleName(`${job.company} (opens in a new tab)`);
  });

  it('names a company without a site in plain text', () => {
    renderCard(JOBS[0]);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(JOBS[0].company)).toBeInTheDocument();
  });
});
