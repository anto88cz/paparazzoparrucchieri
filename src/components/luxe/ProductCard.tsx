'use client';

import Link from 'next/link';
import { useCart } from './cart';
import { categoryName, effectivePrice, formatEuro, stockLabel, type Product } from './demo-data';
import ProductArt from './ProductArt';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const stock = stockLabel(product.stock);
  const href = `/anteprima/shop/${product.slug}`;

  return (
    <article className="group">
      <div className="relative overflow-hidden">
        <Link href={href} aria-label={product.name}>
          <ProductArt kind={product.art} className="aspect-[10/11] w-full transition-transform duration-[1500ms] ease-out group-hover:scale-105" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-2">
          {product.salePrice && (
            <span className="bg-luxe-gold px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-luxe-black">Offerta</span>
          )}
          {stock.tone !== 'ok' && (
            <span className="border border-luxe-ivory/30 bg-luxe-black/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-luxe-ivory">
              {stock.text}
            </span>
          )}
        </div>
        {product.stock > 0 && (
          <button
            type="button"
            onClick={() => add(product.slug)}
            className="absolute inset-x-3 bottom-3 translate-y-2 bg-luxe-ivory py-3 text-[10px] uppercase tracking-[0.3em] text-luxe-black opacity-0 transition-all duration-500 hover:bg-luxe-gold focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Aggiungi
          </button>
        )}
      </div>
      <Link href={href} className="mt-4 block">
        <p className="text-[10px] uppercase tracking-[0.25em] text-luxe-mute">{categoryName(product.category)}</p>
        <h3 className="mt-1 font-luxe-serif text-xl font-normal text-luxe-ivory transition-colors group-hover:text-luxe-goldsoft">
          {product.name}
        </h3>
        <p className="mt-1 text-sm">
          <span className="text-luxe-gold">{formatEuro(effectivePrice(product))}</span>
          {product.salePrice && <span className="ml-2 text-luxe-mute line-through">{formatEuro(product.price)}</span>}
        </p>
      </Link>
    </article>
  );
}
