'use client';

import { List, Mountain } from 'lucide-react';
import { DOCK_ICON_STROKE } from '@/constants';
import { DockBubble } from '@/components/dock-bubble';
import { useView } from '@/hooks/use-view';
import { switchView } from '@/lib/view';
import { cn } from '@/utils/cn';

/** Both icons sit in the same place; the one not in use is turned away and shrunk to nothing. */
const ICON =
  'absolute transition-[rotate,scale,opacity] duration-300 ease-pop motion-reduce:transition-none';

/**
 * The climb or the plain timeline, at the end of the dock. As with day and night, the icon is where the click
 * takes you, and it is picked by CSS from `data-view` so it is right from the first paint; the name and the
 * bubble come from the store and settle after hydration. The switch itself is in `lib/view.ts`.
 */
export function ViewToggle({ className }: { className?: string }) {
  const timeline = useView() === 'timeline';

  return (
    <button
      type='button'
      aria-label={timeline ? 'Show the climb' : 'Show the plain timeline'}
      onClick={() => switchView()}
      className={cn(
        'group rounded-ctl text-ink-2 hover:bg-ice hover:text-ink relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200 motion-reduce:transition-none',
        className
      )}
    >
      <List
        aria-hidden='true'
        strokeWidth={DOCK_ICON_STROKE}
        className={cn(ICON, 'timeline:scale-0 timeline:rotate-90 timeline:opacity-0')}
      />
      <Mountain
        aria-hidden='true'
        strokeWidth={DOCK_ICON_STROKE}
        className={cn(
          ICON,
          'scale-0 -rotate-90 opacity-0',
          'timeline:scale-100 timeline:rotate-0 timeline:opacity-100'
        )}
      />
      <DockBubble>{timeline ? 'Climb' : 'Timeline'}</DockBubble>
    </button>
  );
}
