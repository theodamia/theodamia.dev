import { ViewLink } from '@/components/view-link';
import { cn } from '@/utils/cn';

type ScrollCueProps = {
  /** True once the page has moved: the cue steps aside rather than being unmounted. */
  gone: boolean;
  onStart: () => void;
};

/**
 * The offer at the foot of the first screen, while the reader is deciding what to do with this page: start the
 * climb, or read the same thing as a plain timeline. Both go once the page moves, which is the point — the
 * choice is put once, at the moment it matters, and the dock keeps it from then on.
 */
export function ScrollCue({ gone, onStart }: ScrollCueProps) {
  const retired = gone || undefined;

  return (
    <div
      className={cn(
        'timeline:hidden fixed bottom-[114px] left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2.5 transition-[opacity,translate] duration-[350ms] motion-reduce:transition-none',
        gone && 'pointer-events-none translate-y-2.5 opacity-0'
      )}
    >
      {/* it floats over the mountain, so it takes the same tight halo the scene's own labels wear */}
      <ViewLink
        tabIndex={gone ? -1 : 0}
        aria-hidden={retired}
        className='text-shadow-halo text-[14.5px]'
      >
        or read it as a timeline
      </ViewLink>

      <button
        type='button'
        onClick={onStart}
        tabIndex={gone ? -1 : 0}
        aria-hidden={retired}
        className='border-line shadow-soft text-ink hover:border-ink bg-card ease-soft inline-flex min-h-11 cursor-pointer items-center gap-[9px] rounded-full border px-5 text-[15.5px] font-semibold whitespace-nowrap transition-[border-color] duration-[350ms] motion-reduce:transition-none'
      >
        Scroll to climb
        <span
          aria-hidden='true'
          className='text-accent-text motion-safe:animate-bob inline-block text-[17px] leading-none'
        >
          ↓
        </span>
      </button>
    </div>
  );
}
