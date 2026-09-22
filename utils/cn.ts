import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names. `clsx` flattens the conditionals; `twMerge` then drops any Tailwind utility an later one
 * overrides (`px-5` beats an earlier `px-4`), which plain string joining cannot do: that is what lets a caller
 * pass a `className` that wins over a component's own classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
