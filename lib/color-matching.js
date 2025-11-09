/**
 * AI Color Matching Logic for Paparazzo Parrucchieri
 * Analisi personalizzata per determinare i colori capelli perfetti
 */

// Database colori professionali organizzati per stagioni
const SEASONAL_PALETTES = {
  'spring': {
    undertone: 'warm',
    name: 'Primavera',
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

  'summer': {
    undertone: 'cool',
    name: 'Estate',
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

  'autumn': {
    undertone: 'warm',
    name: 'Autunno',
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

  'winter': {
    undertone: 'cool',
    name: 'Inverno',
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

/**
 * Analizza il tono della pelle dall'RGB
 */
function analyzeSkinTone(rgbValues) {
  const { r, g, b } = rgbValues;
  
  // Calcola luminosità
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Determina sottotono
  const undertone = (r > g && r > b) ? 'warm' : 
                   (b > r && b > g) ? 'cool' : 'neutral';
  
  // Calcola saturazione
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  
  return {
    undertone,
    luminance: Math.round(luminance * 100),
    saturation: Math.round(saturation * 100),
    dominant: r > g && r > b ? 'red' : b > r && b > g ? 'blue' : 'green'
  };
}

/**
 * Determina la stagione cromatica
 */
function determineColorSeason(skinAnalysis, eyeColor = 'brown', hairColor = 'brown') {
  const { undertone, luminance, saturation } = skinAnalysis;
  
  // Logica semplificata per determinare la stagione
  if (undertone === 'warm') {
    if (luminance > 60 && saturation > 30) {
      return 'spring'; // Caldo e luminoso
    } else {
      return 'autumn'; // Caldo e intenso
    }
  } else {
    if (luminance > 50 && saturation < 40) {
      return 'summer'; // Freddo e delicato
    } else {
      return 'winter'; // Freddo e intenso
    }
  }
}

/**
 * Genera raccomandazioni colori personalizzate
 */
function generateHairColorRecommendations(skinAnalysis, options = {}) {
  const season = determineColorSeason(skinAnalysis, options.eyeColor, options.currentHair);
  const palette = SEASONAL_PALETTES[season];
  
  // Ordina i colori per compatibilità
  const sortedColors = [...palette.colors].sort((a, b) => {
    // Priorità basata su difficoltà e manutenzione
    const scoreA = (a.difficulty === 'Facile' ? 3 : a.difficulty === 'Media' ? 2 : 1);
    const scoreB = (b.difficulty === 'Facile' ? 3 : b.difficulty === 'Media' ? 2 : 1);
    return scoreB - scoreA;
  });
  
  return {
    season: {
      name: palette.name,
      undertone: palette.undertone,
      description: palette.description
    },
    confidence: calculateConfidence(skinAnalysis),
    recommended: sortedColors.slice(0, 3), // Top 3 raccomandazioni
    avoid: palette.avoid,
    analysis: {
      skinTone: `${palette.undertone} (${skinAnalysis.undertone})`,
      luminance: `${skinAnalysis.luminance}%`,
      saturation: `${skinAnalysis.saturation}%`
    }
  };
}

/**
 * Calcola il livello di confidenza dell'analisi
 */
function calculateConfidence(skinAnalysis) {
  let confidence = 70; // Base confidence
  
  // Aumenta confidenza se i parametri sono chiari
  if (skinAnalysis.undertone !== 'neutral') confidence += 15;
  if (skinAnalysis.saturation > 20 && skinAnalysis.saturation < 80) confidence += 10;
  if (skinAnalysis.luminance > 20 && skinAnalysis.luminance < 90) confidence += 5;
  
  return Math.min(confidence, 95); // Max 95%
}

/**
 * Fornisce consigli aggiuntivi basati sull'analisi
 */
function getAdditionalTips(recommendations, currentHair = 'naturale') {
  const tips = [];
  
  if (recommendations.season.undertone === 'warm') {
    tips.push('Evita colori con base cenere o viola');
    tips.push('I riflessi dorati valorizzeranno la tua carnagione');
  } else {
    tips.push('Evita colori troppo caldi o dorati');
    tips.push('I toni freddi e cenere sono perfetti per te');
  }
  
  tips.push('Usa sempre prodotti specifici per capelli colorati');
  tips.push('Prenota un ritocco ogni 6-8 settimane per mantenere il colore');
  
  return tips;
}

module.exports = {
  analyzeSkinTone,
  determineColorSeason,
  generateHairColorRecommendations,
  getAdditionalTips,
  SEASONAL_PALETTES
};