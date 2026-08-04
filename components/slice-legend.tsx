import { CHART_COLORS } from '@/lib/constants';
import type { Slice } from '@/lib/figures';
import { cn } from '@/lib/utils';

type SliceLegendProps = {
  slices: Slice[];
  className?: string;
};

/** Hand-written legend that replaces the one chart.xkcd draws inside the svg. */
export function SliceLegend({ slices, className }: SliceLegendProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {slices.map((slice, index) => (
        <div key={slice.label} className='flex items-center gap-2'>
          <span
            className='size-[13px] shrink-0 rounded-[3px]'
            style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
          />
          <span className='text-ink-body text-[15px]'>
            {slice.label} — {slice.detail}
          </span>
        </div>
      ))}
    </div>
  );
}
