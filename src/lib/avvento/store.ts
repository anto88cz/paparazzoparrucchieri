import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { AVVENTO } from '@/config/avvento';

export type PaymentMethod = 'stripe' | 'paypal' | 'contanti';
export type OrderStatus = 'in_attesa_pagamento' | 'pagato' | 'da_pagare_in_negozio' | 'annullato';

export interface AvventoOrder {
  id: string;
  createdAt: string;
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  quantita: number;
  note?: string;
  metodo: PaymentMethod;
  prezzoUnitario: number;
  totale: number;
  status: OrderStatus;
  providerRef?: string;
  paidAt?: string;
  ip?: string;
}

const ORDERS_FILE = path.join(process.cwd(), 'data', 'avvento-orders.json');

function readOrders(): AvventoOrder[] {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeOrders(orders: AvventoOrder[]) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
  const tmp = `${ORDERS_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(orders, null, 2));
  fs.renameSync(tmp, ORDERS_FILE);
}

// Serializza le scritture per evitare di vendere più pezzi di quelli disponibili
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => T | Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

function holdsStock(o: AvventoOrder, now: number): boolean {
  if (o.status === 'pagato' || o.status === 'da_pagare_in_negozio') return true;
  if (o.status === 'in_attesa_pagamento') {
    return now - new Date(o.createdAt).getTime() < AVVENTO.onlineHoldMinutes * 60 * 1000;
  }
  return false;
}

function reservedCount(orders: AvventoOrder[], now = Date.now()): number {
  return orders.filter((o) => holdsStock(o, now)).reduce((sum, o) => sum + o.quantita, 0);
}

export function getRemaining(): number {
  return Math.max(0, AVVENTO.stock - reservedCount(readOrders()));
}

function newId(): string {
  // Non indovinabile: l'ID è anche la "chiave" della pagina di conferma
  return `AVV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

export function createOrder(
  data: Omit<AvventoOrder, 'id' | 'createdAt' | 'status'>
): Promise<AvventoOrder | null> {
  return withLock(() => {
    const orders = readOrders();
    if (AVVENTO.stock - reservedCount(orders) < data.quantita) return null;
    const order: AvventoOrder = {
      ...data,
      id: newId(),
      createdAt: new Date().toISOString(),
      status: data.metodo === 'contanti' ? 'da_pagare_in_negozio' : 'in_attesa_pagamento',
    };
    orders.push(order);
    writeOrders(orders);
    return order;
  });
}

export function getOrder(id: string): AvventoOrder | undefined {
  return readOrders().find((o) => o.id === id);
}

/** Aggiorna un ordine. Ritorna [ordine aggiornato, ordine precedente]. */
export function updateOrder(
  id: string,
  patch: Partial<AvventoOrder>
): Promise<[AvventoOrder, AvventoOrder] | null> {
  return withLock(() => {
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const prev = orders[idx];
    orders[idx] = { ...prev, ...patch };
    writeOrders(orders);
    return [orders[idx], prev] as [AvventoOrder, AvventoOrder];
  });
}

/** Segna come pagato una sola volta; ritorna l'ordine solo se lo stato è cambiato. */
export async function markPaid(id: string, providerRef?: string): Promise<AvventoOrder | null> {
  const current = getOrder(id);
  if (!current || current.status === 'pagato') return null;
  const res = await updateOrder(id, {
    status: 'pagato',
    paidAt: new Date().toISOString(),
    ...(providerRef ? { providerRef } : {}),
  });
  if (!res || res[1].status === 'pagato') return null;
  return res[0];
}

/** Un ordine online è ancora evadibile? (hold valido, oppure scaduto ma con pezzi ancora liberi) */
export function canFulfil(order: AvventoOrder): boolean {
  if (order.status === 'annullato') return false;
  const orders = readOrders();
  const now = Date.now();
  if (holdsStock(order, now)) return true;
  return AVVENTO.stock - reservedCount(orders, now) >= order.quantita;
}
