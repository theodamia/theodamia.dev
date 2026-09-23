import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* client navigations run inside a view transition, so moving between the climb and /cv cross-fades */
  experimental: { viewTransition: true },
};

export default nextConfig;
