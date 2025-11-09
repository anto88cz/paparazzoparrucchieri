import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/config/constants';

export const metadata: Metadata = {
  title: 'Cookie Policy | Paparazzo Parrucchieri',
  description: 'Informativa sui cookie utilizzati dal sito Paparazzo Parrucchieri Catanzaro.',
};

export default function CookiePage() {
  return (
    <>
      <Section background="gradient" padding="xl">
        <Container size="md">
          <h1 className="mb-6 text-center font-display text-4xl font-bold text-gray-900">
            Cookie Policy
          </h1>
          <p className="text-center text-gray-600">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </Container>
      </Section>

      <Section background="white" padding="xl">
        <Container size="md">
          <div className="prose prose-lg max-w-none">
            <h2>1. Cosa sono i Cookie</h2>
            <p>
              I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo
              dell'utente quando visita un sito web. Sono ampiamente utilizzati per far funzionare
              i siti web in modo più efficiente e fornire informazioni ai proprietari del sito.
            </p>

            <h2>2. Come Utilizziamo i Cookie</h2>
            <p>Questo sito utilizza diverse tipologie di cookie per diverse finalità:</p>

            <h3>Cookie Tecnici (Necessari)</h3>
            <p>
              Questi cookie sono essenziali per il corretto funzionamento del sito. Senza questi
              cookie, alcune funzionalità del sito potrebbero non funzionare correttamente.
            </p>
            <ul>
              <li>
                <strong>Cookie di sessione</strong>: mantengono la tua sessione attiva durante la
                navigazione
              </li>
              <li>
                <strong>Cookie di preferenze</strong>: memorizzano le tue preferenze (es. consenso
                cookie)
              </li>
            </ul>
            <p className="text-sm italic">
              Base giuridica: necessari per il funzionamento del sito (Art. 122 Codice Privacy)
            </p>

            <h3>Cookie Analitici</h3>
            <p>
              Utilizziamo cookie analitici per capire come gli utenti interagiscono con il nostro
              sito, quali pagine visitano più frequentemente e come possiamo migliorare l'esperienza
              utente.
            </p>
            <ul>
              <li>
                <strong>Google Analytics 4</strong>: raccoglie dati anonimi sull'utilizzo del sito
              </li>
            </ul>
            <p className="text-sm italic">Base giuridica: consenso dell'utente (GDPR Art. 6(1)(a))</p>

            <h3>Cookie di Marketing (Futuri)</h3>
            <p>
              Attualmente non utilizziamo cookie di marketing o pubblicità. Se in futuro
              decidessimo di implementarli, chiederemo il tuo consenso esplicito prima di attivarli.
            </p>

            <h2>3. Cookie di Terze Parti</h2>
            <h3>Google Analytics</h3>
            <p>
              Utilizziamo Google Analytics per analizzare l'utilizzo del sito. Google Analytics
              installa cookie che raccolgono dati statistici aggregati sulle visite al sito.
            </p>
            <ul>
              <li>Nome cookie: _ga, _ga_*, _gid</li>
              <li>Durata: fino a 2 anni</li>
              <li>Finalità: analisi statistica del traffico</li>
              <li>
                Privacy Policy:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 hover:underline"
                >
                  policies.google.com/privacy
                </a>
              </li>
            </ul>

            <h3>Google Maps</h3>
            <p>
              Utilizziamo Google Maps per mostrare la nostra posizione. Google può installare
              cookie quando visualizzi la mappa.
            </p>
            <ul>
              <li>Finalità: visualizzazione mappa interattiva</li>
              <li>
                Privacy Policy:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 hover:underline"
                >
                  policies.google.com/privacy
                </a>
              </li>
            </ul>

            <h2>4. Come Gestire i Cookie</h2>
            <h3>Banner Cookie</h3>
            <p>
              Alla prima visita del sito, visualizzerai un banner che ti permette di accettare o
              rifiutare i cookie non essenziali. Puoi modificare le tue preferenze in qualsiasi
              momento cliccando sul link "Impostazioni Cookie" nel footer del sito.
            </p>

            <h3>Impostazioni Browser</h3>
            <p>
              Puoi gestire o eliminare i cookie attraverso le impostazioni del tuo browser. Ecco
              come fare nei principali browser:
            </p>
            <ul>
              <li>
                <strong>Chrome</strong>: Impostazioni → Privacy e sicurezza → Cookie e altri dati
                dei siti
              </li>
              <li>
                <strong>Firefox</strong>: Opzioni → Privacy e sicurezza → Cookie e dati dei siti
                web
              </li>
              <li>
                <strong>Safari</strong>: Preferenze → Privacy → Gestisci dati siti web
              </li>
              <li>
                <strong>Edge</strong>: Impostazioni → Cookie e autorizzazioni sito → Gestisci ed
                elimina cookie
              </li>
            </ul>

            <h3>Disattivare Google Analytics</h3>
            <p>
              Puoi disattivare Google Analytics installando il componente aggiuntivo del browser
              disponibile su:{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:underline"
              >
                tools.google.com/dlpage/gaoptout
              </a>
            </p>

            <h2>5. Durata dei Cookie</h2>
            <p>I cookie utilizzati su questo sito hanno diverse durate:</p>
            <ul>
              <li>
                <strong>Cookie di sessione</strong>: vengono eliminati alla chiusura del browser
              </li>
              <li>
                <strong>Cookie persistenti</strong>: rimangono sul dispositivo fino alla scadenza o
                eliminazione manuale (max 2 anni)
              </li>
            </ul>

            <h2>6. Modifiche alla Cookie Policy</h2>
            <p>
              Ci riserviamo il diritto di modificare questa Cookie Policy in qualsiasi momento.
              Eventuali modifiche saranno pubblicate su questa pagina con data di aggiornamento.
            </p>

            <h2>7. Contatti</h2>
            <p>
              Per domande riguardo questa Cookie Policy o per esercitare i tuoi diritti, contattaci:
            </p>
            <ul>
              <li>Email: {BUSINESS.email}</li>
              <li>Telefono: {BUSINESS.phoneFormatted}</li>
              <li>
                WhatsApp:{' '}
                <a href={BUSINESS.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">
                  {BUSINESS.phoneFormatted}
                </a>
              </li>
            </ul>

            <div className="mt-8 rounded-xl bg-gold-50 p-6">
              <p className="mb-4 font-bold text-gray-900">📋 Riepilogo Cookie Utilizzati</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-200">
                    <th className="pb-2 text-left">Nome</th>
                    <th className="pb-2 text-left">Tipo</th>
                    <th className="pb-2 text-left">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gold-100">
                    <td className="py-2">cookie_consent</td>
                    <td>Tecnico</td>
                    <td>1 anno</td>
                  </tr>
                  <tr className="border-b border-gold-100">
                    <td className="py-2">_ga</td>
                    <td>Analitico</td>
                    <td>2 anni</td>
                  </tr>
                  <tr className="border-b border-gold-100">
                    <td className="py-2">_ga_*</td>
                    <td>Analitico</td>
                    <td>2 anni</td>
                  </tr>
                  <tr>
                    <td className="py-2">_gid</td>
                    <td>Analitico</td>
                    <td>24 ore</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button href="/" variant="primary">
              Torna alla Home
            </Button>
            <Button href="/privacy" variant="outline">
              Leggi Privacy Policy
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
