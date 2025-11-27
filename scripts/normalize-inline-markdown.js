#!/usr/bin/env node
/*
  Conservative inline Markdown normalizer.
  - Inserts a blank line after ATX headers when missing.
  - Ensures list markers ('-' and '*') have a space after them.
  - Adds a space between adjacent text and bold markers when attached (conservative: inserts space before an opening bold when attached to previous char; appends a space after a closing bold when attached to next char).
  - Operates only on the body (leaves YAML frontmatter alone).
  - Supports --dry-run (default), --confirm to write files, --sample=N to operate on first N files.

  Usage:
    node scripts/normalize-inline-markdown.js --dry-run --sample=5
    node scripts/normalize-inline-markdown.js --confirm
*/

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: true, confirm: false, sample: null };
  args.forEach(a => {
    if (a === '--confirm') { opts.confirm = true; opts.dryRun = false; }
    if (a === '--dry-run') { opts.dryRun = true; }
    if (a.startsWith('--sample=')) { opts.sample = parseInt(a.split('=')[1], 10) || null; }
  });
  return opts;
}

function readFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(CONTENT_DIR, f));
}

function splitFrontmatterAndBody(content) {
  if (content.startsWith('---')) {
    const lines = content.split(/\r?\n/);
    let endLine = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') { endLine = i; break; }
    }
    if (endLine !== -1) {
      const frontmatter = lines.slice(0, endLine + 1).join('\n');
      const body = lines.slice(endLine + 1).join('\n');
      return { frontmatter, body };
    }
  }
  return { frontmatter: null, body: content };
}

function normalizeBody(body) {
  // Work line-by-line for header and list fixes
  const lines = body.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Ensure list markers have a space: '-item' -> '- item'
    line = line.replace(/^([-*])([A-Za-z0-9\u00C0-\u017F])/u, '$1 $2');

    out.push(line);

    // If current line is an ATX header and next line exists and is not blank, insert a blank line
    if (/^#{1,6}\s*\S/.test(line)) {
      const next = lines[i+1];
      if (typeof next !== 'undefined' && next.trim() !== '') {
        // Only insert if next line is not a list, blockquote, code fence, or header
        if (!/^(?:[-*]>|#{1,6}\s|```|>\s|[-*]\s)/.test(next)) {
          out.push('');
        }
      }
    }
  }

  let newBody = out.join('\n');

  // Fix bold adjacency conservatively:
  // 1) If a closing bold (**...**) is followed immediately by non-space, add a space after the closing markers
  newBody = newBody.replace(/\*\*[^\*]+\*\*(?=\S)/g, match => match + ' ');
  // 2) If an opening+closing bold sequence is preceded immediately by a non-space char, insert a space before it
  newBody = newBody.replace(/(\S)(\*\*[^\*]+\*\*)/g, (m, p1, p2) => p1 + ' ' + p2);

  // Normalize multiple blank lines to at most two
  newBody = newBody.replace(/(\n\s*){3,}/g, '\n\n');

  return newBody;
}

function showDiffSnippet(before, after) {
  const bLines = before.split(/\r?\n/);
  const aLines = after.split(/\r?\n/);
  // Find first differing line and show a small window
  let firstDiff = -1;
  for (let i = 0; i < Math.max(bLines.length, aLines.length); i++) {
    if (bLines[i] !== aLines[i]) { firstDiff = i; break; }
  }
  if (firstDiff === -1) return null;
  const start = Math.max(0, firstDiff - 3);
  const end = Math.min(Math.max(bLines.length, aLines.length), firstDiff + 10);
  const snippet = [];
  for (let i = start; i < end; i++) {
    const beforeLine = bLines[i] === undefined ? '' : bLines[i];
    const afterLine = aLines[i] === undefined ? '' : aLines[i];
    if (beforeLine !== afterLine) {
      snippet.push(`- ${beforeLine}`);
      snippet.push(`+ ${afterLine}`);
    } else {
      snippet.push(`  ${beforeLine}`);
    }
  }
  return snippet.join('\n');
}

function run() {
  const opts = parseArgs();
  const files = readFiles();
  if (files.length === 0) {
    console.log('No markdown files found in', CONTENT_DIR);
    return;
  }

  const sampleCount = opts.sample || Math.min(5, files.length);
  const targetFiles = files.slice(0, sampleCount);

  const changed = [];
  for (const file of targetFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    const { frontmatter, body } = splitFrontmatterAndBody(raw);
    const bodyBefore = body;
    const bodyAfter = normalizeBody(bodyBefore);
    if (bodyBefore !== bodyAfter) {
      const beforeFull = (frontmatter ? frontmatter + '\n' : '') + bodyBefore;
      const afterFull = (frontmatter ? frontmatter + '\n' : '') + bodyAfter;
      const diff = showDiffSnippet(beforeFull, afterFull) || '(changed but snippet empty)';
      changed.push({ file, diff, before: beforeFull, after: afterFull });
      if (opts.confirm) {
        fs.writeFileSync(file, afterFull, 'utf8');
      }
    }
  }

  console.log(`Files scanned: ${targetFiles.length}; Files changed: ${changed.length}`);
  changed.forEach((c, i) => {
    console.log('\n---');
    console.log(`[${i+1}] ${path.basename(c.file)}`);
    console.log(c.diff);
  });

  if (opts.dryRun) {
    console.log('\nDry-run mode (no files written). To apply changes, re-run with --confirm.');
  } else if (opts.confirm) {
    console.log('\nChanges written to disk. Consider running `npm run build` and regenerating sitemap.');
  }
}

run();
