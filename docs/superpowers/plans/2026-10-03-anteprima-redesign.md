# Anteprima redesign luxury — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Anteprima navigabile nero & oro su `/anteprima` (home, shop, prodotto, carrello, checkout UI) isolata dal sito live.

**Architecture:** Route App Router sotto `src/app/anteprima/` con layout proprio (font + CartProvider). Il chrome del sito live (Navbar/Footer/WhatsApp/Cookie) viene nascosto su `/anteprima` da un wrapper client `SiteChrome`. Componenti in `src/components/luxe/`, dati demo in un modulo puro con helper testati.

**Tech Stack:** Next.js 14, React 18, Tailwind 3, next/font/google, sharp (logo), node:test via `tsx` per helper puri.

Spec: `docs/superpowers/specs/2026-10-03-anteprima-redesign-design.md`

---

## File structure

| File | Responsabilità |
|---|---|
| `tailwind.config.ts` | token colore `luxe.*`, font family `luxe-serif/script/sans` |
| `src/components/layout/SiteChrome.tsx` | client; nasconde chrome live su `/anteprima` |
| `src/app/layout.tsx` | usa `SiteChrome` al posto di Navbar/Footer/WhatsApp/Cookie diretti |
| `scripts/make-logo-light.js` | genera `public/images/logo-light.png` |
| `src/components/luxe/demo-data.ts` | tipi `Product`/`Category`, prodotti demo, `formatEuro`, `stockLabel`, `sortProducts`, `shippingCost` |
| `src/components/luxe/demo-data.test.ts` | test helper puri |
| `src/components/luxe/cart.tsx` | `CartProvider`, `useCart` (context + localStorage) |
| `src/components/luxe/ProductArt.tsx` | illustrazioni SVG prodotto |
| `src/components/luxe/AnnouncementBar.tsx`, `Header.tsx`, `Footer.tsx` | chrome anteprima |
| `src/components/luxe/Hero.tsx`, `ServicesGrid.tsx`, `PromoSplit.tsx`, `Reviews.tsx`, `SectionTitle.tsx`, `ProductCard.tsx`, `Reveal.tsx` | sezioni |
| `src/components/luxe/ShopBrowser.tsx`, `ProductDetail.tsx`, `CartView.tsx`, `CheckoutForm.tsx` | parti client delle pagine |
| `src/app/anteprima/layout.tsx`, `page.tsx`, `shop/page.tsx`, `shop/[slug]/page.tsx`, `carrello/page.tsx`, `checkout/page.tsx` | route |

## Tasks

### Task 1: Isolare il chrome del sito live
- [ ] Creare `SiteChrome.tsx` (client, `usePathname`): se pathname inizia con `/anteprima` rende solo `children` dentro `<main>`; altrimenti Navbar, `<main className="min-h-screen pt-20">`, Footer, WhatsAppButton, CookieBanner come oggi.
- [ ] Sostituire in `src/app/layout.tsx` il blocco Navbar…CookieBanner con `<SiteChrome>{children}</SiteChrome>`.
- [ ] `npm run type-check` → nessun errore. Commit.

### Task 2: Token Tailwind + logo chiaro
- [ ] Aggiungere `luxe: { black:'#0B0B0B', coal:'#161514', line:'#2A2724', gold:'#C9A96E', goldsoft:'#E3CFA3', ivory:'#F3EDE4', mute:'#A39C92' }` e font family `luxe-serif: var(--font-cormorant)`, `luxe-script: var(--font-pinyon)`, `luxe-sans: var(--font-jost)`.
- [ ] `scripts/make-logo-light.js`: con sharp, raw RGBA; pixel con luminanza < 80 e non gialli → `#F3EDE4` mantenendo alpha; sfondo bianco opaco → trasparente; trim. Eseguire, verificare l'immagine a occhio. Commit.

### Task 3: Dati demo + helper (TDD)
- [ ] Test (`node --test` via `npx tsx`): `formatEuro(24.9) === '€ 24,90'`; `stockLabel(0)` → esaurito, `stockLabel(3)` → `Ultimi 3 pezzi`, `stockLabel(20)` → `Disponibile`; `sortProducts(list,'price-asc')` ordina per prezzo effettivo; `shippingCost(50,'spedizione') === 6.9`, `shippingCost(80,'spedizione') === 0`, `shippingCost(50,'ritiro') === 0`.
- [ ] Eseguire → FAIL. Implementare `demo-data.ts`. Eseguire → PASS. Commit.

### Task 4: Carrello
- [ ] `cart.tsx`: items `{slug, qty}`; `add(slug, qty)` limitato a stock; `setQty`; `remove`; `count`; `subtotal`; persistenza `localStorage['luxe-cart']` con try/catch, idratazione in `useEffect`. Commit.

### Task 5: Layout anteprima + chrome
- [ ] `anteprima/layout.tsx`: font Cormorant/Pinyon/Jost, `robots noindex`, `CartProvider`, AnnouncementBar, Header, Footer, sfondo `luxe-black`.
- [ ] Header sticky con nav, logo centrale, icone SVG inline, badge carrello, menu mobile. Footer con `BUSINESS`. Commit.

### Task 6: Home
- [ ] Hero, ServicesGrid, PromoSplit, sezione prodotti in evidenza (ProductCard + ProductArt), Reviews (da `data/reviews.json` lato server, fallback demo), Reveal (IntersectionObserver, rispetta reduced-motion). Commit.

### Task 7: Shop + scheda prodotto
- [ ] `ShopBrowser` (chip categoria, select ordinamento, griglia), `shop/page.tsx`.
- [ ] `shop/[slug]/page.tsx` con `generateStaticParams`, `notFound()`; `ProductDetail` con quantità, add-to-cart, accordion, correlati. Commit.

### Task 8: Carrello + checkout UI
- [ ] `CartView`, `CheckoutForm` (consegna, dati, indirizzo condizionale, pagamento con contanti disabilitato se spedizione, riepilogo, submit → banner "anteprima"). Commit.

### Task 9: Verifica
- [ ] `npm run type-check`, `npm run build`.
- [ ] `npm run start`, screenshot 1440px e 390px di ogni pagina con Chrome headless; controllare `/` e `/avvento` invariati. Correggere difetti visivi. Commit.
