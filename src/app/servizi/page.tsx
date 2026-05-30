import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SERVICES } from '@/config/constants';

export const metadata: Metadata = {
  title: 'Servizi Parrucchiere Catanzaro | Nanoplastia, Extensions, Colorazione',
  alternates: { canonical: '/servizi' },
  description:
    'Servizi parrucchiere a Catanzaro: Nanoplastia, Hair Extensions, Color Correction, Tagli, Colorazione. Salone professionale Via Formia 47. Prenota ☎️ 339 239 9044',
  keywords: [
    'servizi parrucchiere catanzaro',
    'parrucchiere catanzaro',
    'nanoplastia catanzaro',
    'hair extensions catanzaro',
    'color correction catanzaro',
    'taglio capelli catanzaro',
    'colorazione capelli catanzaro',
    'trattamenti capelli catanzaro',
  ],
};

export default function ServiziPage() {
  return (
    <>
      {/* Hero Section */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="section-heading">I Nostri Servizi</h1>
            <p className="section-subtitle">
              Tecniche avanzate, prodotti premium e attenzione maniacale ai dettagli per risultati
              straordinari
            </p>
          </div>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section background="white" padding="xl">
        <Container>
          <div className="grid gap-12 lg:gap-16">
            {SERVICES.map((service, index) => (
              <article
                key={service.id}
                className={`grid gap-8 lg:grid-cols-2 lg:gap-12 ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 shadow-xl">
                    {/* Placeholder - sostituire con immagine reale */}
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mb-4 text-6xl">{service.icon}</div>
                        <p className="text-xl font-semibold text-gray-700">{service.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <div className="mb-4 inline-flex items-center rounded-full bg-gold-100 px-4 py-2 text-sm font-medium text-gold-700">
                    <span className="mr-2">{service.icon}</span>
                    {service.name}
                  </div>

                  <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
                    {service.name}
                  </h2>

                  <p className="mb-6 text-lg leading-relaxed text-gray-600">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  <div className="mb-8">
                    <h3 className="mb-4 font-semibold text-gray-900">Benefici:</h3>
                    <ul className="space-y-2">
                      {service.benefits.slice(0, 4).map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-gold-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Info */}
                  <div className="mb-6 flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-gold-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Durata: {service.duration}</span>
                    </div>
                  </div>

                  <div className="mt-auto"><Button href={`/servizi/${service.slug}`} variant="primary" size="lg">
                    Scopri Tutti i Dettagli</Button></div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Pricing Section */}
      <Section background="white" padding="xl" id="prezzi">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
                Listino Prezzi
              </h2>
              <p className="text-lg text-gray-600">
                Prezzi trasparenti per servizi di alta qualità
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {/* Servizi Premium */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gold-50 to-gold-100 px-6 py-4">
                <h3 className="font-display text-xl font-bold text-gray-900">
                  Servizi Premium
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Nanoplastia</h4>
                    <p className="text-sm text-gray-600">Trattamento lisciante rivoluzionario</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">Da €200</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Hair Extensions</h4>
                    <p className="text-sm text-gray-600">Extension capelli naturali invisibili</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">Da €450</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Color Correction</h4>
                    <p className="text-sm text-gray-600">Correzione colore professionale</p>
                  </div>
                  <span className="text-right font-medium text-gray-700">
                    Consulenza Richiesta<br />
                    <span className="text-sm text-gray-500">+ Ciocca test</span>
                  </span>
                </div>
              </div>

              {/* Colorazioni Avanzate */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gold-50 to-gold-100 px-6 py-4">
                <h3 className="font-display text-xl font-bold text-gray-900">
                  Colorazioni Avanzate
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Moonkiss</h4>
                    <p className="text-sm text-gray-600">Tecnica schiarente delicata</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€120</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Airtouch</h4>
                    <p className="text-sm text-gray-600">Balayage con tecnica airtouch</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">Da €200</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Colorazione Completa</h4>
                    <p className="text-sm text-gray-600">Colore uniforme su tutta la chioma</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€50</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Ritocco Colore</h4>
                    <p className="text-sm text-gray-600">Ritocco ricrescita</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€30</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Toner</h4>
                    <p className="text-sm text-gray-600">Correzione tono e riflesssi</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€25</span>
                </div>
              </div>

              {/* Servizi Base */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gold-50 to-gold-100 px-6 py-4">
                <h3 className="font-display text-xl font-bold text-gray-900">
                  Servizi Base
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Taglio</h4>
                    <p className="text-sm text-gray-600">Taglio personalizzato</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€20</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Piega Liscia</h4>
                    <p className="text-sm text-gray-600">Phon</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€15</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Piega Onde</h4>
                    <p className="text-sm text-gray-600">Piega mossa con ferro o spazzola</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€20</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Acconciatura</h4>
                    <p className="text-sm text-gray-600">Per eventi e cerimonie</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€60</span>
                </div>
              </div>

              {/* Trattamenti */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gold-50 to-gold-100 px-6 py-4">
                <h3 className="font-display text-xl font-bold text-gray-900">
                  Trattamenti
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Ricostruzione</h4>
                    <p className="text-sm text-gray-600">Trattamento ricostruttivo profondo</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€45</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <h4 className="font-semibold text-gray-900">Ricostruzione Molecolare</h4>
                    <p className="text-sm text-gray-600">Con macchinario professionale</p>
                  </div>
                  <span className="font-display text-lg font-bold text-gold-600">€75</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-8 rounded-lg bg-gold-50 p-6 text-center">
              <p className="text-sm text-gray-700">
                <strong>Nota:</strong> I prezzi possono variare in base alla lunghezza e densità dei capelli. 
                Contattaci per un preventivo personalizzato gratuito.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="gradient" padding="lg">
        <Container>
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl md:p-12">
            <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Non Sai Quale Servizio Scegliere?
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Contattaci per una consulenza gratuita personalizzata. Ti aiuteremo a scegliere il
              trattamento perfetto per i tuoi capelli.
            </p>
            <Button
              href="https://wa.me/393392399044?text=Ciao,%20vorrei%20una%20consulenza%20gratuita"
              variant="whatsapp"
              size="lg"
              external
            >
              Richiedi Consulenza Gratuita
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}


