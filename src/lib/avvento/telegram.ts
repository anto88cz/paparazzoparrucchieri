import type { AvventoOrder } from './store';
import type { AvventoLead } from './leads';

const METODO_LABEL: Record<AvventoOrder['metodo'], string> = {
  stripe: '💳 Carta (Stripe)',
  paypal: '🅿️ PayPal',
  contanti: '💶 Contanti in negozio',
};

const STATUS_LABEL: Record<AvventoOrder['status'], string> = {
  in_attesa_pagamento: '⏳ In attesa di pagamento online',
  pagato: '✅ PAGATO',
  da_pagare_in_negozio: '🏪 Da pagare in negozio',
  annullato: '❌ Annullato',
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatOrder(o: AvventoOrder, title: string, remaining?: number): string {
  const lines = [
    `<b>${esc(title)}</b>`,
    '',
    `🆔 <b>Ordine:</b> ${o.id}`,
    `👤 <b>Cliente:</b> ${esc(o.nome)} ${esc(o.cognome)}`,
    `📞 <b>Telefono:</b> ${esc(o.telefono)}`,
    `✉️ <b>Email:</b> ${esc(o.email)}`,
    `📦 <b>Quantità:</b> ${o.quantita}`,
    `💰 <b>Totale:</b> € ${o.totale.toFixed(2)} (${o.quantita} × € ${o.prezzoUnitario.toFixed(2)})`,
    `💳 <b>Metodo:</b> ${METODO_LABEL[o.metodo]}`,
    `📌 <b>Stato:</b> ${STATUS_LABEL[o.status]}`,
  ];
  if (o.note) lines.push(`📝 <b>Note:</b> ${esc(o.note)}`);
  if (o.providerRef) lines.push(`🔗 <b>Rif. pagamento:</b> ${esc(o.providerRef)}`);
  lines.push(
    `🕒 <b>Data:</b> ${new Date(o.createdAt).toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}`
  );
  if (remaining !== undefined) lines.push('', `🎄 Pezzi ancora disponibili online: <b>${remaining}</b>`);
  return lines.join('\n');
}

function when(iso: string): string {
  return new Date(iso).toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
}

export function formatLead(l: AvventoLead, total: number): string {
  return [
    '<b>🔔 Nuova iscrizione · Avvisami all\'apertura</b>',
    '',
    `👤 <b>Nome:</b> ${esc(l.nome)}`,
    `📞 <b>WhatsApp:</b> ${esc(l.telefono)}`,
    `🕒 <b>Data:</b> ${when(l.createdAt)}`,
    '',
    `📋 Iscritti in totale: <b>${total}</b> · /iscritti per l'elenco`,
  ].join('\n');
}

/** Elenco iscritti diviso in messaggi sotto il limite di 4096 caratteri di Telegram. */
export function formatLeadList(leads: AvventoLead[]): string[] {
  if (leads.length === 0) return ['📋 Nessun iscritto per ora.'];
  const chunks: string[] = [];
  let cur = `<b>📋 Iscritti all'avviso apertura: ${leads.length}</b>\n`;
  leads.forEach((l, i) => {
    const line = `\n${i + 1}. ${esc(l.nome)} · ${esc(l.telefono)}`;
    if (cur.length + line.length > 3800) {
      chunks.push(cur);
      cur = '';
    }
    cur += line;
  });
  chunks.push(cur);
  return chunks;
}

export async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[avvento] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID mancanti, notifica non inviata');
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    if (!res.ok) console.error('[avvento] Telegram error', res.status, await res.text());
  } catch (err) {
    console.error('[avvento] Telegram fetch failed', err);
  }
}
