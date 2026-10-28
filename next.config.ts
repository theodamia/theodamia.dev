import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
/* Vercel's toolbar (comments on preview deployments) loads from vercel.live; production never does. */
const isPreview = process.env.VERCEL_ENV === 'preview';

/* Everything the site loads is its own: the paintings, the fonts (next/font serves them from the site) and
   Vercel Analytics and Speed Insights (/_vercel/...). 'unsafe-inline' in script-src because the theme, season
   and daypart scripts in app/layout.tsx and Next's own inline scripts differ per page, and nonces would make
   every page dynamic. No upgrade-insecure-requests: every request is same-origin and .dev is HTTPS-only, and
   it would break `next start` over http://localhost. */
const sources: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'blob:', 'data:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

if (isDev) {
  /* Turbopack's dev runtime evaluates code, and the analytics packages load debug scripts from Vercel's CDN */
  sources['script-src'].push("'unsafe-eval'", 'https://va.vercel-scripts.com');
}

if (isPreview) {
  /* the sources Vercel lists for the toolbar: vercel.com/docs/vercel-toolbar/managing-toolbar */
  sources['script-src'].push('https://vercel.live');
  sources['style-src'].push('https://vercel.live');
  sources['img-src'].push('https://vercel.live', 'https://vercel.com');
  sources['font-src'].push('https://vercel.live', 'https://assets.vercel.com');
  sources['connect-src'].push('https://vercel.live', 'wss://ws-us3.pusher.com');
  sources['frame-src'] = ['https://vercel.live'];
}

const csp = Object.entries(sources)
  .map(([directive, values]) => `${directive} ${values.join(' ')}`)
  .join('; ');

/* No flags: React 19.3 made <ViewTransition> and addTransitionType stable, so the move between the pages
   (components/trail-link.tsx, the <ViewTransition> in app/layout.tsx) needs no experimental switch any more. */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
