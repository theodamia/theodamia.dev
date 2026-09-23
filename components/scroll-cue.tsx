import { cn } from '@/utils/cn';

type ScrollCueProps = {
  /** True once the page has moved: the cue steps aside rather than being unmounted. */
  gone: boolean;
  onStart: () => void;
};

/** The nudge at the foot of the first screen, until the page moves and it is not needed any more. */
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
