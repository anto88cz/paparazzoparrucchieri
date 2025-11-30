import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import https from 'https';

// Configurazione per DeepSeek
const CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  model: process.env.DEEPSEEK_MODEL_TEXT || 'deepseek-chat',
  maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '3000'), // Ridotto da 4000 per velocità
  maxTokensMetadata: parseInt(process.env.DEEPSEEK_MAX_TOKENS_METADATA || '500'), // Token per metadati
  temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.8'), // Aumentato da 0.7 per risposte più veloci
  siteName: process.env.SITE_NAME || 'Paparazzo Parrucchieri',
  whatsapp: process.env.BUSINESS_WHATSAPP || '+393392399044',
  address: process.env.BUSINESS_ADDRESS || 'Via Formia 47, Catanzaro',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://paparazzoparrucchieri.it',
};

// Topic categories (versione ridotta per API)
const TOPICS = [
  {
    category: 'Hair Extensions',
    keywords: ['hair extensions', 'extension capelli', 'capelli lunghi', 'volume capelli'],
    service: '/servizi/hair-extensions',
    weight: 3,
  },
  {
    category: 'Nanoplastia',
    keywords: ['nanoplastia', 'trattamento lisciante', 'capelli lisci', 'anti-crespo'],
    service: '/servizi/nanoplastia',
    weight: 3,
  },
  {
    category: 'Color Correction',
    keywords: ['color correction', 'correzione colore', 'biondo perfetto', 'colore capelli'],
    service: '/servizi/color-correction',
    weight: 3,
  },
  {
    category: 'Balayage e Degradé',
    keywords: ['balayage', 'degradé', 'sfumature', 'colpi di sole'],
    service: '/servizi/color-correction',
    weight: 2,
  },
  {
    category: 'Taglio e Styling',
    keywords: ['taglio capelli', 'acconciature', 'styling', 'piega'],
    service: '/servizi',
    weight: 2,
  },
];

// Funzione per selezionare un topic casuale
function selectRandomTopic() {
  const totalWeight = TOPICS.reduce((sum, topic) => sum + topic.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const topic of TOPICS) {
    random -= topic.weight;
    if (random <= 0) {
      return topic;
    }
  }
  
  return TOPICS[0];
}

// Funzione per chiamare DeepSeek API
async function callDeepSeek(prompt: string, maxTokens: number = CONFIG.maxTokens): Promise<string> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: CONFIG.temperature,
    });

    const url = new URL('/v1/chat/completions', CONFIG.baseUrl);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.choices && response.choices[0]) {
            resolve(response.choices[0].message.content);
          } else {
            reject(new Error('Risposta API non valida'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Funzione per generare metadati velocemente
async function generateMetadata(selectedTopic: any, randomKeyword: string): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}> {
  const metadataPrompt = `Sei un esperto SEO per parrucchieri. Genera metadati ottimizzati per un articolo su "${randomKeyword}" a Catanzaro da Paparazzo Parrucchieri.

Rispondi SOLO con un JSON valido:
{
  "title": "Titolo accattivante completo",
  "slug": "slug-url-ottimizzato",
  "excerpt": "Breve descrizione per anteprima",
  "metaTitle": "Titolo SEO ottimizzato | Paparazzo Parrucchieri",
  "metaDescription": "Descrizione meta ottimizzata per SEO",
  "keywords": "parola1, parola2, parola3, catanzaro, parrucchiere"
}`;

  const response = await callDeepSeek(metadataPrompt, CONFIG.maxTokensMetadata); // Richiesta più piccola e veloce
  
  try {
    const metadata = JSON.parse(response.trim());
    return {
      title: metadata.title || `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} a Catanzaro`,
      slug: metadata.slug || `${randomKeyword.toLowerCase().replace(/\s+/g, '-')}-catanzaro`,
      excerpt: metadata.excerpt || `Scopri il servizio di ${randomKeyword} professionale da Paparazzo Parrucchieri a Catanzaro`,
      metaTitle: metadata.metaTitle || `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} Catanzaro | Paparazzo Parrucchieri`,
      metaDescription: metadata.metaDescription || `Servizio ${randomKeyword} premium a Catanzaro. Esperti certificati, prodotti professionali, risultati garantiti.`,
      keywords: metadata.keywords || `${randomKeyword}, parrucchiere catanzaro, ${selectedTopic.keywords.slice(0, 3).join(', ')}`,
    };
  } catch (error) {
    // Fallback se JSON non valido
    console.warn('Errore parsing metadata JSON, uso fallback:', error);
    return {
      title: `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} a Catanzaro: Servizio Professionale`,
      slug: `${randomKeyword.toLowerCase().replace(/\s+/g, '-')}-catanzaro`,
      excerpt: `Scopri il servizio di ${randomKeyword} professionale da Paparazzo Parrucchieri a Catanzaro`,
      metaTitle: `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} Catanzaro | Paparazzo Parrucchieri`,
      metaDescription: `Servizio ${randomKeyword} premium a Catanzaro. Esperti certificati, prodotti professionali, risultati garantiti.`,
      keywords: `${randomKeyword}, parrucchiere catanzaro, ${selectedTopic.keywords.slice(0, 3).join(', ')}`,
    };
  }
}

// Funzione per generare il body dell'articolo
async function generateArticleBody(metadata: any, selectedTopic: any, randomKeyword: string): Promise<string> {
  const bodyPrompt = `Scrivi il corpo completo dell'articolo in italiano su "${metadata.title}" per Paparazzo Parrucchieri a Catanzaro.

REQUISITI:
- Lunghezza: 800-1000 parole
- Stile: professionale, coinvolgente, orientato alla vendita
- Target: clienti locali a Catanzaro
- Includi riferimenti naturali al salone "Paparazzo Parrucchieri"
- Formato: Markdown puro (# per headers, ** per grassetto, - per liste)

STRUTTURA OBBLIGATORIA:

# ${metadata.title}

[Paragrafo introduttivo di 3-4 frasi che cattura l'attenzione]

## Che cos'è il ${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)}?

[Spiegazione completa del servizio: cos'è, come funziona, tecniche utilizzate, prodotti impiegati. Minimo 150 parole]

## I Benefici Principali del ${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)}

**1. Risultati Visibili e Duraturi**
- [Beneficio specifico 1]
- [Beneficio specifico 2]
- [Beneficio specifico 3]

**2. Tecnica Professionale e Personalizzata**
- [Come viene personalizzato]
- [Esperienza dello staff]
- [Prodotti utilizzati]

**3. Cura e Protezione dei Capelli**
- [Aspetti protettivi]
- [Trattamenti complementari]
- [Manutenzione post-servizio]

## ${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} da Paparazzo Parrucchieri a Catanzaro

Da **Paparazzo Parrucchieri**, il servizio di ${randomKeyword} raggiunge livelli di eccellenza assoluta. Il nostro team di hair stylist certificati combina esperienza ventennale con le tecniche più innovative del settore.

[Continua con 2-3 paragrafi su: expertise del salone, prodotti professionali utilizzati, approccio personalizzato, testimonianze clienti]

## Per Chi è Indicato il ${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)}

- [Tipo di cliente 1: capelli, esigenze]
- [Tipo di cliente 2: obiettivi, risultati]
- [Tipo di cliente 3: stile di vita, mantenimento]

## Il Processo: Come Funziona

**Consulenza Iniziale**
[Descrizione fase 1]

**Preparazione e Applicazione**
[Descrizione fase 2]

**Finalizzazione e Styling**
[Descrizione fase 3]

## Quanto Dura e Come Mantenerlo

[Paragrafo sulla durata del risultato, consigli per la manutenzione, prodotti consigliati, frequenza ritocchi]

## Prezzi e Come Prenotare

Il servizio di ${randomKeyword} da Paparazzo Parrucchieri parte da [fascia prezzo indicativa]. Il costo finale viene personalizzato in base a lunghezza, spessore e condizioni dei capelli.

**Prenota il tuo appuntamento:**
- 📱 WhatsApp: ${CONFIG.whatsapp}
- 📍 Vieni a trovarci: ${CONFIG.address}
- 🌐 Visita il nostro sito: ${CONFIG.siteUrl}

[Paragrafo di chiusura motivazionale]

IMPORTANTE: Scrivi SOLO il corpo dell'articolo in Markdown, senza frontmatter, introduzioni o spiegazioni aggiuntive.`;

  return await callDeepSeek(bodyPrompt, CONFIG.maxTokens);
}

// Funzione per pulire e formattare il contenuto
function cleanAndFormatContent(content: string): string {
  // Rimuovi BOM e normalizza line endings
  content = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
  
  // Rimuovi code fences se presenti
  content = content.replace(/^```markdown\s*/gm, '').replace(/^```\s*$/gm, '');
  
  // Se non inizia con ---, aggiungi frontmatter vuoto
  if (!content.startsWith('---')) {
    content = '---\n---\n' + content;
  }
  
  // Separa frontmatter e body
  let frontmatter = '';
  let body = content;
  
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (frontmatterMatch) {
    frontmatter = '---\n' + frontmatterMatch[1] + '\n---';
    body = frontmatterMatch[2];
  }
  
  // Normalizza frontmatter
  frontmatter = frontmatter.replace(/^- --$/gm, '---');
  
  // Normalizza date nel frontmatter
  frontmatter = frontmatter.replace(/^date:\s*\d{4}-\d{2}-\d{2}T[\d:.-]+Z?\s*$/gm, 
    () => `date: ${new Date().toISOString().split('T')[0]}`);
  
  // Assicura che frontmatter inizi e finisca con ---
  if (!frontmatter.startsWith('---')) frontmatter = '---\n' + frontmatter;
  if (!frontmatter.endsWith('---')) frontmatter = frontmatter + '\n---';
  
  // Fix headers (ensure space after #)
  body = body.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');
  
  // Fix bold (ensure spaces around **)
  body = body.replace(/(\S)\*\*/g, '$1 **');
  body = body.replace(/\*\*(\S)/g, '** $1');
  
  // Fix list markers
  body = body.replace(/^([-*])([^\s])/gm, '$1 $2');
  
  // Normalizza blank lines (max 2 consecutive)
  body = body.replace(/\n{3,}/g, '\n\n');
  
  // Verifica che ci sia contenuto oltre al frontmatter
  if (body.trim().length < 100) {
    throw new Error('Contenuto generato troppo breve o mancante');
  }
  
  return frontmatter + '\n' + body.trim();
}

export async function POST(request: NextRequest) {
  // Controlla autenticazione
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    // Seleziona topic casuale
    const selectedTopic = selectRandomTopic();
    const randomKeyword = selectedTopic.keywords[Math.floor(Math.random() * selectedTopic.keywords.length)];
    
    console.log('=== INIZIO GENERAZIONE BOZZA ===');
    console.log('Topic selezionato:', selectedTopic.category);
    console.log('Keyword:', randomKeyword);
    
    // PASSO 1: Genera metadati velocemente
    console.log('Generando metadati...');
    const metadata = await generateMetadata(selectedTopic, randomKeyword);
    console.log('Metadati generati:', metadata.title);
    
    // PASSO 2: Genera il body dell'articolo usando i metadati
    console.log('Generando corpo articolo...');
    const articleBody = await generateArticleBody(metadata, selectedTopic, randomKeyword);
    
    // Log per debugging
    console.log('=== CONTENUTO GENERATO DA AI ===');
    console.log('Lunghezza body:', articleBody.length, 'caratteri');
    console.log('Prime 500 caratteri:', articleBody.substring(0, 500));
    console.log('================================');
    
    // Verifica che ci sia contenuto
    if (!articleBody || articleBody.length < 200) {
      throw new Error('Contenuto generato troppo breve o vuoto');
    }
    
    // Costruisci il frontmatter
    const frontmatter = `---
title: ${metadata.title}
slug: ${metadata.slug}
excerpt: ${metadata.excerpt}
date: ${new Date().toISOString().split('T')[0]}
category: ${selectedTopic.category}
metaTitle: ${metadata.metaTitle}
metaDescription: ${metadata.metaDescription}
keywords: ${metadata.keywords}
---

${articleBody}`;
    
    // Pulisci e formatta il contenuto completo
    const cleanedContent = cleanAndFormatContent(frontmatter);
    
    console.log('=== BOZZA COMPLETA GENERATA ===');
    
    return NextResponse.json({
      success: true,
      draft: {
        title: metadata.title,
        slug: metadata.slug,
        excerpt: metadata.excerpt,
        category: selectedTopic.category,
        metaTitle: metadata.metaTitle,
        metaDescription: metadata.metaDescription,
        keywords: metadata.keywords,
        date: new Date().toISOString().split('T')[0],
        content: cleanedContent,
      },
    });
  } catch (error) {
    console.error('Errore generazione bozza:', error);
    
    // Messaggio di errore dettagliato
    let errorMessage = 'Errore nella generazione dell\'articolo';
    let errorDetails = 'Unknown error';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Messaggi personalizzati in base al tipo di errore
      if (error.message.includes('troppo breve') || error.message.includes('mancante')) {
        errorMessage = 'L\'AI ha generato contenuto insufficiente. Riprova cliccando "Rigenera".';
      } else if (error.message.includes('API')) {
        errorMessage = 'Errore di comunicazione con l\'AI. Verifica la configurazione API.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Errore nel parsing dei metadati. Riprova la generazione.';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        suggestion: 'Prova a rigenerare l\'articolo o contatta il supporto se il problema persiste.'
      },
      { status: 500 }
    );
  }
}
