import { NextResponse } from 'next/server';
import { AVVENTO, getCurrentPrice, getPreorderDeadline, isPreorderActive } from '@/config/avvento';
import { getRemaining } from '@/lib/avvento/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    remaining: getRemaining(),
    stock: AVVENTO.stock,
    price: getCurrentPrice(),
    fullPrice: AVVENTO.fullPrice,
    preorderPrice: AVVENTO.preorderPrice,
    preorderActive: isPreorderActive(),
    deadline: getPreorderDeadline().toISOString(),
  });
}
