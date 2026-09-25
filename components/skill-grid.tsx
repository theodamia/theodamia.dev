import { BrandIcon } from '@/components/icons/brand-icon';
import { Pill } from '@/components/ui/pill';
import { Heading } from '@/components/ui/text';
import type { Skill, SkillGroup } from '@/content/skill-groups';

const SKILL_ICON_SIZE = 16;
/* thicker than the dock's 1.75: at 16px that line looks faint beside the filled logos */
const SKILL_ICON_STROKE = 2;
const SKILL_ICON_CLASS = 'text-accent-text shrink-0';

/** Decorative: the pill's text is its name. */
function SkillIcon({ skill }: { skill: Skill }) {
  if ('brand' in skill) {
    return (
      <BrandIcon
        d={skill.brand.path}
        width={SKILL_ICON_SIZE}
        height={SKILL_ICON_SIZE}
        className={SKILL_ICON_CLASS}
      />
    );
  }

  const Icon = skill.icon;

  return (
    <Icon
      size={SKILL_ICON_SIZE}
      strokeWidth={SKILL_ICON_STROKE}
      className={SKILL_ICON_CLASS}
      aria-hidden='true'
    />
  );
}

/** One full-width row per category: its name, then its skills as pills below. Nothing else. */
export function SkillGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className='max-wide:mt-7 mt-[34px] flex flex-col'>
      {groups.map(group => (
        <div
          key={group.name}
          className='border-line max-wide:py-5 flex flex-col gap-3.5 border-t py-6 first:border-t-0 first:pt-0 last:pb-0'
        >
          <Heading as='h3' size='sub'>
            {group.name}
          </Heading>
          <ul className='flex flex-wrap gap-3'>
            {group.items.map(skill => (
              <Pill key={skill.name}>
                <SkillIcon skill={skill} />
                {skill.name}
              </Pill>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
