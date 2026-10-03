import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost, Pinyon_Script } from 'next/font/google';
import AnnouncementBar from '@/components/luxe/AnnouncementBar';
import Footer from '@/components/luxe/Footer';
import Header from '@/components/luxe/Header';
import { CartProvider } from '@/components/luxe/cart';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pinyon',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Anteprima nuovo sito',
  robots: { index: false, follow: false },
};

export default function AnteprimaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} ${pinyon.variable} ${jost.variable} luxe min-h-screen bg-luxe-black font-luxe-sans font-light text-luxe-ivory antialiased`}
    >
      <CartProvider>
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
      </CartProvider>
    </div>
  );
}
