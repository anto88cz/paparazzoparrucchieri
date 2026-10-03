import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

const SERVICES = [
  { href: '/servizi/nanoplastia', label: 'Nanoplastia', note: 'Liscio, luce, zero crespo', image: '/images/services/nanoplastia-4.jpg' },
  { href: '/servizi/hair-extensions', label: 'Hair Extensions', note: 'Lunghezza e volume invisibili', image: '/images/services/hair-extensions-1.jpg' },
  { href: '/servizi/color-correction', label: 'Color Correction', note: 'Il biondo perfetto, su misura', image: '/images/services/color-correction-2.jpg' },
];

export default function ServicesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionTitle title="I nostri servizi" script="signature" />
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.href} delay={i * 120}>
            <Link href={s.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-luxe-coal">
                <Image
                  src={s.image}
                  alt={s.label}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxe-black/70 via-transparent to-transparent" />
                <span className="absolute inset-3 border border-luxe-gold/0 transition-colors duration-700 group-hover:border-luxe-gold/60" />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="text-[12px] uppercase tracking-[0.28em] text-luxe-ivory">{s.label}</h3>
                <span className="text-[11px] uppercase tracking-[0.2em] text-luxe-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Scopri
                </span>
              </div>
              <p className="mt-1 text-sm text-luxe-mute">{s.note}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
