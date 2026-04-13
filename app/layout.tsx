import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Deduce — Daily Logic Puzzles',
  description: 'Solve a daily mystery using 4 logic mini-games: LinkGrid, TimeTrace, TrueLie, and CodeBreak.',
  keywords: ['logic puzzle', 'deduction game', 'daily puzzle', 'mystery game'],
  openGraph: {
    title: 'Deduce',
    description: 'Daily logic puzzle game — deduce WHO, WHEN, WHERE, HOW.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D0D0D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
