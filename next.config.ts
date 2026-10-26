import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* client navigations run inside a view transition: moving between pages goes up or down the mountain
     (components/trail-link.tsx, the <ViewTransition> in app/layout.tsx) */
  experimental: { viewTransition: true },
};

export default nextConfig;
