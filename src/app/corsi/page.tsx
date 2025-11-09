import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { BUSINESS } from '@/config/constants';

export const metadata: Metadata = {
  title: 'Corso Hair Extensions | Masterclass Applicazione Biadesivo - Paparazzo Parrucchieri',
  description:
    'Impara il metodo professionale di applicazione Hair Extensions con biadesivo. Corso pratico per parrucchieri che vogliono offrire il servizio di extension nel proprio salone. Catanzaro e Calabria.',
  keywords: [
    'corso hair extensions',
    'masterclass extensions',
    'corso extension biadesivo',
    'formazione parrucchieri catanzaro',
    'corso tape in extensions',
    'formazione hair extensions calabria',
  ],
};

export default function CorsiPage() {
  return (
    <>
      {/* Hero */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white">
                <span className="mr-2">🎓</span>
                Formazione Professionale
              </div>

              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Masterclass
                <br />
                <span className="text-gold-600">Hair Extensions</span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Impara il metodo professionale di applicazione Hair Extensions con tecnica
                biadesivo (Tape-In) e inizia a offrire questo servizio esclusivo nel tuo salone.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  href={getWhatsAppLink('Vorrei informazioni sul corso Hair Extensions')}
                  variant="whatsapp"
                  size="lg"
                  external
                >
                  Richiedi Info
                </Button>
                <Button href="/contatti" variant="outline" size="lg">
                  Contattaci
                </Button>
              </div>
            </div>

            <div className="relative">
              <ImageCarousel
                images={[
                  {
                    src: '/images/services/hair-extensions-1.jpg',
                    alt: 'Hair Extensions - Esempio 1',
                  },
                  {
                    src: '/images/services/hair-extensions-2.jpg',
                    alt: 'Hair Extensions - Esempio 2',
                  },
                ]}
                aspectRatio="4/5"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Cosa Imparerai */}
      <Section background="white" padding="xl">
        <Container>
          <h2 className="section-heading text-center">Cosa Imparerai</h2>
          <p className="section-subtitle text-center">
            Un percorso completo per diventare specialista in Hair Extensions
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '📚',
                title: 'Teoria delle Extension',
                desc: 'Tipologie di capelli, qualità, provenienza e come riconoscere extension di qualità premium.',
              },
              {
                icon: '🎨',
                title: 'Color Matching',
                desc: 'Tecniche avanzate per abbinare perfettamente il colore delle extension ai capelli naturali del cliente.',
              },
              {
                icon: '✂️',
                title: 'Preparazione Capelli',
                desc: 'Come preparare i capelli naturali per l\'applicazione: lavaggio, asciugatura e sezionamento professionale.',
              },
              {
                icon: '🔧',
                title: 'Tecnica Tape-In',
                desc: 'Applicazione pratica del metodo biadesivo: posizionamento, pressione, distanze e strategie per risultato invisibile.',
              },
              {
                icon: '💇',
                title: 'Taglio e Styling',
                desc: 'Come tagliare, sfumare e integrare le extension per un effetto naturale. Tecniche di styling specifiche.',
              },
              {
                icon: '🔄',
                title: 'Manutenzione',
                desc: 'Rimozione sicura, refresh, riposizionamento e consigli di cura per il cliente.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-white to-gold-50 p-6 shadow-lg transition-transform hover:-translate-y-2"
              >
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h3 className="mb-3 font-display text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Struttura del Corso */}
      <Section background="gray" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Struttura del Corso</h2>
          <p className="section-subtitle text-center">
            Una giornata intensiva con focus sulla pratica
          </p>

          <div className="mt-12 space-y-8">
            {[
              {
                time: 'Mattina',
                title: 'Parte Teorica',
                activities: [
                  'Introduzione alle Hair Extensions: storia, evoluzione e mercato',
                  'Tipologie di extension: vergini, remy, sintетiche - differenze e qualità',
                  'Metodi di applicazione: confronto tra tape-in, cheratina, microring',
                  'Valutazione del cliente: analisi capelli, densità, texture',
                  'Color matching professionale: teoria del colore e abbinamenti',
                  'Strumenti e prodotti necessari per il servizio',
                ],
              },
              {
                time: 'Pomeriggio',
                title: 'Parte Pratica',
                activities: [
                  'Preparazione della postazione e organizzazione del lavoro',
                  'Lavaggio e preparazione dei capelli naturali',
                  'Sezionamento strategico per applicazione invisibile',
                  'Applicazione guidata passo-passo del metodo tape-in',
                  'Tecniche di pressione e sigillatura delle ciocche',
                  'Taglio, sfumatura e integrazione delle extension',
                  'Styling finale e consigli per il cliente',
                  'Rimozione sicura e tecniche di riposizionamento',
                ],
              },
              {
                time: 'Q&A Finale',
                title: 'Business & Consulenza',
                activities: [
                  'Come inserire il servizio nel listino del salone',
                  'Prezzi di mercato e margini di guadagno',
                  'Fornitori affidabili e gestione dello stock',
                  'Marketing del servizio: foto prima/dopo, social media',
                  'Gestione appuntamenti e tempistiche',
                  'Domande e risposte personalizzate',
                ],
              },
            ].map((session, index) => (
              <div key={index} className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 font-display text-2xl font-bold text-white shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gold-600">{session.time}</p>
                    <h3 className="font-display text-2xl font-bold text-gray-900">
                      {session.title}
                    </h3>
                  </div>
                </div>
                <ul className="space-y-3">
                  {session.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1 flex-shrink-0 text-gold-600">✓</span>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Dettagli Pratici */}
      <Section background="white" padding="xl">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Info Corso */}
            <div className="rounded-2xl bg-gradient-to-br from-gold-50 to-amber-50 p-8">
              <h2 className="mb-6 font-display text-3xl font-bold text-gray-900">
                Dettagli del Corso
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow">
                    📅
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Durata</h3>
                    <p className="text-gray-700">
                      1 giornata intensiva (9:00 - 18:00)
                      <br />
                      <span className="text-sm text-gray-600">Pausa pranzo inclusa</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow">
                    👥
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Partecipanti</h3>
                    <p className="text-gray-700">
                      Massimo 2 persone per corso
                      <br />
                      <span className="text-sm text-gray-600">
                        Per garantire attenzione personalizzata
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow">
                    📍
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Sede</h3>
                    <p className="text-gray-700">
                      {BUSINESS.address.street}
                      <br />
                      {BUSINESS.address.city}, {BUSINESS.address.region}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow">
                    📦
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Materiale Incluso</h3>
                    <p className="text-gray-700">
                      Kit pratico con extension, strumenti, dispensa digitale e attestato di
                      partecipazione
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow">
                    🎓
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Attestato</h3>
                    <p className="text-gray-700">
                      Certificato di partecipazione rilasciato a fine corso
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow">
                    💬
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">Supporto Post-Corso</h3>
                    <p className="text-gray-700">
                      Assistenza WhatsApp dopo il corso per domande e chiarimenti
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* A Chi è Rivolto */}
            <div>
              <h2 className="mb-6 font-display text-3xl font-bold text-gray-900">
                A Chi è Rivolto
              </h2>

              <div className="space-y-6">
                <div className="rounded-xl border-2 border-gold-200 bg-white p-6">
                  <h3 className="mb-3 flex items-center font-display text-xl font-bold text-gray-900">
                    <span className="mr-3 text-2xl">💇‍♀️</span>
                    Parrucchieri Professionisti
                  </h3>
                  <p className="text-gray-700">
                    Hai un salone e vuoi aggiungere il servizio di Hair Extensions al tuo listino
                    per aumentare il fatturato e fidelizzare i clienti.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-gold-200 bg-white p-6">
                  <h3 className="mb-3 flex items-center font-display text-xl font-bold text-gray-900">
                    <span className="mr-3 text-2xl">✨</span>
                    Hair Stylist Freelance
                  </h3>
                  <p className="text-gray-700">
                    Lavori come freelance e vuoi specializzarti in un servizio premium molto
                    richiesto dal mercato.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-gold-200 bg-white p-6">
                  <h3 className="mb-3 flex items-center font-display text-xl font-bold text-gray-900">
                    <span className="mr-3 text-2xl">🎯</span>
                    Aspiranti Specialisti
                  </h3>
                  <p className="text-gray-700">
                    Vuoi specializzarti in un settore di nicchia ad alto valore aggiunto e
                    differenziarti dalla concorrenza.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-gray-900 p-6 text-white">
                <h3 className="mb-3 font-display text-xl font-bold">⚠️ Prerequisiti</h3>
                <p className="text-gray-300">
                  È richiesta una qualifica professionale come parrucchiere o esperienza
                  equivalente nel settore. Il corso non è adatto a principianti senza formazione
                  di base.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Perché Scegliere Questo Corso */}
      <Section background="gradient" padding="xl">
        <Container>
          <h2 className="section-heading text-center">Perché Scegliere Questo Corso</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              {
                icon: '🏆',
                title: 'Esperienza Comprovata',
                desc: 'Oltre 10 anni di esperienza nel settore Hair Extensions. Formiamo con il metodo che usiamo ogni giorno nel nostro salone.',
              },
              {
                icon: '👨‍🏫',
                title: 'Formazione Pratica',
                desc: 'Focus sulla pratica con esercitazioni su modella. Impari facendo, non solo guardando.',
              },
              {
                icon: '📚',
                title: 'Materiale Didattico Completo',
                desc: 'Kit con extension professionali, dispensa digitale scaricabile.',
              },
              {
                icon: '🎁',
                title: 'Bonus Esclusivi',
                desc: 'Lista fornitori affidabili, template per preventivi, consigli di marketing.',
              },
              {
                icon: '💪',
                title: 'Piccoli Gruppi',
                desc: 'Massimo 2 partecipanti per garantire attenzione personalizzata e possibilità di fare tutte le domande.',
              },
              {
                icon: '🔄',
                title: 'Supporto Continuativo',
                desc: 'Non ti lasciamo solo dopo il corso supporto WhatsApp per dubbi e domande.',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-xl transition-transform hover:-translate-y-2"
              >
                <div className="mb-4 text-5xl">{benefit.icon}</div>
                <h3 className="mb-3 font-display text-2xl font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-lg text-gray-700">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Investimento */}
      <Section background="white" padding="xl">
        <Container size="sm">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center text-white shadow-2xl md:p-12">
            <div className="mb-4 text-6xl">💎</div>
            <h2 className="mb-4 font-display text-3xl font-bold">Investimento</h2>
            <div className="mb-6">
              <p className="mb-2 text-5xl font-bold text-gold-400">€ 1497</p>
              <p className="text-lg text-gray-300">
                Corso completo + Kit pratico + Materiale didattico + Attestato + Supporto post-corso
              </p>
            </div>

            <div className="mb-8 rounded-xl bg-white/10 p-6 backdrop-blur">
              <p className="mb-2 font-semibold text-gold-300">💡 Ritorno sull'investimento</p>
              <p className="text-sm text-gray-300">
                Con solo 2-3 applicazioni di extension recuperi completamente l'investimento del
                corso. Ogni servizio successivo è puro guadagno!
              </p>
            </div>

            <p className="mb-6 text-gray-400">
              Posti limitati • Prenotazione obbligatoria • Acconto richiesto
            </p>

            <Button
              href={getWhatsAppLink(
                'Ciao! Vorrei prenotare il corso Hair Extensions. Quando sono le prossime date disponibili?'
              )}
              variant="whatsapp"
              size="lg"
              external
            >
              Prenota il Tuo Posto
            </Button>

            {/* Payment Methods */}
            <div className="mt-8 border-t border-white/20 pt-8">
              <p className="text-sm text-gray-400">
                Pagamento rateale disponibile con Klarna, PayPal e Alma Pay
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="gray" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Domande Frequenti</h2>

          <div className="mt-12 space-y-6">
            {[
              {
                question: 'Devo portare la mia modella?',
                answer:
                  'No, non è necessario. Noi forniamo modelle su cui esercitarsi durante la parte pratica del corso. Se preferisci portare una tua modella, comunicacelo in anticipo.',
              },
              {
                question: 'Riceverò un attestato valido?',
                answer:
                  'Sì, al termine del corso riceverai un attestato di partecipazione che certifica la tua formazione nel metodo di applicazione Hair Extensions con tecnica tape-in.',
              },
              {
                question: 'Posso pagare a rate?',
                answer:
                  'Sì, offriamo pagamento rateale con Klarna (fino a 3 rate senza interessi), PayPal (Paga in 3) e Alma Pay. Puoi anche pagare tramite bonifico bancario. Contattaci su WhatsApp per scegliere il metodo più comodo per te.',
              },
              {
                question: 'Cosa succede se devo annullare?',
                answer:
                  'Puoi annullare fino a 7 giorni prima della data del corso con rimborso completo dell\'acconto. Oltre questo termine, l\'acconto non è rimborsabile ma può essere utilizzato per una data futura.',
              },
              {
                question: 'Organizate corsi anche fuori Catanzaro?',
                answer:
                  'Attualmente i corsi si svolgono presso la nostra sede a Catanzaro. Per gruppi di almeno 4 persone, valutiamo la possibilità di organizzare corsi in altre località. Contattaci per maggiori informazioni.',
              },
              {
                question: 'Dove posso acquistare le extension dopo il corso?',
                answer:
                  'Durante il corso ti forniremo una lista completa di fornitori affidabili con cui collaboriamo, comprensiva di contatti diretti e condizioni commerciali vantaggiose.',
              },
              {
                question: 'Quanto tempo serve per diventare autonomo?',
                answer:
                  'Dopo il corso sarai in grado di eseguire applicazioni base in autonomia. Consigliamo di fare pratica su almeno 5-10 clienti per acquisire completa sicurezza e velocità. Il nostro supporto post-corso ti accompagnerà in questa fase.',
              },
              {
                question: 'Il metodo tape-in danneggia i capelli?',
                answer:
                  'No, se applicato correttamente il metodo tape-in è sicuro e non danneggia i capelli naturali. Durante il corso imparerai tutte le tecniche per un\'applicazione sicura e professionale.',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                <summary className="flex cursor-pointer items-center justify-between font-display text-xl font-bold text-gray-900">
                  {faq.question}
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
                <p className="mt-4 leading-relaxed text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Finale */}
      <Section background="white" padding="xl">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 p-8 text-center text-white shadow-2xl md:p-12">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              Pronto a Specializzarti in Hair Extensions?
            </h2>
            <p className="mb-8 text-xl text-gold-50">
              Contattaci ora per conoscere le prossime date disponibili e prenotare il tuo posto.
              I posti sono limitati!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                href={getWhatsAppLink('Vorrei informazioni sul corso Hair Extensions')}
                variant="whatsapp"
                size="lg"
                external
              >
                Chiedi Info su WhatsApp
              </Button>
              <Button href="/contatti" variant="outline" size="lg">
                Contattaci
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
