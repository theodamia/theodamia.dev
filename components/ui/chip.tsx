import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/**
 * Chips sit on job cards (squarer, quieter); pills sit in the Skills section (round, a size up, an icon before the
 * name). Never interactive.
 */
const chipVariants = cva('bg-ice leading-normal font-medium', {
  variants: {
    shape: {
      chip: 'rounded-chip text-ink-2 px-[11px] py-1 text-[14.5px]',
      pill: 'text-ink inline-flex h-[34px] items-center gap-2 rounded-full pr-[15px] pl-3 text-[15.5px] whitespace-nowrap max-[899px]:text-[15px]',
    },
  },
  defaultVariants: { shape: 'chip' },
});

type ChipProps = React.HTMLAttributes<HTMLLIElement> & VariantProps<typeof chipVariants>;

export function Chip({ shape, className, ...props }: ChipProps) {
  return <li className={cn(chipVariants({ shape }), className)} {...props} />;
}
