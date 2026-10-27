import type { NextConfig } from 'next';

/* No flags: React 19.3 made <ViewTransition> and addTransitionType stable, so the move between the pages
   (components/trail-link.tsx, the <ViewTransition> in app/layout.tsx) needs no experimental switch any more. */
const nextConfig: NextConfig = {};

export default nextConfig;
