import { Chip } from '@/components/ui/chip';
import { Heading } from '@/components/ui/text';
import type { SkillGroup } from '@/lib/skill-groups';

/** A category name, then its skills as rounded pills. Nothing else. */
export function SkillGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className='mt-[34px] grid grid-cols-2 gap-x-[52px] gap-y-10 max-[899px]:mt-7 max-[899px]:grid-cols-1 max-[899px]:gap-[30px]'>
      {groups.map(group => (
        <div key={group.name}>
          <Heading as='h3' size='sub'>
            {group.name}
          </Heading>
          <ul className='mt-3.5 flex flex-wrap gap-2'>
            {group.items.map(item => (
              <Chip key={item} shape='pill'>
                {item}
              </Chip>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
