import type React from 'react';
import { cn } from '@/utils/cn';

/* Lucide's radio tower (the dock's Contact icon) on a larger canvas, room for one more ring of waves */
const VIEW_BOX = '-3 -3 30 27';
const MAST = ['M9.5 18h5', 'm8 22 4-11 4 11'];
/** Inner to outer: Lucide's two rings, then one more a step further out (radius 14 around the transmitter). */
const WAVES = [
  ['M7.8 4.7a6.14 6.14 0 0 0-.8 7.5', 'M16.2 4.8c2 2 2.26 5.11.8 7.47'],
  ['M4.9 16.1C1 12.2 1 5.8 4.9 1.9', 'M19.1 1.9a9.96 9.96 0 0 1 0 14.1'],
  ['M2.1 18.9A14 14 0 0 1 2.1 -0.9', 'M21.9 -0.9A14 14 0 0 1 21.9 18.9'],
];
/** How far behind the ring inside it each ring lights up, so the signal travels outward. */
const WAVE_STEP_S = 0.35;
/** Line width in screen pixels at any size (the strokes do not scale with the drawing). */
const STROKE_PX = 2.5;

function Drawing({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={VIEW_BOX}
      style={style}
      fill='none'
      stroke='currentColor'
      strokeWidth={STROKE_PX}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn(
        'absolute inset-0 size-full [&_*]:[vector-effect:non-scaling-stroke]',
        className
      )}
    >
      {children}
    </svg>
  );
}

/**
 * The dock's Contact icon drawn large behind the Contact card: the mast in ink, the
 * transmitter and the waves in the accent, the waves lighting up in turn from the inside out, as if on air. Each
 * ring is a layer of its own animated with opacity only, so the compositor runs it and nothing repaints (as with
 * the camp lights). Reduced motion: the rings simply stay lit. Decorative, and only where there is room beside the
 * heading. (A detailed lattice mast and a Gemini picture were both tried; the icon's own shape read best.)
 */
export function SignalTower({ className }: { className?: string }) {
  return (
    <div aria-hidden='true' className={cn('pointer-events-none aspect-[30/27]', className)}>
      <Drawing className='text-ink'>
        {MAST.map(d => (
          <path key={d} d={d} />
        ))}
      </Drawing>
      <Drawing className='text-accent-text'>
        <circle cx='12' cy='9' r='2' />
      </Drawing>
      {WAVES.map((ring, i) => (
        <Drawing
          key={ring[0]}
          className='text-accent-text motion-safe:animate-signal opacity-60'
          style={{ animationDelay: `${i * WAVE_STEP_S}s` }}
        >
          {ring.map(d => (
            <path key={d} d={d} />
          ))}
        </Drawing>
      ))}
    </div>
  );
}
