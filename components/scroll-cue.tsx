import { cn } from '@/utils/cn';

type ScrollCueProps = {
  /** Once the page is moving the cue steps aside. */
  gone: boolean;
  onStart: () => void;
};

/** A real button just above the dock on the first screen. Click it and the climb starts. */
export function ScrollCue({ gone, onStart }: ScrollCueProps) {
  return (
    <button
      type='button'
      onClick={onStart}
      tabIndex={gone ? -1 : 0}
      aria-hidden={gone || undefined}
      className={cn(
        'border-line shadow-soft text-ink hover:border-ink bg-card fixed bottom-[114px] left-1/2 z-[80] inline-flex min-h-11 -translate-x-1/2 cursor-pointer items-center gap-[9px] rounded-full border px-5 text-[15.5px] font-semibold whitespace-nowrap transition-[opacity,translate,border-color] duration-[350ms] motion-reduce:transition-none',
        gone && 'pointer-events-none translate-y-2.5 opacity-0'
      )}
    >
      Scroll to climb
      <span
        aria-hidden='true'
        className='text-accent-text motion-safe:animate-bob inline-block text-[17px] leading-none'
      >
        ↓
      </span>
    </button>
  );
}
