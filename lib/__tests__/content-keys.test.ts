import { describe, expect, it } from 'vitest';
import { COFFEE, LANGUAGES, OPINIONS, STATS, TENURE, TRIVIA, WEEK_SPLIT } from '@/lib/figures';
import { MILESTONES, ROLE_BANDS } from '@/lib/milestones';
import { PANEL_KEYS, PANELS } from '@/lib/panels';
import { SKILL_GROUPS } from '@/lib/skill-groups';

/**
 * Every list in the CV data is rendered with its own text as the React key, so a repeated
 * entry shows up as a duplicate-key warning in the browser instead of failing here. These
 * tests keep that a red build rather than a console message someone has to notice.
 */
function duplicatesIn(values: (string | number)[]) {
  const seen = new Set<string | number>();
  return values.filter(value => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  });
}

describe('skill groups', () => {
  it('names each group once', () => {
    expect(duplicatesIn(SKILL_GROUPS.map(group => group.name))).toEqual([]);
  });

  it.each(SKILL_GROUPS.map(group => [group.name, group.items] as const))(
    'lists every %s item once',
    (_name, items) => {
      expect(duplicatesIn(items)).toEqual([]);
    }
  );
});

describe('figure data', () => {
  it('keeps donut slice labels unique', () => {
    expect(duplicatesIn(TENURE.map(slice => slice.label))).toEqual([]);
    expect(duplicatesIn(WEEK_SPLIT.map(slice => slice.label))).toEqual([]);
  });

  it('keeps the remaining keyed lists unique', () => {
    expect(duplicatesIn(OPINIONS.map(opinion => opinion.name))).toEqual([]);
    expect(duplicatesIn(COFFEE.map(phase => phase.phase))).toEqual([]);
    expect(duplicatesIn(LANGUAGES.map(language => language.name))).toEqual([]);
    expect(duplicatesIn(TRIVIA.map(item => item.label))).toEqual([]);
    expect(duplicatesIn(STATS.map(stat => stat.label))).toEqual([]);
  });
});

describe('climb data', () => {
  it('keys milestones by a unique year', () => {
    expect(duplicatesIn(MILESTONES.map(milestone => milestone.year))).toEqual([]);
  });

  it('keys role bands by a unique level', () => {
    expect(duplicatesIn(ROLE_BANDS.map(band => band.level))).toEqual([]);
  });

  it.each(MILESTONES.map(milestone => [milestone.title, milestone.tags] as const))(
    'tags %s without repeats',
    (_title, tags) => {
      expect(duplicatesIn(tags)).toEqual([]);
    }
  );
});

describe('words panels', () => {
  it.each(PANEL_KEYS)('keeps the %s panel body and chips unique', key => {
    expect(duplicatesIn(PANELS[key].body)).toEqual([]);
    expect(duplicatesIn(PANELS[key].chips)).toEqual([]);
  });
});
