import type React from 'react';

/**
 * The name over a dock item, shown on hover or keyboard focus (the item must be a `group`). Decorative: the item
 * carries its own accessible name.
 */
export function DockBubble({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden='true'
      className='bg-ink shadow-soft ease-soft text-on-ink pointer-events-none absolute bottom-[calc(100%+13px)] left-1/2 origin-bottom -translate-x-1/2 translate-y-1.5 scale-[0.94] rounded-full px-[11px] pt-[5px] pb-1.5 text-[13.5px] leading-[1.3] font-semibold whitespace-nowrap opacity-0 transition-[opacity,translate,scale] duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[80ms] group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 after:absolute after:top-full after:left-1/2 after:-mt-[5px] after:-ml-1 after:size-2 after:rotate-45 after:rounded-[2px] after:bg-inherit motion-reduce:transition-none'
    >
      {children}
    </span>
  );
}
