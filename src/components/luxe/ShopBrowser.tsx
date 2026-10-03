'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { CATEGORIES, PRODUCTS, sortProducts, type SortKey } from './demo-data';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'In evidenza' },
  { value: 'price-asc', label: 'Prezzo crescente' },
  { value: 'price-desc', label: 'Prezzo decrescente' },
];

export default function ShopBrowser() {
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<SortKey>('featured');

  const products = useMemo(
    () => sortProducts(category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS, sort),
    [category, sort]
  );

  const chip = (active: boolean) =>
    `whitespace-nowrap border px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
      active ? 'border-luxe-gold bg-luxe-gold text-luxe-black' : 'border-luxe-line text-luxe-ivory/75 hover:border-luxe-gold/60'
    }`;

  return (
    <div>
      <div className="flex flex-col gap-6 border-y border-luxe-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Categorie">
          <button type="button" className={chip(category === '')} onClick={() => setCategory('')} aria-pressed={category === ''}>
            Tutti
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={chip(category === c.slug)}
              onClick={() => setCategory(c.slug)}
              aria-pressed={category === c.slug}
            >
              {c.name}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-luxe-mute">
          Ordina
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border-0 border-b border-luxe-line bg-luxe-black py-2 pl-0 pr-8 text-[11px] uppercase tracking-[0.2em] text-luxe-ivory focus:border-luxe-gold focus:ring-0"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-luxe-mute">
        {products.length} {products.length === 1 ? 'prodotto' : 'prodotti'}
      </p>

      {products.length === 0 ? (
        <p className="py-24 text-center font-luxe-serif text-2xl text-luxe-mute">Nessun prodotto in questa categoria.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
