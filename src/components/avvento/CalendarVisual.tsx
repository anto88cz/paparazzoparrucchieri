'use client';

import { useState } from 'react';
import { BottleIcon, GiftCardIcon, ScissorsIcon, SparkleIcon } from './Icons';

// Ordine "sparso" delle caselle come in un vero calendario
const DOORS = [7, 15, 2, 21, 11, 18, 4, 23, 9, 13, 1, 20, 16, 6, 24, 10, 3, 19, 12, 8, 22, 5, 17, 14];
const PEEK = [BottleIcon, SparkleIcon, GiftCardIcon, ScissorsIcon];
const BIG = new Set([24, 1, 12]);

export default function CalendarVisual() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([1, 12]));

  const toggle = (n: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-av-gold/20 blur-3xl" aria-hidden />
      <div className="relative rounded-[2rem] border border-av-gold/50 bg-gradient-to-br from-[#7a1b2e] via-av-berry to-[#5b1322] p-4 shadow-2xl sm:p-5">
        <div className="mb-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-av-gold/80">Paparazzo Parrucchieri</div>
          <div className="font-display text-xl italic text-av-cream">Advent Beauty Box</div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {DOORS.map((n, i) => {
            const isOpen = open.has(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggle(n)}
                aria-label={`Casella ${n}${isOpen ? ' aperta' : ''}`}
                className={`relative aspect-square rounded-lg border text-av-gold transition duration-300 [perspective:600px] ${
                  BIG.has(n) ? 'border-av-gold' : 'border-av-gold/30'
                } ${isOpen ? 'bg-av-ink/70' : 'bg-av-cream/5 hover:-translate-y-0.5 hover:bg-av-cream/10'}`}
              >
                {isOpen ? (
                  (() => {
                    const Peek = PEEK[i % PEEK.length];
                    return <Peek className="mx-auto h-7 w-7 sm:h-8 sm:w-8" />;
                  })()
                ) : (
                  <span className="font-display text-xl font-bold sm:text-2xl">{n}</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[11px] text-av-cream/60">Tocca una casella per sbirciare</p>
      </div>
    </div>
  );
}
