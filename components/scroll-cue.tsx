import { ArrowDown } from 'lucide-react';
import { cn } from '@/utils/cn';

/** The arrow: a touch heavier than the dock's icons, since it sits beside bold text. */
const ARROW = { SIZE: 17, STROKE: 2.25 } as const;

type ScrollCueProps = {
  /** True once the page has moved: the cue steps aside rather than being unmounted. */
  gone: boolean;
  onStart: () => void;
};

/**
 * The nudge at the foot of the first screen, until the page moves and it is not needed any more. It says what it
 * does, not which gesture to make: it is a button (it takes you to the first camp), and the arrow shows the way.
 * The arrow is an icon, not a text glyph, so it sits on the text's centre line, and it bobs evenly either side of
 * that line rather than below it.
 */
export function ScrollCue({ gone, onStart }: ScrollCueProps) {
  return (
    <button
      type='button'
      onClick={onStart}
      tabIndex={gone ? -1 : 0}
      aria-hidden={gone || undefined}
      className={cn(
        'border-line shadow-soft text-ink hover:border-ink bg-card ease-soft fixed bottom-[114px] left-1/2 z-[80] inline-flex min-h-11 -translate-x-1/2 cursor-pointer items-center gap-[9px] rounded-full border px-5 text-[15.5px] font-semibold whitespace-nowrap transition-[opacity,translate,border-color] duration-[350ms] motion-reduce:transition-none',
        gone && 'pointer-events-none translate-y-2.5 opacity-0'
      )}
    >
      Start the climb
      <ArrowDown
        size={ARROW.SIZE}
        strokeWidth={ARROW.STROKE}
        aria-hidden='true'
        className='text-accent-text motion-safe:animate-bob shrink-0'
      />
    </button>
  );
}
