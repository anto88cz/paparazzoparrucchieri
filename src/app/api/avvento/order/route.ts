import { NextRequest, NextResponse } from 'next/server';
import { AVVENTO, getCurrentPrice, isLaunched } from '@/config/avvento';
import { hasPreviewAccess } from '@/lib/avvento/preview';
import { createOrder, getRemaining, updateOrder, type PaymentMethod } from '@/lib/avvento/store';
import { formatOrder, sendTelegram } from '@/lib/avvento/telegram';
import { createPaypalOrder, createStripeCheckout } from '@/lib/avvento/payments';

export const dynamic = 'force-dynamic';

// Rate limit semplice in memoria: max 5 tentativi ogni 10 minuti per IP
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const METHODS: PaymentMethod[] = ['stripe', 'paypal', 'contanti'];

function clean(v: unknown, max = 100): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Troppi tentativi, riprova tra qualche minuto.' }, { status: 429 });
  }

  if (!isLaunched() && !hasPreviewAccess()) {
    return NextResponse.json({ error: 'I preordini non sono ancora aperti.' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }

  // Honeypot anti-bot
  if (clean(body.website)) return NextResponse.json({ ok: true, redirect: '/avvento/grazie' });

  const nome = clean(body.nome, 60);
  const cognome = clean(body.cognome, 60);
  const telefono = clean(body.telefono, 30);
  const email = clean(body.email, 120).toLowerCase();
  const note = clean(body.note, 300);
  const metodo = body.metodo as PaymentMethod;
  const quantita = Number(body.quantita);

  if (!nome || !cognome) return NextResponse.json({ error: 'Inserisci nome e cognome.' }, { status: 400 });
  if (!/^\+?[0-9\s./-]{8,20}$/.test(telefono))
    return NextResponse.json({ error: 'Numero di telefono non valido.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'Email non valida.' }, { status: 400 });
  if (!METHODS.includes(metodo)) return NextResponse.json({ error: 'Scegli un metodo di pagamento.' }, { status: 400 });
  if (!Number.isInteger(quantita) || quantita < 1 || quantita > AVVENTO.maxPerOrder)
    return NextResponse.json({ error: `Puoi preordinare da 1 a ${AVVENTO.maxPerOrder} calendari.` }, { status: 400 });
  if (body.privacy !== true)
    return NextResponse.json({ error: 'Devi accettare il trattamento dei dati.' }, { status: 400 });

  const prezzoUnitario = getCurrentPrice();
  const order = await createOrder({
    nome,
    cognome,
    telefono,
    email,
    note: note || undefined,
    quantita,
    metodo,
    prezzoUnitario,
    totale: prezzoUnitario * quantita,
    ip,
  });

  if (!order) {
    const remaining = getRemaining();
    return NextResponse.json(
      {
        error:
          remaining > 0
            ? `Sono rimasti solo ${remaining} calendari: riduci la quantità.`
            : 'Ci dispiace, i calendari sono esauriti!',
        remaining,
      },
      { status: 409 }
    );
  }

  const remaining = getRemaining();

  if (metodo === 'contanti') {
    await sendTelegram(formatOrder(order, '🎄 NUOVO PREORDINE - Calendario Avvento', remaining));
    return NextResponse.json({ ok: true, redirect: `/avvento/grazie?ordine=${order.id}` });
  }

  try {
    const checkout = metodo === 'stripe' ? await createStripeCheckout(order) : await createPaypalOrder(order);
    const updated = await updateOrder(order.id, { providerRef: checkout.id });
    await sendTelegram(
      formatOrder(updated ? updated[0] : order, '🎄 NUOVO PREORDINE - in attesa di pagamento', remaining)
    );
    return NextResponse.json({ ok: true, redirect: checkout.url });
  } catch (err) {
    console.error('[avvento] checkout error', err);
    await updateOrder(order.id, { status: 'annullato' });
    return NextResponse.json(
      { error: 'Pagamento online momentaneamente non disponibile. Scegli "Contanti in salone" o riprova.' },
      { status: 502 }
    );
  }
}
