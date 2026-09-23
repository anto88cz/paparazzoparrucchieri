'use client';

import { useEffect, useState } from 'react';

export interface AvventoStatus {
  remaining: number;
  stock: number;
  price: number;
  fullPrice: number;
  preorderPrice: number;
  preorderActive: boolean;
  deadline: string;
}

// Stato condiviso tra tutti i componenti della pagina: un solo polling
let shared: AvventoStatus | null = null;
const listeners = new Set<(s: AvventoStatus) => void>();
let timer: ReturnType<typeof setInterval> | null = null;

async function refresh() {
  try {
    const res = await fetch('/api/avvento/status', { cache: 'no-store' });
    if (!res.ok) return;
    shared = await res.json();
    listeners.forEach((l) => l(shared!));
  } catch {
    /* rete assente: manteniamo l'ultimo valore */
  }
}

export function refreshAvventoStatus() {
  return refresh();
}

export function useAvventoStatus(initial: AvventoStatus): AvventoStatus {
  const [status, setStatus] = useState<AvventoStatus>(shared ?? initial);

  useEffect(() => {
    listeners.add(setStatus);
    if (!timer) {
      refresh();
      timer = setInterval(refresh, 30_000);
    }
    return () => {
      listeners.delete(setStatus);
      if (listeners.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);

  return status;
}

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function euro(n: number): string {
  return n % 1 === 0 ? `€${n}` : `€${n.toFixed(2).replace('.', ',')}`;
}
