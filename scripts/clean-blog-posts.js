#!/usr/bin/env node
/*
 Safe bulk cleaner for existing blog posts
 Usage:
  node scripts/clean-blog-posts.js [--dry-run] [--sample=N]

 By default will create a timestamped backup of content/blog/ before writing changes.
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

function cleanAndFormatContent(content, filename) {
  if (!content || typeof content !== 'string') return '';

  // Remove BOM and CR
  content = content.replace(/^\uFEFF/, '').replace(/\r/g, '');

  // Remove wrapper code fences
  content = content.replace(/```(?:markdown)?\n?/gi, '').replace(/\n?```/g, '');

  // Trim leading/trailing whitespace
  content = content.trim();

  // Split into lines
  const lines = content.split('\n');

  // Find first H1 to limit frontmatter processing
  let bodyIndex = lines.findIndex(l => l.trim().startsWith('# '));
  if (bodyIndex === -1) bodyIndex = Math.min(40, lines.length);

  // Normalize dash-only separators in frontmatter area
  for (let i = 0; i < bodyIndex; i++) {
    lines[i] = lines[i].replace(/\u00A0/g, ' ').replace(/\t/g, ' ').trim();
    const onlyDashSpace = lines[i].replace(/[^\-\s]/g, '');
    if (onlyDashSpace.length >= 3 && /^[-\s]+$/.test(onlyDashSpace)) {
      lines[i] = '---';
    }
  }

  // Detect frontmatter start/end
  let fmStart = -1, fmEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (fmStart === -1) fmStart = i;
      else if (fmEnd === -1) { fmEnd = i; break; }
    }
  }

  // If missing, try to insert a frontmatter block using H1 or top metadata-like lines
  if (fmStart === -1) {
    // find title from H1
    const h1Idx = lines.findIndex(l => l.trim().startsWith('# '));
    const title = h1Idx !== -1 ? lines[h1Idx].trim().replace(/^#\s+/, '').trim() : path.basename(filename, '.md');
    const slug = createSlug(title);
    const now = new Date().toISOString().split('T')[0];
    const fm = ['---', `title: "${title.replace(/"/g, '')}"`, `slug: "${slug}"`, `date: "${now}"`, '---'];
    lines.unshift('', ...lines); // ensure space
    lines.splice(0, 0, ...fm, '');
    fmStart = 0; fmEnd = fm.length - 1;
  } else if (fmEnd === -1) {
    // insert closing --- before first H1 or after metadata-like lines
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

  // Rebuild early content
  let newContent = lines.join('\n');

  // If frontmatter present, ensure it contains title and slug; if missing, infer
  const fmMatch = newContent.match(/^---\n([\s\S]*?)\n---/m);
  if (fmMatch) {
    let fmBody = fmMatch[1];
    let titleMatch = fmBody.match(/(^|\n)title:\s*"([^"]+)"/m) || fmBody.match(/(^|\n)title:\s*([^\n\r]+)/m);
    if (!titleMatch) {
      // try to get H1
      const h1 = newContent.match(/(^|\n)#\s+(.+?)\n/);
      const inferredTitle = h1 ? h1[2].trim() : path.basename(filename, '.md');
      fmBody = `title: "${inferredTitle.replace(/"/g, '')}\n${fmBody}`.replace(/\n\n+/g, '\n');
    }

    let slugMatch = fmBody.match(/(^|\n)slug:\s*"?([^"\n]+)"?/m);
    if (!slugMatch) {
      const computed = createSlug((titleMatch && titleMatch[2]) || (fmBody.match(/title:\s*"?([^"\n]+)"?/) && RegExp.$1) || path.basename(filename, '.md'));
      fmBody += `\nslug: "${computed}"`;
    }

    // ensure date exists in YYYY-MM-DD
    if (!/date:\s*"\d{4}-\d{2}-\d{2}"/m.test(fmBody)) {
      const now = new Date().toISOString().split('T')[0];
      fmBody += `\ndate: "${now}"`;
    }

    // reconstruct frontmatter
    newContent = newContent.replace(/^---\n([\s\S]*?)\n---/m, `---\n${fmBody}\n---`);
  }

  // Remove garbage lines between frontmatter end and H1: dash-only, duplicate meta
  newContent = newContent.replace(/---\n([\s\S]*?)\n(#\s+)/m, (m, between, h1) => {
    const cleaned = between
      .split('\n')
      .filter(l => {
        const t = (l || '').trim();
        if (t === '') return false;
        if (/^[-\s]+$/.test(t)) return false;
        if (/^(category|metaTitle|metaDescription|keywords|excerpt|slug):/i.test(t)) return false;
        return true;
      })
      .join('\n');
    return `---\n${cleaned}\n\n${h1}`;
  });

  // Normalize headers: ensure space after #
  newContent = newContent.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');

  // Normalize bold spacing
  newContent = newContent.replace(/\*\*\s+/g, '**').replace(/\s+\*\*/g, '**');

  // Ensure bullets have space
  newContent = newContent.replace(/^(\s*)[-•]\s*/gm, '- ');

  // Collapse multiple blank lines
  newContent = newContent.replace(/\n{3,}/g, '\n\n');

  return newContent.trim();
}

function backupDir(srcDir) {
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const dest = path.join(path.dirname(srcDir), `blog-backup-${stamp}`);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));
  files.forEach(f => {
    fs.copyFileSync(path.join(srcDir, f), path.join(dest, f));
  });
  return { dest, count: files.length };
}

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || !args.includes('--confirm');
  const sampleArg = args.find(a => a.startsWith('--sample='));
  const sample = sampleArg ? parseInt(sampleArg.split('=')[1], 10) : 0;

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('Content directory not found:', CONTENT_DIR);
    process.exit(1);
  }

  console.log(`Scanning ${CONTENT_DIR} for .md files...`);
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('No markdown files found. Nothing to do.');
    return;
  }

  console.log(`Found ${files.length} files.`);

  // Backup before doing anything
  console.log('Creating backup...');
  const { dest, count } = backupDir(CONTENT_DIR);
  console.log(`Backup created at ${dest} (${count} files copied)`);

  const toProcess = sample > 0 ? files.slice(0, sample) : files;

  const report = [];
  for (const file of toProcess) {
    try {
      const fp = path.join(CONTENT_DIR, file);
      const raw = fs.readFileSync(fp, 'utf8');
      const cleaned = cleanAndFormatContent(raw, file);
      if (cleaned.trim() === raw.trim()) {
        report.push({ file, changed: false });
        continue;
      }
      report.push({ file, changed: true });
      if (!dryRun) {
        fs.writeFileSync(fp, cleaned, 'utf8');
      }
    } catch (err) {
      console.error('Error processing', file, err.message);
      report.push({ file, error: err.message });
    }
  }

  // Summary
  const changed = report.filter(r => r.changed).length;
  const errored = report.filter(r => r.error).length;
  console.log('\nCleanup summary:');
  console.log(`  Files scanned: ${toProcess.length}`);
  console.log(`  Files changed: ${changed}`);
  console.log(`  Errors: ${errored}`);
  if (dryRun) console.log('\nDry run mode: no files were written. Re-run with --confirm to apply changes.');
  else console.log('\nChanges applied to files in place. Backup located at: ' + dest);

  // List changed files (first 50)
  const changedList = report.filter(r => r.changed).map(r => r.file).slice(0, 50);
  if (changedList.length) {
    console.log('\nChanged files (sample):');
    changedList.forEach(f => console.log(' -', f));
  }
}

// Execute
if (require.main === module) {
  run().catch(err => { console.error('Fatal error:', err); process.exit(1); });
}

module.exports = { cleanAndFormatContent };
