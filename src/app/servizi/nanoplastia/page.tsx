import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Nanoplastia Catanzaro | Lisciatura Permanente Naturale Senza Formaldeide',
  description:
    'Nanoplastia a Catanzaro da Paparazzo Parrucchieri: lisciatura naturale senza formaldeide, capelli lisci e luminosi fino a 8 mesi. Da €150. Prenota ☎️ 339 239 9044',
  keywords: [
    'nanoplastia catanzaro',
    'trattamento lisciante catanzaro',
    'cheratina senza formaldeide catanzaro',
    'lisciatura capelli catanzaro',
    'nanoplastia calabria',
    'lisciatura permanente catanzaro',
    'parrucchiere nanoplastia catanzaro',
  ],
};

const FAQ = [
  {
    question: 'Cos\'è la Nanoplastia e come funziona?',
    answer:
      'La Nanoplastia è un trattamento brasiliano innovativo che ricostruisce la fibra capillare dall\'interno utilizzando nanoparticelle di aminoacidi, collagene e vitamine. A differenza della cheratina tradizionale, è completamente priva di formaldeide e sostanze nocive, rendendola sicura e adatta a tutti i tipi di capelli.',
  },
  {
    question: 'Quanto dura l\'effetto della Nanoplastia?',
    answer:
      'L\'effetto della Nanoplastia dura tipicamente tra i 6 e 8 mesi, a seconda del tipo di capello e della cura post-trattamento. Con una manutenzione adeguata e l\'utilizzo di prodotti professionali, i risultati possono durare anche più a lungo.',
  },
  {
    question: 'La Nanoplastia rovina i capelli?',
    answer:
      'No, al contrario! La Nanoplastia non solo non danneggia i capelli, ma li rinforza e li ripara dall\'interno. È un trattamento ricostruttivo che migliora la salute generale della fibra capillare, rendendola più forte, elastica e luminosa.',
  },
  {
    question: 'Posso fare la Nanoplastia su capelli colorati o decolorati?',
    answer:
      'Assolutamente sì! La Nanoplastia è sicura ed efficace anche su capelli colorati, decolorati o con meches. Anzi, è particolarmente indicata per capelli danneggiati da trattamenti chimici, in quanto aiuta a ripararli e a sigillare il colore.',
  },
  {
    question: 'Quanto costa la Nanoplastia?',
    answer:
      'Il costo varia in base alla lunghezza e alla densità dei capelli. Contattaci su WhatsApp per un preventivo personalizzato gratuito. Offriamo anche pagamenti in 3 rate con circuito Klarna.',
  },
];

export default function NanoplastiaPage() {
  return (
    <>
      {/* Hero */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white">
                <span className="mr-2">💫</span>
                Trattamento Rivoluzionario
              </div>

              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Nanoplastia
                <br />
                <span className="text-gold-600">Senza Formaldeide</span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Il trattamento di nuova generazione che ricostruisce i capelli
                dall'interno, eliminando il crespo e donando lucentezza straordinaria. Risultati
                naturali che durano fino a 7 mesi.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button href={getWhatsAppLink('Vorrei informazioni sulla Nanoplastia')} variant="whatsapp" size="lg" external>
                  Prenota Ora
                </Button>
                <Button href="/contatti" variant="outline" size="lg">
                  Chiedi Info
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 shadow-2xl">
                <Image
                  src="/images/services/nanoplastia-4.jpg"
                  alt="Nanoplastia - Prima e Dopo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Cos'è */}
      <Section background="white" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Cos'è la Nanoplastia?</h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              La <strong>Nanoplastia</strong> è un trattamento rivoluzionario proveniente dal
              Brasile che ha conquistato il mondo dell'hair styling grazie ai suoi risultati
              straordinari e alla totale sicurezza.
            </p>
            <p>
              A differenza della cheratina tradizionale, la Nanoplastia utilizza{' '}
              <strong>nanoparticelle di aminoacidi, collagene, acido ialuronico e vitamine</strong>{' '}
              che penetrano in profondità nella fibra capillare, ricostruendola dall'interno e
              riempiendo le porosità.
            </p>
            <p>
              Il risultato? Capelli <strong>lisci, luminosi, morbidi e sani</strong> senza l'uso di
              formaldeide o altre sostanze nocive. È adatto a tutti i tipi di capelli, anche quelli
              più danneggiati da colorazioni, decolorazioni o trattamenti chimici precedenti.
            </p>
          </div>
        </Container>
      </Section>

      {/* Benefici */}
      <Section background="gradient" padding="xl">
        <Container>
          <h2 className="section-heading text-center">Benefici della Nanoplastia</h2>
          <p className="section-subtitle text-center">
            Un trattamento completo che trasforma i tuoi capelli
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '✨',
                title: 'Elimina il Crespo',
                desc: 'Fino a 7 mesi di capelli perfettamente lisci e disciplinati',
              },
              {
                icon: '💎',
                title: 'Luminosità Estrema',
                desc: 'Riflessi brillanti e capelli visibilmente più sani',
              },
              {
                icon: '🛡️',
                title: 'Ricostruzione Profonda',
                desc: 'Ripara i danni da colorazioni, decolorazioni e calore',
              },
              {
                icon: '⏱️',
                title: 'Risparmio Tempo',
                desc: 'Riduce i tempi di piega fino al 70%',
              },
              {
                icon: '🌱',
                title: 'Senza Formaldeide',
                desc: 'Formula 100% sicura e priva di sostanze nocive',
              },
              {
                icon: '🎨',
                title: 'Mantiene il Colore',
                desc: 'Compatibile con colorazioni e meches',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="mb-3 text-4xl">{benefit.icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Come funziona */}
      <Section background="white" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Come Funziona il Trattamento</h2>
          <div className="mt-12 space-y-8">
            {[
              {
                step: '01',
                title: 'Analisi e Consulenza',
                desc: 'Valutiamo la struttura del capello e le tue esigenze per personalizzare il trattamento.',
              },
              
              {
                step: '02',
                title: 'Applicazione',
                desc: 'Applichiamo il prodotto Nanoplastia ciocca per ciocca, assicurando una copertura uniforme.',
              },
              {
                step: '03',
                title: 'Posa e Asciugatura',
                desc: 'Tempo di posa variabile (40-90 min), poi asciugatura professionale con phon.',
              },
              {
                step: '04',
                title: 'Sigillatura con Piastra',
                desc: 'Utilizziamo la piastra professionale per sigillare il trattamento nella fibra capillare.',
              },
              {
                step: '05',
                title: 'Risultato Finale',
                desc: 'Capelli lisci, luminosi e trasformati. Effetto immediato e duraturo!',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 font-display text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-display text-2xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-lg text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-gold-50 p-8">
            <div className="flex items-start gap-4">
              <svg
                className="h-6 w-6 flex-shrink-0 text-gold-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Durata del trattamento</h4>
                <p className="text-gray-700">
                  Il trattamento completo richiede <strong>4-6 ore</strong> a seconda della
                  lunghezza e densità dei capelli. Prenota con tranquillità, ci prendiamo tutto il
                  tempo necessario per un risultato perfetto.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="gray" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Domande Frequenti</h2>
          <div className="mt-12 space-y-6">
            {FAQ.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                <summary className="flex cursor-pointer items-center justify-between font-display text-xl font-bold text-gray-900">
                  {item.question}
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
                <p className="mt-4 leading-relaxed text-gray-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Final */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
            <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Pronta per la Trasformazione?
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              Prenota ora il tuo trattamento Nanoplastia e scopri il piacere di avere capelli
              perfetti ogni giorno.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                href={getWhatsAppLink('Ciao, vorrei prenotare la Nanoplastia!')}
                variant="whatsapp"
                size="lg"
                external
              >
                Prenota su WhatsApp
              </Button>
              <Button href="/servizi" variant="outline" size="lg">
                Vedi Altri Servizi
              </Button>
            </div>
            
          </div>
        </Container>
      </Section>
    </>
  );
}
