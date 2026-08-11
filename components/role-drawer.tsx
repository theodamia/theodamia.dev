'use client';

import { useEffect, useRef } from 'react';
import { ALL_STEPS_HEADER, MILESTONES, type Milestone } from '@/lib/milestones';
import { cn } from '@/utils/cn';

/** Newest first and without the student step — it has no employer to link to. */
const ALL_STEPS = MILESTONES.slice(1).reverse();

const WIDTH = { single: 440, all: 520 };

type RoleDrawerProps = {
  open: boolean;
  showAll: boolean;
  milestone: Milestone;
  onClose: () => void;
};

export function RoleDrawer({ open, showAll, milestone, onClose }: RoleDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const isOpen = open || showAll;
  const header = showAll ? ALL_STEPS_HEADER : milestone;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (drawerRef.current?.contains(target)) return;
      if (target.closest('[data-keep-drawer]')) return;
      onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        aria-hidden='true'
        className='bg-ink/12 pointer-events-none fixed inset-0 z-[205] transition-opacity duration-300'
        style={{ opacity: isOpen ? 1 : 0 }}
      />
      <aside
        ref={drawerRef}
        role='dialog'
        aria-label='Role detail'
        aria-hidden={!isOpen}
        inert={!isOpen}
        className='border-ink bg-drawer shadow-drawer ease-draw fixed inset-y-0 right-0 z-[210] flex flex-col border-l-2 transition-transform duration-[380ms]'
        style={{
          width: `min(${showAll ? WIDTH.all : WIDTH.single}px, 94vw)`,
          transform: isOpen ? 'translateX(0)' : 'translateX(101%)',
        }}
      >
        <div className='border-ink/25 flex items-start justify-between gap-4 border-b border-dashed px-[26px] pt-[26px] pb-[18px]'>
          <div>
            <p className='text-accent mb-1.5 font-mono text-[10px] tracking-[0.22em] uppercase'>
              {header.period}
            </p>
            <h3 className='font-serif text-[34px] leading-[1.05]'>{header.company}</h3>
            <p className='text-ink-muted mt-1 text-[15px] font-medium'>{header.role}</p>
            {!showAll && milestone.url && (
              <ExternalLink href={milestone.url} host={milestone.host} />
            )}
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close'
            className='border-ink/35 text-ink-strong hover:bg-ink/7 size-[34px] shrink-0 cursor-pointer rounded-[4px] border-[1.5px] text-[17px] leading-none'
          >
            ✕
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-[26px] pt-6 pb-[30px]'>
          {showAll ? <AllSteps /> : <SingleStep milestone={milestone} />}
        </div>

        <div className='border-ink/25 font-hand text-ink-faint border-t border-dashed px-[26px] py-4 text-[16px]'>
          {showAll
            ? 'Five roles, ten years · Esc to close.'
            : 'Click another landmark on the climb to keep reading · Esc to close.'}
        </div>
      </aside>
    </>
  );
}

function ExternalLink({ href, host }: { href: string; host?: string }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-accent border-accent/60 hover:text-accent-hover mt-1.5 inline-flex items-center gap-[5px] border-b border-dashed font-mono text-[11px] tracking-[0.06em]'
    >
      {host} ↗
    </a>
  );
}

function SingleStep({ milestone }: { milestone: Milestone }) {
  return (
    <div>
      <span className='bg-pill text-ink-muted mb-[18px] inline-block rounded-full px-[11px] py-1 font-mono text-[11px]'>
        {milestone.duration}
      </span>
      <p className='text-ink-body text-[16.5px] leading-[1.75] text-pretty'>{milestone.full}</p>
      <TagRow tags={milestone.tags} className='mt-[26px] gap-2' size='lg' />
    </div>
  );
}

function AllSteps() {
  return (
    <div className='flex flex-col gap-[30px]'>
      {ALL_STEPS.map(step => (
        <div key={step.year} className='grid [grid-template-columns:14px_minmax(0,1fr)] gap-3.5'>
          <div className='flex flex-col items-center gap-1'>
            <span className='border-ink bg-chart-1 mt-[5px] size-[13px] rounded-full border-[2.5px]' />
            <span className='dashed-connector w-px flex-1' />
          </div>
          <div>
            <p className='text-accent font-mono text-[10px] tracking-[0.18em] uppercase'>
              {step.period}
            </p>
            <p className='mt-[5px] font-serif text-[25px] leading-[1.1]'>{step.company}</p>
            <p className='text-ink-muted mt-0.5 text-[14px] font-medium'>
              {step.role} · {step.duration}
            </p>
            {step.url && <ExternalLink href={step.url} host={step.host} />}
            <p className='text-ink-body mt-2 text-[15px] leading-[1.65] text-pretty'>{step.full}</p>
            <TagRow tags={step.tags} className='mt-3 gap-1.5' size='sm' />
          </div>
        </div>
      ))}
    </div>
  );
}

type TagRowProps = {
  tags: string[];
  className?: string;
  size: 'sm' | 'lg';
};

function TagRow({ tags, className, size }: TagRowProps) {
  return (
    <div className={cn('flex flex-wrap', className)}>
      {tags.map(tag => (
        <span
          key={tag}
          className={cn(
            'text-accent-strong rounded-[3px] border border-dashed tracking-[0.08em] uppercase',
            size === 'lg'
              ? 'border-accent/50 px-[11px] py-[5px] font-mono text-[11px]'
              : 'border-accent/45 px-[9px] py-1 font-mono text-[10px]'
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
