import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/config/constants';

export default function LocationSection() {
  return (
    <Section background="gray" padding="xl">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3046.8447826891835!2d16.585458376536404!3d38.90980997171524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13131f9b3f8a5a65%3A0x5f5f5f5f5f5f5f5f!2sVia%20Formia%2C%2047%2C%2088100%20Catanzaro%20CZ!5e0!3m2!1sit!2sit!4v1730000000000!5m2!1sit!2sit"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa Paparazzo Parrucchieri - Via Formia 47, Catanzaro"
              ></iframe>
            </div>
          </div>

          {/* Info */}
          <div className="order-1 lg:order-2">
            <h2 className="mb-6 font-display text-4xl font-bold text-gray-900">
              Vieni a Trovarci
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start">
                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">Indirizzo</h3>
                  <p className="text-gray-600">{BUSINESS.address.full}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">Telefono</h3>
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="text-gray-600 hover:text-gold-600"
                  >
                    {BUSINESS.phoneFormatted}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start">
                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Orari</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Mar - Ven: 09:00 - 13:00 / 15:00 - 19:00</li>
                    <li>Sabato: 09:00 - 18:30</li>
                    <li>Lunedì e Domenica: Chiuso</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button href="/contatti" variant="primary" size="lg">
                Contattaci
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
