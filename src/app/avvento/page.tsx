import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  AVVENTO,
  getCurrentPrice,
  getLaunchDate,
  getPreorderDeadline,
  isLaunched,
  isPreorderActive,
} from '@/config/avvento';
import { hasPreviewAccess } from '@/lib/avvento/preview';
import Teaser from '@/components/avvento/Teaser';
import { PreviewBar } from '@/components/avvento/Launch';
import { BUSINESS } from '@/config/constants';
import { getRemaining } from '@/lib/avvento/store';
import { Countdown, PriceTag, StickyBar, StockBar } from '@/components/avvento/Offer';
import OrderForm from '@/components/avvento/OrderForm';
import CalendarVisual from '@/components/avvento/CalendarVisual';
import type { AvventoStatus } from '@/components/avvento/useAvventoStatus';
import { HIGHLIGHT_ICONS, SparkleIcon } from '@/components/avvento/Icons';

export const dynamic = 'force-dynamic';

function availableImages() {
  return AVVENTO.images
    .filter((img) => fs.existsSync(path.join(process.cwd(), 'public', 'images', 'avvento', img.file)))
    .map((img) => ({ src: `/images/avvento/${img.file}`, alt: img.alt }));
}

function launchInfo() {
  const d = getLaunchDate();
  const opts = { timeZone: 'Europe/Rome' } as const;
  const day = d.toLocaleDateString('it-IT', { ...opts, day: 'numeric', month: 'long' });
  const time = d.toLocaleTimeString('it-IT', { ...opts, hour: '2-digit', minute: '2-digit' });
  return { iso: d.toISOString(), day, time, label: `${day} alle ore ${time}` };
}

export function generateMetadata(): Metadata {
  const cover = availableImages()[0]?.src ?? '/images/Marchio.jpg';
  if (!isLaunched()) {
    const { label } = launchInfo();
    const description = `24 sorprese di Paparazzo Parrucchieri: prodotti a marchio Paparazzo, gift card e servizi in salone. Valore commerciale €${AVVENTO.contentValue}. Limited Edition di ${AVVENTO.totalPieces} pezzi, preordini dal ${label}.`;
    return {
      title: "Calendario dell'Avvento 2026 - In arrivo",
      description,
      alternates: { canonical: '/avvento' },
      openGraph: {
        title: `Calendario dell'Avvento Paparazzo - preordini dal ${label}`,
        description,
        url: '/avvento',
        images: [{ url: cover }],
      },
    };
  }
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: cover }] } };
}

const metadata: Metadata = {
  title: "Calendario dell'Avvento 2026 - Preordine",
  description: `24 sorprese di Paparazzo Parrucchieri: prodotti a marchio Paparazzo, gift card e servizi gratuiti in salone. Limited Edition di ${AVVENTO.totalPieces} pezzi, solo ${AVVENTO.stock} prenotabili online: preordina a €${AVVENTO.preorderPrice} invece di €${AVVENTO.fullPrice}. Ritiro in salone a Catanzaro.`,
  alternates: { canonical: '/avvento' },
  openGraph: {
    title: `Calendario dell'Avvento Paparazzo - Limited Edition, solo ${AVVENTO.stock} pezzi online`,
    description: `24 sorprese per i tuoi capelli. Preordine a €${AVVENTO.preorderPrice} invece di €${AVVENTO.fullPrice}, solo per 96 ore.`,
    url: '/avvento',
  },
};

const FAQ = [
  {
    q: 'Quando e dove ritiro il calendario?',
    a: `In salone, in ${BUSINESS.address.full}, ${AVVENTO.pickupFrom}. Ti avvisiamo noi su WhatsApp quando è pronto, così lo hai prima del 1° dicembre.`,
  },
  {
    q: 'Cosa succede dopo le 96 ore?',
    a: `Il prezzo preordine di €${AVVENTO.preorderPrice} scade e il calendario sale a €${AVVENTO.fullPrice}. Se lo prenoti ora, il prezzo resta bloccato anche se paghi al ritiro.`,
  },
  {
    q: 'Posso pagare in contanti?',
    a: 'Sì. Scegli "Contanti in salone": il calendario viene riservato a tuo nome al prezzo di oggi e lo paghi quando passi a ritirarlo.',
  },
  {
    q: 'È un buon regalo?',
    a: 'È il regalo perfetto per chi ama prendersi cura di sé: il cofanetto rosso con fiocco è già pronto da regalare, e se ci lasci una nota possiamo aggiungere un biglietto personalizzato.',
  },
  {
    q: `Perché solo ${AVVENTO.stock} pezzi online?`,
    a: `È una Limited Edition di ${AVVENTO.totalPieces} calendari, con una selezione curata dal nostro team. Solo ${AVVENTO.stock} sono prenotabili online, gli altri sono riservati alle clienti in salone. Quando finiscono, non ne faremo altri.`,
  },
];

const NOTICES: Record<string, string> = {
  annullato: 'Pagamento annullato: il tuo calendario non è stato ancora preordinato. Puoi riprovare qui sotto.',
  pagamento: 'Il pagamento non è andato a buon fine. Riprova oppure scegli "Contanti in salone".',
  scaduto: 'La prenotazione è scaduta e i pezzi sono stati presi da altri. Scrivici su WhatsApp per la lista d\'attesa.',
};

export default function AvventoPage({ searchParams }: { searchParams: { annullato?: string; errore?: string } }) {
  const notice = searchParams.annullato ? NOTICES.annullato : searchParams.errore ? NOTICES[searchParams.errore] : null;

  const images = availableImages();
  const launched = isLaunched();
  const preview = !launched && hasPreviewAccess();
  const launch = launchInfo();

  if (!launched && !preview) {
    return (
      <Teaser
        images={images}
        launchAt={launch.iso}
        launchLabel={launch.label}
        launchDay={launch.day}
        launchTime={launch.time}
      />
    );
  }

  const initial: AvventoStatus = {
    remaining: getRemaining(),
    stock: AVVENTO.stock,
    price: getCurrentPrice(),
    fullPrice: AVVENTO.fullPrice,
    preorderPrice: AVVENTO.preorderPrice,
    preorderActive: isPreorderActive(),
    deadline: getPreorderDeadline().toISOString(),
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: AVVENTO.productName,
    brand: { '@type': 'Brand', name: BUSINESS.name },
    description: '24 cassetti con prodotti a marchio Paparazzo, gift card e servizi gratuiti da usare in salone.',
    image: `https://www.paparazzoparrucchieri.it${images[0]?.src ?? '/images/Marchio.jpg'}`,
    offers: {
      '@type': 'Offer',
      price: initial.price,
      priceCurrency: 'EUR',
      availability: initial.remaining > 0 ? 'https://schema.org/PreOrder' : 'https://schema.org/SoldOut',
      url: 'https://www.paparazzoparrucchieri.it/avvento',
      priceValidUntil: initial.deadline.slice(0, 10),
    },
  };

  return (
    <div className="avvento relative overflow-hidden bg-av-ink text-av-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      {preview && <PreviewBar launchLabel={launch.label} />}

      {/* Neve */}
      <div className="av-snow pointer-events-none absolute inset-0" aria-hidden />

      {/* Barra urgenza */}
      <div className="relative z-10 border-b border-av-gold/20 bg-av-berry px-4 py-2 text-center text-sm font-medium text-white">
        {initial.preorderActive ? (
          <>
            <SparkleIcon className="mr-1.5 inline h-4 w-4 -translate-y-px text-av-gold" />
            Prezzo preordine valido ancora per{' '}
            <strong>
              <Countdown initial={initial} compact />
            </strong>{' '}
            · Limited Edition, solo {AVVENTO.stock} pezzi online
          </>
        ) : (
          <>
            <SparkleIcon className="mr-1.5 inline h-4 w-4 -translate-y-px text-av-gold" />
            Limited Edition · {AVVENTO.totalPieces} pezzi · solo {AVVENTO.stock} online</>
        )}
      </div>

      {/* HERO */}
      <section className="relative z-10 px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full border border-av-gold/40 px-4 py-1 text-xs uppercase tracking-[0.25em] text-av-gold">
              Limited Edition · {AVVENTO.totalPieces} pezzi · solo {AVVENTO.stock} online
            </p>
            <h1 className="mb-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              24 giorni di coccole
              <br />
              <span className="italic text-av-gold">per i tuoi capelli</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-av-cream/80">
              Un elegante cofanetto rosso e oro con 24 cassetti, curato dal team di{' '}
              <strong>Paparazzo Parrucchieri</strong>: ogni giorno una sorpresa tra prodotti a marchio Paparazzo, gift
              card e servizi esclusivi da vivere in salone.
            </p>

            <PriceTag initial={initial} />
            <p className="mb-6 mt-2 text-sm text-av-cream/60">
              Dopo le 96 ore il prezzo sale a €{AVVENTO.fullPrice} · Valore commerciale €{AVVENTO.contentValue} tra
              prodotti e servizi · Ritiro in salone {AVVENTO.pickupFrom}
            </p>

            <div className="mb-6 max-w-md">
              <StockBar initial={initial} />
            </div>

            <a
              href="#preordina"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-av-gold to-[#f1d49a] px-8 py-4 text-lg font-bold text-av-ink shadow-xl shadow-av-gold/20 transition hover:scale-[1.02]"
            >
              Preordina il tuo calendario →
            </a>
            <p className="mt-3 text-xs text-av-cream/50">Carta · PayPal · Contanti in salone</p>
          </div>

          {images[0] ? (
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-av-gold/20 blur-3xl" aria-hidden />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-av-gold/50 shadow-2xl">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 512px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 rotate-[-6deg] rounded-full bg-av-berry px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-xl">
                Limited Edition
                <span className="block text-[11px] font-medium normal-case tracking-normal">{AVVENTO.totalPieces} pezzi · {AVVENTO.stock} online</span>
              </div>
            </div>
          ) : (
            <CalendarVisual />
          )}
        </div>
      </section>

      {/* GALLERIA */}
      {images.length > 1 && (
        <section className="relative z-10 px-4 pb-16 sm:px-6 lg:pb-24">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {images.slice(1).map((img) => (
              <div key={img.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-av-gold/30 [&:nth-child(3)]:hidden lg:[&:nth-child(3)]:block">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 384px"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CHI LO RIEMPIE */}
      <section className="relative z-10 px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-av-gold/20 bg-av-pine/40 p-8 text-center sm:p-12">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-av-gold">La confezione è bella, il contenuto è nostro</p>
          <h2 className="mb-5 font-display text-3xl font-bold sm:text-4xl">
            Scelto dalle mani di <span className="italic text-av-gold">Paparazzo Parrucchieri</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-av-cream/75">
            Ogni giorno in salone, in {BUSINESS.address.street} a {BUSINESS.address.city}, ci prendiamo cura di capelli
            di ogni tipo: nanoplastia, extension, color correction. Dentro questo calendario abbiamo messo i nostri
            prodotti a marchio Paparazzo, gift card e servizi gratuiti: capelli curati a casa e momenti per te in
            salone, per tutto dicembre e oltre.
          </p>
          <div className="grid gap-6 text-left sm:grid-cols-3">
            {[
              { t: 'Prodotti Paparazzo', d: 'La nostra linea a marchio Paparazzo, da usare a casa ogni giorno.' },
              { t: 'Selezione curata', d: 'Ogni cassetto è pensato dai nostri professionisti per la cura dei tuoi capelli.' },
              { t: 'Servizi in omaggio', d: 'Gift card e servizi gratuiti per tornare a trovarci in salone.' },
            ].map((x) => (
              <div key={x.t} className="border-l-2 border-av-gold/60 pl-4">
                <h3 className="mb-1 font-semibold text-av-gold">{x.t}</h3>
                <p className="text-sm text-av-cream/70">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COSA C'È DENTRO */}
      <section className="relative z-10 bg-av-pine/60 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-display text-3xl font-bold sm:text-4xl">
            Cosa trovi dietro le <span className="italic text-av-gold">24 caselle</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-av-cream/70">
            Tre tipi di sorprese, tutte firmate dal salone: da usare a casa e da vivere in salone con noi.
          </p>
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
            {AVVENTO.highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border border-av-gold/20 bg-av-ink/50 p-6 transition hover:-translate-y-1 hover:border-av-gold/50"
              >
                {(() => {
                  const Icon = HIGHLIGHT_ICONS[h.icon];
                  return (
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-av-gold/40 bg-av-gold/5 text-av-gold">
                      <Icon className="h-7 w-7" />
                    </div>
                  );
                })()}
                <h3 className="mb-2 font-display text-xl font-semibold text-av-gold">{h.title}</h3>
                <p className="text-sm text-av-cream/75">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="relative z-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-av-gold/30 bg-gradient-to-b from-av-pine to-av-ink p-8 text-center sm:p-12">
          <h2 className="mb-8 font-display text-3xl font-bold sm:text-4xl">Fai due conti</h2>
          <div className="mx-auto max-w-sm space-y-3 text-left">
            <div className="flex justify-between border-b border-av-cream/10 pb-3">
              <span className="text-av-cream/70">Valore commerciale (prodotti + servizi)</span>
              <span className="font-semibold">€{AVVENTO.contentValue}</span>
            </div>
            <div className="flex justify-between border-b border-av-cream/10 pb-3">
              <span className="text-av-cream/70">Prezzo dopo il preordine</span>
              <span className="font-semibold line-through decoration-av-berry decoration-2">€{AVVENTO.fullPrice}</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-semibold text-av-gold">Prezzo preordine (96 ore)</span>
              <span className="font-display text-4xl font-bold text-av-gold">€{AVVENTO.preorderPrice}</span>
            </div>
          </div>
          <div className="mt-10">
            <Countdown initial={initial} />
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="relative z-10 bg-av-pine/60 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-bold sm:text-4xl">Come funziona il preordine</h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {[
              { n: '1', t: 'Prenota ora', d: `Blocca il prezzo di €${AVVENTO.preorderPrice} compilando il modulo qui sotto: ci vuole un minuto.` },
              { n: '2', t: 'Paga come preferisci', d: 'Online con carta o PayPal, oppure in contanti quando passi in salone.' },
              { n: '3', t: 'Ritira in salone', d: `Ti scriviamo quando è pronto: lo ritiri ${AVVENTO.pickupFrom}, in tempo per il 1° dicembre.` },
            ].map((s) => (
              <li key={s.n} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-av-gold font-display text-2xl font-bold text-av-gold">
                  {s.n}
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{s.t}</h3>
                <p className="text-av-cream/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FORM */}
      <section id="preordina" className="relative z-10 scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-center font-display text-3xl font-bold sm:text-4xl">
            Riserva il tuo <span className="italic text-av-gold">calendario</span>
          </h2>
          <p className="mb-8 text-center text-av-cream/70">
            Limited Edition di {AVVENTO.totalPieces} pezzi: solo {AVVENTO.stock} sono prenotabili online. Quando finiscono, non ne faremo altri.
          </p>
          {notice && (
            <p role="alert" className="mb-6 rounded-xl border border-av-berry bg-av-berry/20 p-4 text-center text-sm">
              {notice}
            </p>
          )}
          <div className="mb-8 rounded-2xl border border-av-gold/20 bg-av-pine/50 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <PriceTag initial={initial} size="md" />
            </div>
            <StockBar initial={initial} />
          </div>
          <div className="rounded-3xl border border-av-cream/10 bg-av-pine/40 p-6 sm:p-8">
            <OrderForm initial={initial} maxPerOrder={AVVENTO.maxPerOrder} pickupFrom={AVVENTO.pickupFrom} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 bg-av-pine/60 px-4 py-16 pb-32 sm:px-6 md:pb-24 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-bold sm:text-4xl">Domande frequenti</h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-av-cream/10 bg-av-ink/50 p-5 open:border-av-gold/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-2xl text-av-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-av-cream/75">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href="#preordina"
              className="inline-flex rounded-full bg-av-gold px-8 py-4 text-lg font-bold text-av-ink shadow-xl shadow-av-gold/20"
            >
              Voglio il mio calendario
            </a>
          </div>
        </div>
      </section>

      <StickyBar initial={initial} />
    </div>
  );
}
