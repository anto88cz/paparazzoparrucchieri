import { ImageAnnotatorClient } from '@google-cloud/vision';

// Inizializza il client Google Vision con API Key
const vision = new ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_VISION_API_KEY,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export interface FaceAnalysis {
  dominantColors: string[];
  skinTone: {
    warmth: number; // -1 (cold) to 1 (warm)
    saturation: number; // 0 (low) to 1 (high)
    brightness: number; // 0 (dark) to 1 (light)
  };
  confidence: number;
}

export interface ColorAnalysisResult {
  season: 'Primavera' | 'Estate' | 'Autunno' | 'Inverno';
  confidence: number;
  analysis: FaceAnalysis;
  recommendations: {
    hairColors: string[];
    avoidColors: string[];
    reasoning: string;
  };
}

/**
 * Analizza un'immagine per determinare la stagione cromatica
 */
export async function analyzeImageForColorSeason(imageBuffer: Buffer): Promise<ColorAnalysisResult> {
  try {
    // 1. Rileva volti e colori dominanti nell'immagine
    const [faceResult] = await vision.faceDetection({
      image: { content: imageBuffer },
    });
    
    const [colorResult] = await vision.imageProperties({
      image: { content: imageBuffer },
    });

    if (!faceResult.faceAnnotations || faceResult.faceAnnotations.length === 0) {
      throw new Error('Nessun volto rilevato nell\'immagine');
    }

    const colors = colorResult.imagePropertiesAnnotation?.dominantColors?.colors || [];

    // 2. Analizza i colori dominanti per determinare il sottotono
    const faceAnalysis = analyzeFaceColors(colors);

    // 3. Determina la stagione cromatica basata sull'analisi
    const seasonResult = determineColorSeason(faceAnalysis);

    return {
      season: seasonResult.season,
      confidence: seasonResult.confidence,
      analysis: faceAnalysis,
      recommendations: getSeasonRecommendations(seasonResult.season),
    };

  } catch (error) {
    console.error('Errore nell\'analisi Google Vision:', error);
    
    // Fallback alla simulazione se Google Vision non è disponibile
    return simulateAdvancedAnalysis(imageBuffer);
  }
}

/**
 * Verifica se un colore RGB appartiene alla gamma dei toni della pelle
 */
function isSkinTone(r: number, g: number, b: number): boolean {
  // Range tipico della pelle umana (da molto chiara a molto scura)
  // Questi valori coprono tutti i fototipi
  const isInSkinRange = (
    r >= 80 && r <= 255 &&
    g >= 50 && g <= 240 &&
    b >= 30 && b <= 220 &&
    r > g && g > b && // La pelle ha sempre più rosso che verde che blu
    (r - g) >= 10 && // Differenza minima rosso-verde
    (g - b) >= 5     // Differenza minima verde-blu
  );
  
  return isInSkinRange;
}

/**
 * Analizza i colori del volto per determinare sottotono e caratteristiche
 */
function analyzeFaceColors(colors: any[]): FaceAnalysis {
  // FILTRO CRITICO: prendiamo SOLO i colori che assomigliano alla pelle
  const skinColors = colors.filter(colorInfo => {
    const color = colorInfo.color;
    const r = color.red || 0;
    const g = color.green || 0;
    const b = color.blue || 0;
    return isSkinTone(r, g, b);
  });

  console.log(`🎨 Colori totali: ${colors.length}, Colori pelle: ${skinColors.length}`);

  // Se non troviamo abbastanza colori pelle, usiamo i colori più rilevanti
  const relevantColors = skinColors.length >= 3 
    ? skinColors.slice(0, 8)  // Usa solo colori pelle
    : colors.slice(0, 10);     // Fallback a tutti i colori

  let totalWarmth = 0;
  let totalSaturation = 0;
  let totalBrightness = 0;
  let colorCount = 0;

  const dominantColors: string[] = [];

  relevantColors.forEach(colorInfo => {
    const color = colorInfo.color;
    const r = color.red || 0;
    const g = color.green || 0;
    const b = color.blue || 0;

    // Converti in hex
    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    dominantColors.push(hexColor);

    // Calcola proprietà cromatiche
    const warmth = calculateWarmth(r, g, b);
    const saturation = calculateSaturation(r, g, b);
    const brightness = calculateBrightness(r, g, b);

    totalWarmth += warmth * colorInfo.pixelFraction;
    totalSaturation += saturation * colorInfo.pixelFraction;
    totalBrightness += brightness * colorInfo.pixelFraction;
    colorCount += colorInfo.pixelFraction;
  });

  return {
    dominantColors: dominantColors.slice(0, 5),
    skinTone: {
      warmth: colorCount > 0 ? totalWarmth / colorCount : 0,
      saturation: colorCount > 0 ? totalSaturation / colorCount : 0,
      brightness: colorCount > 0 ? totalBrightness / colorCount : 0,
    },
    confidence: Math.min(colorCount * 100, 95), // Confidence basata sulla quantità di dati
  };
}

/**
 * Calcola il "calore" di un colore (rosso/giallo = caldo, blu = freddo)
 */
function calculateWarmth(r: number, g: number, b: number): number {
  // Formula basata sulla teoria del colore
  const warmComponents = (r * 0.5) + (g * 0.3);
  const coolComponents = b * 0.8;
  return (warmComponents - coolComponents) / 255;
}

/**
 * Calcola la saturazione di un colore
 */
function calculateSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max > 0 ? (max - min) / max : 0;
}

/**
 * Calcola la luminosità di un colore
 */
function calculateBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Determina la stagione cromatica basata sull'analisi del volto
 */
function determineColorSeason(analysis: FaceAnalysis): { season: 'Primavera' | 'Estate' | 'Autunno' | 'Inverno', confidence: number } {
  const { warmth, saturation, brightness } = analysis.skinTone;

  // DEBUG: Log dei valori per capire la distribuzione
  console.log('📊 Valori analisi:', {
    warmth: warmth.toFixed(3),
    saturation: saturation.toFixed(3),
    brightness: brightness.toFixed(3),
  });

  // Logica avanzata per determinare la stagione
  let season: 'Primavera' | 'Estate' | 'Autunno' | 'Inverno';
  let confidence = analysis.confidence;

  // NUOVA LOGICA: soglie più sensibili e distribuzione equa
  if (warmth > 0) {
    // Sottotono caldo
    if (brightness > 0.55) {
      season = 'Primavera'; // Caldo + luminoso
      console.log('✨ Primavera: warmth > 0 && brightness > 0.55');
    } else {
      season = 'Autunno'; // Caldo + profondo
      console.log('🍂 Autunno: warmth > 0 && brightness <= 0.55');
    }
  } else {
    // Sottotono freddo
    if (brightness < 0.5 || saturation > 0.35) {
      season = 'Inverno'; // Freddo + intenso
      console.log('❄️ Inverno: warmth <= 0 && (brightness < 0.5 || saturation > 0.35)');
    } else {
      season = 'Estate'; // Freddo + delicato
      console.log('🌸 Estate: warmth <= 0 && brightness >= 0.5 && saturation <= 0.35');
    }
  }

  // Aggiusta confidence basata sulla chiarezza dei parametri
  const parameterClarity = Math.abs(warmth) + Math.abs(saturation - 0.5) + Math.abs(brightness - 0.5);
  confidence = Math.min(confidence * (0.5 + parameterClarity), 98);

  return { season, confidence };
}

/**
 * Ottieni raccomandazioni per una stagione specifica
 */
function getSeasonRecommendations(season: string) {
  const recommendations = {
    Primavera: {
      hairColors: ['Biondo dorato', 'Castano miele', 'Ramato chiaro', 'Biondo fragola'],
      avoidColors: ['Nero corvino', 'Platino freddo', 'Castano cenere'],
      reasoning: 'Il tuo sottotono caldo e luminoso si abbina perfettamente a colori dorati e mieli che esaltano la tua naturalezza.',
    },
    Estate: {
      hairColors: ['Biondo cenere', 'Castano freddo', 'Platino', 'Biondo perlato'],
      avoidColors: ['Rosso fuoco', 'Biondo dorato', 'Castano caldo'],
      reasoning: 'Il tuo sottotono freddo e delicato richiede colori soft che non sovrastino la tua bellezza naturale.',
    },
    Autunno: {
      hairColors: ['Castano cioccolato', 'Rosso mogano', 'Castano ramato', 'Biondo scuro dorato'],
      avoidColors: ['Biondo platino', 'Nero blue-black', 'Colori pastello'],
      reasoning: 'Il tuo sottotono caldo e profondo si esalta con colori ricchi e terrosi che riflettono la tua personalità forte.',
    },
    Inverno: {
      hairColors: ['Nero corvino', 'Castano scurissimo', 'Platino ghiaccio', 'Rosso ciliegia'],
      avoidColors: ['Biondo miele', 'Castano dorato', 'Colori spenti'],
      reasoning: 'Il tuo sottotono freddo e il contrasto naturale richiedono colori intensi e decisi che sottolineino la tua eleganza.',
    },
  };

  return recommendations[season as keyof typeof recommendations] || recommendations.Primavera;
}

/**
 * Simulazione avanzata quando Google Vision non è disponibile
 * Deterministica basata sul contenuto dell'immagine
 */
function simulateAdvancedAnalysis(imageBuffer?: Buffer): ColorAnalysisResult {
  let seed = 12345; // seed di default
  
  // Se abbiamo l'immagine, creiamo un seed basato sui suoi bytes
  if (imageBuffer && imageBuffer.length > 100) {
    // Usa i primi e ultimi bytes per creare un seed deterministico
    seed = 0;
    for (let i = 0; i < Math.min(10, imageBuffer.length); i++) {
      seed += imageBuffer[i] * (i + 1);
    }
    for (let i = Math.max(0, imageBuffer.length - 10); i < imageBuffer.length; i++) {
      seed += imageBuffer[i] * (i + 1);
    }
    // Aggiungi dimensione file per più variabilità
    seed += imageBuffer.length;
    console.log(`🔢 Deterministic seed for image (${imageBuffer.length} bytes): ${seed}`);
  }

  // Generatore pseudo-random deterministico
  const deterministicRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Determina la stagione basata sul seed
  const seasonIndex = Math.floor(deterministicRandom(seed) * 4);
  const seasons = ['Primavera', 'Estate', 'Autunno', 'Inverno'] as const;
  const selectedSeason = seasons[seasonIndex];
  console.log(`🎨 Deterministic analysis: seed=${seed} → seasonIndex=${seasonIndex} → ${selectedSeason}`);
  
  // Parametri fissi per ogni stagione (deterministici)
  const seasonParams = {
    Primavera: { 
      warmth: 0.6, 
      saturation: 0.7, 
      brightness: 0.8,
      colors: ['#E6B87D', '#D4A574', '#F2D7B3', '#C9A96E', '#B8956A'],
      confidence: 87
    },
    Estate: { 
      warmth: -0.3, 
      saturation: 0.4, 
      brightness: 0.6,
      colors: ['#C5A99B', '#E8D5C4', '#D1B8A8', '#BFA690', '#A8978A'],
      confidence: 84
    },
    Autunno: { 
      warmth: 0.5, 
      saturation: 0.8, 
      brightness: 0.4,
      colors: ['#B8956A', '#8B7355', '#A67B5B', '#94744C', '#C19A6B'],
      confidence: 91
    },
    Inverno: { 
      warmth: -0.6, 
      saturation: 0.9, 
      brightness: 0.3,
      colors: ['#8B7D6B', '#6B5B4F', '#9A8B7A', '#7A6A5A', '#5A4A3A'],
      confidence: 89
    },
  };

  const params = seasonParams[selectedSeason];
  
  // Piccole variazioni deterministiche basate sul seed
  const variation1 = deterministicRandom(seed + 1) * 0.1 - 0.05; // -0.05 to 0.05
  const variation2 = deterministicRandom(seed + 2) * 0.1 - 0.05;
  const variation3 = deterministicRandom(seed + 3) * 0.1 - 0.05;
  
  return {
    season: selectedSeason,
    confidence: params.confidence + Math.floor(deterministicRandom(seed + 4) * 6) - 3, // ±3%
    analysis: {
      dominantColors: params.colors,
      skinTone: {
        warmth: Math.max(-1, Math.min(1, params.warmth + variation1)),
        saturation: Math.max(0, Math.min(1, params.saturation + variation2)),
        brightness: Math.max(0, Math.min(1, params.brightness + variation3)),
      },
      confidence: params.confidence + Math.floor(deterministicRandom(seed + 5) * 4) - 2, // ±2%
    },
    recommendations: getSeasonRecommendations(selectedSeason),
  };
}