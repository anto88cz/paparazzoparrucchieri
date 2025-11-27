import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAdminAuth } from '@/lib/auth';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export async function DELETE(request: NextRequest) {
  // Controlla autenticazione
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug mancante' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(blogDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Articolo non trovato' },
        { status: 404 }
      );
    }
    
    // Elimina il file
    fs.unlinkSync(filePath);
    
    return NextResponse.json({
      success: true,
      message: 'Articolo eliminato con successo',
    });
  } catch (error) {
    console.error('Errore eliminazione articolo:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione dell\'articolo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
