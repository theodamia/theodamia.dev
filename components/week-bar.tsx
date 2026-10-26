import type React from 'react';
import { Eyebrow } from '@/components/ui/text';
import type { WeekSlice } from '@/content/about';
import { cn } from '@/utils/cn';

/**
 * How strongly each slice is inked after the first, which is the accent: the week reads from what takes most of it
 * to what takes least, in one colour and one orange, rather than five colours to decode.
 */
const SHADES = [1, 0.78, 0.56, 0.38, 0.24];

const shade = (i: number) =>
  ({ opacity: SHADES[Math.min(i, SHADES.length - 1)] }) as React.CSSProperties;

/**
 * Where a week goes: one proportion bar, then each slice as a row (its name, its share, its note), lined up so the
 * eye can run down the shares. The bar is decoration; the rows say it.
 */
export function WeekBar({ week }: { week: WeekSlice[] }) {
  return (
    <div className='mt-12'>
      <Eyebrow as='h3'>Where a week goes</Eyebrow>
      <div aria-hidden='true' className='mt-[18px] flex h-2.5 max-w-[760px] gap-[3px]'>
        {week.map((slice, i) => (
          <i
            key={slice.label}
            className={cn('block rounded-[3px]', i === 0 ? 'bg-accent' : 'bg-ink')}
            style={{ flex: slice.share, ...(i === 0 ? {} : shade(i)) }}
          />
        ))}
      </div>
      <ul className='mt-[18px] max-w-[760px]'>
        {week.map((slice, i) => (
          <li
            key={slice.label}
            className='border-line wide:grid-cols-[14px_190px_52px_minmax(0,1fr)] grid grid-cols-[14px_minmax(0,1fr)_52px] items-baseline gap-x-3.5 border-t py-[11px] text-[16px]'
          >
            <i
              aria-hidden='true'
              className={cn('size-2.5 self-center rounded-[3px]', i === 0 ? 'bg-accent' : 'bg-ink')}
              style={i === 0 ? undefined : shade(i)}
            />
            <span className='text-ink font-semibold'>{slice.label}</span>
            <span className='text-ink-3 text-right font-semibold'>{slice.share}%</span>
            <span className='text-ink-2 max-wide:col-start-2 max-wide:col-end-[-1]'>
              {slice.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
