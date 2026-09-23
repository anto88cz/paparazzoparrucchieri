import crypto from 'crypto';
import { AVVENTO, getCurrentPrice } from '@/config/avvento';
import type { AvventoOrder } from './store';

const NOMI = ['Giulia', 'Francesca', 'Chiara', 'Martina', 'Sara', 'Valentina', 'Alessia', 'Federica', 'Roberta', 'Ilaria'];
const COGNOMI = ['Rossi', 'Ferraro', 'Russo', 'Gallo', 'Romano', 'Greco', 'Caruso', 'Mancuso', 'Scalise', 'Costa'];
const METODI: AvventoOrder['metodo'][] = ['stripe', 'paypal', 'contanti'];

const pick = <T>(a: readonly T[]) => a[crypto.randomInt(a.length)];

/** Ordine d'esempio per provare le notifiche: mai salvato, ID sempre "TEST-". */
export function randomTestOrder(): AvventoOrder {
  const nome = pick(NOMI);
  const cognome = pick(COGNOMI);
  const metodo = pick(METODI);
  const quantita = crypto.randomInt(1, AVVENTO.maxPerOrder + 1);
  const prezzoUnitario = getCurrentPrice();
  return {
    id: `TEST-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    createdAt: new Date().toISOString(),
    nome,
    cognome,
    telefono: `+39 3${crypto.randomInt(10, 99)} ${crypto.randomInt(100, 999)} ${crypto.randomInt(1000, 9999)}`,
    email: `${nome}.${cognome}@esempio.it`.toLowerCase(),
    quantita,
    metodo,
    prezzoUnitario,
    totale: prezzoUnitario * quantita,
    status: metodo === 'contanti' ? 'da_pagare_in_negozio' : 'pagato',
  };
}
