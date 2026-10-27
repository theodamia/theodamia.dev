'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { addTransitionType, startTransition } from 'react';

/**
 * The pages are heights on one mountain: /cv the valley at its foot (where the trail starts), / the climb itself,
 * /about the summit's strip, and /ai beside it, read from it. A page that is not on this map counts as the climb's.
 */
const ALTITUDE: Record<string, number> = { '/cv': 0, '/': 1, '/about': 2, '/ai': 2 };

type TrailDirection = 'trail-up' | 'trail-down' | 'trail-across';

/** Which way a move between two pages goes on the mountain. */
export function trailDirection(from: string, to: string): TrailDirection {
  const start = ALTITUDE[from] ?? 1;
  const end = ALTITUDE[to] ?? 1;
  if (end > start) return 'trail-up';
  if (end < start) return 'trail-down';

  return 'trail-across';
}

type TrailLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string };

/**
 * A link between the site's pages that goes up or down the mountain as it moves: next/link, with the navigation run
 * in a transition named for its direction, which the page's `<ViewTransition>` (app/layout.tsx) turns into the
 * motion under "Moving between the pages" in globals.css. Going up, the page leaves upward and the next rises in
 * from below, the way the climb's cards move as you climb; going down, the reverse.
 *
 * Its own `onClick` runs first, and anything it settles stays settled (the dock scrolls to a section of the page
 * you are already on). A link to the page you are on, a click meant for a new tab or window, and another site are
 * all left to the link itself.
 */
export function TrailLink({ href, onClick, ...props }: TrailLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={event => {
        onClick?.(event);
        const modified =
          event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (event.defaultPrevented || modified) return;
        const to = new URL(href, window.location.href);
        if (to.origin !== window.location.origin || to.pathname === pathname) return;
        event.preventDefault();

        startTransition(() => {
          addTransitionType(trailDirection(pathname, to.pathname));
          router.push(`${to.pathname}${to.search}${to.hash}`);
        });
      }}
      {...props}
    />
  );
}
