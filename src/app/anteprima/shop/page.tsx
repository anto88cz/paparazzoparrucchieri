import ShopBrowser from '@/components/luxe/ShopBrowser';

export const metadata = { title: 'Shop · Anteprima' };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <header className="py-16 text-center md:py-24">
        <p className="luxe-eyebrow">Shop online</p>
        <h1 className="mt-5">
          <span className="luxe-title block text-5xl md:text-7xl">The Collection</span>
          <span className="luxe-script -mt-2 block text-3xl md:text-5xl">i prodotti del salone</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-luxe-mute">
          Gli stessi prodotti professionali che usiamo ogni giorno in salone. Spedizione in tutta Italia o ritiro
          gratuito a Catanzaro.
        </p>
      </header>
      <ShopBrowser />
    </div>
  );
}
