'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieBanner from '@/components/CookieBanner';

// Le route /anteprima hanno un layout proprio: lì il chrome del sito live non va mostrato
export default function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/anteprima')) return <main>{children}</main>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      {footer}
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}
