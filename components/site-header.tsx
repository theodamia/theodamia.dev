'use client';

import { cn } from '@/lib/utils';

export type PortfolioView = 'climb' | 'words';

const VIEWS: { id: PortfolioView; label: string }[] = [
  { id: 'climb', label: 'The climb' },
  { id: 'words', label: 'The words' },
];

type SiteHeaderProps = {
  view: PortfolioView;
  onViewChange: (view: PortfolioView) => void;
};

export function SiteHeader({ view, onViewChange }: SiteHeaderProps) {
  return (
    <header className='border-ink/10 bg-background/82 fixed inset-x-0 top-0 z-[90] flex items-center justify-between gap-3 border-b px-4 py-3.5 backdrop-blur-[14px] sm:gap-5 sm:px-6'>
      <a
        href='#top'
        onClick={event => {
          // The wordmark is "home": back to the default view, whichever view you are on.
          event.preventDefault();
          onViewChange('climb');
        }}
        className='text-ink font-mono text-[12px] tracking-[0.14em] whitespace-nowrap uppercase'
      >
        T. Damianidis
      </a>
      <div className='border-ink/14 flex items-center gap-1.5 rounded-full border bg-white/60 p-1'>
        {VIEWS.map(item => (
          <button
            key={item.id}
            type='button'
            aria-pressed={view === item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'cursor-pointer rounded-full px-[15px] py-[7px] text-[13px] font-medium whitespace-nowrap transition-colors duration-200',
              view === item.id ? 'bg-ink text-on-ink' : 'text-ink-muted'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
