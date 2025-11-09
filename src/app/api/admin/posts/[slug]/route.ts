import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { checkAdminAuth } from '@/lib/auth';

const blogDirectory = path.join(process.cwd(), 'content/blog');

// GET: Carica un singolo post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Controlla autenticazione
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    const { slug } = params;
    const filePath = path.join(blogDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post non trovato' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const post = {
      title: data.title || '',
      slug: data.slug || slug,
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString(),
      category: data.category || '',
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      keywords: data.keywords || '',
      content: content
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Errore nel caricamento del post:', error);
    return NextResponse.json({ error: 'Errore nel caricamento del post' }, { status: 500 });
  }
}

// PUT: Salva le modifiche a un post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Controlla autenticazione
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    const { slug } = params;
    const post = await request.json();
    
    const filePath = path.join(blogDirectory, `${slug}.md`);
    
    // Crea il frontmatter
    const frontmatter = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: post.date,
      category: post.category,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      keywords: post.keywords
    };

    // Combina frontmatter e contenuto
    const fileContent = matter.stringify(post.content, frontmatter);
    
    // Salva il file
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nel salvataggio del post:', error);
    return NextResponse.json({ error: 'Errore nel salvataggio del post' }, { status: 500 });
  }
}