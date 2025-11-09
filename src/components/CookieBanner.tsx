'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    
    // Enable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 p-4 text-white shadow-2xl md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-sm leading-relaxed md:text-base">
              Utilizziamo cookie per migliorare la tua esperienza sul nostro sito. Continuando la
              navigazione, accetti la nostra{' '}
              <Link href="/cookie" className="underline hover:text-gold-400">
                Cookie Policy
              </Link>{' '}
              e la{' '}
              <Link href="/privacy" className="underline hover:text-gold-400">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={rejectCookies}
              className="rounded-lg border border-gray-600 px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-800"
            >
              Rifiuta
            </button>
            <button
              onClick={acceptCookies}
              className="rounded-lg bg-gold-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-600"
            >
              Accetta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
