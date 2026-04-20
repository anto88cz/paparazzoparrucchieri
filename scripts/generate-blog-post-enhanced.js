/**
 * DeepSeek Blog Post Generator - Enhanced Version
 * Generates SEO-optimized blog articles with perfect formatting
 * Usage: node scripts/generate-blog-post-enhanced.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration from environment variables
const CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  model: process.env.DEEPSEEK_MODEL_TEXT || 'deepseek-chat',
  maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 4000,
  temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE) || 0.7,
  siteName: process.env.SITE_NAME || 'Paparazzo Parrucchieri',
  whatsapp: process.env.BUSINESS_WHATSAPP || '+393392399044',
  address: process.env.BUSINESS_ADDRESS || 'Via Formia 47, Catanzaro',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://paparazzoparrucchieri.it',
};

// ============================================================
// SEASONAL INTELLIGENCE — temi e tono adattati al mese corrente
// ============================================================
function getSeasonContext() {
  const month = new Date().getMonth(); // 0-11
  const year = new Date().getFullYear();

  const SEASONS = {
    winter:   { months: [11, 0, 1], name: 'inverno', adjective: 'invernale',
      mood: 'protezione, calore, feste, nuovi inizi',
      themes: ['protezione dal freddo', 'capelli lucenti per le feste', 'trattamenti rigeneranti post-Natale', 'nuovi look per il nuovo anno', 'colori profondi e avvolgenti'] },
    spring:   { months: [2, 3, 4], name: 'primavera', adjective: 'primaverile',
      mood: 'rinascita, leggerezza, colore, cambiamento',
      themes: ['detox capelli dopo l\'inverno', 'schiariture naturali', 'tagli freschi e leggeri', 'colori luminosi e pastello', 'preparazione all\'estate', 'matrimoni e cerimonie'] },
    summer:   { months: [5, 6, 7], name: 'estate', adjective: 'estivo',
      mood: 'protezione solare, leggerezza, vacanze, stile beach',
      themes: ['protezione sole e salsedine', 'beach waves e styling vacanza', 'biondo estivo e sun-kissed', 'acconciature anti-caldo', 'trattamenti idratanti intensivi'] },
    autumn:   { months: [8, 9, 10], name: 'autunno', adjective: 'autunnale',
      mood: 'calore, profondità, trasformazione, ritorno alla routine',
      themes: ['colori caldi e avvolgenti', 'rame e borgogna', 'riparazione danni estivi', 'trattamenti ristrutturanti', 'tagli di tendenza della stagione'] },
  };

  for (const [key, season] of Object.entries(SEASONS)) {
    if (season.months.includes(month)) {
      return { ...season, key, year };
    }
  }
  return { ...SEASONS.spring, key: 'spring', year };
}

// Topic categories — weight usato per probabilità di selezione
const TOPICS = [
  // === SERVIZI PRINCIPALI ===
  { category: 'Hair Extensions',
    keywords: ['hair extensions', 'extension capelli', 'capelli lunghi', 'volume capelli', 'extension tape', 'microring', 'great lengths'],
    service: '/servizi/hair-extensions', weight: 3 },
  { category: 'Nanoplastia',
    keywords: ['nanoplastia', 'trattamento lisciante', 'capelli lisci', 'anti-crespo', 'cheratina', 'liscio naturale'],
    service: '/servizi/nanoplastia', weight: 3 },
  { category: 'Color Correction',
    keywords: ['color correction', 'correzione colore', 'biondo perfetto', 'colore capelli', 'decolorazione', 'tinta professionale'],
    service: '/servizi/color-correction', weight: 3 },

  // === TECNICHE COLORE ===
  { category: 'Balayage e Sfumature',
    keywords: ['balayage', 'degradé', 'sfumature', 'colpi di sole', 'highlights', 'lowlights', 'shatush', 'babylights'],
    service: '/servizi/color-correction', weight: 2 },
  { category: 'Colori Creativi e di Tendenza',
    keywords: ['copper hair', 'cherry cola hair', 'cowgirl copper', 'expensive brunette', 'vanilla blonde', 'mushroom brown', 'money pieces'],
    service: '/servizi/color-correction', weight: 2 },
  { category: 'Biondo Perfetto',
    keywords: ['biondo perfetto', 'cold blonde', 'warm blonde', 'mantenere il biondo', 'anti-giallo', 'toner capelli'],
    service: '/servizi/color-correction', weight: 2 },

  // === TAGLIO E STYLING ===
  { category: 'Tagli Tendenza',
    keywords: ['taglio capelli', 'italian bob', 'butterfly cut', 'wolf cut', 'shag', 'layers', 'curtain bangs', 'frangia'],
    service: '/servizi', weight: 2 },
  { category: 'Acconciature e Styling',
    keywords: ['acconciature', 'styling', 'piega', 'onde morbide', 'beach waves', 'capelli lisci', 'bouncy blowout'],
    service: '/servizi', weight: 2 },

  // === TRATTAMENTI ===
  { category: 'Trattamenti Ristrutturanti',
    keywords: ['olaplex', 'bond repair', 'botox capelli', 'ricostruzione', 'maschera professionale', 'trattamento alla cheratina'],
    service: '/servizi', weight: 2 },
  { category: 'Salute del Cuoio Capelluto',
    keywords: ['scalp care', 'cuoio capelluto', 'forfora', 'dermatite', 'scrub cuoio capelluto', 'hair detox', 'microbioma'],
    service: '/servizi', weight: 1 },

  // === CURA E MANUTENZIONE ===
  { category: 'Hair Care Routine',
    keywords: ['routine capelli', 'hair care', 'prodotti professionali', 'shampoo solfato-free', 'leave-in', 'olio capelli'],
    service: '/servizi', weight: 2 },
  { category: 'Capelli Danneggiati',
    keywords: ['capelli rovinati', 'riparare capelli', 'doppie punte', 'capelli secchi', 'idratazione profonda', 'porosità'],
    service: '/servizi', weight: 2 },
  { category: 'Crescita e Rinforzamento',
    keywords: ['crescita capelli', 'caduta capelli', 'rinforzare capelli', 'integratori', 'massaggio cuoio capelluto', 'hair cycling'],
    service: '/servizi', weight: 1 },

  // === TEXTURE E TIPI SPECIFICI ===
  { category: 'Capelli Ricci e Mossi',
    keywords: ['capelli ricci', 'curly girl method', 'ricci definiti', 'texture naturale', 'diffusore', 'gel ricci'],
    service: '/servizi', weight: 2 },
  { category: 'Capelli Fini e Volume',
    keywords: ['capelli fini', 'volume naturale', 'ispessire capelli', 'root lift', 'body wave', 'mousse volume'],
    service: '/servizi', weight: 1 },

  // === OCCASIONI ===
  { category: 'Matrimoni e Eventi',
    keywords: ['acconciature sposa', 'capelli matrimonio', 'look cerimonia', 'eventi speciali', 'updo', 'chignon'],
    service: '/servizi', weight: 1 },

  // === LIFESTYLE & CULTURA ===
  { category: 'Hair Trends Social',
    keywords: ['TikTok hair', 'viral hairstyles', 'hair trends', 'celebrity look', 'red carpet', 'instagram hair'],
    service: '/servizi', weight: 2 },
  { category: 'Sostenibilità e Clean Beauty',
    keywords: ['prodotti biologici', 'clean beauty', 'eco-friendly', 'ingredienti naturali', 'vegan hair care', 'packaging sostenibile'],
    service: '/servizi', weight: 1 },
  { category: 'Anti-Age e Grey Blending',
    keywords: ['capelli grigi', 'grey blending', 'silver hair', 'anti-age capelli', 'volume over 50', 'copertura ricrescita'],
    service: '/servizi', weight: 1 },

  // === INNOVAZIONE ===
  { category: 'Nuove Tecnologie Hair',
    keywords: ['bond building', 'trattamenti a vapore', 'infrarossi capelli', 'diagnostica capelli', 'personalizzazione trattamenti'],
    service: '/servizi', weight: 1 },
];

/**
 * Make API request to DeepSeek with enhanced prompt
 */
function makeDeepSeekRequest(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: `Sei un esperto SEO copywriter e hair stylist con 15+ anni di esperienza. 
          Scrivi contenuti per ${CONFIG.siteName}, salone di lusso a Catanzaro. 
          IMPORTANTE: Restituisci SEMPRE contenuto in formato Markdown perfettamente formattato con:
          - Titoli H1, H2, H3 con #, ##, ###
          - Testo in grassetto con **testo**
          - Elenchi puntati con - 
          - Paragrafi separati da righe vuote
          - Link formattati [testo](url)
          - Struttura chiara e leggibile`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
    });

    const url = new URL('/v1/chat/completions', CONFIG.baseUrl);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONFIG.apiKey}`,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(url, options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(body);
            resolve(response.choices[0].message.content);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        } else {
          reject(new Error(`API request failed: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Generate dynamic trending topics using AI — stagionalità intelligente
 */
async function generateTrendingTopics() {
  console.log('🔥 Generating trending topics with AI...');
  
  const season = getSeasonContext();
  const monthName = new Date().toLocaleDateString('it-IT', { month: 'long' });
  
  const prompt = `
Sei un esperto di tendenze hair & beauty. Genera 5 argomenti ORIGINALI e SPECIFICI per articoli blog di un salone di parrucchieri.

CONTESTO ATTUALE:
- Mese: ${monthName} ${season.year}
- Stagione: ${season.name}
- Mood stagionale: ${season.mood}
- Temi stagionali suggeriti: ${season.themes.join(', ')}

REQUISITI:
1. Argomenti CONCRETI e SPECIFICI (non generici come "tendenze capelli")
2. Mix di: 1 trend social/virale + 1 tecnica professionale + 1 cura/salute + 1 stagionale + 1 a scelta libera
3. Titoli che le persone cercherebbero davvero su Google
4. Orientati al periodo ${season.adjective} ma non banali
5. NON menzionare città o nomi di saloni nei titoli
6. In italiano, professionali ma accattivanti

FORMATO OUTPUT (solo i titoli, uno per riga):
1. [Titolo specifico e accattivante]
2. [Titolo specifico e accattivante]
3. [Titolo specifico e accattivante]
4. [Titolo specifico e accattivante]
5. [Titolo specifico e accattivante]
`;

  try {
    const response = await makeDeepSeekRequest(prompt);
    const topics = response
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^["'`]+|["'`]+$/g, '').trim())
      .filter(topic => topic.length > 10);
    
    console.log('✨ Generated trending topics:', topics);
    return topics;
  } catch (err) {
    console.log('⚠️  Failed to generate trending topics, using fallback:', err.message);
    return [];
  }
}

/**
 * Check if a topic has been recently published to avoid duplicates
 */
function isTopicRecentlyPublished(topic, recentTitles) {
  const topicLower = topic.toLowerCase();
  
  // Check for exact matches or very similar titles
  for (const recentTitle of recentTitles) {
    const recentLower = recentTitle.toLowerCase();
    
    // Exact match
    if (topicLower === recentLower) {
      return true;
    }
    
    // Check for keyword overlap (at least 3 common words)
    const topicWords = topicLower.split(/\s+/).filter(word => word.length > 3);
    const recentWords = recentLower.split(/\s+/).filter(word => word.length > 3);
    
    const commonWords = topicWords.filter(word => recentWords.includes(word));
    if (commonWords.length >= 3) {
      return true;
    }
    
    // Check for category similarity (colori, capelli, trattamenti, etc.)
    const colorKeywords = ['colori', 'colore', 'tinta', 'decolorazione', 'balayage', 'highlights', 'autunnali', 'caldi'];
    const hairKeywords = ['capelli', 'hair', 'extensions', 'lunghezza', 'volume'];
    const treatmentKeywords = ['trattamento', 'nanoplastia', 'cheratina', 'botox', 'ristrutturante'];
    
    const hasColorMatch = colorKeywords.some(k => topicLower.includes(k) && recentLower.includes(k));
    const hasHairMatch = hairKeywords.some(k => topicLower.includes(k) && recentLower.includes(k));
    const hasTreatmentMatch = treatmentKeywords.some(k => topicLower.includes(k) && recentLower.includes(k));
    
    if (hasColorMatch || hasHairMatch || hasTreatmentMatch) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get recent published titles to avoid duplicates
 */
function getRecentTitles() {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const titles = [];
  
  try {
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          try {
            const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
            const titleMatch = content.match(/^title:\s*"([^"]+)"/m) || content.match(/^#\s+(.+)$/m);
            return titleMatch ? titleMatch[1].trim() : null;
          } catch (err) {
            console.log('⚠️  Could not read file:', file, err.message);
            return null;
          }
        })
        .filter(title => title !== null)
        .slice(-10); // Last 10 articles
      
      titles.push(...files);
    }
  } catch (err) {
    console.log('⚠️  Could not read recent titles:', err.message);
  }
  
  return titles;
}

/**
 * Select topic based on weighted probability or AI-generated trends
 */
async function selectSmartTopic() {
  const recentTitles = getRecentTitles();
  console.log(`📚 Found ${recentTitles.length} recent articles to avoid duplicates`);
  
  // 60% probabilità di usare AI trending topics per varietà massima
  const useAITopics = Math.random() < 0.6;
  
  if (useAITopics) {
    const trendingTopics = await generateTrendingTopics();
    if (trendingTopics.length > 0) {
      // Filter out recently published topics
      const availableTrending = trendingTopics.filter(topic => 
        !isTopicRecentlyPublished(topic, recentTitles)
      );
      
      if (availableTrending.length > 0) {
        const selectedTrending = availableTrending[Math.floor(Math.random() * availableTrending.length)];
        return {
          category: 'AI Trending',
          keywords: ['tendenze capelli', 'moda capelli', 'innovazioni', 'stile moderno'],
          service: '/servizi',
          weight: 1,
          aiGenerated: true,
          trendingTitle: selectedTrending
        };
      }
    }
  }
  
  // Fallback to weighted selection from predefined topics
  const weightedTopics = [];
  TOPICS.forEach(topic => {
    for (let i = 0; i < topic.weight; i++) {
      weightedTopics.push(topic);
    }
  });
  
  // Filter out recently published topics
  const availableTopics = weightedTopics.filter(topic => {
    const sampleTitle = `${topic.keywords[0]} ${topic.keywords[1] || ''}`.trim();
    return !isTopicRecentlyPublished(sampleTitle, recentTitles);
  });
  
  if (availableTopics.length === 0) {
    console.log('⚠️  All topics recently published, using random selection');
    return weightedTopics[Math.floor(Math.random() * weightedTopics.length)];
  }
  
  return availableTopics[Math.floor(Math.random() * availableTopics.length)];
}

/**
 * Generate SEO-optimized title
 */
async function generateTitle() {
  console.log('🎯 Generating SEO title...');

  const selectedTopic = await selectSmartTopic();
  const topicKeywords = selectedTopic.keywords.slice(0, 3).join(', ');
  
  console.log(`📂 Selected category: ${selectedTopic.category} (weight: ${selectedTopic.weight})`);
  console.log(`🏷️  Topic keywords: ${topicKeywords}`);
  
  // Se il topic è generato da AI, usa il titolo trending
  if (selectedTopic.aiGenerated && selectedTopic.trendingTitle) {
    console.log('🔥 Using AI-generated trending title:', selectedTopic.trendingTitle);
    return selectedTopic.trendingTitle;
  }

  const season = getSeasonContext();

  const prompt = `
Genera 1 titolo SEO-ottimizzato per un articolo del blog di un salone di parrucchieri.

CATEGORIA: ${selectedTopic.category}
KEYWORDS DA INCLUDERE: ${topicKeywords}
STAGIONE: ${season.name} ${season.year}

REQUISITI TITOLO:
- Lunghezza: 50-70 caratteri
- Attraente, specifico e professionale
- Include una keyword principale della categoria
- Può includere "Catanzaro" o "Calabria" MA non è obbligatorio (alternare)
- Orientato a ciò che le persone cercano su Google
- Deve sembrare un articolo di una rivista di settore

ESEMPI DI BUONI TITOLI:
"Balayage Caramello: la Tecnica per Sfumature Perfette"
"Come Riparare i Capelli Dopo l'Estate: Guida Completa"
"Nanoplastia: Tutto sul Trattamento Lisciante Naturale"
"I 5 Tagli più Richiesti della Primavera ${season.year}"
"Hair Extensions: Come Scegliere Quelle Giuste per Te"

Restituisci SOLO il titolo, senza numerazione, virgolette o note.
`;

  const response = await makeDeepSeekRequest(prompt);
  return response.trim().replace(/^["'`]*|["'`]*$/g, '');
}

/**
 * Create URL-safe slug from title
 */
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
    .substring(0, 60);
}

/**
 * Generate enhanced blog post with perfect formatting
 */
async function generateEnhancedBlogPost(title) {
  console.log('✍️  Generating enhanced blog post...');

  const slug = createSlug(title);
  const whatsappLink = `https://wa.me/${CONFIG.whatsapp.replace(/\+/g, '')}?text=Ciao! Ho letto l'articolo "${title}" e vorrei una consulenza!`;
  const currentDate = new Date().toISOString().split('T')[0];
  const season = getSeasonContext();

  const prompt = `
Scrivi un articolo COMPLETO e BEN FORMATTATO per il blog di ${CONFIG.siteName}, salone di parrucchieri a Catanzaro.

TITOLO: "${title}"
STAGIONE CORRENTE: ${season.name} ${season.year}
CONTESTO STAGIONALE: ${season.mood}

REQUISITI ASSOLUTI - FORMATTAZIONE MARKDOWN:
1. Usa # per H1, ## per H2, ### per H3
2. Usa **testo** per grassetto
3. Usa *testo* per corsivo
4. Usa - per elenchi puntati
5. Paragrafi separati da righe vuote
6. Link: [testo](url)

STRUTTURA OBBLIGATORIA - RISPETTA ESATTAMENTE:
⚠️  IMPORTANTE: Usa ESATTAMENTE tre trattini --- NON - -- o varianti
⚠️  FORMATTAZIONE CRITICA:
   - Header SEMPRE con spazio dopo #: "## Titolo" NON "##Titolo"
   - Date SEMPRE in formato YYYY-MM-DD (es: 2024-12-25) NON ISO completo
   - Grassetti SEMPRE con **testo** NON ** testo ** o varianti
   - Liste SEMPRE con - NON * o altri caratteri

---
title: "${title}"
slug: "${slug}"
excerpt: "[150-160 caratteri descrittivi con keyword principale]"
date: "${currentDate}"
category: "Trattamenti"
metaTitle: "${title} | ${CONFIG.siteName}"
metaDescription: "[Meta description 150-160 caratteri con CTA]"
keywords: "parrucchieri catanzaro, ${title.toLowerCase()}, salone lusso catanzaro"
---

# ${title}

[Introduzione coinvolgente 150-200 parole con keyword nel primo paragrafo]

## Che cos'è [argomento principale]?

[Paragrafo dettagliato con **grassetti** per parole chiave]

## I Benefici Principali

**1. Beneficio primo**
- Punto dettaglio
- Punto dettaglio

**2. Beneficio secondo**
- Punto dettaglio
- Punto dettaglio

**3. Beneficio terzo**
- Punto dettaglio
- Punto dettaglio

## Come Funziona il Processo

### Fase 1: Consulenza
[Descrizione dettagliata]

### Fase 2: Preparazione
[Descrizione dettagliata]

### Fase 3: Trattamento
[Descrizione dettagliata]

### Fase 4: Risultati
[Descrizione dettagliata]

## Perché Scegliere ${CONFIG.siteName}

Da oltre **20 anni** il nostro salone rappresenta l'eccellenza nel settore dei **parrucchieri a Catanzaro**. 

- ✅ **Esperienza certificata** in [trattamenti specialistici]
- ✅ **Prodotti premium** di alta qualità
- ✅ **Team qualificato** in formazione continua
- ✅ **Ambiente luxury** nel cuore di Catanzaro

> 💬 **"Un'esperienza fantastica! Professionalità e risultati incredibili"** - Cliente soddisfatta

## Costi e Tempistiche

| Servizio | Durata | Prezzo |
|----------|--------|---------|
| Consulenza | 30 min | Gratuita |
| Trattamento Base | 2-3 ore | Da €XX |
| Trattamento Premium | 3-4 ore | Da €XX |

*I prezzi possono variare in base alle specifiche esigenze*

## Domande Frequenti (FAQ)

### Quanto dura l'effetto del trattamento?
[Risposta dettagliata 80-100 parole]

### È adatto a tutti i tipi di capelli?
[Risposta dettagliata 80-100 parole]

### Ci sono controindicazioni?
[Risposta dettagliata 80-100 parole]

### Come mantenere i risultati?
[Risposta dettagliata 80-100 parole]

## Prenota la Tua Consulenza Gratuita

Non aspettare oltre! I nostri **hair stylist esperti** sono pronti a trasformare i tuoi capelli.

**📱 [Prenota su WhatsApp](${whatsappLink})** per una consulenza personalizzata gratuita!

Scopri anche i nostri altri servizi premium:
- [Hair Extensions professionali](${CONFIG.siteUrl}/servizi/hair-extensions)
- [Nanoplastia anti-crespo](${CONFIG.siteUrl}/servizi/nanoplastia)  
- [Color Correction avanzata](${CONFIG.siteUrl}/servizi/color-correction)

## Conclusione

[Paragrafo finale 100-150 parole che riassume i benefici principali]

**Contattaci oggi stesso** per iniziare il tuo percorso verso capelli da sogno!

📍 **${CONFIG.address}**  
📱 **[${CONFIG.whatsapp}](${whatsappLink})**  
🌐 **[${CONFIG.siteUrl}](${CONFIG.siteUrl})**

---

IMPORTANTE: 
- Restituisci SOLO il contenuto markdown come specificato
- Mantieni ESATTA la formattazione con #, **, -, ecc.
- Non aggiungere commenti o note extra
- Assicurati che ogni sezione sia ben separata
- Usa grassetti strategicamente per SEO
`;

  const response = await makeDeepSeekRequest(prompt);
  return response;
}

/**
 * Clean and format the generated content
 */
function cleanAndFormatContent(content) {
  return content
    // Remove any extra markdown code blocks
    .replace(/```markdown\s*/g, '')
    .replace(/```\s*$/g, '')
    
    // Fix common spacing issues
    .replace(/\n{3,}/g, '\n\n')  // Max 2 line breaks
    .replace(/^[\s\n]+|[\s\n]+$/g, '')  // Trim start/end
    
    // CRITICAL: Fix malformed YAML frontmatter - ALL PATTERNS
    .replace(/^-\s--$/gm, '---')           // Fix - -- to --- (exact)
    .replace(/^-\s*--\s*$/gm, '---')       // Fix - -- with spaces
    .replace(/^-\s+--\s*$/gm, '---')       // Fix -   -- 
    .replace(/^\s*-\s*--\s*$/gm, '---')    // Fix indented - --
    .replace(/^-\s{1,}--\s*$/gm, '---')    // Fix any - spaces --
    
    // Fix business names with underscores
    .replace(/Paparazzo_Parrucchieri/g, 'Paparazzo Parrucchieri')
    .replace(/Via_Formia_47_Catanzaro/g, 'Via Formia 47, Catanzaro')
    
    // CRITICAL: Fix header formatting - ensure space after #
    .replace(/^([#]{1,3})([^#\s])/gm, '$1 $2')
    
    // Ensure proper H2/H3 formatting (double check)
    .replace(/^([#]{1,3})\s*([^#\n]+)/gm, '$1 $2')
    
    // Fix malformed bold text
    .replace(/\*\*\s+/g, '**')  // Remove spaces after **
    .replace(/\s+\*\*/g, '**')  // Remove spaces before **
    .replace(/\*\*([^*]*)\*\*\*/g, '**$1**')  // Fix triple asterisks
    
    // Ensure proper bold formatting
    .replace(/\*\*([^*]+)\*\*/g, '**$1**')
    
    // Fix list formatting
    .replace(/^\s*[-•]\s*/gm, '- ')
    
    // Ensure proper link formatting
    .replace(/\[([^\]]+)\]\s*\(\s*([^)]+)\s*\)/g, '[$1]($2)')
    
    // Add proper line breaks after headers
    .replace(/^(#{1,3}\s+.+)$/gm, '$1\n')
    
    // Ensure frontmatter is properly closed
    .replace(/(---\n[\s\S]*?\n)([^-])/g, '$1---\n\n$2')
    
    // Fix date format in frontmatter (ensure YYYY-MM-DD)
    .replace(/date:\s*["']?(\d{4}-\d{2}-\d{2})T[\d:.]+Z?["']?/gm, 'date: "$1"')
    
    // FINAL FIX: Replace any remaining malformed frontmatter
    .replace(/^- --$/gm, '---')
    .replace(/^date:\s*(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/gm, 'date: "$1".split("T")[0]');
}

/**
 * Save blog post to file with better error handling
 */
function saveBlogPost(content, title) {
  const contentDir = path.join(__dirname, '..', 'content', 'blog');

  // Create content/blog directory if it doesn't exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
    console.log('📁 Created blog directory');
  }

  // Extract slug from content or generate from title
  let slug;
  const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/);
  if (slugMatch) {
    slug = slugMatch[1].trim();
  } else {
    slug = createSlug(title);
  }

  // Clean slug to avoid strange suffixes
  slug = slug.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const filename = `${slug}.md`;
  const filepath = path.join(contentDir, filename);

  // Check if file already exists - use a cleaner approach
  if (fs.existsSync(filepath)) {
    // Instead of timestamp, try to make slug unique by adding a number
    let counter = 1;
    let newSlug = slug;
    let newFilepath = filepath;

    while (fs.existsSync(newFilepath) && counter < 10) {
      newSlug = `${slug}-${counter}`;
      newFilepath = path.join(contentDir, `${newSlug}.md`);
      counter++;
    }

    if (fs.existsSync(newFilepath)) {
      // Last resort: use timestamp but cleaner format
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      newSlug = `${slug}-${timestamp}`;
      newFilepath = path.join(contentDir, `${newSlug}.md`);
    }

    // Update slug in content
    content = content.replace(/slug:\s*["']?([^"'\n]+)["']?/, `slug: "${newSlug}"`);

    fs.writeFileSync(newFilepath, content, 'utf8');
    console.log(`✅ Blog post saved: ${newFilepath} (unique slug created)`);
    return newFilepath;
  }

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Blog post saved: ${filepath}`);
  return filepath;
}

/**
 * Clean and format generated content to fix common AI formatting issues
 */
function cleanAndFormatContent(content) {
  console.log('🧹 Cleaning and formatting content...');

  if (!content || typeof content !== 'string') return '';

  // Remove BOM and CR characters
  content = content.replace(/^\uFEFF/, '').replace(/\r/g, '');

  // Remove markdown code fences that sometimes wrap the whole response
  content = content.replace(/```(?:markdown)?\n?/gi, '');
  content = content.replace(/\n?```/g, '');

  // Trim leading/trailing whitespace
  content = content.trimStart();

  // Convert to lines for robust frontmatter normalization
  const lines = content.split('\n');

  // Find approximate body start (first H1) to limit normalization to the frontmatter area
  let bodyIndex = lines.findIndex(l => l.trim().startsWith('# '));
  if (bodyIndex === -1) bodyIndex = Math.min(40, lines.length); // limit to first 40 lines if no H1 found

  // Normalize any line in the frontmatter area that contains only dashes and spaces (including unicode spaces)
  for (let i = 0; i < bodyIndex; i++) {
    // normalize unicode NBSP and tabs to regular spaces, then trim
    lines[i] = lines[i].replace(/\u00A0/g, ' ').replace(/\t/g, ' ').trim();

    // Extract only dashes and spaces to detect malformed separators like '- --' or '- - -'
    const onlyDashSpace = lines[i].replace(/[^\-\s]/g, '');
    if (onlyDashSpace.length >= 3 && /^[-\s]+$/.test(onlyDashSpace)) {
      lines[i] = '---';
    }
  }

  // Ensure there is a frontmatter block starting and ending with '---'
  let fmStart = -1;
  let fmEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (fmStart === -1) fmStart = i;
      else if (fmEnd === -1) { fmEnd = i; break; }
    }
  }

  // If no start found, insert a frontmatter start at the top and try to close it
  if (fmStart === -1) {
    lines.unshift('---');
    // Find a reasonable place to close frontmatter: before first H1 or after first block of metadata-like lines
    let insertPos = 1;
    for (let i = 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l.startsWith('# ') || l === '') { insertPos = i; break; }
      if (!/^\w[\w-]*:\s*/.test(l) && !/^[\w-]+:/.test(l)) { insertPos = i; break; }
    }
    lines.splice(insertPos, 0, '---');
    fmStart = 0; fmEnd = insertPos;
  } else if (fmEnd === -1) {
    // start exists but no end - insert end after first non key:value line or before first H1
    let insertPos = fmStart + 1;
    for (let i = fmStart + 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l.startsWith('# ')) { insertPos = i; break; }
      if (!/^\w[\w-]*:\s*/.test(l) && l !== '') { insertPos = i; break; }
      insertPos = i + 1;
    }
    lines.splice(insertPos, 0, '---');
    fmEnd = insertPos;
  }

  // Rebuild content
  content = lines.join('\n');

  // Normalize date to YYYY-MM-DD (use current date if none)
  const currentDate = new Date().toISOString().split('T')[0];
  content = content.replace(/date:\s*"[^"]*"/g, `date: "${currentDate}"`);

  // Ensure header spacing (space after #)
  content = content.replace(/^#{1,6}(?![#\s])/gm, (m) => m + ' ');

  // Fix malformed bold spacing
  content = content.replace(/\*\*\s+/g, '**').replace(/\s+\*\*/g, '**');

  // Fix numbered bold like **1. Title** -> **1.** Title
  content = content.replace(/\*\*(\d+)\.\s*([^*]+)\*\*/g, '**$1.** $2');

  // Ensure bullet spacing
  content = content.replace(/^(\s*)-([^\s])/gm, '$1- $2');

  // Collapse multiple spaces
  content = content.replace(/ {2,}/g, ' ');

  // Remove extra blank lines (more than 2)
  content = content.replace(/\n{3,}/g, '\n\n');

  return content.trim();
}

/**
 * Validate generated content
 */
function validateContent(content) {
  const issues = [];

  // More lenient frontmatter check - accept --- or - -- (with space)
  if (!content.includes('---') && !content.includes('- --')) {
    issues.push('Missing or malformed frontmatter');
  }

  if (!content.includes('# ')) {
    issues.push('Missing H1 title');
  }

  if (!content.includes('## ')) {
    issues.push('Missing H2 sections');
  }

  if (!content.includes('**')) {
    issues.push('Missing bold formatting');
  }

  if (!content.includes('- ')) {
    issues.push('Missing bullet points');
  }

  if (content.length < 1000) {
    issues.push('Content too short');
  }

  return issues;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting enhanced blog post generation...\n');

    // Check API key
    if (!CONFIG.apiKey) {
      throw new Error('DEEPSEEK_API_KEY not found in environment variables');
    }

    // Generate SEO title
    const title = await generateTitle();
    console.log(`\n🎯 Generated title: "${title}"`);

    // Generate enhanced blog post
    const rawContent = await generateEnhancedBlogPost(title);
    
    // Clean and format content
    const cleanContent = cleanAndFormatContent(rawContent);
    
    // Validate content quality
    const issues = validateContent(cleanContent);
    if (issues.length > 0) {
      console.log('\n⚠️  Content validation issues:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    }

    // Ensure frontmatter exists and contains title/slug/date
    let finalContent = cleanContent;
  const hasTitleInFrontmatter = /(^|\n)title:\s*"[^"]+"/m.test(finalContent);
    if (!hasTitleInFrontmatter) {
      // Build a safe frontmatter using known values
      const safeSlug = createSlug(title);
      const currentDate = new Date().toISOString().split('T')[0];
  const excerptMatch = finalContent.match(/excerpt:\s*"([^"]*)"/m);
      const excerpt = excerptMatch ? excerptMatch[1] : `${title} - Scopri tutti i dettagli e prenota una consulenza gratuita a Catanzaro.`;

      const fm = [
        '---',
  `title: "${title.replace(/"/g, '')}"`,
        `slug: "${safeSlug}"`,
        `excerpt: "${excerpt}"`,
        `date: "${currentDate}"`,
        `category: "Trattamenti"`,
        `metaTitle: "${title} | ${CONFIG.siteName}"`,
        `metaDescription: "${excerpt}"`,
        `keywords: "parrucchieri catanzaro, ${title.toLowerCase()}, salone lusso catanzaro"`,
        '---',
      ].join('\n');

      // Prepend frontmatter
      finalContent = `${fm}\n\n${finalContent}`;

      // Clean stray dash-only lines that may sit between frontmatter and the H1
      const allLines = finalContent.split('\n');
      // find end of the frontmatter (the second '---')
      let fmEndIdx = -1;
      for (let i = 1; i < allLines.length; i++) {
        if (allLines[i].trim() === '---') { fmEndIdx = i; break; }
      }
      // find the H1 index
      let h1Idx = allLines.findIndex(l => l.trim().startsWith('# '));
      if (h1Idx === -1) h1Idx = allLines.length;

      // Remove garbage lines between fmEndIdx and h1Idx (dash-only or duplicate metadata)
      if (fmEndIdx !== -1) {
        const before = allLines.slice(0, fmEndIdx + 1);
        const bodySeg = allLines.slice(fmEndIdx + 1, h1Idx).filter(l => {
          const t = (l || '').trim();
          if (t === '' ) return false; // remove empty
          if (/^[-\s]+$/.test(t)) return false; // remove dash-only
          if (/^category:\s*/i.test(t)) return false; // remove duplicate category lines
          if (/^metaTitle:\s*/i.test(t)) return false;
          if (/^metaDescription:\s*/i.test(t)) return false;
          return true;
        });
        const after = allLines.slice(h1Idx);
        finalContent = [...before, ...bodySeg, ...after].join('\n');
      }

      console.log('🔧 Frontmatter was missing - prepended safe frontmatter and cleaned pre-body garbage');
    }

    // Save to file
    const filepath = saveBlogPost(finalContent, title);

    console.log('\n🎉 Enhanced blog post generation complete!');
    console.log(`📄 File: ${filepath}`);
    console.log(`📝 Word count: ~${cleanContent.split(' ').length} words`);
    console.log('\n✅ Features included:');
    console.log('   - Perfect Markdown formatting');
    console.log('   - SEO-optimized structure');
    console.log('   - Bold keywords and headings');
    console.log('   - Internal links');
    console.log('   - WhatsApp CTA');
    console.log('   - FAQ section');
    console.log('   - Professional layout');

    return filepath;
  } catch (error) {
    console.error('❌ Error generating blog post:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { generateEnhancedBlogPost, generateTitle };