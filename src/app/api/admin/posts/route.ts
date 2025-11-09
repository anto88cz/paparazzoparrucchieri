import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { checkAdminAuth } from '@/lib/auth';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export async function GET(request: NextRequest) {
  // Controlla autenticazione
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    // Legge tutti i file markdown nella directory blog
    const filenames = fs.readdirSync(blogDirectory);
    const posts = filenames
      .filter(name => name.endsWith('.md'))
      .map(filename => {
        const filePath = path.join(blogDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        return {
          slug: filename.replace(/\.md$/, ''),
          title: data.title || 'Senza titolo'
        };
      });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Errore nel caricamento dei post:', error);
    return NextResponse.json({ error: 'Errore nel caricamento dei post' }, { status: 500 });
  }
}