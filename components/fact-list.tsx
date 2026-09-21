import { Eyebrow } from '@/components/ui/text';
import type { Fact } from '@/lib/about';

export function FactList({ facts }: { facts: Fact[] }) {
  return (
    <dl className='flex flex-col'>
      {facts.map(fact => (
        <div
          key={fact.label}
          className='border-line border-t py-[13px] first:border-t-0 first:pt-0'
        >
          <dt>
            <Eyebrow>{fact.label}</Eyebrow>
          </dt>
          <dd className='text-ink text-[16.5px] leading-[1.45] font-medium'>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
