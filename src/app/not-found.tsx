import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Pagina Non Trovata | Paparazzo Parrucchieri',
  description: 'La pagina che stai cercando non esiste o è stata spostata.',
};

export default function NotFound() {
  return (
    <>
      <Section background="gradient" padding="xl">
        <Container>
          <div className="text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <p className="font-display text-9xl font-bold text-gold-600 md:text-[12rem]">404</p>
            </div>

            {/* Icon */}
            <div className="mb-6 text-6xl">😕</div>

            {/* Title */}
            <h1 className="mb-6 font-display text-4xl font-bold text-gray-900 md:text-5xl">
              Pagina Non Trovata
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Oops! La pagina che stai cercando non esiste o è stata spostata. Forse hai digitato
              l'indirizzo in modo errato o la pagina è stata rimossa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/" variant="primary" size="lg">
                Torna alla Home
              </Button>
              <Button href="/servizi" variant="outline" size="lg">
                Vedi i Servizi
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Helpful Links */}
      <Section background="white" padding="xl">
        <Container>
          <h2 className="section-heading text-center">Pagine Utili</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/servizi"
              className="group rounded-2xl bg-gray-50 p-6 text-center transition-all hover:-translate-y-2 hover:bg-gold-50 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">💇</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900 group-hover:text-gold-600">
                I Nostri Servizi
              </h3>
              <p className="text-sm text-gray-600">
                Scopri Nanoplastia, Hair Extensions e Color Correction
              </p>
            </Link>

            <Link
              href="/blog"
              className="group rounded-2xl bg-gray-50 p-6 text-center transition-all hover:-translate-y-2 hover:bg-gold-50 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">📝</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900 group-hover:text-gold-600">
                Blog
              </h3>
              <p className="text-sm text-gray-600">Guide, consigli e tendenze hair styling</p>
            </Link>

            <Link
              href="/corsi"
              className="group rounded-2xl bg-gray-50 p-6 text-center transition-all hover:-translate-y-2 hover:bg-gold-50 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">🎓</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900 group-hover:text-gold-600">
                Corsi
              </h3>
              <p className="text-sm text-gray-600">Masterclass Hair Extensions</p>
            </Link>

            <Link
              href="/contatti"
              className="group rounded-2xl bg-gray-50 p-6 text-center transition-all hover:-translate-y-2 hover:bg-gold-50 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">💬</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900 group-hover:text-gold-600">
                Contatti
              </h3>
              <p className="text-sm text-gray-600">Prenota il tuo appuntamento</p>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Search Suggestion */}
      <Section background="gray" padding="xl">
        <Container size="md">
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl md:p-12">
            <div className="mb-4 text-5xl">💡</div>
            <h2 className="mb-4 font-display text-2xl font-bold text-gray-900">
              Hai Bisogno di Aiuto?
            </h2>
            <p className="mb-6 text-gray-600">
              Se non riesci a trovare quello che cerchi, contattaci direttamente su WhatsApp.
              Saremo felici di aiutarti!
            </p>
            <Button
              href="https://wa.me/393392399044?text=Ciao!%20Ho%20bisogno%20di%20aiuto"
              variant="whatsapp"
              size="lg"
              external
            >
              Chatta su WhatsApp
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
