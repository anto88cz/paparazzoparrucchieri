'use client';

import { useCart } from './cart';
import { formatEuro, FREE_SHIPPING_FROM, shippingCost, type Delivery } from './demo-data';

export default function OrderSummary({ delivery, children }: { delivery: Delivery | null; children?: React.ReactNode }) {
  const { subtotal } = useCart();
  const shipping = delivery ? shippingCost(subtotal, delivery) : null;
  const missing = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className="border border-luxe-line bg-luxe-coal p-6 sm:p-8">
      <h2 className="luxe-eyebrow">Riepilogo</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-luxe-mute">Subtotale</dt>
          <dd>{formatEuro(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-luxe-mute">Consegna</dt>
          <dd>{shipping === null ? 'Scegli al checkout' : shipping === 0 ? 'Gratuita' : formatEuro(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-luxe-line pt-4 font-luxe-serif text-2xl">
          <dt>Totale</dt>
          <dd className="text-luxe-gold">{formatEuro(subtotal + (shipping ?? 0))}</dd>
        </div>
      </dl>
      {delivery !== 'ritiro' && missing > 0 && (
        <p className="mt-4 text-[12px] text-luxe-mute">
          Ancora {formatEuro(missing)} per la spedizione gratuita.
        </p>
      )}
      {children}
    </div>
  );
}
