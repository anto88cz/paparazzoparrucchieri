import { NextRequest, NextResponse } from 'next/server';
import { PREVIEW_COOKIE, checkSecretWord, previewToken } from '@/lib/avvento/preview';

export const dynamic = 'force-dynamic';

// Max 5 tentativi ogni 15 minuti per IP
const attempts = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (recent.length >= 5) {
    return NextResponse.json({ ok: false, error: 'Troppi tentativi, riprova più tardi.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const parola = typeof body.parola === 'string' ? body.parola : '';
  const token = previewToken();

  if (!token || !checkSecretWord(parola)) {
    recent.push(now);
    attempts.set(ip, recent);
    return NextResponse.json({ ok: false, error: 'Parola sbagliata. Babbo Natale non ti riconosce!' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

// Esci dall'anteprima
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(PREVIEW_COOKIE);
  return res;
}
