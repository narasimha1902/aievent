'use client';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import SupabaseProvider from '@/components/SupabaseProvider';
import { PropsWithChildren, useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // prevent hydration mismatch
  if (!mounted) return null;

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} font-sans`}>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}