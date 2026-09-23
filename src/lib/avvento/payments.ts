import crypto from 'crypto';
import { AVVENTO } from '@/config/avvento';
import type { AvventoOrder } from './store';

export function siteUrl(): string {
  // AVVENTO_BASE_URL permette di testare in locale (es. http://localhost:3000) senza toccare il sito
  return (
    process.env.AVVENTO_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.paparazzoparrucchieri.it'
  ).replace(/\/$/, '');
}

/* ----------------------------- STRIPE ----------------------------- */

async function stripeRequest(method: 'GET' | 'POST', endpoint: string, params?: Record<string, string>) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY mancante');
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params ? new URLSearchParams(params).toString() : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Stripe: ${json?.error?.message || res.status}`);
  return json;
}

export async function createStripeCheckout(order: AvventoOrder): Promise<{ id: string; url: string }> {
  const base = siteUrl();
  const session = await stripeRequest('POST', 'checkout/sessions', {
    mode: 'payment',
    client_reference_id: order.id,
    customer_email: order.email,
    'metadata[orderId]': order.id,
    'payment_intent_data[metadata][orderId]': order.id,
    'line_items[0][quantity]': String(order.quantita),
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(Math.round(order.prezzoUnitario * 100)),
    'line_items[0][price_data][product_data][name]': AVVENTO.productName,
    'line_items[0][price_data][product_data][description]': `Preordine ${order.id} - ritiro in salone ${AVVENTO.pickupFrom}`,
    expires_at: String(Math.floor(Date.now() / 1000) + AVVENTO.onlineHoldMinutes * 60),
    locale: 'it',
    success_url: `${base}/avvento/grazie?ordine=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/avvento?annullato=1#preordina`,
  });
  return { id: session.id, url: session.url };
}

export async function getStripeSession(sessionId: string) {
  return stripeRequest('GET', `checkout/sessions/${encodeURIComponent(sessionId)}`);
}

/** Verifica firma webhook Stripe (header Stripe-Signature). */
export function verifyStripeSignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((kv) => {
      const [k, ...v] = kv.split('=');
      return [k, v.join('=')];
    })
  );
  const t = parts.t;
  const signatures = header
    .split(',')
    .filter((p) => p.startsWith('v1='))
    .map((p) => p.slice(3));
  if (!t || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
  return signatures.some((sig) => {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

/* ----------------------------- PAYPAL ----------------------------- */

function paypalBase(): string {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function paypalToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET mancanti');
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`PayPal auth: ${json?.error_description || res.status}`);
  return json.access_token;
}

export async function createPaypalOrder(order: AvventoOrder): Promise<{ id: string; url: string }> {
  const token = await paypalToken();
  const base = siteUrl();
  const res = await fetch(`${paypalBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': order.id,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: order.id,
          custom_id: order.id,
          description: `${AVVENTO.productName} x${order.quantita}`,
          amount: { currency_code: 'EUR', value: order.totale.toFixed(2) },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'Paparazzo Parrucchieri',
            locale: 'it-IT',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: `${base}/api/avvento/paypal/capture?ordine=${order.id}`,
            cancel_url: `${base}/avvento?annullato=1#preordina`,
          },
        },
      },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`PayPal order: ${json?.message || res.status}`);
  const link = json.links?.find((l: { rel: string }) => l.rel === 'payer-action' || l.rel === 'approve');
  if (!link) throw new Error('PayPal: link di approvazione mancante');
  return { id: json.id, url: link.href };
}

export async function capturePaypalOrder(paypalOrderId: string): Promise<{ completed: boolean; captureId?: string; referenceId?: string }> {
  const token = await paypalToken();
  const res = await fetch(`${paypalBase()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  // Ordine già catturato (es. refresh della pagina): lo consideriamo completato
  if (!res.ok && json?.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
    return { completed: true };
  }
  if (!res.ok) throw new Error(`PayPal capture: ${json?.message || res.status}`);
  const unit = json.purchase_units?.[0];
  return {
    completed: json.status === 'COMPLETED',
    captureId: unit?.payments?.captures?.[0]?.id,
    referenceId: unit?.reference_id,
  };
}
