import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FieldLog } from '@/components/field-log';
import { JOBS, TRAILHEAD } from '@/content/jobs';
import { SUMMIT_LINE } from '@/content/site';
import { YEAR_STATES, yearTimeline } from '@/scene/seasons';

const newestFirst = [...JOBS].reverse();

/** The log's entries: its list items that are not the phones' window onto the year. */
const entries = () =>
  [
    ...screen
      .getByRole('list', { name: 'Experience, newest first' })
      .querySelectorAll<HTMLLIElement>(':scope > li'),
  ].filter(item => item.getAttribute('aria-hidden') !== 'true');

describe('FieldLog', () => {
  it('lists every job newest first, one entry each, named by its role', () => {
    render(<FieldLog />);

    const articles = screen.getAllByRole('article');
    expect(articles.map(article => article.querySelector('h2')?.textContent)).toEqual(
      newestFirst.map(job => job.role)
    );
    newestFirst.forEach(job =>
      expect(screen.getByRole('article', { name: job.role })).toBeInTheDocument()
    );
    expect(entries()).toHaveLength(JOBS.length);
  });

  it('dates every entry like a log, with no entry numbers', () => {
    render(<FieldLog />);

    newestFirst.forEach(job => {
      const article = screen.getByRole('article', { name: job.role });
      expect(within(article).getByText(`${job.period} · ${job.duration}`)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Entry \d/)).not.toBeInTheDocument();
  });

  it('says no "Now": the date line already says "present"', () => {
    render(<FieldLog />);

    expect(screen.queryByText('Now')).not.toBeInTheDocument();
    expect(screen.getByRole('article', { name: newestFirst[0].role })).toHaveTextContent('present');
  });

  it('opens the rail with the entry not written yet, and closes it where the trail starts', () => {
    render(<FieldLog />);

    const list = screen.getByRole('list', { name: 'Experience, newest first' });
    const top = screen.getByText(SUMMIT_LINE, { exact: false });
    const foot = screen.getByText(`${TRAILHEAD.year} · where the trail starts`);
    expect(top).toHaveTextContent(SUMMIT_LINE);
    expect(list).not.toContainElement(top);
    expect(list).not.toContainElement(foot);
  });

  it('links each company that has a site, in a new tab, and says so', () => {
    render(<FieldLog />);

    JOBS.forEach(job => {
      const article = screen.getByRole('article', { name: job.role });

      if (job.url) {
        const link = within(article).getByRole('link', {
          name: `${job.company} (opens in a new tab)`,
        });
        expect(link).toHaveAttribute('href', job.url);
        expect(link).toHaveAttribute('target', '_blank');
      } else {
        expect(within(article).queryByRole('link')).not.toBeInTheDocument();
      }
    });
  });

  it('shows what I did for every job without a click', () => {
    render(<FieldLog />);

    JOBS.flatMap(job => job.highlights).forEach(point =>
      expect(screen.getByText(point)).toBeInTheDocument()
    );
  });

  it('names a hairline timeline on every entry and on the foot, in reading order', () => {
    const { container } = render(<FieldLog />);

    const named = [...container.querySelectorAll<HTMLElement>('[style*="view-timeline-name"]')];
    expect(named.map(node => node.style.viewTimelineName)).toEqual(
      Array.from({ length: YEAR_STATES - 1 }, (_, i) => yearTimeline(i + 1))
    );
    expect(entries().map(item => item.style.viewTimelineName)).toEqual(
      newestFirst.map((_, i) => yearTimeline(i + 1))
    );
  });
});
