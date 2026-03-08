import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Time Machine - AI Agent Observability',
  description:
    'Debug and observe your AI agents with Time Machine. Capture executions, replay from any step, compare diffs visually.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Time Machine - AI Agent Observability',
    description: 'Capture agent executions. Replay from any step. Compare diffs visually.',
    url: 'https://timemachinesdk.dev',
    siteName: 'Time Machine',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Machine - AI Agent Observability',
    description: 'Capture agent executions. Replay from any step. Compare diffs visually.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
