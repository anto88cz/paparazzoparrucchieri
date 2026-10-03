import Image from 'next/image';
import Link from 'next/link';

export default function PromoSplit() {
  return (
    <section className="grid border-y border-luxe-line md:grid-cols-2">
      <div className="flex flex-col justify-center bg-luxe-coal px-8 py-20 sm:px-14 lg:px-24">
        <p className="luxe-eyebrow mb-6">Solo online</p>
        <h2>
          <span className="luxe-title block text-5xl leading-none md:text-6xl">Autumn Ritual</span>
          <span className="luxe-script block text-4xl md:text-5xl">tutto il mese</span>
        </h2>
        <ul className="mt-10 space-y-4 text-[12px] uppercase tracking-[0.22em] text-luxe-ivory/85">
          <li className="flex gap-4"><span className="text-luxe-gold">—</span> 20% sui trattamenti ricostruzione</li>
          <li className="flex gap-4"><span className="text-luxe-gold">—</span> Spedizione gratuita da € 69</li>
          <li className="flex gap-4"><span className="text-luxe-gold">—</span> Sconto applicato al checkout</li>
        </ul>
        <div className="mt-12">
          <Link href="/anteprima/shop" className="luxe-btn">Acquista ora</Link>
        </div>
      </div>
      <div className="relative min-h-[420px]">
        <Image
          src="/images/services/hair-extensions-2.jpg"
          alt="Onde morbide realizzate in salone"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-luxe-black/10" />
      </div>
    </section>
  );
}
