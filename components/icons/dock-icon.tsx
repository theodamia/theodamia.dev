import type React from 'react';

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'children'>;

/**
 * Shell for hand-drawn dock icons (today only the ice axe: Lucide has none), matched to Lucide's style: a 24px
 * grid, 1.75 stroke, round caps and joins. They take the colour of the button they sit in. Always decorative: the
 * button carries the name.
 */
export function DockIcon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox='0 0 24 24'
      width={24}
      height={24}
      fill='none'
      stroke='currentColor'
      strokeWidth={1.75}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      focusable='false'
      {...props}
    >
      {children}
    </svg>
  );
}
