import fs from 'fs';
import path from 'path';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

interface Review {
  name: string;
  text: string;
}

const DEMO: Review[] = [
  { name: 'Giulia M.', text: 'Finalmente il biondo che cercavo da anni. Professionalità e cura in ogni dettaglio.' },
  { name: 'Francesca R.', text: 'La nanoplastia ha cambiato i miei capelli: lucidi e morbidi per mesi.' },
  { name: 'Martina L.', text: 'Extension invisibili e naturalissime. Un’esperienza da vera diva.' },
];

function loadReviews(): Review[] {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'reviews.json'), 'utf8'));
    const real = (Array.isArray(raw) ? raw : [])
      .map((r: Record<string, unknown>) => ({ name: String(r.name ?? ''), text: String(r.text ?? r.comment ?? '') }))
      .filter((r: Review) => r.name && r.text);
    return real.length >= 3 ? real.slice(0, 3) : DEMO;
  } catch {
    return DEMO;
  }
}

export default function Reviews() {
  const reviews = loadReviews();
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionTitle title="Dicono di noi" script="from hair to heart" />
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 120} className="text-center">
            <p className="text-luxe-gold" aria-label="5 stelle su 5">★★★★★</p>
            <blockquote className="mt-5 font-luxe-serif text-2xl font-light italic leading-snug text-luxe-ivory">
              “{r.text}”
            </blockquote>
            <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-luxe-mute">{r.name}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
