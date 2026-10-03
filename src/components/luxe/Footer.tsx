import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS } from '@/config/constants';
import { FacebookIcon, InstagramIcon, StoreIcon, TruckIcon } from './Icons';

const HOURS = [
  ['Martedì – Venerdì', '9:00–13:00 · 15:00–19:00'],
  ['Sabato', '9:00–18:30'],
  ['Domenica e lunedì', 'Chiuso'],
];

export default function Footer() {
  return (
    <footer className="border-t border-luxe-line bg-luxe-black text-luxe-mute">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="relative mb-5 h-12 w-48">
            <Image src="/images/logo-light.png" alt="Paparazzo" fill sizes="192px" className="object-contain object-left" />
          </div>
          <p className="text-sm leading-relaxed">{BUSINESS.description}</p>
          <div className="mt-6 flex gap-4">
            <a href={BUSINESS.social.instagram} aria-label="Instagram" className="transition hover:text-luxe-gold">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href={BUSINESS.social.facebook} aria-label="Facebook" className="transition hover:text-luxe-gold">
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="luxe-eyebrow mb-5">Salone</h3>
          <address className="space-y-1 text-sm not-italic leading-relaxed">
            <p>{BUSINESS.address.street}</p>
            <p>
              {BUSINESS.address.postalCode} {BUSINESS.address.city}
            </p>
            <p className="pt-3">
              <a href={`tel:${BUSINESS.whatsapp}`} className="transition hover:text-luxe-gold">
                {BUSINESS.phoneFormatted}
              </a>
            </p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="transition hover:text-luxe-gold">
                {BUSINESS.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="luxe-eyebrow mb-5">Orari</h3>
          <dl className="space-y-3 text-sm">
            {HOURS.map(([day, time]) => (
              <div key={day}>
                <dt className="text-luxe-ivory/90">{day}</dt>
                <dd>{time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="luxe-eyebrow mb-5">Shop</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <TruckIcon className="h-5 w-5 text-luxe-gold" /> Spedizione in tutta Italia
            </li>
            <li className="flex items-center gap-3">
              <StoreIcon className="h-5 w-5 text-luxe-gold" /> Ritiro gratuito in salone
            </li>
            <li className="pt-2">Pagamenti: PayPal · contanti al ritiro</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-luxe-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-[11px] uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Paparazzo Parrucchieri</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-luxe-gold">Privacy</Link>
            <Link href="/cookie" className="transition hover:text-luxe-gold">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
