import { AVVENTO } from '@/config/avvento';
import Image from 'next/image';

/** Sezione "Golden Ticket": un buono nascosto in uno solo dei calendari. */
export default function GoldenTicket() {
  const { value } = AVVENTO.goldenTicket;

  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-av-gold">E in più, un premio nascosto</p>
        <h2 className="mb-5 font-display text-3xl font-bold sm:text-4xl">
          Trova il <span className="italic text-av-gold">Golden Ticket</span>
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-av-cream/75">
          In uno solo dei {AVVENTO.totalPieces} calendari abbiamo nascosto un Golden Ticket: un buono da €{value} da
          spendere in salone, in aggiunta a tutte le sorprese dei 24 cassetti. Nessuno sa quale sia: potrebbe essere
          proprio il tuo.
        </p>

        {/* Biglietto */}
        <div className="relative mx-auto max-w-2xl -rotate-2 transition duration-500 hover:rotate-0">
          <div className="absolute inset-4 rounded-[2rem] bg-av-gold/30 blur-3xl" aria-hidden />
          <Image
            src="/images/avvento/golden-ticket.webp"
            alt={`Golden Ticket Paparazzo Parrucchieri: buono valore €${value}`}
            width={1200}
            height={518}
            sizes="(max-width: 768px) 100vw, 672px"
            className="relative h-auto w-full drop-shadow-2xl"
          />
          <div className="absolute -bottom-5 right-2 rotate-[6deg] rounded-full bg-av-berry px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-xl sm:right-6 sm:text-sm">
            1 su {AVVENTO.totalPieces} calendari
          </div>
        </div>
      </div>
    </section>
  );
}
