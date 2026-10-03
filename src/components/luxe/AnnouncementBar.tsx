import { BUSINESS } from '@/config/constants';
import { FacebookIcon, InstagramIcon } from './Icons';

export default function AnnouncementBar() {
  return (
    <div className="border-b border-luxe-line bg-luxe-black text-luxe-mute">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 sm:justify-between sm:px-6 lg:px-8">
        <div className="hidden items-center gap-3 sm:flex">
          <a href={BUSINESS.social.instagram} aria-label="Instagram" className="transition hover:text-luxe-gold">
            <InstagramIcon />
          </a>
          <a href={BUSINESS.social.facebook} aria-label="Facebook" className="transition hover:text-luxe-gold">
            <FacebookIcon />
          </a>
        </div>
        <p className="text-center text-[10px] uppercase tracking-[0.28em] sm:text-[11px]">
          Spedizione in tutta Italia <span className="mx-2 text-luxe-gold">·</span> Ritiro gratuito in salone
        </p>
        <a href={`tel:${BUSINESS.whatsapp}`} className="hidden text-[11px] tracking-[0.2em] transition hover:text-luxe-gold sm:block">
          {BUSINESS.phoneFormatted}
        </a>
      </div>
    </div>
  );
}
