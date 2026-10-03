'use client';

import Link from 'next/link';
import { useCart } from './cart';
import { effectivePrice, formatEuro } from './demo-data';
import OrderSummary from './OrderSummary';
import ProductArt from './ProductArt';

export default function CartView() {
  const { lines, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-luxe-serif text-3xl font-light text-luxe-ivory">Il carrello è vuoto</p>
        <p className="mt-3 text-sm text-luxe-mute">Scopri i prodotti che usiamo ogni giorno in salone.</p>
        <Link href="/anteprima/shop" className="luxe-btn mt-10">Vai allo shop</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-luxe-line border-y border-luxe-line">
        {lines.map(({ product, qty, total }) => (
          <li key={product.slug} className="flex gap-5 py-6">
            <Link href={`/anteprima/shop/${product.slug}`} className="w-24 shrink-0 overflow-hidden sm:w-28">
              <ProductArt kind={product.art} className="aspect-[10/11] w-full" />
            </Link>
            <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
              <div>
                <Link href={`/anteprima/shop/${product.slug}`} className="font-luxe-serif text-xl text-luxe-ivory hover:text-luxe-goldsoft">
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-luxe-mute">{formatEuro(effectivePrice(product))} cad.</p>
                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  className="luxe-link mt-3 text-[10px] uppercase tracking-[0.25em] text-luxe-mute"
                >
                  Rimuovi
                </button>
              </div>
              <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                <div className="flex h-10 items-center border border-luxe-line">
                  <button type="button" className="h-full px-3 text-luxe-ivory/70 hover:text-luxe-gold" onClick={() => setQty(product.slug, qty - 1)} aria-label={`Diminuisci ${product.name}`}>
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    className="h-full px-3 text-luxe-ivory/70 hover:text-luxe-gold disabled:opacity-30"
                    onClick={() => setQty(product.slug, qty + 1)}
                    disabled={qty >= product.stock}
                    aria-label={`Aumenta ${product.name}`}
                  >
                    +
                  </button>
                </div>
                <p className="text-luxe-gold">{formatEuro(total)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary delivery={null}>
          <Link href="/anteprima/checkout" className="luxe-btn-solid mt-8 w-full">Procedi al checkout</Link>
          <Link href="/anteprima/shop" className="luxe-link mt-5 block text-center text-[10px] uppercase tracking-[0.25em] text-luxe-mute">
            Continua lo shopping
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
