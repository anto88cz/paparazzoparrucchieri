import { NextRequest, NextResponse } from 'next/server';
import { addLead } from '@/lib/avvento/leads';
import { formatLead, sendTelegram } from '@/lib/avvento/telegram';

export const dynamic = 'force-dynamic';

// Rate limit semplice in memoria: max 5 iscrizioni ogni 10 minuti per IP
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function clean(v: unknown, max = 100): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Troppi tentativi, riprova tra qualche minuto.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }

  // Honeypot anti-bot
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const nome = clean(body.nome, 60);
  const telefono = clean(body.telefono, 30);

  if (!nome) return NextResponse.json({ error: 'Inserisci il tuo nome.' }, { status: 400 });
  if (!/^\+?[0-9\s./-]{8,20}$/.test(telefono))
    return NextResponse.json({ error: 'Numero WhatsApp non valido.' }, { status: 400 });
  if (body.privacy !== true)
    return NextResponse.json({ error: 'Devi acconsentire a essere contattato.' }, { status: 400 });

  const res = await addLead({ nome, telefono, ip });
  // Numero già iscritto: rispondiamo ok senza notificare di nuovo
  if (res) await sendTelegram(formatLead(res.lead, res.total));

  return NextResponse.json({ ok: true });
}
