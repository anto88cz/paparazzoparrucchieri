import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import https from 'https';

// Configurazione per DeepSeek
const CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  model: process.env.DEEPSEEK_MODEL_TEXT || 'deepseek-chat',
  maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '4000'),
  temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7'),
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
async function callDeepSeek(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: CONFIG.maxTokens,
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
    
    // Crea il prompt per DeepSeek
    const prompt = `Sei un esperto copywriter SEO per un salone di parrucchieri di lusso a Catanzaro chiamato "Paparazzo Parrucchieri".

Scrivi un articolo di blog COMPLETO in italiano su: "${randomKeyword} a Catanzaro"

REQUISITI:
- Lunghezza: 800-1000 parole
- Stile: professionale, coinvolgente, orientato alla vendita
- Target: clienti locali a Catanzaro
- Includi riferimenti naturali al salone "Paparazzo Parrucchieri"
- Formato: Markdown puro (# per headers, ** per grassetto, - per liste)

STRUTTURA OBBLIGATORIA:

---
title: ${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} a Catanzaro: [Sottotitolo accattivante]
slug: ${randomKeyword.toLowerCase().replace(/\s+/g, '-')}-catanzaro
excerpt: Scopri il servizio di ${randomKeyword} professionale da Paparazzo Parrucchieri a Catanzaro
date: ${new Date().toISOString().split('T')[0]}
category: ${selectedTopic.category}
metaTitle: ${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} Catanzaro | Paparazzo Parrucchieri
metaDescription: Servizio ${randomKeyword} premium a Catanzaro. Esperti certificati, prodotti professionali, risultati garantiti. Prenota ora!
keywords: ${randomKeyword}, parrucchiere catanzaro, ${selectedTopic.keywords.slice(0, 3).join(', ')}
---

# ${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} a Catanzaro: [Titolo Completo Accattivante]

[Paragrafo introduttivo di 3-4 frasi che cattura l'attenzione, presenta il problema/desiderio del cliente e introduce la soluzione]

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

IMPORTANTE: Scrivi SOLO l'articolo completo in Markdown, senza introduzioni o spiegazioni aggiuntive. NON usare blocchi \`\`\`markdown. Inizia direttamente con "---".`;

    // Chiama DeepSeek
    const generatedContent = await callDeepSeek(prompt);
    
    // Log per debugging
    console.log('=== CONTENUTO GENERATO DA AI ===');
    console.log('Lunghezza:', generatedContent.length, 'caratteri');
    console.log('Prime 500 caratteri:', generatedContent.substring(0, 500));
    console.log('================================');
    
    // Verifica che ci sia contenuto
    if (!generatedContent || generatedContent.length < 200) {
      throw new Error('Contenuto generato troppo breve o vuoto');
    }
    
    // Pulisci e formatta il contenuto
    const cleanedContent = cleanAndFormatContent(generatedContent);
    
    // Estrai metadata dal frontmatter
    const frontmatterMatch = cleanedContent.match(/^---\n([\s\S]*?)\n---/);
    const metadata: Record<string, string> = {};
    
    if (frontmatterMatch) {
      const frontmatterContent = frontmatterMatch[1];
      const lines = frontmatterContent.split('\n');
      
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
          metadata[match[1].trim()] = match[2].trim();
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      draft: {
        title: metadata.title || 'Articolo Generato',
        slug: metadata.slug || 'articolo-generato',
        excerpt: metadata.excerpt || '',
        category: metadata.category || selectedTopic.category,
        metaTitle: metadata.metaTitle || metadata.title || '',
        metaDescription: metadata.metaDescription || metadata.excerpt || '',
        keywords: metadata.keywords || randomKeyword,
        date: metadata.date || new Date().toISOString().split('T')[0],
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
