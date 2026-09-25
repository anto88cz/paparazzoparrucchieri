import Image from 'next/image';
import { AVVENTO } from '@/config/avvento';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { HIGHLIGHT_ICONS, SparkleIcon } from './Icons';
import { LaunchCountdown, SantaAccess } from './Launch';

interface Props {
  images: { src: string; alt: string }[];
  launchAt: string;
  launchLabel: string;
  launchDay: string;
  launchTime: string;
}

/** Pagina di attesa mostrata prima dell'apertura dei preordini. */
export default function Teaser({ images, launchAt, launchLabel, launchDay, launchTime }: Props) {
  const notifyLink = getWhatsAppLink(
    `Ciao! Avvisatemi quando aprono i preordini del Calendario dell'Avvento Paparazzo 🎄`
  );

  return (
    <div className="avvento relative overflow-hidden bg-av-ink text-av-cream">
      <div className="av-snow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 border-b border-av-gold/20 bg-av-berry px-4 py-2 text-center text-sm font-medium text-white">
        <SparkleIcon className="mr-1.5 inline h-4 w-4 -translate-y-px text-av-gold" />
        Preordini aperti dal <strong>{launchLabel}</strong> · Limited Edition, solo {AVVENTO.stock} pezzi online
      </div>

      {/* HERO */}
      <section className="relative z-10 px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full border border-av-gold/40 px-4 py-1 text-xs uppercase tracking-[0.25em] text-av-gold">
              In arrivo · Natale 2026
            </p>
            <h1 className="mb-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Il Calendario dell&apos;Avvento
              <br />
              <span className="italic text-av-gold">di Paparazzo Parrucchieri</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-av-cream/80">
              24 giorni di sorprese per i tuoi capelli, in un elegante cofanetto rosso e oro curato dal nostro team.
              Una Limited Edition di soli {AVVENTO.totalPieces} pezzi.
            </p>

            <p className="mb-3 text-sm uppercase tracking-widest text-av-cream/60">I preordini aprono tra</p>
            <LaunchCountdown launchAt={launchAt} />
            <p className="mb-8 mt-3 text-sm text-av-cream/60">{launchLabel}</p>

            <a
              href={notifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-av-gold to-[#f1d49a] px-8 py-4 text-lg font-bold text-av-ink shadow-xl shadow-av-gold/20 transition hover:scale-[1.02]"
            >
              Avvisami all&apos;apertura
            </a>
            <p className="mt-3 text-xs text-av-cream/50">Ti scriviamo su WhatsApp appena si aprono i preordini</p>
          </div>

          {images[0] && (
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
                <span className="block text-[11px] font-medium normal-case tracking-normal">
                  {AVVENTO.totalPieces} pezzi
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LA STORIA */}
      <section className="relative z-10 px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-av-gold/20 bg-av-pine/40 p-8 text-center sm:p-12">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-av-gold">La nostra idea di Natale</p>
          <h2 className="mb-5 font-display text-3xl font-bold sm:text-4xl">
            Un mese di coccole, <span className="italic text-av-gold">a casa e in salone</span>
          </h2>
          <p className="mx-auto max-w-2xl text-av-cream/75">
            Ogni giorno in salone ci prendiamo cura di capelli di ogni tipo.
            Quest&apos;anno abbiamo voluto portare quella cura
            anche a casa tua: dal 1° al 24 dicembre, ogni mattina apri un cassetto e trovi una sorpresa scelta dai
            nostri professionisti. Alcune da usare a casa, altre da vivere con noi in salone.
          </p>
        </div>
      </section>

      {/* COSA C'È DENTRO */}
      <section className="relative z-10 bg-av-pine/60 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-display text-3xl font-bold sm:text-4xl">
            Cosa troverai dentro i <span className="italic text-av-gold">24 cassetti</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-av-cream/70">
            Tre tipi di sorprese, tutte firmate dal salone.
          </p>
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
            {AVVENTO.highlights.map((h) => {
              const Icon = HIGHLIGHT_ICONS[h.icon];
              return (
                <div key={h.title} className="rounded-2xl border border-av-gold/20 bg-av-ink/50 p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-av-gold/40 bg-av-gold/5 text-av-gold">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-av-gold">{h.title}</h3>
                  <p className="text-sm text-av-cream/75">{h.text}</p>
                </div>
              );
            })}
          </div>

          {images.length > 1 && (
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {images.slice(1).map((img) => (
                <div
                  key={img.src}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-av-gold/30 [&:nth-child(3)]:hidden lg:[&:nth-child(3)]:block"
                >
                  <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 50vw, 384px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VALORE + DATA */}
      <section className="relative z-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {[
            { big: `€${AVVENTO.contentValue}`, small: 'di valore commerciale tra prodotti e servizi' },
            { big: String(AVVENTO.totalPieces), small: `pezzi in tutto, solo ${AVVENTO.stock} prenotabili online` },
            { big: launchDay, small: `ore ${launchTime}: apertura dei preordini con prezzo speciale per ${AVVENTO.preorderHours} ore` },
          ].map((x) => (
            <div key={x.small} className="rounded-2xl border border-av-gold/30 bg-av-pine/50 p-6 text-center">
              <div className="mb-2 font-display text-4xl font-bold text-av-gold">{x.big}</div>
              <p className="text-sm text-av-cream/75">{x.small}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-xl text-center text-av-cream/70">
          Il {launchLabel} questa pagina si trasforma: potrai preordinare online con carta o PayPal, oppure riservarlo
          e pagarlo in contanti al ritiro in salone. I primi arrivati avranno il prezzo di preordine.
        </p>
        <div className="mt-8 text-center">
          <a
            href={notifyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-av-gold px-8 py-4 text-lg font-bold text-av-ink shadow-xl shadow-av-gold/20"
          >
            Avvisami all&apos;apertura
          </a>
        </div>
      </section>

      <div className="relative z-10 pb-10">
        <SantaAccess />
      </div>
    </div>
  );
}
