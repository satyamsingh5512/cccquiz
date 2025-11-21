import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quizo - Modern Quiz Platform',
  description: 'Enterprise-grade quiz platform for institutions and teams. Create, deploy, and analyze assessments at scale.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Quizo - Modern Quiz Platform',
    description: 'Enterprise-grade quiz platform for institutions and teams. Create, deploy, and analyze assessments at scale.',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Quizo - Modern Quiz Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quizo - Modern Quiz Platform',
    description: 'Enterprise-grade quiz platform for institutions and teams.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
