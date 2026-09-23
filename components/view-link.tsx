'use client';

import type React from 'react';
import { switchView } from '@/lib/view';
import { cn } from '@/utils/cn';

type ViewLinkProps = Omit<React.ComponentProps<'button'>, 'onClick' | 'type'>;

/**
 * The quiet way between the two views: offered once beside the scroll cue, and again at the head of the timeline
 * so the way back is never only the dock. The dock's switch is the permanent control; this is the invitation.
 */
export function ViewLink({ children, className, ...props }: ViewLinkProps) {
  return (
    <button
      type='button'
      onClick={() => switchView()}
      className={cn(
        'text-ink-3 hover:text-ink cursor-pointer text-[15px] font-semibold underline decoration-dotted underline-offset-4 transition-colors duration-200 motion-reduce:transition-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
