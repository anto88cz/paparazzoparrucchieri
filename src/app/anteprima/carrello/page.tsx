import CartView from '@/components/luxe/CartView';

export const metadata = { title: 'Carrello · Anteprima' };

export default function CarrelloPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <h1 className="py-14 text-center md:py-20">
        <span className="luxe-title block text-5xl md:text-6xl">Carrello</span>
      </h1>
      <CartView />
    </div>
  );
}
