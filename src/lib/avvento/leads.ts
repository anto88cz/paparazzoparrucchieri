import fs from 'fs';
import path from 'path';

/** Persone che hanno chiesto di essere avvisate all'apertura dei preordini. */
export interface AvventoLead {
  nome: string;
  telefono: string;
  createdAt: string;
  ip?: string;
}

const LEADS_FILE = path.join(process.cwd(), 'data', 'avvento-iscritti.json');

function readLeads(): AvventoLead[] {
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeLeads(leads: AvventoLead[]) {
  fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
  const tmp = `${LEADS_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(leads, null, 2));
  fs.renameSync(tmp, LEADS_FILE);
}

let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => T | Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

/** Solo cifre, senza prefisso internazionale italiano: "+39 333 1234567" → "3331234567" */
function phoneKey(telefono: string): string {
  const digits = telefono.replace(/\D/g, '');
  return digits.startsWith('0039') ? digits.slice(4) : digits.startsWith('39') && digits.length > 10 ? digits.slice(2) : digits;
}

/** Aggiunge un iscritto. Ritorna null se il numero era già iscritto. */
export function addLead(data: Omit<AvventoLead, 'createdAt'>): Promise<{ lead: AvventoLead; total: number } | null> {
  return withLock(() => {
    const leads = readLeads();
    const key = phoneKey(data.telefono);
    if (leads.some((l) => phoneKey(l.telefono) === key)) return null;
    const lead: AvventoLead = { ...data, createdAt: new Date().toISOString() };
    leads.push(lead);
    writeLeads(leads);
    return { lead, total: leads.length };
  });
}

export function listLeads(): AvventoLead[] {
  return readLeads();
}
