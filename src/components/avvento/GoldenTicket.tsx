import { AVVENTO } from '@/config/avvento';
import { SparkleIcon } from './Icons';

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
        <div className="relative mx-auto max-w-xl -rotate-2 transition duration-500 hover:rotate-0">
          <div className="absolute -inset-4 rounded-[2rem] bg-av-gold/25 blur-2xl" aria-hidden />
          <div className="relative flex overflow-hidden rounded-2xl bg-gradient-to-br from-[#f3dca6] via-av-gold to-[#b8904c] text-av-ink shadow-2xl">
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-10">
              <SparkleIcon className="mb-2 h-6 w-6" />
              <p className="text-xs font-semibold uppercase tracking-[0.35em]">Golden Ticket</p>
              <p className="my-1 font-display text-6xl font-bold leading-none sm:text-7xl">€{value}</p>
              <p className="text-sm font-medium">da spendere in salone</p>
            </div>
            {/* Tagliando staccabile */}
            <div className="relative flex w-24 flex-col items-center justify-center border-l-2 border-dashed border-av-ink/30 px-2 sm:w-28">
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-av-ink" aria-hidden />
              <span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-av-ink" aria-hidden />
              <p className="font-display text-3xl font-bold">1</p>
              <p className="text-center text-[11px] font-semibold uppercase leading-tight tracking-wide">
                su {AVVENTO.totalPieces}
                <br />
                calendari
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
