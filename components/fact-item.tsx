import { Eyebrow } from '@/components/ui/text';
import type { Fact } from '@/content/about';
import { cn } from '@/utils/cn';

/**
 * One fact of a `<dl>`: its label as a caption, its value in ink. The list around it sets the layout (a row on /cv,
 * a row under /about's title, a column beside its text); `className` is the value's, for its measure.
 */
export function FactItem({ fact, className }: { fact: Fact; className?: string }) {
  return (
    <div>
      <Eyebrow as='dt'>{fact.label}</Eyebrow>
      <dd className={cn('text-ink mt-1 text-[16.5px] leading-[1.45] font-medium', className)}>
        {fact.value}
      </dd>
    </div>
  );
}
