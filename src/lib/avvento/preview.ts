import crypto from 'crypto';
import { cookies } from 'next/headers';

// Accesso in anteprima con la "parola segreta di Babbo Natale" (AVVENTO_SECRET_WORD)
export const PREVIEW_COOKIE = 'avv_babbo';

function secretWord(): string | null {
  const w = process.env.AVVENTO_SECRET_WORD?.trim();
  return w ? w : null;
}

/** Il cookie contiene un'impronta della parola, mai la parola stessa. */
export function previewToken(): string | null {
  const w = secretWord();
  return w ? crypto.createHmac('sha256', w).update('babbo-natale-anteprima').digest('hex') : null;
}

export function checkSecretWord(input: string): boolean {
  const w = secretWord();
  if (!w) return false;
  const a = crypto.createHash('sha256').update(input.trim().toLowerCase()).digest();
  const b = crypto.createHash('sha256').update(w.toLowerCase()).digest();
  return crypto.timingSafeEqual(a, b);
}

export function hasPreviewAccess(): boolean {
  const token = previewToken();
  const value = cookies().get(PREVIEW_COOKIE)?.value;
  if (!token || !value || value.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(token));
}
