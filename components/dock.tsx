'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOCK_ICON_STROKE, DOCK_PROBE_RATIO, SECTION_SCROLL_OFFSET_PX } from '@/constants';
import { Map, NotebookPen, RadioTower, Tent } from 'lucide-react';
import { DockBubble } from '@/components/dock-bubble';
import { IceAxeIcon } from '@/components/icons/ice-axe-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { DOCK_ITEMS, dockHref, type DockItem, type DockItemId } from '@/lib/dock-items';
import { cn } from '@/utils/cn';

type DockIconComponent = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

/** Lucide icons, except Skills: Lucide has no ice axe, so that one is drawn to match its 24px grid and stroke. */
const ICONS: Record<DockItemId, DockIconComponent> = {
  home: Tent,
  climb: Map,
  about: NotebookPen,
  skills: IceAxeIcon,
  contact: RadioTower,
};
/** Where a same-page click should scroll to. The climb publishes its first stop; other sections use their top. */
function scrollTargetFor(item: DockItem): number {
  if (!item.section) return 0;
  const el = document.getElementById(item.section);
  if (!el) return 0;
  /* the climb publishes where a section starts; the emptiness check is because Number('') is a finite 0 */
  const published = Number(el.dataset.scrollY);
  if (el.dataset.scrollY && Number.isFinite(published)) return published;
  return el.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET_PX;
}

/** The section under the middle of the screen, of the ones that live on this page. */
function useActiveSection(pathname: string): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = DOCK_ITEMS.filter(item => item.page === pathname && item.section).map(
      item => item.section as string
    );
    let tops: number[] = [];
    let probeOffset = 0;
    let raf = 0;

    const update = () => {
      raf = 0;
      const probe = window.scrollY + probeOffset;
      let current: string | null = null;
      ids.forEach((id, i) => {
        if (probe >= tops[i]) current = id;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const measure = () => {
      probeOffset = window.innerHeight * DOCK_PROBE_RATIO;
      tops = ids.map(id => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      });
      onScroll();
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [pathname]);

  return active;
}

/**
 * The only navigation: five climbing icons floating at the bottom of both pages, then, past a hairline, the switch
 * between day and night. The switch is a setting, not a place, so it sits outside the `Sections` landmark. Every
 * link carries its name three ways: `aria-label` (always), a bubble on hover or keyboard focus, and spelled out
 * inside the lit item on touch screens, where nothing can hover.
 */
export function Dock() {
  const pathname = usePathname();
  const active = useActiveSection(pathname);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>, item: DockItem) => {
    const plainClick = !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
    if (item.page !== pathname || !plainClick) return;
    /* already on the right page: move there instead of navigating. Smooth or instant follows reduced motion. */
    event.preventDefault();
    window.scrollTo({ top: Math.max(0, scrollTargetFor(item)) });
  };

  return (
    <div className='rounded-dock border-line shadow-dock bg-card/96 touch:p-1 fixed bottom-4 left-1/2 z-[90] flex max-w-[calc(100vw-20px)] -translate-x-1/2 items-center border p-1.5'>
      <nav aria-label='Sections' className='touch:gap-0 flex items-center gap-0.5'>
        {DOCK_ITEMS.map(item => {
          const Icon = ICONS[item.id];
          const isHome = item.id === 'home';
          const isOn = Boolean(item.section) && item.section === active;
          return (
            <Link
              key={item.id}
              href={dockHref(item)}
              aria-label={item.label}
              aria-current={isOn ? 'true' : undefined}
              onClick={event => onClick(event, item)}
              className={cn(
                'group rounded-ctl text-ink-2 relative inline-flex size-11 shrink-0 items-center justify-center gap-2 text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none',
                isHome && 'bg-ice text-ink hover:bg-line touch-xs:hidden mr-1',
                !isHome && !isOn && 'hover:bg-ice hover:text-ink',
                item.id === 'contact' && 'border-accent text-accent-text ml-1 border-[1.5px]',
                item.id === 'contact' && !isOn && 'hover:bg-accent-wash hover:text-accent-text',
                isOn && 'bg-ink border-ink touch:w-auto touch:pr-3 touch:pl-2.5 text-on-ink'
              )}
            >
              <Icon className='shrink-0' strokeWidth={DOCK_ICON_STROKE} aria-hidden='true' />
              {isOn && <span className='touch:inline hidden'>{item.label}</span>}
              <DockBubble>{item.label}</DockBubble>
            </Link>
          );
        })}
      </nav>
      {/*
        the night needs light-dark() (the scene's colours use it); without it the site stays in daylight.
        The hairline sits further from Contact than from the switch: Contact's outline is at the edge of its box,
        the switch's icon 10px inside its own, so this is what centres it between the two things you see.
      */}
      <span
        aria-hidden='true'
        className='bg-line touch:ml-2 touch:mr-0 mr-0.5 ml-3 h-6 w-px shrink-0 not-supports-[color:light-dark(#000,#fff)]:hidden'
      />
      <ThemeToggle className='not-supports-[color:light-dark(#000,#fff)]:hidden' />
    </div>
  );
}
