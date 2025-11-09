import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Color Correction Catanzaro | Correzione Colore Capelli Professionale',
  description: 
    'Color Correction a Catanzaro da Paparazzo: correzione colore professionale, recupero tinte sbagliate, rimozione pigmenti. Risultati perfetti garantiti. Prenota ☎️ 339 239 9044',
  keywords: [
    'color correction catanzaro',
    'correzione colore capelli catanzaro',
    'rimozione pigmenti catanzaro',
    'transizione dal nero catanzaro',
    'parrucchiere color correction catanzaro',
    'decolorazione capelli catanzaro',
    'correzione tinta sbagliata catanzaro',
  ],
};

export default function ColorCorrectionPage() {
  return (
    <>
      <Section background="gradient" padding="xl">
        <Container>
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white">
              <span className="mr-2">🎨</span>
              Specialisti in Correzione Colore
            </div>
            <h1 className="mb-6 font-display text-4xl font-bold text-gray-900 md:text-5xl">
              Color Correction Professionale
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Recuperiamo colorazioni sbagliate, capelli danneggiati o riflessi indesiderati.
              Tecnica avanzata con prodotti performanti per risultati perfetti.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                href={getWhatsAppLink('Ciao! Vorrei una consulenza per Color Correction')}
                variant="whatsapp"
                size="lg"
                external
              >
                Consulenza Gratuita
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="white" padding="xl">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative overflow-hidden rounded-2xl" style={{ height: '400px' }}>
              <Image
                src="/images/services/color-correction-3.jpg"
                alt="Esempio Color Correction - Prima e Dopo"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h2 className="mb-6 font-display text-3xl font-bold text-gray-900">
                Cos'è la Color Correction?
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  La <strong>Color Correction</strong> è un trattamento avanzato di correzione del colore 
                  che permette di rimediare a colorazioni sbagliate, transizioni difficili e capelli 
                  danneggiati da precedenti trattamenti.
                </p>
                <p>
                  Che tu abbia un colore da schiarire, riflessi indesiderati da neutralizzare 
                  o una colorazione non uniforme, il nostro team di esperti saprà trovare la soluzione perfetta 
                  per te.
                </p>
                <p>
                  Utilizziamo tecniche professionali e prodotti di alta qualità per garantire risultati 
                  ottimali rispettando sempre la salute del capello. Ogni correzione è preceduta da 
                  un'attenta analisi per studiare il percorso migliore verso il colore desiderato.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="xl">
        <Container>
          <div className="text-center mb-12">
            <h2 className="mb-4 font-display text-3xl font-bold text-gray-900">
              Quando Serve la Color Correction?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Situazioni comuni che richiedono un intervento di correzione colore professionale
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-4 text-4xl">🔄</div>
              <h3 className="mb-3 font-display text-xl font-bold text-gray-900">
                Transizione da un colore scuro
              </h3>
              <p className="text-gray-600">
                Passare da un colore scuro a tonalità più chiare richiede competenza e pazienza. 
                Realizziamo la transizione gradualmente preservando la salute dei capelli.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-4 text-4xl">⚠️</div>
              <h3 className="mb-3 font-display text-xl font-bold text-gray-900">
                Colore Sbagliato
              </h3>
              <p className="text-gray-600">
                Colorazione troppo scura, troppo chiara o con riflessi indesiderati? 
                Correggiamo ogni tipo di errore cromatico con tecniche professionali.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-4 text-4xl">💚</div>
              <h3 className="mb-3 font-display text-xl font-bold text-gray-900">
                Riflessi Indesiderati
              </h3>
              <p className="text-gray-600">
                Neutralizziamo riflessi indesiderati causati da decolorazioni 
                o colorazioni precedenti non riuscite.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="white" padding="xl">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 font-display text-3xl font-bold text-gray-900">
                Il Nostro Metodo
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center font-bold text-gold-600">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Analisi Iniziale</h3>
                    <p className="text-gray-600">
                      Valutiamo lo stato attuale dei capelli, la storia delle colorazioni precedenti 
                      e il risultato desiderato.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center font-bold text-gold-600">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Piano Personalizzato</h3>
                    <p className="text-gray-600">
                      Creiamo un percorso su misura, che può richiedere una o più sedute, 
                      per raggiungere il colore desiderato in sicurezza.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center font-bold text-gold-600">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Trattamento Professionale</h3>
                    <p className="text-gray-600">
                      Utilizziamo prodotti di alta gamma e tecniche avanzate per correggere 
                      il colore rispettando l'integrità del capello.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center font-bold text-gold-600">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cura e Mantenimento</h3>
                    <p className="text-gray-600">
                      Ti consigliamo i prodotti giusti e le abitudini per mantenere il risultato 
                      nel tempo e preservare la salute dei capelli.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gold-50 to-amber-50 rounded-2xl p-8">
              <h3 className="mb-4 font-display text-2xl font-bold text-gray-900">
                Perché Sceglierci?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-gold-600">✓</span>
                  <span className="text-gray-700">
                    <strong>Esperienza comprovata</strong> in correzioni colore complesse
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-gold-600">✓</span>
                  <span className="text-gray-700">
                    <strong>Prodotti professionali</strong> delle migliori marche
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-gold-600">✓</span>
                  <span className="text-gray-700">
                    <strong>Consulenza gratuita</strong> per valutare la fattibilità
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-gold-600">✓</span>
                  <span className="text-gray-700">
                    <strong>Approccio personalizzato</strong> per ogni cliente
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-gold-600">✓</span>
                  <span className="text-gray-700">
                    <strong>Rispetto della salute</strong> del capello sempre al primo posto
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="gradient" padding="xl">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6 font-display text-3xl font-bold text-gray-900">
              Hai bisogno di una Color Correction?
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Non tutti i casi sono uguali. Contattaci per una consulenza gratuita: 
              valuteremo insieme il tuo caso e ti proporremo la soluzione migliore per ottenere 
              il colore che desideri.
            </p>
            <Button
              href={getWhatsAppLink('Ciao! Vorrei prenotare una consulenza per Color Correction')}
              variant="whatsapp"
              size="lg"
              external
            >
              Prenota Consulenza Gratuita
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
