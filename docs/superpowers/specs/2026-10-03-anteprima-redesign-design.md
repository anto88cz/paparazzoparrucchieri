# Anteprima redesign luxury — Design

Data: 2026-10-03 · Branch: `redesign` · Sottoprogetto 1 di 3

## Contesto

Il sito (Next.js 14 App Router + Tailwind, dati su file JSON in `data/`) va rifatto con un'estetica
più professionale e luxury, ispirata a uno screen di riferimento (header con logo centrale, hero con
titolo serif sottile + script, parole giganti in filigrana, card servizi, banner promo split).
Il lavoro è diviso in tre sottoprogetti, ognuno con spec → piano → implementazione:

1. **Anteprima grafica** (questa spec) — validare lo stile.
2. **Shop reale** — SQLite, checkout PayPal + contanti, spedizione Italia, ritiro in salone.
3. **Admin** — login sicuro, CRUD prodotti/categorie, prezzi, magazzino, ordini.

## Obiettivo

Un'anteprima navigabile del nuovo stile **nero & oro**, isolata dal sito live, costruita con
componenti React riutilizzabili quando lo stile sarà approvato.

## Decisioni

- **Dove:** route `src/app/anteprima/*` con `robots: noindex, nofollow`.
- **Isolamento dal layout attuale:** il root layout monta Navbar, Footer, WhatsAppButton e
  CookieBanner. Un componente client `SiteChrome` li nasconde quando il pathname inizia con
  `/anteprima`; il `<main>` perde il `pt-20` sulle stesse route. Nessun'altra pagina esistente cambia.
- **Componenti:** in `src/components/luxe/`, un file per componente.
- **Dati:** prodotti e categorie finti in `src/components/luxe/demo-data.ts`. Le categorie sono
  segnaposto marcate come esempio: quelle reali le creerà il titolare da admin (sottoprogetto 3).
- **Carrello:** React context + `localStorage` (con try/catch), solo per l'anteprima.
- **Immagini prodotto:** non esistono foto prodotto; uso illustrazioni SVG eleganti generate in
  codice (flacone/vasetto/phon stilizzati in oro su fondo scuro). Per servizi e hero uso le foto
  esistenti in `public/images/services/`.
- **Logo:** versione chiara generata da `Marchio_trasparente.png` (nero → avorio, giallo invariato)
  salvata in `public/images/logo-light.png`.

## Stile

| Token | Valore | Uso |
|---|---|---|
| `luxe.black` | `#0B0B0B` | sfondo principale |
| `luxe.coal` | `#161514` | sezioni alternate, card |
| `luxe.line` | `#2A2724` | bordi sottili |
| `luxe.gold` | `#C9A96E` | accenti, CTA, script |
| `luxe.goldsoft` | `#E3CFA3` | hover, testo su oro |
| `luxe.ivory` | `#F3EDE4` | testo principale |
| `luxe.mute` | `#A39C92` | testo secondario |

Il giallo del logo compare solo nel logo.

Font (via `next/font/google`, variabili CSS limitate al layout anteprima):

- titoli: *Cormorant Garamond* 300/400, maiuscolo, tracking ampio;
- accenti script: *Pinyon Script*;
- testo e UI: *Jost* 300/400/500.

Movimento: fade/slide-in leggero all'ingresso, zoom lento delle immagini all'hover.
`prefers-reduced-motion` disattiva le animazioni. Mobile-first, nessuno scroll orizzontale.

## Pagine

1. **`/anteprima` — Home**
   - Barra annuncio: "Spedizione in tutta Italia · Ritiro gratuito in salone".
   - Header: a sinistra Prenota · Shop · Servizi · Accademia, al centro il logo, a destra cerca,
     account e carrello con badge; menu hamburger su mobile.
   - Hero: foto a destra; titolo "EXPERIENCE" serif sottile con script "l'arte del capello";
     parole in filigrana "LUXURY" (verticale) e "PREMIUM"; CTA a bordo oro "Scopri lo shop".
   - "I nostri servizi": linea + titolo + 3 card (Nanoplastia, Hair Extensions, Color Correction)
     con le foto reali e link alle pagine servizio esistenti.
   - Banner promo split: a sinistra testo oro su carbone con titolo + script, punti elenco e CTA;
     a destra la foto.
   - "Selezione Paparazzo": 4 prodotti in evidenza (ProductCard).
   - Recensioni: 3 citazioni da `data/reviews.json` se disponibili, altrimenti testi demo.
   - Footer: contatti da `BUSINESS`, orari, social, link, metodi di pagamento e consegna.
2. **`/anteprima/shop`** — intestazione, chip per filtrare per categoria, ordinamento
   (rilevanza / prezzo ↑ / prezzo ↓), griglia responsive di ProductCard, stato vuoto.
3. **`/anteprima/shop/[slug]`** — galleria, categoria, nome, prezzo (con prezzo barrato se in
   offerta), stato disponibilità (disponibile / ultimi N pezzi / esaurito), selettore quantità
   limitato allo stock, "Aggiungi al carrello", accordion descrizione/modo d'uso/consegna, prodotti correlati.
4. **`/anteprima/carrello`** — righe con quantità modificabile e rimozione, subtotale, stima
   spedizione, CTA checkout, stato vuoto.
5. **`/anteprima/checkout`** — solo UI, nessun pagamento:
   - consegna: "Spedizione in tutta Italia" (tariffa demo €6,90, gratis sopra €69) oppure
     "Ritiro in salone" (gratis, indirizzo da `BUSINESS`);
   - dati cliente e, solo con spedizione, indirizzo;
   - pagamento: "PayPal" oppure "Contanti al ritiro", abilitato solo con il ritiro in salone;
   - riepilogo ordine; il pulsante finale mostra un messaggio che dice che è un'anteprima.

## Fuori scope

DB, PayPal reale, admin, autenticazione, migrazione delle pagine esistenti, modifiche al sito live.

## Verifica

- `npm run type-check` e `npm run build` senza errori.
- Screenshot desktop (1440px) e mobile (390px) di ogni pagina, controllati a occhio.
- Le pagine esistenti (`/`, `/servizi`, `/avvento`) mostrano ancora Navbar/Footer come prima.
