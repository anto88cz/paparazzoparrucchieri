'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './cart';
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from './Icons';

// /prenota è un redirect esterno (WhatsApp): va aperto come link normale, senza prefetch
const NAV = [
  { href: '/prenota', label: 'Prenota', external: true as const },
  { href: '/anteprima/shop', label: 'Shop' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/corsi', label: 'Accademia' },
];

type NavItem = (typeof NAV)[number];

function NavLink({ item, className, children }: { item: NavItem; className: string; children: React.ReactNode }) {
  if ('external' in item) return <a href={item.href} className={className}>{children}</a>;
  return <Link href={item.href} className={className}>{children}</Link>;
}

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${
        scrolled ? 'border-luxe-line bg-luxe-black/90 backdrop-blur-md' : 'border-transparent bg-luxe-black'
      }`}
    >
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principale">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className={`luxe-link text-[11px] uppercase tracking-[0.25em] ${
                pathname?.startsWith(item.href) ? 'text-luxe-gold' : 'text-luxe-ivory/80'
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="-ml-2 p-2 text-luxe-ivory lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link href="/anteprima" className="relative block h-9 w-36 sm:h-11 sm:w-44" aria-label="Paparazzo, home">
          <Image src="/images/logo-light.png" alt="Paparazzo · from hair to heart" fill priority sizes="176px" className="object-contain" />
        </Link>

        <div className="flex items-center justify-end gap-1 text-luxe-ivory/80 sm:gap-3">
          <Link href="/anteprima/shop" className="hidden p-2 transition hover:text-luxe-gold sm:block" aria-label="Cerca">
            <SearchIcon />
          </Link>
          <button type="button" className="hidden p-2 transition hover:text-luxe-gold sm:block" aria-label="Account">
            <UserIcon />
          </button>
          <Link href="/anteprima/carrello" className="relative p-2 transition hover:text-luxe-gold" aria-label={`Carrello, ${count} articoli`}>
            <BagIcon />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-luxe-gold px-1 text-[9px] font-medium text-luxe-black">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-luxe-line bg-luxe-black px-6 pb-8 pt-4 lg:hidden" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className="block border-b border-luxe-line py-4 font-luxe-serif text-2xl uppercase tracking-[0.15em] text-luxe-ivory"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
