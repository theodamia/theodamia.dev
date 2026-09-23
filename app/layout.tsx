import type React from 'react';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Dock } from '@/components/dock';
import { SITE } from '@/lib/site';
import { THEME_SCRIPT } from '@/lib/theme';
import { VIEW_SCRIPT } from '@/lib/view';
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
  title: `${SITE.name} | ${SITE.title}`,
  description:
    'The Ascent — ten years of frontend engineering drawn as one long climb. Senior Frontend Software Engineer at DeepSea.ai, previously Frontend Lead at Geekbot.',
  generator: 'theodamia.dev',
  keywords: [
    'Frontend Engineer',
    'Frontend Software Engineer',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'GraphQL',
    'Web Development',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    title: `${SITE.name} | ${SITE.title}`,
    description: 'Ten years of frontend engineering, drawn as one long climb',
    type: 'website',
  },
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
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
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
    /* the scripts below set data-theme and data-view before hydration, so <html> differs from the server render on purpose */
    <html
      lang='en'
      className={`${bricolage.variable} ${instrumentSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* before the first paint: day or night, so the page never flashes the wrong sky */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* and the climb or the plain timeline, so a returning reader never sees the other one first */}
        <script dangerouslySetInnerHTML={{ __html: VIEW_SCRIPT }} />
      </head>
      {/* overflow-x: clip, not hidden — hidden would make the body a scroll container and break the sticky stage */}
      <body className='overflow-x-clip'>
        {children}
        <Dock />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
