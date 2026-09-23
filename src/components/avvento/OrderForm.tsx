'use client';

import { useState } from 'react';
import Link from 'next/link';
import { refreshAvventoStatus, useAvventoStatus, useNow, euro, type AvventoStatus } from './useAvventoStatus';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { CardIcon, LockIcon, StoreIcon, WalletIcon } from './Icons';

type Metodo = 'stripe' | 'paypal' | 'contanti';

const METODI: { id: Metodo; title: string; text: string; icon: typeof CardIcon }[] = [
  { id: 'stripe', title: 'Carta di credito', text: 'Visa, Mastercard, Apple Pay, Google Pay', icon: CardIcon },
  { id: 'paypal', title: 'PayPal', text: 'Paga con il tuo conto PayPal', icon: WalletIcon },
  { id: 'contanti', title: 'Contanti in salone', text: 'Blocca il prezzo ora, paghi al ritiro', icon: StoreIcon },
];

export default function OrderForm({
  initial,
  maxPerOrder,
  pickupFrom,
}: {
  initial: AvventoStatus;
  maxPerOrder: number;
  pickupFrom: string;
}) {
  const status = useAvventoStatus(initial);
  const now = useNow();
  const active = new Date(status.deadline).getTime() > now;
  const price = active ? status.preorderPrice : status.fullPrice;

  const [metodo, setMetodo] = useState<Metodo>('stripe');
  const [quantita, setQuantita] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxQty = Math.max(1, Math.min(maxPerOrder, status.remaining));
  const qty = Math.min(quantita, maxQty);
  const soldOut = status.remaining <= 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/avvento/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: fd.get('nome'),
          cognome: fd.get('cognome'),
          telefono: fd.get('telefono'),
          email: fd.get('email'),
          note: fd.get('note'),
          website: fd.get('website'),
          privacy: fd.get('privacy') === 'on',
          quantita: qty,
          metodo,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Qualcosa è andato storto, riprova.');
        refreshAvventoStatus();
        setLoading(false);
        return;
      }
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as unknown as { gtag: (...a: unknown[]) => void }).gtag('event', 'begin_checkout', {
          currency: 'EUR',
          value: price * qty,
          payment_type: metodo,
        });
      }
      window.location.href = json.redirect;
    } catch {
      setError('Connessione assente. Controlla la rete e riprova.');
      setLoading(false);
    }
  }

  if (soldOut) {
    return (
      <div className="rounded-3xl border border-av-gold/30 bg-av-pine/60 p-8 text-center">
        <p className="mb-2 font-display text-3xl text-av-gold">Esaurito online!</p>
        <p className="mb-6 text-av-cream/80">
          I {status.stock} calendari prenotabili online sono esauriti. Scrivici su WhatsApp: verifichiamo se ne restano in
          salone o ti mettiamo in lista d&apos;attesa.
        </p>
        <a
          href={getWhatsAppLink("Ciao! Il Calendario dell'Avvento è esaurito online, ne avete ancora in salone? 🎄")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-av-gold px-8 py-4 font-bold text-av-ink"
        >
          Chiedi disponibilità in salone
        </a>
      </div>
    );
  }

  const input =
    'w-full rounded-xl border border-av-cream/20 bg-av-ink/50 px-4 py-3 text-av-cream placeholder:text-av-cream/40 focus:border-av-gold focus:outline-none focus:ring-2 focus:ring-av-gold/30';

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate={false}>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-av-cream/80">Nome *</span>
          <input name="nome" required autoComplete="given-name" className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-av-cream/80">Cognome *</span>
          <input name="cognome" required autoComplete="family-name" className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-av-cream/80">Telefono *</span>
          <input name="telefono" type="tel" required autoComplete="tel" placeholder="+39 ..." className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-av-cream/80">Email *</span>
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
      </div>

      <div>
        <span className="mb-2 block text-sm text-av-cream/80">Quantità</span>
        <div className="inline-flex items-center rounded-full border border-av-cream/20 bg-av-ink/50">
          <button
            type="button"
            onClick={() => setQuantita(Math.max(1, qty - 1))}
            className="h-11 w-11 text-xl text-av-cream disabled:opacity-30"
            disabled={qty <= 1}
            aria-label="Diminuisci quantità"
          >
            −
          </button>
          <span className="w-10 text-center text-lg font-bold text-av-cream tabular-nums">{qty}</span>
          <button
            type="button"
            onClick={() => setQuantita(Math.min(maxQty, qty + 1))}
            className="h-11 w-11 text-xl text-av-cream disabled:opacity-30"
            disabled={qty >= maxQty}
            aria-label="Aumenta quantità"
          >
            +
          </button>
        </div>
        <span className="ml-3 text-xs text-av-cream/50">max {maxPerOrder} a persona</span>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm text-av-cream/80">Come vuoi pagare?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {METODI.map((m) => (
            <label
              key={m.id}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                metodo === m.id
                  ? 'border-av-gold bg-av-gold/10 ring-2 ring-av-gold/40'
                  : 'border-av-cream/15 bg-av-ink/40 hover:border-av-cream/40'
              }`}
            >
              <input
                type="radio"
                name="metodo"
                value={m.id}
                checked={metodo === m.id}
                onChange={() => setMetodo(m.id)}
                className="sr-only"
              />
              <m.icon className="mb-2 h-7 w-7 text-av-gold" />
              <div className="font-semibold text-av-cream">{m.title}</div>
              <div className="text-xs text-av-cream/60">{m.text}</div>
            </label>
          ))}
        </div>
        {metodo === 'contanti' && (
          <p className="mt-3 rounded-xl bg-av-gold/10 p-3 text-sm text-av-cream/90">
            Il tuo calendario resta bloccato al prezzo di oggi. Lo paghi in contanti quando lo ritiri in salone{' '}
            {pickupFrom}.
          </p>
        )}
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-sm text-av-cream/80">Note (facoltativo)</span>
        <input name="note" maxLength={300} placeholder="Es. è un regalo per mia sorella" className={input} />
      </label>

      <label className="flex items-start gap-3 text-sm text-av-cream/70">
        <input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 accent-[#d9b26f]" />
        <span>
          Acconsento al trattamento dei miei dati per gestire il preordine, come da{' '}
          <Link href="/privacy" className="underline hover:text-av-gold">
            informativa privacy
          </Link>
          . *
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-xl border border-av-berry bg-av-berry/20 p-3 text-sm text-white">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-av-gold to-[#f1d49a] px-8 py-5 text-lg font-bold text-av-ink shadow-xl shadow-av-gold/20 transition hover:scale-[1.01] disabled:opacity-60"
      >
        <span className="relative z-10">
          {loading
            ? 'Un attimo…'
            : metodo === 'contanti'
              ? `Prenota ora · ${euro(price * qty)} al ritiro`
              : `Preordina ora · ${euro(price * qty)}`}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </button>

      <p className="text-center text-xs text-av-cream/50">
        <LockIcon className="mr-1 inline h-3.5 w-3.5 -translate-y-px" />
        Pagamenti sicuri gestiti da Stripe e PayPal · Nessun dato di carta passa dal nostro sito
      </p>
    </form>
  );
}
