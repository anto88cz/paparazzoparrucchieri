'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { effectivePrice, getProduct, type Product } from './demo-data';

interface CartItem {
  slug: string;
  qty: number;
}

export interface CartLine {
  product: Product;
  qty: number;
  total: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'luxe-cart';
const CartContext = createContext<CartValue | null>(null);

function clampQty(slug: string, qty: number): number {
  const stock = getProduct(slug)?.stock ?? 0;
  return Math.max(0, Math.min(Math.floor(qty), stock));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setItems(saved.filter((i) => getProduct(i?.slug)));
    } catch {
      // storage non disponibile: carrello vuoto
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage non disponibile: il carrello vive solo in memoria
    }
  }, [items, hydrated]);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) => {
      const next = clampQty(slug, qty);
      const rest = prev.filter((i) => i.slug !== slug);
      if (next === 0) return rest;
      return prev.some((i) => i.slug === slug)
        ? prev.map((i) => (i.slug === slug ? { slug, qty: next } : i))
        : [...rest, { slug, qty: next }];
    });
  }, []);

  const add = useCallback(
    (slug: string, qty = 1) => {
      setItems((prev) => {
        const current = prev.find((i) => i.slug === slug)?.qty ?? 0;
        const next = clampQty(slug, current + qty);
        if (next === 0) return prev;
        return current
          ? prev.map((i) => (i.slug === slug ? { slug, qty: next } : i))
          : [...prev, { slug, qty: next }];
      });
    },
    []
  );

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartValue>(() => {
    const lines = items.flatMap((i) => {
      const product = getProduct(i.slug);
      return product ? [{ product, qty: i.qty, total: effectivePrice(product) * i.qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.total, 0),
      add,
      setQty,
      remove,
      clear,
    };
  }, [items, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart va usato dentro CartProvider');
  return ctx;
}
