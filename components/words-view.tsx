'use client';

import { useState } from 'react';
import { PANEL_KEYS, PANELS, type PanelKey } from '@/lib/panels';
import { cn } from '@/lib/utils';

/** View 2 — the same CV as prose. A fixed rail of four panels, no page scroll. */
export function WordsView() {
  const [active, setActive] = useState<PanelKey>('about');
  const panel = PANELS[active];

  return (
    <main className='flex min-h-screen pt-[62px]'>
      <aside className='border-ink/12 bg-rail w-[250px] shrink-0 border-r px-5 py-[46px]'>
        <div className='sticky top-[110px] flex flex-col gap-1'>
          {PANEL_KEYS.map(key => (
            <button
              key={key}
              type='button'
              aria-current={active === key ? 'page' : undefined}
              onClick={() => setActive(key)}
              className={cn(
                'cursor-pointer rounded-lg px-3.5 py-[11px] text-left text-[15px] transition-colors duration-200',
                active === key
                  ? 'text-ink shadow-rail bg-white font-bold'
                  : 'text-ink-muted font-medium'
              )}
            >
              {PANELS[key].title}
            </button>
          ))}
          <p className='text-ink-ghost mt-[26px] px-3.5 font-mono text-[10.5px] leading-[1.7] tracking-[0.1em] uppercase'>
            No scrolling.
            <br />
            Pick a panel.
          </p>
        </div>
      </aside>

      <section className='min-w-0 flex-1 px-14 pt-[70px] pb-20'>
        <div className='max-w-[720px]'>
          <p className='text-accent mb-3 font-mono text-[11px] tracking-[0.24em] uppercase'>
            {panel.kicker}
          </p>
          <h2 className='mb-[30px] font-serif text-[clamp(36px,5.4vw,62px)] leading-none'>
            {panel.title}
          </h2>
          <div className='text-ink-body flex flex-col gap-[18px] text-[16.5px] leading-[1.72]'>
            {panel.body.map(line => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className='mt-[34px] flex flex-wrap gap-2.5'>
            {panel.chips.map(chip => (
              <span
                key={chip}
                className='border-ink/16 text-ink-body rounded-full border px-3.5 py-[7px] text-[13.5px]'
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
