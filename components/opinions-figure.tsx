import { FigureCard, FigureCaption, FigureLabel } from '@/components/figure-card';
import { CHART_COLORS } from '@/lib/constants';
import { OPINIONS } from '@/lib/figures';

/** Fig. 3 — opinions, held loosely. */
export function OpinionsFigure() {
  return (
    <FigureCard className='flex flex-col'>
      <FigureLabel className='mb-1'>Fig. 3 — opinions, held loosely</FigureLabel>

      <div className='text-ink-ghost mt-3.5 mb-4 flex justify-between gap-2.5 font-mono text-[9.5px] tracking-[0.14em] uppercase'>
        <span>depends</span>
        <span>every time</span>
      </div>

      <div className='flex flex-col gap-[17px]'>
        {OPINIONS.map((opinion, index) => (
          <div key={opinion.name} className='flex flex-col gap-[7px]'>
            <span className='font-hand text-ink-strong text-[19px] leading-[1.15]'>
              {opinion.name}
            </span>
            <div className='relative h-3.5'>
              <div className='dashed-scale absolute inset-x-0 top-1.5 h-0.5' />
              <div className='bg-ink/35 absolute top-px left-0 h-3 w-0.5' />
              <div className='bg-ink/35 absolute top-px right-0 h-3 w-0.5' />
              <div
                className='border-ink absolute top-0 -ml-[7px] size-3.5 rounded-full border-[2.5px]'
                style={{
                  left: `${(opinion.position * 100).toFixed(1)}%`,
                  background: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <FigureCaption className='mt-auto pt-[18px]'>
        Strong opinions, weakly held — the codebase gets a vote too.
      </FigureCaption>
    </FigureCard>
  );
}
