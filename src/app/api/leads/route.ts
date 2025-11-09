import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Lead {
  id: string;
  name: string;
  phone: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  analyses: Array<{
    id: string;
    timestamp: string;
    result: {
      season: string;
      confidence: number;
      undertone?: string;
      dominantColors?: string[];
      recommendations?: string;
      topColors?: Array<{
        name: string;
        code: string;
        difficulty: string;
        sessions: number;
        maintenance: string;
        price: { min: number; max: number };
        description: string;
        benefits: string[];
      }>;
    };
    imageInfo: {
      name: string;
      size: number;
    };
    imageData?: string;
  }>;
  consentGiven: boolean;
  source: string;
}

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

// Assicurati che la directory e il file esistano
function ensureLeadsFile() {
  const dataDir = path.dirname(LEADS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '[]');
  }
}

// Leggi tutti i lead
function getLeads(): Lead[] {
  ensureLeadsFile();
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Errore lettura leads:', error);
    return [];
  }
}

// Salva i lead
function saveLeads(leads: Lead[]) {
  ensureLeadsFile();
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Errore salvataggio leads:', error);
    throw new Error('Impossibile salvare i dati');
  }
}

// Genera ID unico
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Valida numero di telefono italiano
function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+39)?[\s]?([0-9]{10}|[0-9]{3}[\s][0-9]{3}[\s]?[0-9]{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Sanitizza nome
function sanitizeName(name: string): string {
  return name.trim().replace(/[<>"']/g, '');
}

// GET - Recupera tutti i lead (solo per admin)
export async function GET(_request: NextRequest) {
  try {
    // TODO: Aggiungere autenticazione admin
    const leads = getLeads();
    
    return NextResponse.json({
      success: true,
      count: leads.length,
      leads: leads.map(lead => ({
        ...lead,
        // Non esporre info sensibili in lista
        userAgent: undefined
      }))
    });
  } catch {
    return NextResponse.json(
      { error: 'Errore recupero dati' },
      { status: 500 }
    );
  }
}

// POST - Crea nuovo lead o aggiunge analisi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, consentGiven, analysisResult, imageInfo, imageData } = body;

    // Validazioni
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefono sono obbligatori' },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: 'È necessario accettare il trattamento dei dati' },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeName(name);
    if (sanitizedName.length < 2) {
      return NextResponse.json(
        { error: 'Nome deve essere almeno 2 caratteri' },
        { status: 400 }
      );
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Numero di telefono non valido' },
        { status: 400 }
      );
    }

    const leads = getLeads();
    
    // Cerca lead esistente per telefono
    let existingLead = leads.find(lead => 
      lead.phone.replace(/\s/g, '') === phone.replace(/\s/g, '')
    );

    const now = new Date().toISOString();
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    if (existingLead) {
      // Aggiorna lead esistente
      existingLead.name = sanitizedName; // Aggiorna nome se cambiato
      
      if (analysisResult && imageInfo) {
        existingLead.analyses.push({
          id: generateId(),
          timestamp: now,
          result: analysisResult,
          imageInfo: imageInfo,
          imageData: imageData || undefined
        });
      }
    } else {
      // Crea nuovo lead
      const newLead: Lead = {
        id: generateId(),
        name: sanitizedName,
        phone: phone.replace(/\s/g, ''),
        timestamp: now,
        ipAddress: clientIP,
        userAgent: userAgent,
        analyses: analysisResult && imageInfo ? [{
          id: generateId(),
          timestamp: now,
          result: analysisResult,
          imageInfo: imageInfo,
          imageData: imageData || undefined
        }] : [],
        consentGiven: true,
        source: 'ai-color-analysis'
      };

      leads.push(newLead);
      existingLead = newLead;
    }

    saveLeads(leads);

    return NextResponse.json({
      success: true,
      leadId: existingLead.id,
      message: 'Dati salvati correttamente'
    });

  } catch (error) {
    console.error('Errore salvataggio lead:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}