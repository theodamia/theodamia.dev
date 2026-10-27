import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import About from '@/app/about/page';
import { FACTS, OPINIONS, holdsInWords, WEEK } from '@/content/about';
import { SKILL_GROUPS } from '@/content/skill-groups';

describe('/about', () => {
  it('opens on the header /cv opens on: the page named as the dock names it, the title and the one action', () => {
    render(<About />);

    const header = screen.getByRole('banner');
    expect(within(header).getByText('About')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Behind the climb' })).toBeInTheDocument();
    expect(within(header).getByRole('link', { name: 'Email me' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:/)
    );
  });

  it('reads every fact once, beside the About text and not in the header', () => {
    render(<About />);

    const header = screen.getByRole('banner');
    const about = screen.getByRole('region', { name: 'Building things that have to last' });
    FACTS.forEach(fact => {
      expect(within(about).getByText(fact.value)).toBeInTheDocument();
      expect(within(header).queryByText(fact.value)).not.toBeInTheDocument();
    });
  });

  it('links the AI opinion to the page that shows it in practice', () => {
    render(<About />);

    expect(
      screen.getByRole('link', { name: 'AI writes the draft, not the decisions' })
    ).toHaveAttribute('href', '/ai');
  });

  it('keeps the sections the dock links to, each named by its heading', () => {
    render(<About />);

    for (const [id, title] of [
      ['background', 'Building things that have to last'],
      ['work', 'What ten years have settled into'],
      ['skills', 'What is in the pack'],
      ['contact', 'Putting a team together?'],
    ]) {
      const section = screen.getByRole('region', { name: title });
      expect(section).toHaveAttribute('id', id);
    }
  });

  it('says how often every opinion holds in words, and lists the week and every skill', () => {
    render(<About />);
    const work = screen.getByRole('region', { name: 'What ten years have settled into' });
    const skills = screen.getByRole('region', { name: 'What is in the pack' });

    OPINIONS.forEach(opinion => expect(screen.getByText(opinion.name)).toBeInTheDocument());

    for (const words of new Set(OPINIONS.map(opinion => holdsInWords(opinion.holds).words))) {
      expect(screen.getAllByText(words).length).toBeGreaterThan(0);
    }

    WEEK.forEach(slice => {
      const row = within(work).getByText(slice.label).closest('li');
      expect(row).toHaveTextContent(`${slice.share}%`);
      expect(row).toHaveTextContent(slice.note);
    });
    SKILL_GROUPS.forEach(group =>
      group.items.forEach(skill => expect(within(skills).getByText(skill.name)).toBeInTheDocument())
    );
  });

  it('answers contact made, once: the saucer is cued only by copying the address or "Email me"', () => {
    render(<About />);
    const finale = screen.getByRole('region', { name: 'Putting a team together?' });

    fireEvent.click(within(finale).getByText('Remote', { exact: false }));
    expect(finale).not.toHaveAttribute('data-contact');

    fireEvent.click(within(finale).getByRole('link', { name: 'Email me' }));
    expect(finale).toHaveAttribute('data-contact');
  });
});
