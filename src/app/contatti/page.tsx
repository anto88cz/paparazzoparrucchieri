import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/config/constants';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contatti | Paparazzo Parrucchieri Catanzaro',
  description: `Contattaci per prenotazioni e informazioni. WhatsApp ${BUSINESS.phoneFormatted}, telefono ${BUSINESS.phoneFormatted}. Risposta rapida garantita.`,
  keywords: [
    'contatti parrucchiere catanzaro',
    'prenotazione parrucchiere catanzaro',
    'whatsapp paparazzo',
    'telefono salone catanzaro',
  ],
};

export default function ContattiPage() {
  return (
    <>
      {/* Hero */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="text-center">
            <h1 className="mb-6 font-display text-4xl font-bold text-gray-900 md:text-5xl">
              Contattaci <span className="text-gold-600">Ora</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Siamo a tua disposizione per prenotazioni, consulenze gratuite e qualsiasi domanda.
              Rispondiamo rapidamente su WhatsApp!
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Methods */}
      <Section background="white" padding="xl">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* WhatsApp */}
            <a
              href={getWhatsAppLink('Ciao! Vorrei informazioni')}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 text-5xl">💬</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900">WhatsApp</h3>
              <p className="mb-3 text-sm text-gray-600">Risposta immediata</p>
              <p className="font-medium text-green-700">{BUSINESS.phoneFormatted}</p>
              <div className="mt-4 inline-block rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white">
                Chatta Ora →
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${BUSINESS.phone}`}
              className="group rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 text-5xl">📞</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900">Telefono</h3>
              <p className="mb-3 text-sm text-gray-600">Chiamaci direttamente</p>
              <p className="font-medium text-blue-700">{BUSINESS.phoneFormatted}</p>
              <div className="mt-4 inline-block rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                Chiama Ora →
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${BUSINESS.email}`}
              className="group rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 text-5xl">✉️</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900">Email</h3>
              <p className="mb-3 text-sm text-gray-600">Per richieste dettagliate</p>
              <p className="break-all font-medium text-purple-700">{BUSINESS.email}</p>
              <div className="mt-4 inline-block rounded-full bg-purple-500 px-4 py-2 text-sm font-medium text-white">
                Scrivi →
              </div>
            </a>

            {/* Visit */}
            <div className="group rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 p-6 text-center shadow-lg">
              <div className="mb-4 text-5xl">📍</div>
              <h3 className="mb-2 font-display text-xl font-bold text-gray-900">Vieni a Trovarci</h3>
              <p className="mb-3 text-sm text-gray-600">Siamo in centro</p>
              <p className="font-medium text-gold-700">
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.city}
              </p>
              <div className="mt-4 inline-block rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white">
                Indirizzo
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Opening Hours */}
      <Section background="gray" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Orari di Apertura</h2>
          <div className="mt-12 rounded-2xl bg-white p-8 shadow-xl md:p-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="font-display text-lg font-bold text-gray-900">Martedì - Venerdì</span>
                <span className="text-lg text-gray-700">09:00 - 13:00 / 15:00 - 19:00</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="font-display text-lg font-bold text-gray-900">Sabato</span>
                <span className="text-lg text-gray-700">09:00 - 18:30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-gray-900">Lunedì e Domenica</span>
                <span className="text-lg text-gray-700">Chiuso</span>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-gold-50 p-6 text-center">
              <p className="text-gray-800">
                💡 <strong>Prenotazione Consigliata</strong>
                <br />
                Per evitare attese, ti consigliamo di prenotare il tuo appuntamento in anticipo su
                WhatsApp.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Contatti */}
      <Section background="white" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Domande Frequenti</h2>
          <div className="mt-12 space-y-6">
            {[
              {
                q: 'Come posso prenotare un appuntamento?',
                a: 'Il modo più veloce è WhatsApp! Mandaci un messaggio e ti risponderemo subito con gli orari disponibili. Puoi anche chiamare direttamente o inviarci una email.',
              },
              {
                q: 'Devo prenotare o posso venire direttamente?',
                a: 'Consigliamo sempre di prenotare per garantirti il servizio all\'orario preferito ed evitare attese. Nei weekend e festivi la prenotazione è obbligatoria.',
              },
              {
                q: 'Entro quanto tempo rispondete ai messaggi?',
                a: 'Su WhatsApp rispondiamo generalmente entro 15-30 minuti durante gli orari di apertura. Le email entro 24 ore.',
              },
              {
                q: 'Posso chiedere una consulenza gratuita?',
                a: 'Assolutamente sì! Offriamo consulenze gratuite per tutti i nostri servizi. Contattaci per fissare un appuntamento o mandaci foto dei tuoi capelli su WhatsApp.',
              },
              {
                q: 'Come posso disdire o spostare un appuntamento?',
                a: 'Mandaci un messaggio WhatsApp o chiamaci almeno 24 ore prima. Capiamo che possono succedere imprevisti, ma apprezziamo il preavviso.',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-gray-50 p-6 shadow-md transition-all hover:shadow-lg"
              >
                <summary className="flex cursor-pointer items-center justify-between font-display text-lg font-bold text-gray-900">
                  {faq.q}
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-gold-600 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="mt-4 leading-relaxed text-gray-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
            <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Pronto a Trasformare i Tuoi Capelli?
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              Contattaci ora per una consulenza gratuita e scopri come possiamo aiutarti a ottenere
              i capelli dei tuoi sogni.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                href={getWhatsAppLink('Ciao! Vorrei prenotare una consulenza gratuita')}
                variant="whatsapp"
                size="lg"
                external
              >
                Prenota Consulenza Gratuita
              </Button>
              <Button href="/servizi" variant="outline" size="lg">
                Esplora i Servizi
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
