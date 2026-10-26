import { BrandIcon } from '@/components/icons/brand-icon';
import type { Skill, SkillGroup } from '@/content/skill-groups';

const SKILL_ICON_SIZE = 16;
/* thicker than the dock's 1.75: at 16px that line looks faint beside the filled logos */
const SKILL_ICON_STROKE = 2;
const SKILL_ICON_CLASS = 'text-accent-text shrink-0';

/** Decorative: the line's text is its name. */
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

/**
 * The groups side by side, three across on wide screens: each its name over a hairline, then its skills as a plain
 * list, a logo (or a symbol, for a practice) beside each name. Lists, not pills: a column scans down faster than a
 * wall of capsules scans across.
 */
export function SkillColumns({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className='wide:grid-cols-2 grid grid-cols-1 gap-x-12 gap-y-10 min-[1100px]:grid-cols-3'>
      {groups.map(group => (
        <div key={group.name}>
          <h3 className='text-ink border-line border-b pb-2.5 text-[16.5px] leading-[1.4] font-semibold'>
            {group.name}
          </h3>
          <ul className='mt-3 flex flex-col gap-[9px]'>
            {group.items.map(skill => (
              <li
                key={skill.name}
                className='text-ink flex items-center gap-2.5 text-[16.5px] font-medium'
              >
                <SkillIcon skill={skill} />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
