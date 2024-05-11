'use client';

import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { Header } from '../components/header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <title>Nutrify</title>
        <link
          href='/images/icon.png'
          rel='icon'
          type='image/png'
          sizes='32x32'
        />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <Header />
        {children}
      </body>
    </html>
  );
}
