import Link from 'next/link';
import Hero from '@/components/luxe/Hero';
import ProductCard from '@/components/luxe/ProductCard';
import PromoSplit from '@/components/luxe/PromoSplit';
import Reveal from '@/components/luxe/Reveal';
import Reviews from '@/components/luxe/Reviews';
import SectionTitle from '@/components/luxe/SectionTitle';
import ServicesGrid from '@/components/luxe/ServicesGrid';
import { PRODUCTS } from '@/components/luxe/demo-data';

export default function AnteprimaHome() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  return (
    <>
      <Hero />
      <ServicesGrid />
      <PromoSplit />
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionTitle title="Selezione" script="Paparazzo" />
        <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/anteprima/shop" className="luxe-btn">Tutti i prodotti</Link>
        </div>
      </section>
      <div className="border-t border-luxe-line" />
      <Reviews />
    </>
  );
}
