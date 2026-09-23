'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SparkleIcon } from './Icons';

const pad = (n: number) => String(n).padStart(2, '0');

/** Conto alla rovescia all'apertura: allo scadere ricarica la pagina e mostra la landing. */
export function LaunchCountdown({ launchAt }: { launchAt: string }) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const left = Math.max(0, new Date(launchAt).getTime() - now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (left === 0) router.refresh();
  }, [left, router]);

  const s = Math.floor(left / 1000);
  const cells = [
    { v: Math.floor(s / 86400), l: 'giorni' },
    { v: Math.floor((s % 86400) / 3600), l: 'ore' },
    { v: Math.floor((s % 3600) / 60), l: 'minuti' },
    { v: s % 60, l: 'secondi' },
  ];

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" suppressHydrationWarning>
      {cells.map((c) => (
        <div
          key={c.l}
          className="min-w-[64px] rounded-xl border border-av-gold/40 bg-av-ink/60 px-2 py-2 text-center backdrop-blur sm:min-w-[76px]"
        >
          <div className="font-display text-3xl font-bold tabular-nums text-av-gold sm:text-4xl" suppressHydrationWarning>
            {pad(c.v)}
          </div>
          <div className="text-[11px] uppercase tracking-widest text-av-cream/70">{c.l}</div>
        </div>
      ))}
    </div>
  );
}

/** Accesso nascosto con la parola segreta di Babbo Natale. */
export function SantaAccess() {
  const [open, setOpen] = useState(false);
  const [parola, setParola] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/avvento/babbo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parola }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (res?.ok && json?.ok) {
      window.location.reload();
      return;
    }
    setError(json?.error || 'Qualcosa è andato storto.');
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Stella di Natale"
        className="mx-auto block p-3 text-av-gold/25 transition hover:text-av-gold/60"
      >
        <SparkleIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-xs flex-col items-center gap-2">
      <input
        type="password"
        autoFocus
        autoComplete="off"
        value={parola}
        onChange={(e) => setParola(e.target.value)}
        placeholder="Parola segreta di Babbo Natale"
        className="w-full rounded-full border border-av-gold/40 bg-av-ink/60 px-4 py-2 text-center text-sm text-av-cream placeholder:text-av-cream/40 focus:border-av-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !parola}
        className="rounded-full bg-av-gold px-5 py-2 text-sm font-bold text-av-ink disabled:opacity-50"
      >
        {loading ? '…' : 'Entra'}
      </button>
      {error && <p className="text-xs text-av-cream/70">{error}</p>}
    </form>
  );
}

/** Barra visibile solo in anteprima, con uscita. */
export function PreviewBar({ launchLabel }: { launchLabel: string }) {
  async function exit() {
    await fetch('/api/avvento/babbo', { method: 'DELETE' }).catch(() => null);
    window.location.reload();
  }
  return (
    <div className="relative z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-emerald-800 px-4 py-2 text-center text-sm text-white">
      <span>
        🎅 <strong>Anteprima segreta</strong> · il pubblico vedrà questa pagina dal {launchLabel}
      </span>
      <button type="button" onClick={exit} className="underline underline-offset-2 hover:text-av-gold">
        Esci dall&apos;anteprima
      </button>
    </div>
  );
}
