/**
 * DeepSeek Blog Post Generator
 * Generates SEO-optimized blog articles automatically
 * Usage: node scripts/generate-blog-post.js
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
  maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 3500,
  temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE) || 0.7,
  siteName: process.env.SITE_NAME || 'Paparazzo Parrucchieri',
  whatsapp: process.env.BUSINESS_WHATSAPP || '+393392399044',
  address: process.env.BUSINESS_ADDRESS || 'Via Formia 47, Catanzaro',
};

// Primary keywords for local SEO
const KEYWORDS = [
  'parrucchieri catanzaro',
  'hair extensions catanzaro',
  'nanoplastia catanzaro',
  'biondo catanzaro',
  'color correction catanzaro',
  'hair extensions calabria',
  'salone lusso catanzaro',
  'trattamento lisciante catanzaro',
  'extension capelli veri catanzaro',
  'colore capelli calabria',
  'degradé catanzaro',
  'balayage catanzaro',
];

// Services to link internally
const SERVICES = [
  { name: 'Nanoplastia', slug: 'nanoplastia' },
  { name: 'Hair Extensions', slug: 'hair-extensions' },
  { name: 'Color Correction', slug: 'color-correction' },
];

/**
 * Make API request to DeepSeek
 */
function makeDeepSeekRequest(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'Sei un esperto SEO copywriter specializzato in contenuti per saloni di parrucchieri di lusso. Scrivi in italiano professionale ma accessibile, con tono esperto e coinvolgente.',
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
 * Generate blog post title ideas
 */
async function generateTitleIdeas() {
  console.log('🎯 Generating title ideas...');

  const prompt = `
Genera 10 idee di titoli SEO-ottimizzati per articoli di blog per un salone di parrucchieri di lusso a Catanzaro (Calabria).
Ogni titolo deve includere almeno una di queste keyword: ${KEYWORDS.slice(0, 8).join(', ')}.
I titoli devono essere clickbait ma professionali, tra 50-65 caratteri.
Focus su: Nanoplastia, Hair Extensions, Color Correction, tendenze capelli, tutorial, consigli di bellezza.

Formato output (solo i titoli, uno per riga):
1. Titolo esempio
2. Titolo esempio
...
`;

  const response = await makeDeepSeekRequest(prompt);
  const titles = response
    .split('\n')
    .filter((line) => line.match(/^\d+\./))
    .map((line) => line.replace(/^\d+\.\s*/, '').trim());

  return titles.filter((t) => t.length > 0);
}

/**
 * Generate full blog post
 */
async function generateBlogPost(title) {
  console.log('✍️  Generating blog post content...');

  const whatsappLink = `https://wa.me/${CONFIG.whatsapp.replace(/\+/g, '')}`;

  const prompt = `
Scrivi un articolo completo e dettagliato di almeno 1200 parole per il blog di ${CONFIG.siteName}, salone di parrucchieri di lusso a ${CONFIG.address}.

TITOLO: "${title}"

REQUISITI OBBLIGATORI:
1. Lunghezza minima: 1200 parole
2. Struttura: Introduzione + 4-6 sezioni H2 + Conclusione
3. Include keyword "${title.toLowerCase()}" nel primo paragrafo
4. 2 CTA WhatsApp con questo link: ${whatsappLink}
5. 2 link interni ai servizi: /servizi/nanoplastia, /servizi/hair-extensions, /servizi/color-correction
6. Tono professionale ma accessibile
7. Include FAQ (minimo 3 domande)
8. Meta description (150-160 caratteri)

FORMATO OUTPUT (Markdown):

---
title: "${title}"
slug: [genera-slug-automatico-dal-titolo]
excerpt: [breve estratto 150-160 caratteri]
date: ${new Date().toISOString()}
category: [Trattamenti/Extensions/Colorazione/Tutorial/Consigli]
metaTitle: [titolo SEO 55-60 caratteri con keyword]
metaDescription: [meta description 150-160 caratteri con keyword e CTA]
keywords: [5-7 keyword separate da virgola]
---

[CONTENUTO ARTICOLO QUI]

## FAQ

**Domanda 1?**
Risposta completa...

**Domanda 2?**
Risposta completa...

[continua con altre FAQ]

## Conclusione

[Paragrafo conclusivo con CTA WhatsApp]

---

IMPORTANTE: Restituisci SOLO il contenuto in formato Markdown come specificato sopra. Non aggiungere note o commenti extra.
`;

  const response = await makeDeepSeekRequest(prompt);
  return response;
}

/**
 * Save blog post to file
 */
function saveBlogPost(content) {
  const contentDir = path.join(__dirname, '..', 'content', 'blog');

  // Create content/blog directory if it doesn't exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Extract slug from content
  const slugMatch = content.match(/slug:\s*(.+)/);
  const slug = slugMatch ? slugMatch[1].trim() : `post-${Date.now()}`;

  const filename = `${slug}.md`;
  const filepath = path.join(contentDir, filename);

  fs.writeFileSync(filepath, content, 'utf8');

  console.log(`✅ Blog post saved: ${filepath}`);
  return filepath;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting blog post generation...\n');

    // Check API key
    if (!CONFIG.apiKey) {
      throw new Error('DEEPSEEK_API_KEY not found in environment variables');
    }

    // Generate title ideas
    const titles = await generateTitleIdeas();
    console.log(`\n📝 Generated ${titles.length} title ideas:\n`);
    titles.forEach((title, index) => {
      console.log(`   ${index + 1}. ${title}`);
    });

    // Select best title (first one for now, can be randomized)
    const selectedTitle = titles[0];
    console.log(`\n🎯 Selected title: "${selectedTitle}"\n`);

    // Generate full blog post
    const blogContent = await generateBlogPost(selectedTitle);

    // Save to file
    const filepath = saveBlogPost(blogContent);

    console.log('\n🎉 Blog post generation complete!');
    console.log(`📄 File: ${filepath}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Review and edit the generated post if needed');
    console.log('   2. Add images to the post');
    console.log('   3. The post will be automatically visible on /blog');

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

module.exports = { generateBlogPost, generateTitleIdeas };
