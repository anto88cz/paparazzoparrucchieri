import CheckoutForm from '@/components/luxe/CheckoutForm';

export const metadata = { title: 'Checkout · Anteprima' };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <h1 className="py-14 text-center md:py-20">
        <span className="luxe-title block text-5xl md:text-6xl">Checkout</span>
        <span className="luxe-script -mt-2 block text-3xl md:text-4xl">quasi tuo</span>
      </h1>
      <CheckoutForm />
    </div>
  );
}
