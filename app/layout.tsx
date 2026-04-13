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
  maximumScale: 1,
  themeColor: '#0D0D0D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-shell">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
