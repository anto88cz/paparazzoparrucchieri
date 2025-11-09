import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/config/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | Paparazzo Parrucchieri',
  description: 'Informativa sulla privacy e trattamento dei dati personali di Paparazzo Parrucchieri Catanzaro.',
};

export default function PrivacyPage() {
  return (
    <>
      <Section background="gradient" padding="xl">
        <Container size="md">
          <h1 className="mb-6 text-center font-display text-4xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-600">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </Container>
      </Section>

      <Section background="white" padding="xl">
        <Container size="md">
          <div className="prose prose-lg max-w-none">
            <h2>1. Titolare del Trattamento</h2>
            <p>
              <strong>{BUSINESS.name}</strong>
              <br />
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.postalCode} {BUSINESS.address.city} ({BUSINESS.address.region})
              <br />
              Email: {BUSINESS.email}
              <br />
              Tel: {BUSINESS.phoneFormatted}
            </p>

            <h2>2. Tipologie di Dati Raccolti</h2>
            <p>
              Tra i dati personali raccolti da questo sito, in modo autonomo o tramite terze parti,
              ci sono: Cookie, Dati di utilizzo, nome, cognome, numero di telefono, indirizzo email.
            </p>
            <p>
              Dettagli completi su ciascuna tipologia di dati raccolti sono forniti nelle sezioni
              dedicate di questa privacy policy o mediante specifici testi informativi visualizzati
              prima della raccolta dei dati stessi.
            </p>

            <h2>3. Modalità e Luogo del Trattamento dei Dati</h2>
            <h3>Modalità di Trattamento</h3>
            <p>
              Il Titolare adotta le opportune misure di sicurezza volte ad impedire l'accesso, la
              divulgazione, la modifica o la distruzione non autorizzate dei Dati Personali.
            </p>
            <p>
              Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con
              modalità organizzative e con logiche strettamente correlate alle finalità indicate.
            </p>

            <h3>Luogo</h3>
            <p>
              I Dati sono trattati presso le sedi operative del Titolare ed in ogni altro luogo in
              cui le parti coinvolte nel trattamento siano localizzate.
            </p>

            <h3>Periodo di Conservazione</h3>
            <p>
              I Dati sono trattati e conservati per il tempo richiesto dalle finalità per le quali
              sono stati raccolti. I dati relativi a prenotazioni e servizi sono conservati per 10
              anni ai fini fiscali.
            </p>

            <h2>4. Finalità del Trattamento</h2>
            <p>I Dati dell'Utente sono raccolti per le seguenti finalità:</p>
            <ul>
              <li>Gestione prenotazioni e appuntamenti</li>
              <li>Erogazione dei servizi richiesti</li>
              <li>Comunicazioni commerciali e promozionali (previo consenso)</li>
              <li>Analisi statistica e miglioramento del servizio</li>
              <li>Adempimento obblighi fiscali e contabili</li>
            </ul>

            <h2>5. Base Giuridica del Trattamento</h2>
            <p>Il Titolare tratta Dati Personali relativi all'Utente in caso sussista una delle seguenti condizioni:</p>
            <ul>
              <li>l'Utente ha prestato il consenso per una o più finalità specifiche;</li>
              <li>il trattamento è necessario all'esecuzione di un contratto con l'Utente;</li>
              <li>il trattamento è necessario per adempiere un obbligo legale al quale è soggetto il Titolare;</li>
              <li>il trattamento è necessario per il perseguimento del legittimo interesse del Titolare.</li>
            </ul>

            <h2>6. Diritti dell'Utente</h2>
            <p>Gli Utenti possono esercitare determinati diritti con riferimento ai Dati trattati dal Titolare:</p>
            <ul>
              <li><strong>Diritto di accesso</strong>: ottenere conferma dell'esistenza di dati personali</li>
              <li><strong>Diritto di rettifica</strong>: correggere dati inesatti o incompleti</li>
              <li><strong>Diritto alla cancellazione</strong>: richiedere la cancellazione dei dati ("diritto all'oblio")</li>
              <li><strong>Diritto di limitazione</strong>: richiedere la limitazione del trattamento</li>
              <li><strong>Diritto alla portabilità</strong>: ricevere i dati in formato strutturato</li>
              <li><strong>Diritto di opposizione</strong>: opporsi al trattamento dei propri dati</li>
              <li><strong>Diritto di revoca</strong>: revocare il consenso in qualsiasi momento</li>
            </ul>
            <p>
              Per esercitare questi diritti, l'Utente può contattarci via email a {BUSINESS.email} o
              tramite WhatsApp al {BUSINESS.phoneFormatted}.
            </p>

            <h2>7. Cookie e Tecnologie Simili</h2>
            <p>
              Questo sito utilizza Cookie tecnici e, previo consenso dell'Utente, Cookie di
              terze parti. Per maggiori informazioni consulta la nostra{' '}
              <Link href="/cookie" className="text-gold-600 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>

            <h2>8. Servizi di Terze Parti</h2>
            <h3>Google Analytics</h3>
            <p>
              Utilizziamo Google Analytics per analizzare l'utilizzo del sito. Google Analytics
              raccoglie informazioni aggregate sull'uso del sito tramite cookie. Puoi disattivare
              Google Analytics installando l'apposito componente aggiuntivo del browser.
            </p>

            <h3>WhatsApp Business</h3>
            <p>
              Il sito contiene link e pulsanti per WhatsApp Business. Quando clicchi su questi link,
              sarai reindirizzato all'applicazione WhatsApp con dati precompilati. WhatsApp è un
              servizio di Meta Platforms, Inc.
            </p>

            <h2>9. Modifiche a Questa Privacy Policy</h2>
            <p>
              Il Titolare si riserva il diritto di apportare modifiche alla presente privacy policy
              in qualunque momento notificandolo agli Utenti su questa pagina. Si prega di controllare
              questa pagina regolarmente per essere informati su eventuali modifiche.
            </p>

            <h2>10. Contatti</h2>
            <p>
              Per qualsiasi domanda o richiesta riguardo questa Privacy Policy, puoi contattarci:
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
          </div>

          <div className="mt-12 text-center">
            <Button href="/" variant="primary">
              Torna alla Home
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
