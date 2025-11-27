#!/usr/bin/env node
/*
 Aggressive frontmatter repair: for any markdown file that lacks a well-formed
 title in frontmatter, create/replace the frontmatter using the first H1 as title.

 Usage:
  node scripts/repair-frontmatter.js       # dry-run (no changes)
  node scripts/repair-frontmatter.js --confirm   # apply changes
*/

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

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
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function hasWellFormedTitle(frontmatter) {
  if (!frontmatter) return false;
  // Accept title: "..." or title: '...' or title: text (no newlines)
  return /(^|\n)title:\s*(["']).+\2/m.test(frontmatter) || /(^|\n)title:\s*[^\n\r]+/m.test(frontmatter);
}

function extractFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/m);
  return m ? m[1] : null;
}

function buildFrontmatter({ title, slug, date }) {
  return ['---', `title: "${title.replace(/"/g, '')}"`, `slug: "${slug}"`, `date: "${date}"`, 'category: "Trattamenti"', 'metaTitle: "' + title.replace(/"/g,'') + ' | Paparazzo Parrucchieri"', 'metaDescription: "[Meta description]"', 'keywords: "parrucchieri catanzaro"', '---'].join('\n');
}

function repairFile(raw, filename) {
  let content = raw.replace(/\r/g, '');
  const front = extractFrontmatter(content);
  const wellFormed = hasWellFormedTitle(front);

  if (wellFormed) return { changed: false };

  // Find first H1
  const h1Match = content.match(/(^|\n)#\s+(.+?)(?:\n|$)/);
  const inferredTitle = h1Match ? h1Match[2].trim() : path.basename(filename, '.md');

  // Try to get existing date
  let date = new Date().toISOString().split('T')[0];
  if (front) {
    const dateMatch = front.match(/(^|\n)date:\s*"?(\d{4}-\d{2}-\d{2})"?/m);
    if (dateMatch) date = dateMatch[2];
  }

  const slug = createSlug(inferredTitle);

  const fm = buildFrontmatter({ title: inferredTitle, slug, date });

  // Remove any leading lines before H1 (garbage), and remove existing malformed frontmatter if present
  // Keep the body from the H1 onward
  let bodyStart = 0;
  const h1Index = content.search(/(^|\n)#\s+/);
  if (h1Index !== -1) bodyStart = h1Index;
  else bodyStart = 0;

  const body = content.slice(bodyStart).replace(/^\n+/, '');

  const newContent = fm + '\n\n' + body.trim() + '\n';

  return { changed: true, newContent };
}

function backupDir(srcDir) {
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const dest = path.join(path.dirname(srcDir), `blog-backup-repair-${stamp}`);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));
  files.forEach(f => fs.copyFileSync(path.join(srcDir, f), path.join(dest, f)));
  return { dest, count: files.length };
}

async function run() {
  const args = process.argv.slice(2);
  const confirm = args.includes('--confirm');

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('Content directory not found:', CONTENT_DIR);
    process.exit(1);
  }

  console.log('Scanning', CONTENT_DIR);
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} markdown files`);

  console.log('Creating backup before any change...');
  const { dest } = backupDir(CONTENT_DIR);
  console.log('Backup at', dest);

  const report = [];
  for (const file of files) {
    const fp = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fp, 'utf8');
    const res = repairFile(raw, file);
    if (res.changed) {
      report.push(file);
      if (confirm) fs.writeFileSync(fp, res.newContent, 'utf8');
    }
  }

  console.log('\nRepair summary:');
  console.log('Files scanned:', files.length);
  console.log('Files to repair:', report.length);
  if (report.length) {
    console.log('\nFiles (sample):');
    report.slice(0, 100).forEach(f => console.log(' -', f));
  }

  if (!confirm) console.log('\nDry-run: no files were modified. Re-run with --confirm to apply the repairs.');
  else console.log('\nRepairs applied. Backup: ' + dest);
}

if (require.main === module) run().catch(err => { console.error(err); process.exit(1); });
