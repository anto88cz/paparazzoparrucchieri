import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REVIEWS_FILE = path.join(process.cwd(), 'data', 'reviews.json');

// Assicura che la cartella data esista
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
  }
}

// GET: Leggi tutte le recensioni
export async function GET() {
  try {
    ensureDataDir();
    const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    const reviews = JSON.parse(data);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Aggiungi nuova recensione
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    
    // Validazione
    if (!body.firstName || !body.lastName || !body.service || !body.rating || !body.review) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    if (body.review.length < 50) {
      return NextResponse.json(
        { error: 'La recensione deve essere di almeno 50 caratteri' },
        { status: 400 }
      );
    }

    // Leggi recensioni esistenti
    const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    const reviews = JSON.parse(data);

    // Crea nuova recensione
    const newReview = {
      id: Date.now().toString(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      service: body.service,
      rating: parseInt(body.rating),
      review: body.review.trim(),
      createdAt: new Date().toISOString(),
    };

    // Aggiungi in testa (le più recenti prima)
    reviews.unshift(newReview);

    // Salva
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));

    return NextResponse.json(
      { success: true, review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio della recensione' },
      { status: 500 }
    );
  }
}
