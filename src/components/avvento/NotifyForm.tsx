'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getWhatsAppLink } from '@/lib/whatsapp';

/** Modulo "Avvisami all'apertura": salva nome e numero, il salone scrive su WhatsApp all'apertura. */
export default function NotifyForm({ launchLabel, align = 'left' }: { launchLabel: string; align?: 'left' | 'center' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const whatsappLink = getWhatsAppLink(
    `Ciao! Avvisatemi quando aprono i preordini del Calendario dell'Avvento Paparazzo 🎄`
  );
  const center = align === 'center';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/avvento/avvisami', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: fd.get('nome'),
          telefono: fd.get('telefono'),
          website: fd.get('website'),
          privacy: fd.get('privacy') === 'on',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Qualcosa è andato storto, riprova.');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Qualcosa è andato storto, riprova.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={`max-w-md rounded-2xl border border-av-gold/40 bg-av-pine/60 p-5 ${center ? 'mx-auto text-center' : ''}`}>
        <p className="mb-1 font-display text-2xl text-av-gold">Fatto, sei nella lista! 🎄</p>
        <p className="text-sm text-av-cream/80">
          Ti scriviamo su WhatsApp il {launchLabel}, appena si aprono i preordini.
        </p>
      </div>
    );
  }

  const input =
    'w-full rounded-xl border border-av-cream/20 bg-av-ink/50 px-4 py-3 text-av-cream placeholder:text-av-cream/40 focus:border-av-gold focus:outline-none focus:ring-2 focus:ring-av-gold/30';

  return (
    <form onSubmit={onSubmit} className={`max-w-md space-y-3 ${center ? 'mx-auto text-left' : ''}`}>
      {/* Honeypot anti-bot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Nome</span>
          <input name="nome" required maxLength={60} autoComplete="given-name" placeholder="Il tuo nome" className={input} />
        </label>
        <label className="block">
          <span className="sr-only">Numero WhatsApp</span>
          <input
            name="telefono"
            type="tel"
            required
            autoComplete="tel"
            placeholder="Numero WhatsApp"
            className={input}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 text-xs text-av-cream/70">
        <input type="checkbox" name="privacy" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#d9b26f]" />
        <span>
          Acconsento a essere contattato su WhatsApp da Paparazzo Parrucchieri per l&apos;apertura dei preordini del
          Calendario dell&apos;Avvento, come da{' '}
          <Link href="/privacy" className="underline hover:text-av-gold">
            informativa privacy
          </Link>
          .
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
        className="w-full rounded-full bg-gradient-to-r from-av-gold to-[#f1d49a] px-8 py-4 text-lg font-bold text-av-ink shadow-xl shadow-av-gold/20 transition hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? 'Un attimo…' : "Avvisami all'apertura"}
      </button>

      <p className={`text-xs text-av-cream/50 ${center ? 'text-center' : ''}`}>
        Oppure{' '}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-av-gold">
          scrivici direttamente su WhatsApp
        </a>
      </p>
    </form>
  );
}
