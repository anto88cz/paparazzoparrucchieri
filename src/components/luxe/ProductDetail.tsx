'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './cart';
import { categoryName, effectivePrice, formatEuro, FREE_SHIPPING_FROM, SHIPPING_FEE, stockLabel, type Product } from './demo-data';
import { StoreIcon, TruckIcon } from './Icons';
import ProductArt from './ProductArt';

export default function ProductDetail({ product }: { product: Product }) {
  const { add, lines } = useCart();
  const inCart = lines.find((l) => l.product.slug === product.slug)?.qty ?? 0;
  const available = Math.max(0, product.stock - inCart);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const stock = stockLabel(product.stock);
  const toneClass = { ok: 'bg-emerald-400', low: 'bg-luxe-gold', out: 'bg-red-400' }[stock.tone];

  const onAdd = () => {
    add(product.slug, qty);
    setQty(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const sections = [
    { title: 'Descrizione', body: product.description },
    { title: 'Modo d’uso', body: product.usage },
    {
      title: 'Consegna e ritiro',
      body: `Spedizione in tutta Italia a ${formatEuro(SHIPPING_FEE)}, gratuita da ${formatEuro(
        FREE_SHIPPING_FROM
      )}. Ritiro gratuito in salone, in Via Formia 47 a Catanzaro.`,
    },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden border border-luxe-line">
          <ProductArt kind={product.art} className="aspect-square w-full" />
          {product.salePrice && (
            <span className="absolute left-4 top-4 bg-luxe-gold px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-luxe-black">
              Offerta
            </span>
          )}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`overflow-hidden border ${i === 0 ? 'border-luxe-gold' : 'border-luxe-line opacity-60'}`}>
              <ProductArt kind={product.art} className="aspect-square w-full" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="luxe-eyebrow">{categoryName(product.category)}</p>
        <h1 className="mt-4 font-luxe-serif text-4xl font-light leading-tight text-luxe-ivory md:text-5xl">{product.name}</h1>
        <p className="mt-2 text-luxe-mute">{product.short}</p>

        <p className="mt-8 flex items-baseline gap-3">
          <span className="font-luxe-serif text-3xl text-luxe-gold">{formatEuro(effectivePrice(product))}</span>
          {product.salePrice && <span className="text-luxe-mute line-through">{formatEuro(product.price)}</span>}
        </p>
        <p className="mt-1 text-[11px] text-luxe-mute">IVA inclusa</p>

        <p className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-luxe-ivory/80">
          <span className={`h-1.5 w-1.5 rounded-full ${toneClass}`} /> {stock.text}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex h-[52px] items-center border border-luxe-line">
            <button
              type="button"
              className="h-full px-5 text-lg text-luxe-ivory/70 transition hover:text-luxe-gold disabled:opacity-30"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1 || available === 0}
              aria-label="Diminuisci quantità"
            >
              −
            </button>
            <span className="w-10 text-center text-sm" aria-live="polite">
              {available === 0 ? 0 : qty}
            </span>
            <button
              type="button"
              className="h-full px-5 text-lg text-luxe-ivory/70 transition hover:text-luxe-gold disabled:opacity-30"
              onClick={() => setQty((q) => Math.min(available, q + 1))}
              disabled={qty >= available}
              aria-label="Aumenta quantità"
            >
              +
            </button>
          </div>
          <button type="button" className="luxe-btn-solid flex-1" onClick={onAdd} disabled={available === 0}>
            {product.stock === 0 ? 'Esaurito' : available === 0 ? 'Tutti nel carrello' : 'Aggiungi al carrello'}
          </button>
        </div>
        <p className="mt-3 h-5 text-sm text-luxe-gold" role="status">
          {added && (
            <>
              Aggiunto al carrello ·{' '}
              <Link href="/anteprima/carrello" className="underline underline-offset-4">
                vai al carrello
              </Link>
            </>
          )}
        </p>

        <div className="mt-6 grid gap-4 border-y border-luxe-line py-6 text-sm text-luxe-ivory/80 sm:grid-cols-2">
          <p className="flex items-center gap-3">
            <TruckIcon className="h-5 w-5 text-luxe-gold" /> Spedizione in tutta Italia
          </p>
          <p className="flex items-center gap-3">
            <StoreIcon className="h-5 w-5 text-luxe-gold" /> Ritiro gratuito in salone
          </p>
        </div>

        <div className="mt-2">
          {sections.map((s, i) => (
            <details key={s.title} className="group border-b border-luxe-line" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[11px] uppercase tracking-[0.3em] text-luxe-ivory">
                {s.title}
                <span className="text-lg text-luxe-gold transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="pb-6 text-sm leading-relaxed text-luxe-mute">{s.body}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
