'use client';

import { CLIMB, LADDER_COLORS } from '@/lib/constants';
import { bandForLevel, MILESTONES } from '@/lib/milestones';

type ClimbLadderProps = {
  onSelect: (index: number) => void;
};

/**
 * Fig. 1 on phones. chart.xkcd's forced aspect ratio and the measured overlays do not
 * survive a narrow viewport, so the climb becomes a step ladder — summit first.
 */
export function ClimbLadder({ onSelect }: ClimbLadderProps) {
  const steps = MILESTONES.map((milestone, index) => ({ milestone, index })).reverse();

  return (
    <div className='flex flex-col gap-0.5'>
      {steps.map(({ milestone, index }) => (
        <button
          key={milestone.year}
          type='button'
          onClick={() => onSelect(index)}
          className='border-ink/20 cursor-pointer border-b border-dashed px-0.5 py-3 text-left'
        >
          <span className='flex items-baseline justify-between gap-3'>
            <span className='font-hand text-ink-strong text-[20px] leading-[1.1]'>
              {milestone.title}
            </span>
            <span className='text-ink-ghost shrink-0 font-mono text-[10.5px] tracking-[0.14em]'>
              {milestone.year}
            </span>
          </span>
          <span className='mt-[7px] flex items-center gap-[9px]'>
            <span className='border-ink/70 hatch-track-wide h-3.5 flex-1 rounded-[3px] border-2'>
              <span
                className='block h-full'
                style={{
                  width: `${((milestone.level / CLIMB.TOP_LEVEL) * 100).toFixed(1)}%`,
                  background: LADDER_COLORS[index % LADDER_COLORS.length],
                }}
              />
            </span>
            <span className='text-ink-ghost w-[58px] font-mono text-[9.5px] tracking-[0.1em] uppercase'>
              {bandForLevel(milestone.level)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
