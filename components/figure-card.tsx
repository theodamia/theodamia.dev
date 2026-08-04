'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReveal } from '@/lib/use-reveal';

type FigureProps = {
  children: ReactNode;
  className?: string;
};

/** The napkin card every figure is drawn on. */
export function FigureCard({ children, className }: FigureProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'border-ink/16 bg-card shadow-card min-w-0 rounded-[4px] border px-5 pt-[18px] pb-6',
        className
      )}
    >
      {children}
    </div>
  );
}

/** "Fig. 3 — opinions, held loosely" */
export function FigureLabel({ children, className }: FigureProps) {
  return (
    <p className={cn('text-ink-ghost font-mono text-[10px] tracking-[0.2em] uppercase', className)}>
      {children}
    </p>
  );
}

/** The hand-written note under a figure. */
export function FigureCaption({ children, className }: FigureProps) {
  return <p className={cn('font-hand text-ink-muted text-[17px]', className)}>{children}</p>;
}
