import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieBanner from '@/components/CookieBanner';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paparazzoparrucchieri.it'),
  title: {
    default: 'Parrucchiere Catanzaro | Paparazzo - Nanoplastia, Extensions, Color Correction',
    template: '%s | Paparazzo Parrucchieri Catanzaro',
  },
  description:
    'Parrucchiere a Catanzaro specializzato in Nanoplastia, Hair Extensions e Color Correction. Salone di lusso in Via Formia 47. Prenota la tua consulenza gratuita ☎️ 339 239 9044',
  keywords: [
    'parrucchiere catanzaro',
    'parrucchieri catanzaro',
    'salone parrucchiere catanzaro',
    'hair extensions catanzaro',
    'nanoplastia catanzaro',
    'color correction catanzaro',
    'parrucchiere catanzaro centro',
    'balayage catanzaro',
    'colorazione capelli catanzaro',
    'taglio capelli catanzaro',
  ],
  authors: [{ name: 'Paparazzo Parrucchieri' }],
  creator: 'Paparazzo Parrucchieri',
  publisher: 'Paparazzo Parrucchieri',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://paparazzoparrucchieri.it',
    siteName: 'Paparazzo Parrucchieri',
    title: 'Parrucchiere Catanzaro | Paparazzo - Salone di Lusso',
    description:
      'Parrucchiere a Catanzaro specializzato in Nanoplastia, Hair Extensions e Color Correction. Prenota la tua consulenza gratuita.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parrucchiere Catanzaro | Paparazzo Parrucchieri',
    description: 'Nanoplastia, Hair Extensions, Color Correction. Prenota ora ☎️ 339 239 9044',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="bg-white font-sans text-gray-900 antialiased">
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieBanner />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
