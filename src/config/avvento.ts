/**
 * Calendario dell'Avvento Paparazzo - configurazione campagna preordine.
 * Modifica qui prezzi, date e contenuti. Le date possono essere sovrascritte da env.
 */

export const AVVENTO = {
  productName: "Calendario dell'Avvento Paparazzo 2026",

  // Prezzi in euro
  fullPrice: 249,
  preorderPrice: 199,

  // Pezzi totali della Limited Edition
  totalPieces: 20,
  // Di questi, quanti sono prenotabili online (il resto è in vendita solo in salone)
  stock: 10,
  maxPerOrder: 2,

  // Apertura al pubblico: prima di questa data /avvento mostra la pagina di attesa.
  // Sovrascrivibile con AVVENTO_LAUNCH_AT (ISO 8601)
  launchAt: process.env.AVVENTO_LAUNCH_AT || '2026-11-01T13:00:00+01:00',

  // Inizio preordine: il prezzo scontato vale 96 ore da questo momento (di default = apertura).
  // Sovrascrivibile con AVVENTO_PREORDER_START (ISO 8601)
  preorderStart:
    process.env.AVVENTO_PREORDER_START || process.env.AVVENTO_LAUNCH_AT || '2026-11-01T13:00:00+01:00',
  preorderHours: 96,

  // Minuti per cui un ordine online non ancora pagato tiene bloccato un pezzo
  onlineHoldMinutes: 30,

  // Ritiro in salone
  pickupFrom: 'dal 20 novembre',

  // Valore commerciale del contenuto tra prodotti e servizi (per il "value stack")
  contentValue: 310,

  // Foto del calendario in public/images/avvento/ (la prima è quella principale in alto).
  // Finché un file non esiste, la pagina lo salta; senza foto mostra il calendario illustrato.
  images: [
    { file: 'calendario-chiuso.jpg', alt: "Calendario dell'Avvento di Paparazzo Parrucchieri, cofanetto rosso e oro con fiocco" },
    { file: 'calendario-aperto.jpg', alt: "Calendario dell'Avvento aperto con le 24 caselle numerate" },
    { file: 'calendario-aperto-lato.jpg', alt: "Calendario dell'Avvento aperto, vista laterale dei cassetti" },
    { file: 'calendario-fronte.jpg', alt: "Confezione del Calendario dell'Avvento con decorazioni oro" },
  ],

  // Cosa c'è dentro i 24 cassetti
  highlights: [
    { icon: 'bottle', title: 'Prodotti Paparazzo', text: 'Prodotti per capelli a marchio Paparazzo, gli stessi che trovi e usiamo in salone.' },
    { icon: 'giftcard', title: 'Gift card', text: 'Buoni regalo da spendere in salone, per te o da regalare a chi vuoi.' },
    { icon: 'scissors', title: 'Servizi gratuiti', text: 'Trattamenti e servizi in omaggio da prenotare e fare in salone.' },
  ],
} as const;

export function getLaunchDate(): Date {
  return new Date(AVVENTO.launchAt);
}

export function isLaunched(now = new Date()): boolean {
  return now.getTime() >= getLaunchDate().getTime();
}

export function getPreorderDeadline(): Date {
  const start = new Date(AVVENTO.preorderStart);
  return new Date(start.getTime() + AVVENTO.preorderHours * 3600 * 1000);
}

export function isPreorderActive(now = new Date()): boolean {
  return now.getTime() < getPreorderDeadline().getTime();
}

export function getCurrentPrice(now = new Date()): number {
  return isPreorderActive(now) ? AVVENTO.preorderPrice : AVVENTO.fullPrice;
}
