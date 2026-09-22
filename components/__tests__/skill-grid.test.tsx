import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkillGrid } from '@/components/skill-grid';
import { SKILL_GROUPS } from '@/lib/skill-groups';

describe('SkillGrid', () => {
  it('names every category and lists its skills under it', () => {
    render(<SkillGrid groups={SKILL_GROUPS} />);

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(SKILL_GROUPS.length);
    SKILL_GROUPS.forEach((group, i) => {
      expect(screen.getByRole('heading', { level: 3, name: group.name })).toBeInTheDocument();
      const items = within(lists[i]).getAllByRole('listitem');
      expect(items.map(item => item.textContent)).toEqual(group.items.map(skill => skill.name));
    });
  });

  it('puts one decorative icon on every pill', () => {
    render(<SkillGrid groups={SKILL_GROUPS} />);

    screen.getAllByRole('listitem').forEach(item => {
      const icons = item.querySelectorAll('svg');
      expect(icons).toHaveLength(1);
      expect(icons[0]).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
