/**
 * GPT-4 Vision API for Seasonal Color Analysis
 * Uses OpenAI's multimodal AI to determine color season from selfies
 */
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SeasonAnalysisResult {
  season: 'Primavera' | 'Estate' | 'Autunno' | 'Inverno';
  confidence: number;
  undertone: 'warm' | 'cool';
  contrast: 'high' | 'low';
  brightness: 'light' | 'medium' | 'dark';
  reasoning: string;
}

/**
 * Analyze image with GPT-4 Vision to determine seasonal color type
 */
export async function analyzeSeasonWithGPT4Vision(imageBuffer: Buffer): Promise<SeasonAnalysisResult> {
  try {
    console.log('🤖 Starting GPT-4 Vision analysis...');
    
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // gpt-4o supporta visione ed è più economico di gpt-4-vision-preview
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Sei un esperto di analisi del colore professionale specializzato in armocromia (seasonal color analysis).

Analizza attentamente questo volto e determina la stagione cromatica tra: Primavera, Estate, Autunno, Inverno.

Valuta questi aspetti chiave:
1. **Sottotono della pelle**: Osserva se la pelle ha riflessi dorati/pesca (caldo) o rosa/bluastri (freddo)
2. **Contrasto naturale**: Differenza tra pelle, capelli e occhi (alto contrasto = Inverno/Primavera, basso = Estate/Autunno)
3. **Luminosità**: Quanto è chiara o scura la carnagione
4. **Saturazione**: Quanto sono intensi i colori naturali (capelli, occhi)

Regole di classificazione:
- **Primavera**: Sottotono CALDO + colori CHIARI e LUMINOSI + contrasto MEDIO-ALTO
- **Estate**: Sottotono FREDDO + colori DELICATI e SOFT + contrasto BASSO-MEDIO
- **Autunno**: Sottotono CALDO + colori PROFONDI e RICCHI + contrasto BASSO-MEDIO
- **Inverno**: Sottotono FREDDO + colori INTENSI e VIVIDI + contrasto ALTO

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido in questo formato:
{
  "season": "Primavera" | "Estate" | "Autunno" | "Inverno",
  "confidence": 75,
  "undertone": "warm" | "cool",
  "contrast": "high" | "low",
  "brightness": "light" | "medium" | "dark",
  "reasoning": "Breve spiegazione di massimo 2 frasi sul perché hai scelto questa stagione"
}

IMPORTANTE: Rispondi SOLO con il JSON, senza altro testo.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
                detail: 'high', // Alta risoluzione per analisi accurata
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3, // Bassa temperatura per risposte più consistenti
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('GPT-4 Vision non ha restituito una risposta');
    }

    console.log('📝 GPT-4 Vision raw response:', content);

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Formato JSON non valido nella risposta GPT-4 Vision');
    }

    const result = JSON.parse(jsonMatch[0]) as SeasonAnalysisResult;

    // Validate result
    const validSeasons = ['Primavera', 'Estate', 'Autunno', 'Inverno'];
    if (!validSeasons.includes(result.season)) {
      throw new Error(`Stagione non valida: ${result.season}`);
    }

    console.log('✅ GPT-4 Vision analysis complete:', {
      season: result.season,
      confidence: result.confidence,
      undertone: result.undertone,
    });

    return result;

  } catch (error) {
    console.error('❌ Errore GPT-4 Vision:', error);
    
    // Fallback to reasonable defaults if GPT-4 fails
    throw new Error(`Analisi GPT-4 Vision fallita: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
  }
}

/**
 * Check if OpenAI API key is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
