import { describe, expect, it } from 'vitest';
import { WEEK, OPINIONS, EDUCATION, SUMMARY_FACTS } from '@/lib/about';
import { DOCK_ITEMS, dockHref } from '@/lib/dock-items';
import { JOBS } from '@/lib/jobs';
import { SKILL_GROUPS } from '@/lib/skill-groups';

/* everything is on the card at once, so the words have to stay short */
const MAX_SUMMARY = 150;
const MIN_HIGHLIGHTS = 2;
const MAX_HIGHLIGHTS = 3;
const MAX_HIGHLIGHT = 72;
/* a curated pack, not a keyword list */
const MAX_SKILLS_PER_GROUP = 8;

describe('jobs', () => {
  it('uses each start year once, oldest first', () => {
    const years = JOBS.map(job => job.start);
    expect(new Set(years).size).toBe(years.length);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
  });

  it('grows: every level is higher than the one before', () => {
    JOBS.slice(1).forEach((job, i) => expect(job.level).toBeGreaterThan(JOBS[i].level));
  });

  it('keeps the copy short enough to read at a glance', () => {
    JOBS.forEach(job => {
      expect(job.summary.length).toBeLessThanOrEqual(MAX_SUMMARY);
      expect(job.highlights.length).toBeGreaterThanOrEqual(MIN_HIGHLIGHTS);
      expect(job.highlights.length).toBeLessThanOrEqual(MAX_HIGHLIGHTS);
      job.highlights.forEach(point => expect(point.length).toBeLessThanOrEqual(MAX_HIGHLIGHT));
    });
  });

  it('gives every job a tenure, which sizes the leg that leaves its camp', () => {
    JOBS.forEach(job => expect(job.years).toBeGreaterThan(0));
  });
});

describe('about', () => {
  it('splits the week into exactly 100%, largest share first', () => {
    expect(WEEK.reduce((sum, slice) => sum + slice.share, 0)).toBe(100);
    WEEK.slice(1).forEach((slice, i) => expect(slice.share).toBeLessThanOrEqual(WEEK[i].share));
  });

  it('keeps opinions between "it depends" and "every time", strongest first', () => {
    OPINIONS.forEach((opinion, i) => {
      expect(opinion.holds).toBeGreaterThan(0);
      expect(opinion.holds).toBeLessThanOrEqual(1);
      if (i) expect(opinion.holds).toBeLessThanOrEqual(OPINIONS[i - 1].holds);
    });
  });

  it('finds every fact the Experience page summarises, so a rename cannot go quiet', () => {
    expect(SUMMARY_FACTS.map(fact => fact.label)).toEqual(['Experience', 'Based in', 'Languages']);
  });

  it('still finds the degree the printed CV carries under the jobs', () => {
    expect(EDUCATION?.value).toBeTruthy();
  });

  it('lists every skill once', () => {
    const skills = SKILL_GROUPS.flatMap(group => group.items.map(skill => skill.name));
    expect(new Set(skills).size).toBe(skills.length);
  });

  it('keeps every skill group short enough to scan', () => {
    SKILL_GROUPS.forEach(group =>
      expect(group.items.length).toBeLessThanOrEqual(MAX_SKILLS_PER_GROUP)
    );
  });
});

describe('dock items', () => {
  it('links sections with a hash, and whole pages without one', () => {
    expect(DOCK_ITEMS.map(dockHref)).toEqual([
      '/',
      '/cv',
      '/about#about',
      '/about#skills',
      '/about#contact',
    ]);
  });
});
