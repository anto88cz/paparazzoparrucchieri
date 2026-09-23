import { NextRequest, NextResponse } from 'next/server';
import { canFulfil, getOrder, getRemaining, markPaid } from '@/lib/avvento/store';
import { formatOrder, sendTelegram } from '@/lib/avvento/telegram';
import { capturePaypalOrder, siteUrl } from '@/lib/avvento/payments';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('ordine') || '';
  const paypalId = req.nextUrl.searchParams.get('token') || '';
  const base = siteUrl();
  const order = getOrder(orderId);

  if (order?.status === 'pagato') {
    return NextResponse.redirect(`${base}/avvento/grazie?ordine=${order.id}`);
  }
  if (!order || !paypalId || order.providerRef !== paypalId) {
    return NextResponse.redirect(`${base}/avvento?errore=pagamento#preordina`);
  }
  // Prenotazione scaduta e pezzi finiti nel frattempo: non addebitiamo
  if (!canFulfil(order)) {
    return NextResponse.redirect(`${base}/avvento?errore=scaduto#preordina`);
  }

  try {
    const result = await capturePaypalOrder(paypalId);
    if (!result.completed) throw new Error('capture not completed');
    const paid = await markPaid(order.id, result.captureId || paypalId);
    if (paid) await sendTelegram(formatOrder(paid, '✅ PAGAMENTO RICEVUTO (PayPal)', getRemaining()));
    return NextResponse.redirect(`${base}/avvento/grazie?ordine=${order.id}`);
  } catch (err) {
    console.error('[avvento] paypal capture error', err);
    return NextResponse.redirect(`${base}/avvento?errore=pagamento#preordina`);
  }
}
