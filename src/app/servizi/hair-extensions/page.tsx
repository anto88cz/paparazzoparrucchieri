import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Hair Extensions Catanzaro | Extension Capelli Naturali Invisibili',
  description:
    'Hair Extensions a Catanzaro da Paparazzo: extension tape-in con capelli 100% naturali, applicazione invisibile. Volume e lunghezza immediati. Da €300. Prenota ☎️ 339 239 9044',
  keywords: [
    'hair extensions catanzaro',
    'extension capelli catanzaro',
    'extension tape-in catanzaro',
    'extension invisibili catanzaro',
    'parrucchiere extensions catanzaro',
    'extension capelli naturali catanzaro',
    'allungamento capelli catanzaro',
  ],
};

const FAQ = [
  {
    question: 'Cosa sono le Stardust Hair Extensions?',
    answer:
      'Le Stardust Hair Extensions sono extension tape-in di ultima generazione con biadesivo ultra-sottile e leggerissimo. Realizzate con capelli 100% naturali vergini da singolo donatore, garantiscono un risultato completamente invisibile e confortevole per tutti i tipi di capelli.',
  },
  {
    question: 'Perché il biadesivo è così speciale?',
    answer:
      'Il nostro biadesivo è ultra-sottile (0.03mm) e leggerissimo, praticamente impercettibile al tatto. Non crea spessore, non tira i capelli naturali e aderisce perfettamente senza lasciare residui. È anallergico, dermatologicamente testato e resistente a calore, acqua e prodotti per capelli.',
  },
  {
    question: 'Posso usarle anche se ho i capelli fini o fragili?',
    answer:
      'Assolutamente sì! Le Stardust sono ideali proprio per capelli fini o fragili grazie al biadesivo leggerissimo che non appesantisce né danneggia. La tecnica tape-in delicata distribuisce uniformemente il peso senza stress per i capelli naturali.',
  },
  {
    question: 'Quanto durano e come si mantengono?',
    answer:
      'Con la giusta cura durano 2-3 mesi. Dopo puoi riposizionarle sostituendo solo il biadesivo, quindi le extension possono essere riutilizzate fino a 6-8 volte. La manutenzione è semplice: lava normalmente 2-3 volte a settimana con prodotti delicati, evita oli sulle attaccature.',
  },
  {
    question: 'Quanto tempo ci vuole per applicarle?',
    answer:
      'L\'applicazione completa richiede 60-90 minuti a seconda della quantità di ciocche necessarie. Il processo è veloce e indolore. Le rimozioni richiedono solo 20-30 minuti con prodotto specifico che scioglie il biadesivo senza danneggiare i capelli.',
  },
  {
    question: 'Si vedono o si sentono al tatto?',
    answer:
      'No! Grazie al biadesivo ultra-sottile e alla tecnica di applicazione professionale, le Stardust sono completamente invisibili. Anche al tatto risultano naturali. Puoi fare code, trecce, raccolti senza preoccuparti che si vedano le attaccature.',
  },
];

export default function HairExtensionsPage() {
  return (
    <>
      {/* Hero */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white">
                <span className="mr-2">✨</span>
                Tecnologia Invisibile
              </div>

              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Stardust Hair Extensions
                <br />
                <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
                  Ultra-Sottili & Leggerissime
                </span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Extension tape-in di nuova generazione con biadesivo invisibile da 0.03mm.
                Leggerissime, confortevoli e adatte a tutti i tipi di capelli. Volume e lunghezza
                immediati con risultato completamente naturale.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  href={getWhatsAppLink(
                    'Ciao! Vorrei informazioni sulle Stardust Hair Extensions'
                  )}
                  variant="whatsapp"
                  size="lg"
                  external
                >
                  Prenota Consulenza Gratuita
                </Button>
                <Button href="/contatti" variant="outline" size="lg">
                  Chiedi Info
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 shadow-2xl">
                <Image
                  src="/images/services/hair-extensions-1.jpg"
                  alt="Stardust Hair Extensions - Extension tape-in invisibili"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-2xl">
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-gold-600">0.03mm</div>
                  <div className="text-sm text-gray-600">Spessore Biadesivo</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Cosa sono le Stardust */}
      <Section background="white" padding="xl">
        <Container size="md">
          <div className="text-center">
            <h2 className="section-heading">Cosa Sono le Stardust Hair Extensions?</h2>
            <p className="section-subtitle">
              La rivoluzione delle extension: invisibili, leggerissime e per tutti
            </p>
          </div>

          <div className="mt-12 space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              Le <strong>Stardust Hair Extensions</strong> rappresentano l'evoluzione delle
              extension tape-in tradizionali. Abbiamo sviluppato un sistema esclusivo con{' '}
              <strong>biadesivo ultra-sottile (0.03mm)</strong> che rende le extension
              praticamente invisibili e impercettibili al tatto.
            </p>

            <p>
              Realizzate con <strong>capelli 100% naturali vergini da singolo donatore</strong>,
              garantiscono qualità premium, durata nel tempo e un aspetto incredibilmente naturale.
              La tecnica tape-in permette un'applicazione veloce (60-90 minuti) e delicata, senza
              calore o danni ai capelli naturali.
            </p>
          </div>
        </Container>
      </Section>

      {/* Caratteristiche Uniche */}
      <Section background="gray" padding="xl">
        <Container>
          <h2 className="section-heading text-center">Le Caratteristiche Uniche</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🪶',
                title: 'Ultra-Leggerissime',
                desc: 'Biadesivo 0.03mm che pesa quasi nulla. Non appesantiscono i capelli, non tirano, non danneggiano. Confort assoluto anche per capelli fini o fragili.',
              },
              {
                icon: '👁️',
                title: 'Completamente Invisibili',
                desc: 'Spessore microscopico che si fonde perfettamente con i capelli naturali. Nessuno noterà che porti extension. Ideali anche per code e raccolti.',
              },
              {
                icon: '💎',
                title: 'Capelli Premium',
                desc: '100% capelli naturali Remy Hair da singolo donatore. Cuticole allineate, zero sintetici. Possono essere trattati come i tuoi capelli naturali.',
              },
              {
                icon: '🔄',
                title: 'Riutilizzabili',
                desc: 'Durano 2-3 mesi e possono essere riposizionate fino a 6-8 volte sostituendo solo il biadesivo. Investimento a lungo termine.',
              },
              {
                icon: '🌡️',
                title: 'Resistenti',
                desc: 'Il biadesivo resiste a calore (phon, piastra), acqua (mare, piscina, doccia), prodotti styling. Tieni saldamente per mesi.',
              },
              {
                icon: '🚿',
                title: 'Facili da Gestire',
                desc: 'Lavaggio normale 2-3 volte a settimana. Nessuna manutenzione speciale. Asciugatura e styling come sempre. Semplicità totale.',
              },
              {
                icon: '⚡',
                title: 'Applicazione Rapida',
                desc: 'Solo 60-90 minuti per un set completo. Nessun dolore, nessun calore aggressivo. Rimozione in 20-30 minuti senza danni.',
              },
              {
                icon: '🌿',
                title: 'Dermatologicamente Testate',
                desc: 'Biadesivo anallergico, testato dermatologicamente. Adatto anche a cuoi capelluti sensibili. Nessuna irritazione o reazione.',
              },
              {
                icon: '👥',
                title: 'Per Tutti i Capelli',
                desc: 'Adatte a capelli fini, spessi, lisci, mossi, ricci. Qualsiasi tipo di capello può beneficiare delle Stardust senza rischi.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="mb-3 text-5xl">{item.icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Come Funziona */}
      <Section background="white" padding="xl">
        <Container>
          <h2 className="section-heading text-center">Come Funziona l'Applicazione</h2>
          <p className="section-subtitle text-center">
            Processo semplice e delicato in 5 step
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Consulenza & Color Match',
                desc: 'Analizziamo i tuoi capelli, definiamo obiettivo (volume/lunghezza) e facciamo il color matching perfetto per un risultato naturale al 100%.',
                icon: '🎨',
              },
              {
                number: '02',
                title: 'Preparazione Capelli',
                desc: 'Lavaggio con shampoo specifico per rimuovere oli e residui. Asciugatura e pettinatura per creare la base perfetta.',
                icon: '🧴',
              },
              {
                number: '03',
                title: 'Selezione Ciocche',
                desc: 'Dividiamo i capelli in sezioni e selezioniamo le ciocche naturali su cui applicare le extension tape-in, studiando la distribuzione ottimale.',
                icon: '✂️',
              },
              {
                number: '04',
                title: 'Applicazione Tape-In',
                desc: 'Applichiamo le Stardust con tecnica "sandwich": una ciocca di capelli naturali tra due extension tape-in. Il biadesivo aderisce istantaneamente.',
                icon: '⚡',
              },
              {
                number: '05',
                title: 'Taglio & Styling',
                desc: 'Taglio personalizzato per fondere extension con capelli naturali. Styling finale per mostrarti il risultato e insegnarti come gestirle.',
                icon: '💇‍♀️',
              },
              {
                number: '✨',
                title: 'Pronta!',
                desc: 'Esci dal salone con capelli più lunghi, voluminosi e luminosi. Risultato immediato, naturale e duraturo. Zero tempo di attesa!',
                icon: '🌟',
              },
            ].map((step, index) => (
              <div key={index} className="relative rounded-2xl bg-gray-50 p-6">
                <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 font-display text-xl font-bold text-white shadow-lg">
                  {step.number}
                </div>
                <div className="mb-3 text-4xl">{step.icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Esempi Trasformazioni */}
      <Section background="gradient" padding="xl">
        <Container>
          <h2 className="section-heading text-center text-white">
            Il Potere Trasformativo delle Stardust
          </h2>
          <p className="mx-auto max-w-2xl text-center text-lg text-white/90">
            Dai capelli corti a lunghi, da fini a voluminosi. Le Stardust possono realizzare il
            cambio look che desideri in poche ore.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/services/hair-extensions-1.jpg"
                  alt="Stardust Hair Extensions 200G - 70cm"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-gold-500 px-4 py-2 font-bold text-white shadow-lg">
                  200G
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-display text-xl font-bold text-gray-900">
                  Stardust Hair Extensions
                </h3>
                <p className="text-gray-600">
                  Lunghezza 70cm, double drown, origine capelli: Ucraina.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/services/hair-extensions-2.jpg"
                  alt="Stardust Hair Extensions 120G - 60cm"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-gold-500 px-4 py-2 font-bold text-white shadow-lg">
                  120G
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-display text-xl font-bold text-gray-900">
                  Stardust Hair Extensions
                </h3>
                <p className="text-gray-600">
                  Lunghezza 60cm, double drown, origine capelli: Ucraina.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="white" padding="xl">
        <Container size="md">
          <h2 className="section-heading text-center">Domande Frequenti</h2>
          <div className="mt-12 space-y-6">
            {FAQ.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-gray-50 p-6 shadow-md transition-all hover:shadow-lg"
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

      {/* CTA Finale */}
      <Section background="gradient" padding="xl">
        <Container>
          <div className="rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
            <div className="mb-6 text-6xl">✨</div>
            <h2 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Pronta a Scoprire le Stardust?
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              Prenota una consulenza gratuita. Analizzeremo i tuoi capelli, ti mostreremo esempi
              reali e ti faremo un preventivo personalizzato senza impegno.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                href={getWhatsAppLink(
                  'Ciao! Vorrei prenotare una consulenza gratuita per le Stardust Hair Extensions'
                )}
                variant="whatsapp"
                size="lg"
                external
              >
                Prenota Consulenza Gratuita
              </Button>
              <Button href="/servizi" variant="outline" size="lg">
                Vedi Altri Servizi
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Consulenza gratuita • Color matching incluso • Preventivo personalizzato
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
