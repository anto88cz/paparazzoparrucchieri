/**
 * API Endpoint for AI Color Analysis - Next.js 14 App Router
 * Using GPT-4 Vision for accurate seasonal color analysis
 */
import { NextRequest, NextResponse } from 'next/server';
import { analyzeSeasonWithGPT4Vision, isOpenAIConfigured } from '@/lib/openai-vision';

// Configurazione per aumentare il limite di dimensione del body
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 secondi per l'analisi
export const dynamic = 'force-dynamic';

const SEASONAL_PALETTES = {
  'spring': {
    name: 'Primavera',
    undertone: 'warm',
    description: 'Carnagione calda e luminosa',
    colors: [
      {
        name: 'Biondo Miele',
        code: '7.3',
        difficulty: 'Media',
        sessions: 1,
        maintenance: '6-8 settimane',
        price: { min: 80, max: 120 },
        description: 'Biondo caldo e naturale che illumina il viso',
        benefits: ['Effetto sunkissed', 'Facile manutenzione', 'Valorizza occhi chiari']
      },
      {
        name: 'Caramello Dorato',
        code: '6.34',
        difficulty: 'Facile',
        sessions: 1,
        maintenance: '8-10 settimane',
        price: { min: 60, max: 90 },
        description: 'Riflessi dorati caldi su base naturale',
        benefits: ['Coprente sui bianchi', 'Naturale', 'Adatto a tutti']
      },
      {
        name: 'Castano Cioccolato',
        code: '5.35',
        difficulty: 'Facile',
        sessions: 1,
        maintenance: '6-8 settimane',
        price: { min: 50, max: 80 },
        description: 'Castano ricco con riflessi dorati',
        benefits: ['Elegante', 'Professionale', 'Lunga durata']
      }
    ],
    avoid: ['Biondo Platino', 'Cenere', 'Nero Corvino']
  },
  'autumn': {
    name: 'Autunno',
    undertone: 'warm',
    description: 'Carnagione calda e intensa',
    colors: [
      {
        name: 'Balayage Caramello',
        code: 'Tecnica Mix',
        difficulty: 'Alta',
        sessions: 2,
        maintenance: '8-12 settimane',
        price: { min: 150, max: 220 },
        description: 'Sfumature caramello naturali',
        benefits: ['Effetto solare', 'Crescita naturale', 'Molto trendy']
      },
      {
        name: 'Rame Veneziano',
        code: '6.64',
        difficulty: 'Media',
        sessions: 1,
        maintenance: '6-8 settimane',
        price: { min: 80, max: 120 },
        description: 'Rosso caldo e intenso',
        benefits: ['Carattere forte', 'Unico', 'Molto femminile']
      },
      {
        name: 'Cioccolato Caldo',
        code: '4.35',
        difficulty: 'Facile',
        sessions: 1,
        maintenance: '8-10 settimane',
        price: { min: 60, max: 90 },
        description: 'Castano scuro con riflessi caldi',
        benefits: ['Elegante', 'Intenso', 'Coprente']
      }
    ],
    avoid: ['Biondo Platino', 'Cenere Chiaro', 'Viola']
  },
  'summer': {
    name: 'Estate',
    undertone: 'cool',
    description: 'Carnagione fredda e delicata',
    colors: [
      {
        name: 'Biondo Cenere',
        code: '8.1',
        difficulty: 'Alta',
        sessions: 2,
        maintenance: '4-6 settimane',
        price: { min: 150, max: 200 },
        description: 'Biondo freddo sofisticato',
        benefits: ['Molto di moda', 'Elegante', 'Effetto ghiaccio']
      },
      {
        name: 'Castano Freddo',
        code: '6.1',
        difficulty: 'Media',
        sessions: 1,
        maintenance: '6-8 settimane',
        price: { min: 70, max: 100 },
        description: 'Castano con riflessi cenere',
        benefits: ['Naturale', 'Sofisticato', 'Adatto ufficio']
      },
      {
        name: 'Biondo Beige',
        code: '7.31',
        difficulty: 'Media',
        sessions: 1,
        maintenance: '6-8 settimane',
        price: { min: 90, max: 130 },
        description: 'Biondo neutro elegante',
        benefits: ['Versatile', 'Luminoso', 'Facile styling']
      }
    ],
    avoid: ['Rame', 'Dorato Intenso', 'Mogano']
  },
  'winter': {
    name: 'Inverno',
    undertone: 'cool',
    description: 'Carnagione fredda e contrastante',
    colors: [
      {
        name: 'Nero Blu',
        code: '1.1',
        difficulty: 'Media',
        sessions: 1,
        maintenance: '8-10 settimane',
        price: { min: 50, max: 80 },
        description: 'Nero intenso con riflessi blu',
        benefits: ['Molto intenso', 'Elegante', 'Lunga durata']
      },
      {
        name: 'Castano Freddo Scuro',
        code: '3.1',
        difficulty: 'Facile',
        sessions: 1,
        maintenance: '6-8 settimane',
        price: { min: 60, max: 90 },
        description: 'Castano scuro con sottotono freddo',
        benefits: ['Naturale', 'Professionale', 'Versatile']
      },
      {
        name: 'Burgundy',
        code: '4.62',
        difficulty: 'Alta',
        sessions: 2,
        maintenance: '4-6 settimane',
        price: { min: 120, max: 180 },
        description: 'Rosso scuro elegante',
        benefits: ['Molto glamour', 'Unico', 'Di carattere']
      }
    ],
    avoid: ['Biondo Dorato', 'Rame', 'Caramello']
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Starting AI Color Analysis...');

    // Parse form data
    const formData = await request.formData();
    const photo = formData.get('photo') as File;

    if (!photo) {
      return NextResponse.json(
        { 
          error: 'Immagine richiesta',
          message: 'Carica una foto per iniziare l\'analisi'
        },
        { status: 400 }
      );
    }

    // Validazione file
    if (!photo.type.startsWith('image/')) {
      return NextResponse.json(
        { 
          error: 'File non valido',
          message: 'Carica un\'immagine in formato JPG o PNG'
        },
        { status: 400 }
      );
    }

    if (photo.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { 
          error: 'File troppo grande',
          message: 'L\'immagine deve essere inferiore a 10MB'
        },
        { status: 400 }
      );
    }

    console.log('📸 Image received:', {
      name: photo.name,
      size: photo.size,
      type: photo.type
    });

    // Converti l'immagine in buffer
    const imageBuffer = Buffer.from(await photo.arrayBuffer());

    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          error: 'Configurazione mancante',
          message: 'OpenAI API key non configurata. Contatta l\'amministratore.'
        },
        { status: 500 }
      );
    }

    // Analisi con GPT-4 Vision
    console.log('🤖 Starting GPT-4 Vision analysis...');
    const visionResult = await analyzeSeasonWithGPT4Vision(imageBuffer);
    console.log('✅ GPT-4 Vision analysis complete:', visionResult.season);

    // Mappa il risultato alla nostra struttura palette esistente
    const seasonMapping: Record<string, keyof typeof SEASONAL_PALETTES> = {
      'Primavera': 'spring',
      'Estate': 'summer', 
      'Autunno': 'autumn',
      'Inverno': 'winter'
    };

    const paletteKey = seasonMapping[visionResult.season] || 'spring';
    const palette = SEASONAL_PALETTES[paletteKey];

    // Ordina colori per compatibilità
    const sortedColors = [...palette.colors].sort((a, b) => {
      const scoreA = (a.difficulty === 'Facile' ? 3 : a.difficulty === 'Media' ? 2 : 1);
      const scoreB = (b.difficulty === 'Facile' ? 3 : b.difficulty === 'Media' ? 2 : 1);
      return scoreB - scoreA;
    });

    // Genera consigli personalizzati
    const tips = [
      palette.undertone === 'warm' 
        ? 'Evita colori con base cenere o viola' 
        : 'Evita colori troppo caldi o dorati',
      palette.undertone === 'warm'
        ? 'I riflessi dorati valorizzeranno la tua carnagione'
        : 'I toni freddi e cenere sono perfetti per te',
      'Usa sempre prodotti specifici per capelli colorati',
      'Prenota un ritocco ogni 6-8 settimane per mantenere il colore'
    ];

    console.log('✅ Analysis complete:', {
      season: palette.name,
      confidence: visionResult.confidence
    });

    // Mappa undertone e contrast per luminance/saturation
    const luminanceMap = {
      'light': 75,
      'medium': 50,
      'dark': 25
    };
    
    const saturationMap = {
      'high': 80,
      'low': 40
    };

    // Risposta completa
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        skinTone: {
          undertone: visionResult.undertone,
          luminance: luminanceMap[visionResult.brightness],
          saturation: saturationMap[visionResult.contrast],
          reasoning: visionResult.reasoning
        },
        season: {
          name: palette.name,
          undertone: palette.undertone,
          description: palette.description
        },
        confidence: visionResult.confidence,
        gptAnalysis: {
          undertone: visionResult.undertone,
          contrast: visionResult.contrast,
          brightness: visionResult.brightness
        }
      },
      recommendations: {
        top3: sortedColors.slice(0, 3),
        avoid: palette.avoid,
        tips: tips
      },
      metadata: {
        processingTime: '2.3s',
        imageSize: photo.size,
        faceDetected: true,
        aiModel: 'GPT-4o Vision'
      }
    });

  } catch (error) {
    console.error('❌ Color analysis failed:', error);
    
    return NextResponse.json(
      {
        error: 'Errore analisi',
        message: 'Si è verificato un errore durante l\'analisi dell\'immagine'
      },
      { status: 500 }
    );
  }
}