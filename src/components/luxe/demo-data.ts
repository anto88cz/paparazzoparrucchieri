// Dati finti per l'anteprima: categorie e prodotti reali arriveranno dall'admin

export type ArtKind = 'bottle' | 'jar' | 'dropper' | 'tube' | 'dryer' | 'brush' | 'extension' | 'giftcard';

export interface Category {
  slug: string;
  name: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  art: ArtKind;
  short: string;
  description: string;
  usage: string;
  featured?: boolean;
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc';
export type Delivery = 'spedizione' | 'ritiro';

export const SHIPPING_FEE = 6.9;
export const FREE_SHIPPING_FROM = 69;

export const CATEGORIES: Category[] = [
  { slug: 'esempio-cura', name: 'Cura (esempio)' },
  { slug: 'esempio-trattamenti', name: 'Trattamenti (esempio)' },
  { slug: 'esempio-styling', name: 'Styling (esempio)' },
  { slug: 'esempio-strumenti', name: 'Strumenti (esempio)' },
  { slug: 'esempio-regali', name: 'Regali (esempio)' },
];

export const PRODUCTS: Product[] = [
  {
    slug: 'shampoo-illuminante',
    name: 'Shampoo Illuminante',
    category: 'esempio-cura',
    price: 24.9,
    stock: 18,
    art: 'bottle',
    short: 'Detersione delicata per capelli luminosi',
    description:
      'Formula delicata che deterge senza appesantire e restituisce brillantezza ai capelli spenti. Ideale dopo colore e schiariture.',
    usage: 'Applicare sui capelli bagnati, massaggiare e risciacquare. Ripetere se necessario.',
    featured: true,
  },
  {
    slug: 'maschera-ricostruzione',
    name: 'Maschera Ricostruzione Intensa',
    category: 'esempio-trattamenti',
    price: 39,
    salePrice: 32,
    stock: 3,
    art: 'jar',
    short: 'Nutrimento profondo per capelli trattati',
    description:
      'Trattamento ricostruttivo per capelli sensibilizzati da decolorazioni e trattamenti termici. Restituisce corpo ed elasticità.',
    usage: 'Dopo lo shampoo distribuire sulle lunghezze, lasciare in posa 5-10 minuti e risciacquare.',
    featured: true,
  },
  {
    slug: 'olio-sublime',
    name: 'Olio Sublime',
    category: 'esempio-styling',
    price: 34,
    stock: 12,
    art: 'dropper',
    short: 'Finish setoso e anticrespo',
    description: 'Olio leggero che sigilla le punte, controlla il crespo e dona un riflesso specchio.',
    usage: 'Scaldare 2-3 gocce tra i palmi e applicare su lunghezze e punte, su capelli umidi o asciutti.',
    featured: true,
  },
  {
    slug: 'balsamo-nutriente',
    name: 'Balsamo Nutriente',
    category: 'esempio-cura',
    price: 22.5,
    stock: 25,
    art: 'tube',
    short: 'Districa e ammorbidisce',
    description: 'Balsamo morbido che districa all’istante e lascia i capelli soffici e facili da pettinare.',
    usage: 'Applicare dopo lo shampoo sulle lunghezze, lasciare agire 1-2 minuti e risciacquare.',
  },
  {
    slug: 'phon-professionale',
    name: 'Phon Professionale Ionico',
    category: 'esempio-strumenti',
    price: 189,
    stock: 4,
    art: 'dryer',
    short: 'Asciugatura rapida, risultato da salone',
    description:
      'Motore digitale ad alte prestazioni con tecnologia ionica: asciuga più velocemente riducendo il crespo.',
    usage: 'Usare con il beccuccio concentratore per pieghe lisce e definite.',
    featured: true,
  },
  {
    slug: 'spazzola-termica',
    name: 'Spazzola Termica in Ceramica',
    category: 'esempio-strumenti',
    price: 29,
    stock: 0,
    art: 'brush',
    short: 'Volume e piega a lungo',
    description: 'Cilindro in ceramica che distribuisce il calore in modo uniforme per pieghe morbide e voluminose.',
    usage: 'Lavorare ciocca per ciocca con il phon, dalla radice alle punte.',
  },
  {
    slug: 'ciocca-extension-biondo',
    name: 'Ciocca Extension Biondo Miele',
    category: 'esempio-trattamenti',
    price: 79,
    stock: 7,
    art: 'extension',
    short: 'Capello naturale, 50 cm',
    description: 'Capello vergine da singolo donatore, tonalità biondo miele. Da applicare in salone.',
    usage: 'Applicazione e color matching in salone su appuntamento.',
  },
  {
    slug: 'gift-card',
    name: 'Gift Card Paparazzo',
    category: 'esempio-regali',
    price: 100,
    stock: 99,
    art: 'giftcard',
    short: 'Un’esperienza da regalare',
    description: 'Da spendere in salone per servizi e prodotti. Valida 12 mesi.',
    usage: 'Presentala in salone al momento del pagamento.',
  },
];

const euro = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

export function formatEuro(value: number): string {
  // Intl mette il simbolo dopo ("24,90 €"): per lo stile del sito lo vogliamo prima
  const parts = euro.formatToParts(value);
  const number = parts
    .filter((p) => p.type !== 'currency' && p.type !== 'literal')
    .map((p) => p.value)
    .join('');
  // Intl non raggruppa le migliaia sotto 10.000 in italiano: aggiungiamo noi il punto
  const [int, dec] = number.split(',');
  const grouped = int.replace(/\./g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `€ ${grouped},${dec}`;
}

export function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function stockLabel(stock: number): { text: string; tone: 'ok' | 'low' | 'out' } {
  if (stock <= 0) return { text: 'Esaurito', tone: 'out' };
  if (stock === 1) return { text: 'Ultimo pezzo', tone: 'low' };
  if (stock <= 5) return { text: `Ultimi ${stock} pezzi`, tone: 'low' };
  return { text: 'Disponibile', tone: 'ok' };
}

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const copy = [...list];
  if (key === 'price-asc') copy.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  if (key === 'price-desc') copy.sort((a, b) => effectivePrice(b) - effectivePrice(a));
  return copy;
}

export function shippingCost(subtotal: number, delivery: Delivery): number {
  if (delivery === 'ritiro' || subtotal >= FREE_SHIPPING_FROM) return 0;
  return SHIPPING_FEE;
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function categoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? '';
}
