import type React from 'react';
import type { Metadata } from 'next';
import { DM_Sans, Instrument_Serif, JetBrains_Mono, Patrick_Hand } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick-hand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Theodore Damianidis | Frontend Engineer',
  description:
    'A career, hand-graphed — ten years of frontend engineering plotted on graph paper. Senior Frontend Engineer at DeepSea.ai, previously Frontend Lead at Geekbot.',
  generator: 'theodamia.dev',
  keywords: [
    'Frontend Engineer',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'GraphQL',
    'Web Development',
  ],
  authors: [{ name: 'Theodore Damianidis' }],
  openGraph: {
    title: 'Theodore Damianidis | Frontend Engineer',
    description: 'A career, hand-graphed — ten years of frontend engineering, plotted',
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
  const fontVariables = [
    dmSans.variable,
    instrumentSerif.variable,
    jetBrainsMono.variable,
    patrickHand.variable,
  ].join(' ');

  return (
    <html lang='en' className={fontVariables}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
