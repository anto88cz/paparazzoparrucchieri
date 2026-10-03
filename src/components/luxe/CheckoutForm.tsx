'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BUSINESS } from '@/config/constants';
import { useCart } from './cart';
import type { Delivery } from './demo-data';
import { StoreIcon, TruckIcon } from './Icons';
import OrderSummary from './OrderSummary';

type Payment = 'paypal' | 'contanti';

function Option({
  checked,
  disabled,
  onSelect,
  title,
  note,
  icon,
  name,
}: {
  checked: boolean;
  disabled?: boolean;
  onSelect: () => void;
  title: string;
  note: string;
  icon?: React.ReactNode;
  name: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors ${
        checked ? 'border-luxe-gold bg-luxe-gold/[0.06]' : 'border-luxe-line hover:border-luxe-gold/50'
      } ${disabled ? 'pointer-events-none opacity-40' : ''}`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} disabled={disabled} className="sr-only" />
      <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-luxe-gold' : 'border-luxe-mute'}`}>
        {checked && <span className="h-2 w-2 rounded-full bg-luxe-gold" />}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-luxe-ivory">
          {icon}
          {title}
        </span>
        <span className="mt-1 block text-sm text-luxe-mute">{note}</span>
      </span>
    </label>
  );
}

function Field({ label, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.25em] text-luxe-mute">{label}</span>
      <input className="luxe-input" {...props} />
    </label>
  );
}

export default function CheckoutForm() {
  const { lines } = useCart();
  const [delivery, setDelivery] = useState<Delivery>('spedizione');
  const [payment, setPayment] = useState<Payment>('paypal');
  const [submitted, setSubmitted] = useState(false);

  const chooseDelivery = (d: Delivery) => {
    setDelivery(d);
    // I contanti si possono usare solo ritirando in salone
    if (d === 'spedizione') setPayment('paypal');
  };

  if (lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-luxe-serif text-3xl font-light">Il carrello è vuoto</p>
        <Link href="/anteprima/shop" className="luxe-btn mt-10">Vai allo shop</Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-12 lg:grid-cols-[1fr_380px]"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="space-y-14">
        <fieldset>
          <legend className="luxe-eyebrow mb-6">1 · Consegna</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Option
              name="delivery"
              checked={delivery === 'spedizione'}
              onSelect={() => chooseDelivery('spedizione')}
              icon={<TruckIcon className="h-4 w-4 text-luxe-gold" />}
              title="Spedizione"
              note="In tutta Italia, 24/72 ore"
            />
            <Option
              name="delivery"
              checked={delivery === 'ritiro'}
              onSelect={() => chooseDelivery('ritiro')}
              icon={<StoreIcon className="h-4 w-4 text-luxe-gold" />}
              title="Ritiro in salone"
              note={`Gratuito · ${BUSINESS.address.street}, ${BUSINESS.address.city}`}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="luxe-eyebrow mb-6">2 · I tuoi dati</legend>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Field label="Nome" name="nome" autoComplete="given-name" required />
            <Field label="Cognome" name="cognome" autoComplete="family-name" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <Field label="Telefono" name="telefono" type="tel" autoComplete="tel" required />
          </div>
        </fieldset>

        {delivery === 'spedizione' && (
          <fieldset>
            <legend className="luxe-eyebrow mb-6">3 · Indirizzo di spedizione</legend>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-6">
              <Field label="Indirizzo e numero civico" name="indirizzo" autoComplete="street-address" required className="sm:col-span-6" />
              <Field label="CAP" name="cap" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" required className="sm:col-span-2" />
              <Field label="Città" name="citta" autoComplete="address-level2" required className="sm:col-span-3" />
              <Field label="Prov." name="provincia" maxLength={2} required className="sm:col-span-1" />
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="luxe-eyebrow mb-6">{delivery === 'spedizione' ? '4' : '3'} · Pagamento</legend>
          <div className="grid gap-3">
            <Option
              name="payment"
              checked={payment === 'paypal'}
              onSelect={() => setPayment('paypal')}
              title="PayPal"
              note="Paga con il tuo conto PayPal o con carta, anche senza account"
            />
            <Option
              name="payment"
              checked={payment === 'contanti'}
              onSelect={() => setPayment('contanti')}
              disabled={delivery !== 'ritiro'}
              title="Contanti al ritiro"
              note={delivery === 'ritiro' ? 'Paghi in salone quando ritiri l’ordine' : 'Disponibile solo con ritiro in salone'}
            />
          </div>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary delivery={delivery}>
          <ul className="mt-6 space-y-2 border-t border-luxe-line pt-5 text-sm text-luxe-mute">
            {lines.map((l) => (
              <li key={l.product.slug} className="flex justify-between gap-4">
                <span>
                  {l.product.name} <span className="text-luxe-ivory/60">× {l.qty}</span>
                </span>
              </li>
            ))}
          </ul>
          <label className="mt-6 flex gap-3 text-[12px] leading-relaxed text-luxe-mute">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-luxe-gold" />
            <span>
              Ho letto e accetto la{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-luxe-gold">privacy policy</Link>
            </span>
          </label>
          <button type="submit" className="luxe-btn-solid mt-6 w-full">
            {payment === 'paypal' ? 'Paga con PayPal' : 'Conferma ordine'}
          </button>
          {submitted && (
            <p className="mt-4 border border-luxe-gold/40 p-4 text-sm text-luxe-goldsoft" role="status">
              Questa è un’anteprima: nessun ordine è stato inviato e nessun pagamento addebitato.
            </p>
          )}
        </OrderSummary>
      </div>
    </form>
  );
}
