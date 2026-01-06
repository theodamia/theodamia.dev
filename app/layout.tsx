import type React from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Theodore Damianidis | Frontend Engineer',
  description:
    'Frontend Engineer with 7+ years of production experience specializing in React, TypeScript and modern web development. Currently Frontend Lead at Geekbot.',
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
    description: 'Frontend Engineer with 7+ years of production experience',
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
    <html lang='en'>
      <body className='font-sans antialiased'>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
