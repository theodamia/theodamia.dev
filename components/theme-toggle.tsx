'use client';

import { Moon, Sun } from 'lucide-react';
import { DOCK_ICON_STROKE } from '@/constants';
import { DockBubble } from '@/components/dock-bubble';
import { useFollowSystemTheme, useTheme } from '@/hooks/use-theme';
import { switchTheme } from '@/lib/theme';
import { cn } from '@/utils/cn';

/** Both icons sit in the same place; the one not in use is turned away and shrunk to nothing. */
const ICON =
  'absolute transition-[rotate,scale,opacity] duration-300 ease-pop motion-reduce:transition-none';

/**
 * Day and night, at the end of the dock. The icon is where the click takes you: a moon by day, a sun at night. The
 * icons follow `data-theme` through CSS, so they are right from the first paint; the name and the bubble come from
 * the theme store and settle right after hydration. The reveal itself is in `lib/theme.ts`.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const night = useTheme() === 'dark';
  useFollowSystemTheme();

  return (
    <button
      type='button'
      aria-label={night ? 'Switch to day' : 'Switch to night'}
      onClick={event => switchTheme(event.currentTarget)}
      className={cn(
        'group rounded-ctl text-ink-2 hover:bg-ice hover:text-ink relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200 motion-reduce:transition-none',
        className
      )}
    >
      <Moon
        aria-hidden='true'
        strokeWidth={DOCK_ICON_STROKE}
        className={cn(ICON, 'dark:scale-0 dark:rotate-90 dark:opacity-0')}
      />
      <Sun
        aria-hidden='true'
        strokeWidth={DOCK_ICON_STROKE}
        className={cn(
          ICON,
          'scale-0 -rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100'
        )}
      />
      <DockBubble>{night ? 'Day' : 'Night'}</DockBubble>
    </button>
  );
}
