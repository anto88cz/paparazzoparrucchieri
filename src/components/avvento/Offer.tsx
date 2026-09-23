'use client';

import { useAvventoStatus, useNow, euro, type AvventoStatus } from './useAvventoStatus';

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Countdown({ initial, compact = false }: { initial: AvventoStatus; compact?: boolean }) {
  const status = useAvventoStatus(initial);
  const now = useNow();
  const left = new Date(status.deadline).getTime() - now;
  const active = left > 0;
  const t = split(left);

  if (!active) {
    return compact ? (
      <span>Prezzo preordine scaduto</span>
    ) : (
      <p className="text-center text-sm text-av-cream/80">
        Il prezzo preordine è scaduto: ora il calendario è a prezzo pieno.
      </p>
    );
  }

  if (compact) {
    return (
      <span className="tabular-nums" suppressHydrationWarning>
        {t.d > 0 && `${t.d}g `}
        {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
      </span>
    );
  }

  const cells = [
    { v: t.d, l: 'giorni' },
    { v: t.h, l: 'ore' },
    { v: t.m, l: 'minuti' },
    { v: t.s, l: 'secondi' },
  ];
  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="timer" aria-live="off" suppressHydrationWarning>
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

export function PriceTag({ initial, size = 'lg' }: { initial: AvventoStatus; size?: 'lg' | 'md' }) {
  const status = useAvventoStatus(initial);
  const now = useNow();
  const active = new Date(status.deadline).getTime() > now;
  const price = active ? status.preorderPrice : status.fullPrice;
  const save = status.fullPrice - status.preorderPrice;
  const big = size === 'lg' ? 'text-6xl sm:text-7xl' : 'text-5xl';

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
      {active && (
        <span className="text-2xl text-av-cream/60 line-through decoration-av-berry decoration-[3px]">
          {euro(status.fullPrice)}
        </span>
      )}
      <span className={`font-display font-bold leading-none text-av-gold ${big}`}>{euro(price)}</span>
      {active && (
        <span className="mb-2 rounded-full bg-av-berry px-3 py-1 text-sm font-bold uppercase tracking-wide text-white">
          Risparmi {euro(save)}
        </span>
      )}
    </div>
  );
}

export function StockBar({ initial }: { initial: AvventoStatus }) {
  const status = useAvventoStatus(initial);
  const sold = status.stock - status.remaining;
  const pct = Math.round((sold / status.stock) * 100);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-av-cream">
          {status.remaining > 0 ? (
            <>
              Solo <span className="text-lg font-bold text-av-gold">{status.remaining}</span> su {status.stock}{' '}
              disponibili online
            </>
          ) : (
            <span className="text-av-gold">Esaurito online</span>
          )}
        </span>
        <span className="text-av-cream/60">{sold} già prenotati</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-av-berry to-av-gold transition-all duration-700"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
    </div>
  );
}

export function StickyBar({ initial }: { initial: AvventoStatus }) {
  const status = useAvventoStatus(initial);
  const now = useNow();
  const active = new Date(status.deadline).getTime() > now;
  if (status.remaining <= 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-av-gold/30 bg-av-ink/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="leading-tight">
          <div className="flex items-baseline gap-2">
            {active && <span className="text-sm text-av-cream/50 line-through">{euro(status.fullPrice)}</span>}
            <span className="font-display text-2xl font-bold text-av-gold">
              {euro(active ? status.preorderPrice : status.fullPrice)}
            </span>
          </div>
          <div className="text-xs text-av-cream/70">
            {active ? (
              <>
                Scade tra <Countdown initial={initial} compact />
              </>
            ) : (
              `Ultimi ${status.remaining} pezzi online`
            )}
          </div>
        </div>
        <a
          href="#preordina"
          className="rounded-full bg-av-gold px-5 py-3 text-sm font-bold text-av-ink shadow-lg shadow-av-gold/20"
        >
          Preordina ora
        </a>
      </div>
    </div>
  );
}
