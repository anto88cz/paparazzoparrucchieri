import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatEuro,
  stockLabel,
  sortProducts,
  shippingCost,
  effectivePrice,
  PRODUCTS,
  type Product,
} from './demo-data';

test('formatEuro usa il formato italiano', () => {
  assert.equal(formatEuro(24.9), '€ 24,90');
  assert.equal(formatEuro(1250), '€ 1.250,00');
});

test('stockLabel distingue esaurito, ultimi pezzi e disponibile', () => {
  assert.deepEqual(stockLabel(0), { text: 'Esaurito', tone: 'out' });
  assert.deepEqual(stockLabel(3), { text: 'Ultimi 3 pezzi', tone: 'low' });
  assert.deepEqual(stockLabel(1), { text: 'Ultimo pezzo', tone: 'low' });
  assert.deepEqual(stockLabel(20), { text: 'Disponibile', tone: 'ok' });
});

test('sortProducts ordina per prezzo effettivo senza mutare', () => {
  const list = [
    { slug: 'a', price: 30 },
    { slug: 'b', price: 50, salePrice: 20 },
    { slug: 'c', price: 25 },
  ] as Product[];
  assert.deepEqual(sortProducts(list, 'price-asc').map((p) => p.slug), ['b', 'c', 'a']);
  assert.deepEqual(sortProducts(list, 'price-desc').map((p) => p.slug), ['a', 'c', 'b']);
  assert.deepEqual(sortProducts(list, 'featured').map((p) => p.slug), ['a', 'b', 'c']);
  assert.deepEqual(list.map((p) => p.slug), ['a', 'b', 'c']);
});

test('effectivePrice preferisce il prezzo in offerta', () => {
  assert.equal(effectivePrice({ price: 50, salePrice: 39 } as Product), 39);
  assert.equal(effectivePrice({ price: 50 } as Product), 50);
});

test('shippingCost: gratis per ritiro o sopra soglia', () => {
  assert.equal(shippingCost(50, 'spedizione'), 6.9);
  assert.equal(shippingCost(69, 'spedizione'), 0);
  assert.equal(shippingCost(80, 'spedizione'), 0);
  assert.equal(shippingCost(50, 'ritiro'), 0);
});

test('i prodotti demo hanno slug unici', () => {
  const slugs = PRODUCTS.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
