/** Series colours for the two small charts on /about, in slice order. */
const SERIES_COLORS = [
  'var(--color-accent)',
  'var(--color-lake-fill)',
  'var(--color-ink-2)',
  'var(--color-sun)',
  'var(--color-mist)',
] as const;
import { Heading } from '@/components/ui/text';
import type { WeekSlice } from '@/content/about';

const colorFor = (index: number) => SERIES_COLORS[index % SERIES_COLORS.length];

/** One stacked bar and its legend. The notes are always visible, so nothing depends on hovering. */
export function WeekSplit({ week }: { week: WeekSlice[] }) {
  return (
    <div>
      <Heading as='h3' size='sub'>
        Where a week goes
      </Heading>
      <div aria-hidden='true' className='mt-4 flex h-4 gap-[3px]'>
        {week.map((slice, i) => (
          <span
            key={slice.label}
            className='block h-full rounded-[5px]'
            style={{ width: `${slice.share}%`, background: colorFor(i) }}
          />
        ))}
      </div>
      <ul className='mt-[18px] flex flex-col gap-2.5'>
        {week.map((slice, i) => (
          <li
            key={slice.label}
            className='text-ink-2 grid grid-cols-[12px_minmax(0,1fr)] items-baseline gap-3 text-[16px] leading-normal'
          >
            <span
              aria-hidden='true'
              className='block size-3 rounded-[4px]'
              style={{ background: colorFor(i) }}
            />
            <span>
              <span className='text-ink font-semibold'>
                {slice.label}, {slice.share}%.
              </span>{' '}
              {slice.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
