import { NextRequest, NextResponse } from 'next/server';
import { getRemaining, markPaid, updateOrder, getOrder } from '@/lib/avvento/store';
import { formatOrder, sendTelegram } from '@/lib/avvento/telegram';
import { verifyStripeSignature } from '@/lib/avvento/payments';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get('stripe-signature'))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const session = event.data?.object;
  const orderId: string | undefined = session?.metadata?.orderId || session?.client_reference_id;
  if (!orderId) return NextResponse.json({ received: true });

  if (event.type === 'checkout.session.completed' && session.payment_status === 'paid') {
    const paid = await markPaid(orderId, session.payment_intent || session.id);
    if (paid) await sendTelegram(formatOrder(paid, '✅ PAGAMENTO RICEVUTO (Stripe)', getRemaining()));
  }

  if (event.type === 'checkout.session.expired') {
    const order = getOrder(orderId);
    if (order?.status === 'in_attesa_pagamento') {
      const res = await updateOrder(orderId, { status: 'annullato' });
      if (res) await sendTelegram(formatOrder(res[0], '⌛ Preordine scaduto (pagamento Stripe non completato)', getRemaining()));
    }
  }

  return NextResponse.json({ received: true });
}
