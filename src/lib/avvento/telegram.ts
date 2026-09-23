import type { AvventoOrder } from './store';

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
