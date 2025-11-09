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

// Base keywords for local SEO (embedded in topics)

// Topic categories with specific keywords - EXPANDED VERSION
const TOPICS = [
  // === SERVIZI PRINCIPALI ===
  {
    category: 'Hair Extensions',
    keywords: ['hair extensions', 'extension capelli', 'capelli lunghi', 'volume capelli', 'extension tape', 'microring'],
    service: '/servizi/hair-extensions',
    weight: 3, // Maggiore probabilità per servizi principali
  },
  {
    category: 'Nanoplastia',
    keywords: ['nanoplastia', 'trattamento lisciante', 'capelli lisci', 'anti-crespo', 'cheratina', 'stiratura'],
    service: '/servizi/nanoplastia',
    weight: 3,
  },
  {
    category: 'Color Correction',
    keywords: ['color correction', 'correzione colore', 'biondo perfetto', 'colore capelli', 'decolorazione', 'tinta'],
    service: '/servizi/color-correction',
    weight: 3,
  },

  // === TECNICHE E TRATTAMENTI ===
  {
    category: 'Balayage e Degradé',
    keywords: ['balayage', 'degradé', 'sfumature', 'colpi di sole', 'highlights', 'lowlights'],
    service: '/servizi/color-correction',
    weight: 2,
  },
  {
    category: 'Taglio e Styling',
    keywords: ['taglio capelli', 'acconciature', 'styling', 'piega', 'taglio donna', 'bob cut', 'pixie cut'],
    service: '/servizi',
    weight: 2,
  },
  {
    category: 'Trattamenti Ristrutturanti',
    keywords: ['trattamenti ristrutturanti', 'maschera capelli', 'botox capelli', 'olaplex', 'ricostruzione'],
    service: '/servizi',
    weight: 2,
  },
  {
    category: 'Permanente e Stiratura',
    keywords: ['permanente', 'stiratura permanente', 'onde naturali', 'beach waves', 'ricci definiti'],
    service: '/servizi',
    weight: 1,
  },

  // === TENDENZE E MODA ===
  {
    category: 'Tendenze Stagionali',
    keywords: ['tendenze primavera', 'colori estate', 'autunno capelli', 'inverno hair', 'moda capelli 2025'],
    service: '/servizi',
    weight: 2,
  },
  {
    category: 'Hair Trends Celebrity',
    keywords: ['capelli celebrity', 'look star', 'red carpet hair', 'instagram hair', 'viral hairstyles'],
    service: '/servizi',
    weight: 1,
  },
  {
    category: 'Colori di Tendenza',
    keywords: ['colori moda', 'copper hair', 'chocolate brown', 'platinum blonde', 'rainbow hair', 'pastel colors'],
    service: '/servizi/color-correction',
    weight: 2,
  },

  // === CURA E MANTENIMENTO ===
  {
    category: 'Routine di Bellezza',
    keywords: ['routine capelli', 'hair care', 'prodotti professionali', 'shampoo giusto', 'balsamo'],
    service: '/servizi',
    weight: 2,
  },
  {
    category: 'Crescita Capelli',
    keywords: ['crescita capelli', 'capelli più lunghi', 'caduta capelli', 'rinforzare capelli', 'vitamine capelli'],
    service: '/servizi',
    weight: 2,
  },
  {
    category: 'Capelli Danneggiati',
    keywords: ['capelli rovinati', 'riparare capelli', 'doppie punte', 'capelli secchi', 'idratazione'],
    service: '/servizi',
    weight: 2,
  },

  // === OCCASIONI SPECIALI ===
  {
    category: 'Matrimoni e Eventi',
    keywords: ['acconciature sposa', 'capelli matrimonio', 'eventi speciali', 'cerimonie', 'look elegante'],
    service: '/servizi',
    weight: 1,
  },
  {
    category: 'Capelli Estate',
    keywords: ['capelli estate', 'protezione solare capelli', 'mare capelli', 'umidità crespo', 'vacation hair'],
    service: '/servizi',
    weight: 1,
  },

  // === PROBLEMI SPECIFICI ===
  {
    category: 'Anti-Age Capelli',
    keywords: ['capelli mature', 'anti-aging hair', 'capelli grigi', 'volume 50+', 'ringiovanire look'],
    service: '/servizi',
    weight: 1,
  },
  {
    category: 'Capelli Ricci e Afro',
    keywords: ['capelli ricci', 'curly method', 'capelli afro', 'texture naturale', 'definire ricci'],
    service: '/servizi',
    weight: 1,
  },
  {
    category: 'Capelli Fini e Sottili',
    keywords: ['capelli fini', 'volume naturale', 'ispessire capelli', 'densità capelli', 'body wave'],
    service: '/servizi',
    weight: 2,
  },

  // === INNOVAZIONI E TECNOLOGIE ===
  {
    category: 'Nuove Tecnologie',
    keywords: ['tecnologie innovative', 'laser capelli', 'ultrasuoni', 'ozono therapy', 'LED therapy'],
    service: '/servizi',
    weight: 1,
  },
  {
    category: 'Prodotti Bio e Naturali',
    keywords: ['prodotti biologici', 'capelli naturali', 'eco-friendly', 'ingredienti naturali', 'vegan hair care'],
    service: '/servizi',
    weight: 1,
  },
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
 * Generate dynamic trending topics using AI
 */
async function generateTrendingTopics() {
  console.log('🔥 Generating trending topics with AI...');
  
  const currentMonth = new Date().toLocaleDateString('it-IT', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  const prompt = `
Genera 3 argomenti di tendenza per articoli di blog per un salone di parrucchieri di lusso a Catanzaro.

CONTESTO:
- Mese corrente: ${currentMonth} ${currentYear}
- Target: Donne 25-55 anni, Catanzaro e provincia
- Salone premium con servizi innovativi

REQUISITI:
1. Argomenti di tendenza nel settore hair & beauty
2. Orientati alla stagionalità (${currentMonth})
3. Con potenziale SEO e ricerca locale
4. Collegabili ai servizi del salone

FORMATO OUTPUT (solo gli argomenti, uno per riga):
1. [Argomento 1]
2. [Argomento 2] 
3. [Argomento 3]

ESEMPI FORMATO:
1. Capelli Glass Hair: il trend virale per l'autunno
2. Color Melting: la tecnica che rivoluziona le sfumature
3. Taglio Wolf Cut: il look selvaggio che spopola
`;

  try {
    const response = await makeDeepSeekRequest(prompt);
    const topics = response
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(topic => topic.length > 10);
    
    console.log('✨ Generated trending topics:', topics);
    return topics;
  } catch (err) {
    console.log('⚠️  Failed to generate trending topics, using fallback:', err.message);
    return [];
  }
}

/**
 * Select topic based on weighted probability or AI-generated trends
 */
async function selectSmartTopic() {
  // 30% probabilità di usare AI trending topics
  const useAITopics = Math.random() < 0.3;
  
  if (useAITopics) {
    const trendingTopics = await generateTrendingTopics();
    if (trendingTopics.length > 0) {
      const selectedTrending = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
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
  
  // Fallback to weighted selection from predefined topics
  const weightedTopics = [];
  TOPICS.forEach(topic => {
    for (let i = 0; i < topic.weight; i++) {
      weightedTopics.push(topic);
    }
  });
  
  return weightedTopics[Math.floor(Math.random() * weightedTopics.length)];
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

  const prompt = `
Genera 1 titolo SEO-ottimizzato per un articolo del blog di ${CONFIG.siteName}, salone di lusso a Catanzaro.

CATEGORIA: ${selectedTopic.category}
KEYWORDS DA INCLUDERE: ${topicKeywords}

REQUISITI TITOLO:
- Lunghezza: 50-65 caratteri
- Include "Catanzaro" o "Calabria"  
- Attraente ma professionale
- Include una keyword principale
- Orientato alla ricerca locale

ESEMPI FORMATO:
"Hair Extensions a Catanzaro: Guida Completa 2024"
"Nanoplastia Catanzaro: Tutto Quello che Devi Sapere"
"Color Correction Professionale: I Segreti del Paparazzo"

Restituisci SOLO il titolo, senza numerazione o note.
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
  const whatsappLink = `https://wa.me/${CONFIG.whatsapp.replace(/\+/g, '')}?text=Ciao! Ho visto l'articolo "${title}" e vorrei prenotare una consulenza!`;
  const currentDate = new Date().toISOString().split('T')[0];

  const prompt = `
Scrivi un articolo PERFETTAMENTE FORMATTATO per il blog di ${CONFIG.siteName}.

TITOLO: "${title}"

REQUISITI ASSOLUTI - FORMATTAZIONE MARKDOWN:
1. Usa # per H1, ## per H2, ### per H3
2. Usa **testo** per grassetto
3. Usa *testo* per corsivo
4. Usa - per elenchi puntati
5. Paragrafi separati da righe vuote
6. Link: [testo](url)

STRUTTURA OBBLIGATORIA - RISPETTA ESATTAMENTE:
⚠️  IMPORTANTE: Usa ESATTAMENTE tre trattini --- NON - -- o varianti

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
    
    // Ensure proper H2/H3 formatting
    .replace(/^([#]{1,3})\s*([^#\n]+)/gm, '$1 $2')
    
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
    
    // FINAL FIX: Replace any remaining malformed frontmatter
    .replace(/^- --$/gm, '---');
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

  const filename = `${slug}.md`;
  const filepath = path.join(contentDir, filename);

  // Check if file already exists
  if (fs.existsSync(filepath)) {
    const timestamp = Date.now();
    const newFilename = `${slug}-${timestamp}.md`;
    const newFilepath = path.join(contentDir, newFilename);
    fs.writeFileSync(newFilepath, content, 'utf8');
    console.log(`✅ Blog post saved: ${newFilepath} (duplicate avoided)`);
    return newFilepath;
  }

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Blog post saved: ${filepath}`);
  return filepath;
}

/**
 * Validate generated content
 */
function validateContent(content) {
  const issues = [];
  
  if (!content.includes('---') || content.includes('- --')) {
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

    // Save to file
    const filepath = saveBlogPost(cleanContent, title);

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