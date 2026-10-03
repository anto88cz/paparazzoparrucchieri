import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/luxe/ProductCard';
import ProductDetail from '@/components/luxe/ProductDetail';
import SectionTitle from '@/components/luxe/SectionTitle';
import { getProduct, PRODUCTS } from '@/components/luxe/demo-data';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  return { title: product ? `${product.name} · Anteprima` : 'Prodotto non trovato' };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav className="py-8 text-[10px] uppercase tracking-[0.25em] text-luxe-mute" aria-label="Breadcrumb">
        <Link href="/anteprima" className="luxe-link">Home</Link>
        <span className="mx-3">/</span>
        <Link href="/anteprima/shop" className="luxe-link">Shop</Link>
        <span className="mx-3">/</span>
        <span className="text-luxe-ivory/80">{product.name}</span>
      </nav>
      <ProductDetail product={product} />
      <section className="py-24">
        <SectionTitle title="Potrebbe piacerti" />
        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
