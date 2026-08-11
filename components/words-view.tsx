'use client';

import { useState } from 'react';
import { NARROW_QUERY } from '@/lib/constants';
import { PANEL_KEYS, PANELS, type PanelKey } from '@/lib/panels';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn } from '@/lib/utils';

const BURGER_MENU_HEIGHT = 260;

/** View 2 — the same CV as prose. A fixed rail of four panels, no page scroll. */
export function WordsView() {
  const [active, setActive] = useState<PanelKey>('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const isNarrow = useMediaQuery(NARROW_QUERY);
  const panel = PANELS[active];

  const selectPanel = (key: PanelKey) => {
    setActive(key);
    setMenuOpen(false);
  };

  return (
    <main className={cn('flex min-h-screen pt-[62px]', isNarrow && 'flex-col')}>
      {isNarrow ? (
        <nav aria-label='Panels' className='bg-rail border-ink/12 sticky top-[62px] z-40 border-b'>
          <button
            type='button'
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
            className='flex min-h-14 w-full cursor-pointer items-center justify-between px-[22px] py-3'
          >
            <span className='text-left'>
              <span className='text-accent block font-mono text-[9.5px] tracking-[0.22em] uppercase'>
                {panel.kicker}
              </span>
              <span className='text-ink block font-serif text-[22px] leading-tight'>
                {panel.title}
              </span>
            </span>
            <span className='flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px]'>
              <span
                className={cn(
                  'bg-ink-strong h-0.5 w-6 transition-transform duration-200',
                  menuOpen && 'translate-y-[7px] rotate-45'
                )}
              />
              <span
                className={cn(
                  'bg-ink-strong h-0.5 w-6 transition-opacity duration-200',
                  menuOpen && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'bg-ink-strong h-0.5 w-6 transition-transform duration-200',
                  menuOpen && '-translate-y-[7px] -rotate-45'
                )}
              />
            </span>
          </button>

          <div
            className='ease-draw overflow-hidden transition-[max-height] duration-[280ms]'
            style={{ maxHeight: menuOpen ? BURGER_MENU_HEIGHT : 0 }}
          >
            {PANEL_KEYS.map(key => (
              <button
                key={key}
                type='button'
                aria-current={active === key ? 'page' : undefined}
                onClick={() => selectPanel(key)}
                className={cn(
                  'border-ink/22 block min-h-[50px] w-full cursor-pointer border-t border-dashed px-[22px] py-[13px] text-left text-[16px]',
                  active === key ? 'text-ink bg-white font-bold' : 'text-ink-muted font-medium'
                )}
              >
                {PANELS[key].title}
              </button>
            ))}
          </div>
        </nav>
      ) : (
        <aside className='border-ink/12 bg-rail w-[250px] shrink-0 border-r px-5 py-[46px]'>
          <div className='sticky top-[110px] flex flex-col gap-1'>
            {PANEL_KEYS.map(key => (
              <button
                key={key}
                type='button'
                aria-current={active === key ? 'page' : undefined}
                onClick={() => selectPanel(key)}
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
      )}

      <section
        className={cn(
          'min-w-0 flex-1',
          isNarrow ? 'px-[22px] pt-[34px] pb-[70px]' : 'px-14 pt-[70px] pb-20'
        )}
      >
        <div className='max-w-[720px]'>
          {!isNarrow && (
            <p className='text-accent mb-3 font-mono text-[11px] tracking-[0.24em] uppercase'>
              {panel.kicker}
            </p>
          )}
          <h2
            className={cn(
              'mb-[30px] font-serif leading-none',
              isNarrow ? 'text-[38px] leading-[1.05]' : 'text-[clamp(36px,5.4vw,62px)]'
            )}
          >
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
