import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { checkAdminAuth } from '@/lib/auth';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export async function POST(request: NextRequest) {
  // Controlla autenticazione
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const draft = await request.json();
    
    // Valida i campi richiesti
    if (!draft.title || !draft.slug || !draft.content) {
      return NextResponse.json(
        { error: 'Campi mancanti: title, slug e content sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Genera slug sicuro
    let safeSlug = draft.slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Controlla se il file esiste già e aggiungi suffisso se necessario
    let finalSlug = safeSlug;
    let counter = 1;
    let filePath = path.join(blogDirectory, `${finalSlug}.md`);
    
    while (fs.existsSync(filePath)) {
      finalSlug = `${safeSlug}-${counter}`;
      filePath = path.join(blogDirectory, `${finalSlug}.md`);
      counter++;
    }
    
    // Crea il frontmatter
    const frontmatter = {
      title: draft.title,
      slug: finalSlug,
      excerpt: draft.excerpt || '',
      date: draft.date || new Date().toISOString().split('T')[0],
      category: draft.category || 'Blog',
      metaTitle: draft.metaTitle || draft.title,
      metaDescription: draft.metaDescription || draft.excerpt || '',
      keywords: draft.keywords || '',
    };
    
    // Estrai solo il body dal content (rimuovi frontmatter se presente)
    let bodyContent = draft.content;
    if (draft.content.startsWith('---')) {
      const parts = draft.content.split(/\n---\n/);
      if (parts.length >= 2) {
        bodyContent = parts.slice(1).join('\n---\n').trim();
      }
    }
    
    // Combina frontmatter e contenuto
    const fileContent = matter.stringify(bodyContent, frontmatter);
    
    // Assicura che la directory esista
    if (!fs.existsSync(blogDirectory)) {
      fs.mkdirSync(blogDirectory, { recursive: true });
    }
    
    // Salva il file
    fs.writeFileSync(filePath, fileContent, 'utf8');
    
    return NextResponse.json({
      success: true,
      slug: finalSlug,
      filePath: path.relative(process.cwd(), filePath),
    });
  } catch (error) {
    console.error('Errore pubblicazione bozza:', error);
    return NextResponse.json(
      { error: 'Errore nella pubblicazione dell\'articolo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
