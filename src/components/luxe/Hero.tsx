import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from './Icons';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-luxe-line">
      {/* Parole in filigrana */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 select-none font-luxe-serif text-[9rem] font-light uppercase leading-none tracking-[0.08em] text-luxe-ivory/[0.04] [writing-mode:vertical-rl] rotate-180 lg:block"
      >
        Luxury
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-0 z-10 select-none font-luxe-serif text-[5rem] font-light uppercase leading-none tracking-[0.1em] text-luxe-ivory/[0.06] md:text-[11rem]"
      >
        Premium
      </span>

      <div className="mx-auto grid max-w-7xl items-center lg:min-h-[680px] lg:grid-cols-2">
        <div className="relative z-10 order-2 px-6 py-16 text-center sm:px-10 lg:order-1 lg:py-24 lg:pl-24 lg:text-left">
          <p className="luxe-eyebrow mb-6 animate-fade-in">Paparazzo · Catanzaro</p>
          <h1 className="animate-slide-up">
            <span className="luxe-title block text-[2.6rem] leading-[0.9] tracking-[0.08em] sm:text-7xl xl:text-[5.5rem]">Experience</span>
            <span className="luxe-script -mt-1 block text-4xl sm:text-5xl xl:text-6xl">l&apos;arte del capello</span>
          </h1>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-luxe-mute lg:mx-0">
            Nanoplastia, extension e color correction firmate dai nostri hair artist. E ora i prodotti che usiamo in
            salone, a casa tua.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/anteprima/shop" className="luxe-btn">
              Scopri lo shop <ArrowIcon />
            </Link>
            {/* /prenota è un redirect a WhatsApp: niente prefetch di Link */}
            <a href="/prenota" className="luxe-link text-[11px] uppercase tracking-[0.3em] text-luxe-ivory/80">
              Prenota un appuntamento
            </a>
          </div>
        </div>

        <div className="relative order-1 h-[440px] sm:h-[560px] lg:absolute lg:inset-y-0 lg:right-0 lg:order-2 lg:h-auto lg:w-1/2">
          <Image
            src="/images/services/nanoplastia-1.jpg"
            alt="Capelli lisci e luminosi dopo la Nanoplastia"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[30%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxe-black via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>
      </div>
    </section>
  );
}
