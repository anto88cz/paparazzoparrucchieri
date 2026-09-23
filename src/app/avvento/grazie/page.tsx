import type { Metadata } from 'next';
import Link from 'next/link';
import { AVVENTO } from '@/config/avvento';
import { BUSINESS } from '@/config/constants';
import { getOrder, getRemaining, markPaid } from '@/lib/avvento/store';
import { formatOrder, sendTelegram } from '@/lib/avvento/telegram';
import { getStripeSession } from '@/lib/avvento/payments';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { CameraIcon, OrnamentIcon } from '@/components/avvento/Icons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Preordine confermato - Calendario dell'Avvento",
  robots: { index: false, follow: false },
};

export default async function GraziePage({
  searchParams,
}: {
  searchParams: { ordine?: string; session_id?: string };
}) {
  let order = searchParams.ordine ? getOrder(searchParams.ordine) : undefined;

  // Conferma Stripe anche senza webhook: verifichiamo la sessione lato server
  if (order && order.metodo === 'stripe' && order.status !== 'pagato' && searchParams.session_id) {
    try {
      const session = await getStripeSession(searchParams.session_id);
      if (session.metadata?.orderId === order.id && session.payment_status === 'paid') {
        const paid = await markPaid(order.id, session.payment_intent || session.id);
        if (paid) {
          await sendTelegram(formatOrder(paid, '✅ PAGAMENTO RICEVUTO (Stripe)', getRemaining()));
          order = paid;
        } else {
          order = getOrder(order.id);
        }
      }
    } catch (err) {
      console.error('[avvento] stripe session check failed', err);
    }
  }

  const paid = order?.status === 'pagato';
  const cash = order?.status === 'da_pagare_in_negozio';

  const createdAt = order
    ? new Date(order.createdAt).toLocaleString('it-IT', {
        timeZone: 'Europe/Rome',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  const metodo = order ? { stripe: 'Carta', paypal: 'PayPal', contanti: 'Contanti al ritiro' }[order.metodo] : '';

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-av-ink px-4 py-8 text-av-cream sm:py-14">
      <div className="av-snow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto max-w-md">
        {order ? (
          <>
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-av-gold/50 bg-av-gold/10 p-3 text-sm">
              <CameraIcon className="h-8 w-8 shrink-0 text-av-gold" />
              <p>
                <strong className="text-av-gold">Fai uno screenshot di questa schermata</strong> e mostralo in salone
                al momento del ritiro.
              </p>
            </div>

            {/* Buono di ritiro */}
            <div className="overflow-hidden rounded-3xl bg-av-cream text-av-ink shadow-2xl ring-2 ring-av-gold">
              <div className="bg-av-berry px-5 py-4 text-center text-white">
                <div className="text-[10px] uppercase tracking-[0.3em] text-av-gold">Paparazzo Parrucchieri</div>
                <div className="font-display text-xl font-bold">Buono ritiro · Calendario dell&apos;Avvento</div>
              </div>

              <div className="px-5 pb-5 pt-4 text-center">
                <div
                  className={`mx-auto mb-3 inline-block rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wide ${
                    paid ? 'bg-emerald-700 text-white' : cash ? 'bg-av-gold text-av-ink' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  {paid ? 'Pagato' : cash ? 'Da pagare al ritiro' : 'Pagamento in verifica'}
                </div>
                <div className="text-xs uppercase tracking-widest text-av-ink/50">Numero preordine</div>
                <div className="mb-1 font-mono text-2xl font-bold tracking-wider text-av-berry">{order.id}</div>
                <div className="text-lg font-semibold">
                  {order.nome} {order.cognome}
                </div>
              </div>

              <div className="relative border-t-2 border-dashed border-av-ink/20">
                <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-av-ink" />
                <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-av-ink" />
              </div>

              <dl className="space-y-2 px-5 py-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-av-ink/60">Quantità</dt>
                  <dd className="font-semibold">{order.quantita}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-av-ink/60">{cash ? 'Da pagare' : 'Totale pagato'}</dt>
                  <dd className="font-semibold">€{order.totale.toFixed(2).replace('.', ',')}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-av-ink/60">Metodo</dt>
                  <dd className="font-semibold">{metodo}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-av-ink/60">Data preordine</dt>
                  <dd className="font-semibold">{createdAt}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-av-ink/60">Ritiro</dt>
                  <dd className="text-right font-semibold">In salone {AVVENTO.pickupFrom}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-av-ink/60">Dove</dt>
                  <dd className="text-right font-semibold">{BUSINESS.address.full.replace(', Italia', '')}</dd>
                </div>
              </dl>
            </div>

            <p className="mt-5 text-center text-sm text-av-cream/70">
              {paid && 'Grazie! Il tuo Calendario dell’Avvento è ufficialmente tuo.'}
              {cash && 'Il calendario è riservato a tuo nome al prezzo del preordine.'}
              {!paid && !cash && 'Stiamo verificando il pagamento. Se hai dubbi, scrivici su WhatsApp.'} Ti avvisiamo
              noi quando è pronto.
            </p>
          </>
        ) : (
          <div className="text-center">
            <OrnamentIcon className="mx-auto mb-6 h-16 w-16 text-av-gold" />
            <h1 className="mb-4 font-display text-4xl font-bold">Grazie!</h1>
            <p className="mb-8 text-lg text-av-cream/80">Abbiamo ricevuto la tua richiesta.</p>
          </div>
        )}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={getWhatsAppLink(
              `Ciao! Ho appena preordinato il Calendario dell'Avvento${order ? ` (ordine ${order.id})` : ''} 🎄`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-av-gold px-6 py-3 text-center font-bold text-av-ink"
          >
            Scrivici su WhatsApp
          </a>
          <Link
            href="/"
            className="rounded-full border border-av-cream/30 px-6 py-3 text-center font-semibold hover:border-av-gold"
          >
            Torna al sito
          </Link>
        </div>
      </div>
    </div>
  );
}
