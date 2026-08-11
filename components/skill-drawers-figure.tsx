import { FigureCard, FigureLabel } from '@/components/figure-card';
import { CHART_COLORS } from '@/lib/constants';
import { MAX_SKILL_SCORE, SKILL_GROUPS } from '@/lib/skill-groups';

/** Fig. 6 — what's in each drawer. */
export function SkillDrawersFigure() {
  return (
    <FigureCard className='col-span-full'>
      <FigureLabel className='mb-[18px]'>
        Fig. 6 — what&rsquo;s in each drawer{' '}
        <span className='text-ink-ghost tracking-[0.04em] normal-case'>
          (depth, self-rated 0–10)
        </span>
      </FigureLabel>

      <div className='flex flex-col gap-5'>
        {SKILL_GROUPS.map((group, index) => (
          <div
            key={group.name}
            className='grid [grid-template-columns:170px_minmax(0,1fr)] items-center gap-x-[18px] gap-y-2 max-[900px]:[grid-template-columns:minmax(0,1fr)] max-[900px]:gap-[9px]'
          >
            <span className='font-hand text-ink-strong text-[20px]'>{group.name}</span>
            <div className='flex items-center gap-2.5'>
              <div className='border-ink/75 hatch-track h-[22px] flex-1 rounded-[3px] border-2'>
                <div
                  className='h-full'
                  style={{
                    width: `${(group.score / MAX_SKILL_SCORE) * 100}%`,
                    background: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
              </div>
              <span className='font-hand text-ink-muted w-[22px] text-[20px]'>{group.score}</span>
            </div>
            <span className='max-[900px]:hidden' />
            <div className='flex flex-wrap gap-1.5'>
              {group.items.map(item => (
                <span
                  key={item}
                  className='border-ink/18 bg-card-alt text-ink-body rounded-[5px] border px-[9px] py-[3px] text-[12.5px]'
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FigureCard>
  );
}
