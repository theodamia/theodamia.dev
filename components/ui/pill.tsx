import type React from 'react';
import { cn } from '@/utils/cn';

/** A skill in the Skills section: its logo, then its name. Never interactive, so it is a plain list item. */
export function Pill({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn(
        'bg-ice text-ink max-wide:text-[15px] inline-flex h-[34px] items-center gap-2 rounded-full pr-[15px] pl-3 text-[15.5px] leading-normal font-medium whitespace-nowrap',
        className
      )}
      {...props}
    />
  );
}
