#!/usr/bin/env node

/**
 * Automated Blog Post Generator
 * Generates SEO-optimized blog posts using DeepSeek AI
 * Run manually: node scripts/cron-blog-generator.js
 * Or via cron: see scripts/setup-cron-ubuntu.sh
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Blog categories
const CATEGORIES = [
  'Trattamenti',
  'Colorazione',
  'Tagli',
  'Extensions',
  'Cura Capelli',
  'Tendenze',
  'Tutorial',
  'Consigli',
];

/**
 * Generate a new blog topic using AI
 */
async function generateBlogTopic(apiKey, baseUrl, model) {
  const topicPrompt = `Genera domanda che cliente cerca su Google su capelli/parrucchiere:

ESEMPI:
Come curare capelli ricci
Quanto dura il balayage
Meglio extensions o cheratina
Come scegliere taglio viso tondo
Capelli danneggiati cosa fare

Genera 1 domanda simile (max 6 parole):`;

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Genera domande che clienti cercano su Google sui capelli.',
          },
          {
            role: 'user',
            content: topicPrompt,
          },
        ],
        max_tokens: 15,
        temperature: 0.8, // High creativity for diverse topics
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Error generating topic:', error);
    throw error;
  }
}

/**
 * Call DeepSeek API to generate blog post content
 */
async function generateBlogPost(topic) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const model = process.env.DEEPSEEK_MODEL_TEXT || 'deepseek-chat';
  const maxTokens = parseInt(process.env.DEEPSEEK_MAX_TOKENS || '3500', 10);
  const temperature = parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7');

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not found in environment variables');
  }

  const prompt = `Scrivi articolo SEO per CLIENTI che cercano: "${topic}"

TITOLO H1 (copia esatto):
# ${topic}

STRUTTURA SEO:

## Risposta Diretta
Prima risposta breve e chiara alla domanda (2-3 frasi).

## Approfondimento
Spiega dettagli utili per il cliente. Linguaggio semplice ma professionale.
3-4 paragrafi brevi. Usa grassetto per concetti chiave.

## Cosa Aspettarsi
Lista puntata 3-4 punti su cosa succede/risultati/benefici.

## Quando Sceglierlo
2-3 frasi: per chi è ideale, quando evitarlo.

## Da Paparazzo Parrucchieri Catanzaro
"Da Paparazzo Parrucchieri a Catanzaro [specifica servizio/approccio]. Prenota una consulenza gratuita."

OTTIMIZZAZIONE SEO:
- 500-700 parole totali
- Ripeti naturalmente parole chiave dalla domanda
- Linguaggio per CLIENTI non parrucchieri
- Tono amichevole ma esperto
- Rispondi alla domanda in modo completo
- NO frasi AI tipo "è importante notare"
- Grassetto su termini importanti

SCRIVI:`;

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'Sei un esperto hair stylist e content writer specializzato in articoli di blog per saloni di parrucchieri di lusso.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
}

/**
 * Clean AI-generated content to remove patterns that could be detected
 */
function cleanAIContent(content) {
  let cleaned = content;

  // Remove zero-width characters used by AI detectors
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // Remove hidden unicode markers
  cleaned = cleaned.replace(/[\u202A-\u202E]/g, '');
  
  // Remove soft hyphens
  cleaned = cleaned.replace(/\u00AD/g, '');
  
  // Replace non-breaking spaces with normal spaces
  cleaned = cleaned.replace(/\u00A0/g, ' ');

  // Remove typical AI phrases that sound unnatural
  const aiPhrases = [
    /In conclusione,?\s*/gi,
    /E importante notare che\s*/gi,
    /Va sottolineato che\s*/gi,
    /Detto questo,?\s*/gi,
    /In altre parole,?\s*/gi,
    /Come accennato in precedenza,?\s*/gi,
    /E degno di nota che\s*/gi,
    /Vale la pena menzionare che\s*/gi,
  ];

  aiPhrases.forEach((phrase) => {
    cleaned = cleaned.replace(phrase, '');
  });

  // Normalize multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  // Normalize multiple newlines (max 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Remove trailing spaces at end of lines
  cleaned = cleaned.replace(/[ \t]+$/gm, '');

  // Add human-like variations (sostituisci pattern troppo regolari)
  // Esempio: "1. ", "2. ", "3. " -> mix di "•", "→", numeri
  let listCounter = 0;
  cleaned = cleaned.replace(/^(\d+)\.\s/gm, (match) => {
    listCounter++;
    // Varia il formato delle liste per sembrare più umano
    if (listCounter % 3 === 0) return '• ';
    if (listCounter % 5 === 0) return '→ ';
    return match; // Mantieni alcuni numeri
  });

  // Rimuovi grassetti eccessivi (più di 3 parole grassetto consecutive = troppo AI)
  cleaned = cleaned.replace(/\*\*([^*]{50,}?)\*\*/g, '$1');

  return cleaned.trim();
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-|-$/g, ''); // Remove leading/trailing -
  
  // Limit to 60 characters max
  return slug.length > 60 ? slug.substring(0, 60).replace(/-+$/, '') : slug;
}

/**
 * Extract title from markdown content
 */
function extractTitle(content) {
  const match = content.match(/^#\s+([^#\n]+)/m);
  if (!match) return 'Articolo dal Blog';
  
  // Extract only the first line title, stop at any markdown heading or newline
  const title = match[1].trim();
  // Remove any markdown formatting
  return title.replace(/[*_#]/g, '').trim();
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(content) {
  // Remove title and get first paragraph
  const withoutTitle = content.replace(/^#\s+.+$/m, '').trim();
  const firstParagraph = withoutTitle.split('\n\n')[0];
  const cleaned = firstParagraph.replace(/[#*\[\]]/g, '').trim();
  return cleaned.length > 200 ? cleaned.substring(0, 197) + '...' : cleaned;
}

/**
 * Calculate reading time
 */
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min di lettura`;
}

/**
 * Create blog post file
 */
function createBlogPost(content, category) {
  const contentDir = path.join(process.cwd(), 'content', 'blog');

  // Create directory if it doesn't exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const title = extractTitle(content);
  const slug = generateSlug(title);
  const excerpt = generateExcerpt(content);
  const readTime = calculateReadTime(content);
  const date = new Date().toISOString();

  // Escape quotes and special chars in YAML strings
  const escapeYAML = (str) => str.replace(/"/g, '\\"').replace(/\n/g, ' ');

  // Create frontmatter
  const frontmatter = `---
title: "${escapeYAML(title)}"
excerpt: "${escapeYAML(excerpt)}"
date: ${date}
author: "Paparazzo Team"
category: "${category}"
tags: []
readTime: "${readTime}"
---

`;

  const fullContent = frontmatter + content;
  const filePath = path.join(contentDir, `${slug}.md`);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  Article already exists: ${filePath}`);
    return null;
  }

  fs.writeFileSync(filePath, fullContent, 'utf8');
  console.log(`✅ Blog post created: ${filePath}`);
  console.log(`   Title: ${title}`);
  console.log(`   Category: ${category}`);
  console.log(`   Slug: ${slug}`);

  return filePath;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting blog post generation...');
  console.log(`📅 Date: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}`);

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    const model = process.env.DEEPSEEK_MODEL_TEXT || 'deepseek-chat';

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY not found in environment variables');
    }

    // Generate a new unique topic using AI
    console.log('🎲 Generating new topic with AI...');
    const topic = await generateBlogTopic(apiKey, baseUrl, model);
    
    // Select random category
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    console.log(`📝 Topic: ${topic}`);
    console.log(`🏷️  Category: ${category}`);
    console.log('⏳ Generating content with DeepSeek AI...');

    const content = await generateBlogPost(topic);

    console.log('✍️  Content generated successfully!');
    console.log(`📏 Length: ${content.length} characters`);

    // Clean AI patterns before saving
    console.log('🧹 Cleaning AI patterns from content...');
    const cleanedContent = cleanAIContent(content);
    console.log(`📏 Cleaned length: ${cleanedContent.length} characters`);

    const filePath = createBlogPost(cleanedContent, category);

    if (filePath) {
      console.log('\n✨ Blog post generation completed successfully!');
      console.log('🔄 Remember to rebuild your Next.js app to see the new post.');
      console.log('   Run: npm run build && pm2 restart paparazzo');
    } else {
      console.log('\n⚠️  Article was not created (may already exist).');
    }
  } catch (error) {
    console.error('\n❌ Error generating blog post:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateBlogPost, createBlogPost };
