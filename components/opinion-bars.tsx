import { Eyebrow, Heading } from '@/components/ui/text';
import type { Opinion } from '@/lib/about';

const percent = (share: number) => `${(share * 100).toFixed(1)}%`;

/** Read-only sliders: how often each opinion holds, from "it depends" to "every time". */
export function OpinionBars({ opinions }: { opinions: Opinion[] }) {
  return (
    <div>
      <Heading as='h3' size='sub'>
        Opinions, by how often they hold
      </Heading>
      <ul>
        {opinions.map(opinion => (
          <li key={opinion.name} className='mt-[18px]'>
            <p className='text-ink text-[16.5px] leading-[1.45] font-medium'>{opinion.name}</p>
            <div
              role='img'
              aria-label={`Holds about ${Math.round(opinion.holds * 100)}% of the time`}
              className='bg-ice relative mt-2.5 h-1.5 rounded-[3px]'
            >
              <span
                className='bg-lake-fill absolute top-0 left-0 h-full rounded-[3px]'
                style={{ width: percent(opinion.holds) }}
              />
              <span
                className='bg-accent border-card absolute top-1/2 -mt-[9px] -ml-[9px] size-[18px] rounded-full border-[3px] shadow-[0_2px_6px_color-mix(in_oklab,var(--color-shade)_40%,transparent)]'
                style={{ left: percent(opinion.holds) }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className='mt-3 flex justify-between'>
        <Eyebrow>It depends</Eyebrow>
        <Eyebrow>Every time</Eyebrow>
      </div>
    </div>
  );
}
