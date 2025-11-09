import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

// Assicurati che il file esista
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
function getLeads() {
  ensureLeadsFile();
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  timestamp: string;
  analyses: Array<{
    id: string;
    timestamp: string;
    result: { season: string; confidence: number };
  }>;
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

// DELETE - Elimina un lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leads = getLeads();
    const leadIndex = leads.findIndex((lead: Lead) => lead.id === params.id);
    
    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead non trovato' },
        { status: 404 }
      );
    }
    
    // Rimuovi il lead
    leads.splice(leadIndex, 1);
    saveLeads(leads);
    
    return NextResponse.json({
      success: true,
      message: 'Lead eliminato con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione lead:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// PUT - Aggiorna un lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, phone } = body;
    
    // Validazioni
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefono sono obbligatori' },
        { status: 400 }
      );
    }
    
    const leads = getLeads();
    const leadIndex = leads.findIndex((lead: Lead) => lead.id === params.id);
    
    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead non trovato' },
        { status: 404 }
      );
    }
    
    // Aggiorna il lead
    leads[leadIndex] = {
      ...leads[leadIndex],
      name: name.trim(),
      phone: phone.replace(/\s/g, ''),
      updatedAt: new Date().toISOString()
    };
    
    saveLeads(leads);
    
    return NextResponse.json({
      success: true,
      message: 'Lead aggiornato con successo',
      lead: leads[leadIndex]
    });
  } catch (error) {
    console.error('Errore aggiornamento lead:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}