'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS, SERVICES } from '@/config/constants';
import Button from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative h-20 w-64">
            <Image
              src="/images/Marchio.jpg"
              alt="Paparazzo Parrucchieri - from hair to heart"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-8 lg:flex">
            <Link
              href="/"
              className="font-medium text-gray-700 transition-colors hover:text-gold-600"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center font-medium text-gray-700 transition-colors hover:text-gold-600 py-6">
                Servizi
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isServicesOpen && (
                <div className="absolute left-0 top-full w-64 rounded-lg bg-white py-2 shadow-xl border border-gray-100">
                  <Link
                    href="/servizi"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-600"
                  >
                    Tutti i Servizi
                  </Link>
                  <div className="my-1 border-t border-gray-100"></div>
                  {SERVICES.map((service) => (
                    <Link
                      key={service.id}
                      href={`/servizi/${service.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-600"
                    >
                      <span className="mr-2">{service.icon}</span>
                      {service.name}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-gray-100"></div>
                  <Link
                    href="/servizi#prezzi"
                    className="block px-4 py-2 text-sm font-semibold text-gold-600 hover:bg-gold-50"
                  >
                    <span className="mr-2">💰</span>
                    Listino Prezzi
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="font-medium text-gray-700 transition-colors hover:text-gold-600"
            >
              Blog
            </Link>
            <Link
              href="/corsi"
              className="font-medium text-gray-700 transition-colors hover:text-gold-600"
            >
              Corsi
            </Link>
            <Link
              href="/contatti"
              className="font-medium text-gray-700 transition-colors hover:text-gold-600"
            >
              Contatti
            </Link>

            <Button href={getWhatsAppLink()} variant="whatsapp" size="sm" external>
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Prenota
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 lg:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="font-medium text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/servizi"
                className="font-medium text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Servizi
              </Link>
              {SERVICES.map((service) => (
                <Link
                  key={service.id}
                  href={`/servizi/${service.slug}`}
                  className="pl-4 text-sm text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-2">{service.icon}</span>
                  {service.name}
                </Link>
              ))}
              <Link
                href="/servizi#prezzi"
                className="pl-4 text-sm font-semibold text-gold-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">💰</span>
                Listino Prezzi
              </Link>
              <Link
                href="/blog"
                className="font-medium text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/corsi"
                className="font-medium text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Corsi
              </Link>
              <Link
                href="/contatti"
                className="font-medium text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contatti
              </Link>
              <Button href={getWhatsAppLink()} variant="whatsapp" fullWidth external>
                Prenota su WhatsApp
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
