import type React from 'react';
import { ViewTransition } from 'react';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Dock } from '@/components/dock';
import { SITE } from '@/content/site';
import { THEME_SCRIPT } from '@/lib/theme';
import { DAYPART_SCRIPT } from '@/scene/about';
import { SEASON_SCRIPT } from '@/scene/seasons';
import './globals.css';

/* Variable, with the optical-size axis: the big headings need the narrower display cut. */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  /* every relative URL below — canonicals and the generated share card — resolves against this */
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} | ${SITE.title}`,
  description:
    'The Ascent: ten years of software engineering, built on frontend fundamentals, drawn as one long climb. Senior Frontend Software Engineer at DeepSea.ai, previously Frontend Lead at Geekbot.',
  generator: 'theodamia.dev',
  keywords: [
    'Senior Software Engineer',
    'Software Engineer',
    'Frontend Engineer',
    'Frontend Software Engineer',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'GraphQL',
    'Web Development',
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: '/' },
  /*
   * Next does not merge `openGraph` field by field: a route that sets its own replaces this whole object. So each
   * page states its own title and description, or it would be shared as the home page (see /cv and /about).
   */
  openGraph: {
    title: `${SITE.name} | ${SITE.title}`,
    description: 'Ten years of software engineering, drawn as one long climb',
    type: 'website',
    url: '/',
    siteName: SITE.name,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* the script below sets data-theme before hydration, so <html> differs from the server render on purpose */
    <html
      lang='en'
      className={`${bricolage.variable} ${instrumentSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* before the first paint: day or night, so the page never flashes the wrong sky */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* and the season it is, which /cv's year starts from; on <html>, so it survives client navigation */}
        <script dangerouslySetInnerHTML={{ __html: SEASON_SCRIPT }} />
        {/* and the visitor's time of day, the light /about opens on */}
        <script dangerouslySetInnerHTML={{ __html: DAYPART_SCRIPT }} />
      </head>
      {/* overflow-x: clip, not hidden — hidden would make the body a scroll container and break the sticky stage */}
      <body className='overflow-x-clip'>
        {/* the move between pages: up or down the mountain, named by the link (components/trail-link.tsx); the
            dock stays out of it, still */}
        <ViewTransition
          default='none'
          update={{ 'trail-up': 'trail-up', 'trail-down': 'trail-down', default: 'trail-across' }}
        >
          {children}
        </ViewTransition>
        {/* the dock is its own still layer in that move, or the page's picture would cover it while it moves */}
        <ViewTransition name='dock' default='none' update='dock-still'>
          <Dock />
        </ViewTransition>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
