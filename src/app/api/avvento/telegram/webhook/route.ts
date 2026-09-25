import { NextRequest, NextResponse } from 'next/server';
import { formatLeadList, formatOrder, sendTelegram } from '@/lib/avvento/telegram';
import { randomTestOrder } from '@/lib/avvento/testOrders';
import { getRemaining } from '@/lib/avvento/store';
import { listLeads } from '@/lib/avvento/leads';

export const dynamic = 'force-dynamic';

const HELP = [
  '<b>Comandi disponibili</b>',
  '/test – invia un ordine di prova',
  '/test 3 – invia 3 ordini di prova (max 5)',
  '/stato – pezzi ancora disponibili online',
  '/iscritti – elenco di chi vuole essere avvisato all\'apertura',
].join('\n');

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  const msg = update?.message;
  // Rispondiamo solo alla chat configurata
  if (!msg?.text || String(msg.chat?.id) !== String(process.env.TELEGRAM_CHAT_ID)) {
    return NextResponse.json({ ok: true });
  }

  const [cmd, arg] = msg.text.trim().split(/\s+/);
  const command = cmd.toLowerCase().split('@')[0];

  if (command === '/test') {
    const n = Math.min(Math.max(parseInt(arg || '1', 10) || 1, 1), 5);
    for (let i = 0; i < n; i++) {
      const text = formatOrder(randomTestOrder(), '🧪 TEST · Ordine di prova (non reale)');
      await sendTelegram(`${text}\n\n⚠️ <i>Messaggio di prova: nessun cliente, nessun pagamento.</i>`);
    }
  } else if (command === '/stato') {
    await sendTelegram(`🎄 Pezzi ancora disponibili online: <b>${getRemaining()}</b>`);
  } else if (command === '/iscritti') {
    for (const chunk of formatLeadList(listLeads())) await sendTelegram(chunk);
  } else if (command === '/start' || command === '/help') {
    await sendTelegram(HELP);
  }

  return NextResponse.json({ ok: true });
}
