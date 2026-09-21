import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/** Chips sit on job cards (squarer, quieter); pills sit in the Skills section (round, a size up). Never interactive. */
const chipVariants = cva('bg-ice leading-normal font-medium', {
  variants: {
    shape: {
      chip: 'rounded-chip text-ink-2 px-[11px] py-1 text-[14.5px]',
      pill: 'text-ink rounded-full px-[15px] py-1.5 text-[15.5px] whitespace-nowrap max-[899px]:px-[13px] max-[899px]:py-[5px] max-[899px]:text-[15px]',
    },
  },
  defaultVariants: { shape: 'chip' },
});

type ChipProps = React.HTMLAttributes<HTMLLIElement> & VariantProps<typeof chipVariants>;

export function Chip({ shape, className, ...props }: ChipProps) {
  return <li className={cn(chipVariants({ shape }), className)} {...props} />;
}
