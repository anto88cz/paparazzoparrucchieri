'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Image from 'next/image';

interface ColorRecommendation {
  name: string;
  code: string;
  difficulty: string;
  sessions: number;
  maintenance: string;
  price: { min: number; max: number };
  description: string;
  benefits: string[];
}

interface AnalysisResult {
  success: boolean;
  analysis: {
    skinTone: {
      undertone: string;
      luminance: number;
      saturation: number;
    };
    season: {
      name: string;
      undertone: string;
      description: string;
    };
    confidence: number;
    visionConfidence?: number;
    dominantColors?: string[];
  };
  recommendations: {
    top3: ColorRecommendation[];
    avoid: string[];
    tips: string[];
  };
}

export default function AIColorMatchingPage() {
  // Stati esistenti
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Nuovi stati per lead capture
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [leadData, setLeadData] = useState({ name: '', phone: '', consent: false });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Funzione per comprimere l'immagine
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Ridimensiona se troppo grande
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Errore compressione immagine'));
              }
            },
            'image/jpeg',
            0.85 // Qualità 85%
          );
        };
        
        img.onerror = () => reject(new Error('Errore caricamento immagine'));
      };
      
      reader.onerror = () => reject(new Error('Errore lettura file'));
    });
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validazione file
    if (!file.type.startsWith('image/')) {
      setError('Seleziona un file immagine valido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('L\'immagine è troppo grande (max 10MB)');
      return;
    }

    try {
      setError(null);
      
      // Comprimi l'immagine se è troppo grande
      let processedFile = file;
      if (file.size > 1024 * 1024) { // Se > 1MB, comprimi
        console.log('🗜️ Compressing image from', file.size, 'bytes...');
        processedFile = await compressImage(file);
        console.log('✅ Compressed to', processedFile.size, 'bytes');
      }
      
      setSelectedImage(processedFile);
      
      // Crea preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(processedFile);
    } catch (err) {
      setError('Errore nel processamento dell\'immagine. Riprova.');
      console.error('Image processing error:', err);
    }
  };

  // Funzione per salvare i lead
  const submitLeadData = async () => {
    if (!leadData.name.trim() || !leadData.phone.trim() || !leadData.consent) {
      setError('Compila tutti i campi e accetta il trattamento dati');
      return;
    }

    setIsSubmittingLead(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          phone: leadData.phone,
          consentGiven: leadData.consent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore salvataggio dati');
      }

      setLeadId(data.leadId);
      setShowLeadForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const analyzeColor = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', selectedImage);
      
      console.log('🚀 Sending image for analysis:', {
        name: selectedImage.name,
        size: selectedImage.size,
        type: selectedImage.type
      });
      
      const response = await fetch('/api/color-analysis', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        
        if (response.status === 413) {
          throw new Error('Immagine troppo grande. Riprova con una foto più piccola.');
        } else if (response.status === 500) {
          throw new Error('Errore del server. Riprova tra qualche istante.');
        } else {
          throw new Error('Errore durante l\'analisi. Verifica la connessione.');
        }
      }

      const data = await response.json();
      console.log('✅ Analysis complete:', data);

      setAnalysisResult(data);

      // Salva l'analisi nel profilo lead se disponibile
      if (leadId && imagePreview) {
        // Prepara raccomandazioni complete
        const recommendationsText = data.recommendations?.tips 
          ? data.recommendations.tips.join(' • ')
          : 'Consulta un esperto per raccomandazioni personalizzate';

        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: leadData.name,
            phone: leadData.phone,
            consentGiven: true,
            analysisResult: {
              season: data.analysis.season.name,
              confidence: data.analysis.confidence,
              undertone: data.analysis.season.undertone === 'warm' ? 'Caldo' : 
                         data.analysis.season.undertone === 'cool' ? 'Freddo' : 
                         data.analysis.season.undertone === 'neutral' ? 'Neutro' : 'Non disponibile',
              dominantColors: data.analysis.dominantColors || [],
              recommendations: recommendationsText,
              topColors: data.recommendations?.top3 || []
            },
            imageInfo: {
              name: selectedImage.name,
              size: selectedImage.size
            },
            imageData: imagePreview
          }),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-gold-50 via-white to-gold-50 py-20 md:py-28">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              AI Paparazzo System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Scopri i <strong>colori capelli perfetti</strong> per te con l&apos;intelligenza artificiale creata da Paparazzo Parrucchieri. 
              Analisi professionale in 3 secondi!
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="font-semibold mb-2">Carica Selfie</h3>
                <p className="text-sm text-gray-600">Foto frontale con luce naturale</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">Analisi automatica in 3 secondi</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold mb-2">Colori Perfetti</h3>
                <p className="text-sm text-gray-600">Raccomandazioni personalizzate</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Upload Section */}
      <Section className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            {!analysisResult ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {showLeadForm ? (
                  /* Form Acquisizione Dati */
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                      <div className="text-4xl mb-4">👤</div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Iniziamo con i Tuoi Dati
                      </h3>
                      <p className="text-gray-600">
                        Per offrirti un servizio personalizzato e tenerti aggiornato sulle nostre novità
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={leadData.name}
                          onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                          placeholder="Mario Rossi"
                          maxLength={50}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numero di Telefono *
                        </label>
                        <input
                          type="tel"
                          value={leadData.phone}
                          onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                          placeholder="+39 333 456 7890"
                          maxLength={20}
                        />
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="consent"
                          checked={leadData.consent}
                          onChange={(e) => setLeadData(prev => ({ ...prev, consent: e.target.checked }))}
                          className="mt-1 w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500"
                        />
                        <label htmlFor="consent" className="text-sm text-gray-600">
                          Accetto il trattamento dei miei dati personali per ricevere comunicazioni commerciali da Paparazzo Parrucchieri. 
                          <a href="/privacy" className="text-gold-600 hover:underline ml-1">
                            Leggi l&apos;informativa privacy
                          </a>
                        </label>
                      </div>

                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      )}

                      <Button
                        onClick={submitLeadData}
                        disabled={isSubmittingLead || !leadData.name.trim() || !leadData.phone.trim() || !leadData.consent}
                        className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50"
                      >
                        {isSubmittingLead ? 'Salvataggio...' : 'Continua con l\'Analisi AI'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-center mb-6">
                      Ciao {leadData.name}, Inizia la Tua Analisi
                    </h2>

                    {/* Upload Area */}
                    <div 
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                        imagePreview ? 'border-gold-300 bg-gold-50' : 'border-gray-300 hover:border-gold-400'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <div className="space-y-4">
                          <Image 
                            src={imagePreview} 
                            alt="Preview" 
                            width={300}
                            height={300}
                            className="mx-auto max-h-64 rounded-lg shadow-md object-cover"
                          />
                          <p className="text-gray-600">
                            Foto caricata! Clicca &quot;Inizia Analisi&quot; per continuare
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-6xl">📸</div>
                          <div>
                            <p className="text-lg font-semibold text-gray-700">
                              Carica la tua foto
                            </p>
                            <p className="text-gray-500">
                              JPG, PNG fino a 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4 justify-center">
                  {selectedImage && (
                    <>
                      <Button
                        onClick={analyzeColor}
                        disabled={isAnalyzing}
                        className="px-8 py-3"
                      >
                        {isAnalyzing ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Analizzando...
                          </span>
                        ) : (
                          '🎨 Inizia Analisi'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetAnalysis}
                        disabled={isAnalyzing}
                      >
                        Cambia Foto
                      </Button>
                    </>
                  )}
                </div>

                {/* Tips */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Consigli per la foto:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Scatta in luce naturale (vicino a una finestra)</li>
                    <li>• Viso pulito senza trucco pesante</li>
                    <li>• Inquadratura frontale, sguardo in camera</li>
                    <li>• Sfondo neutro e uniforme</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Results Section */
              <div className="space-y-8">
                {/* Analysis Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold mb-2">
                        La Tua Analisi Completa
                      </h2>
                      <p className="text-gray-600">
                        Confidenza: {analysisResult.analysis.confidence}%
                      </p>
                    </div>
                    <Button variant="outline" onClick={resetAnalysis}>
                      Nuova Analisi
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-gold-50 rounded-xl">
                      <h3 className="font-semibold text-gold-800">Stagione Cromatica</h3>
                      <p className="text-2xl font-bold text-gold-900">
                        {analysisResult.analysis.season.name}
                      </p>
                      <p className="text-sm text-gold-700">
                        {analysisResult.analysis.season.description}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-blue-800">Sottotono</h3>
                      <p className="text-2xl font-bold text-blue-900 capitalize">
                        {analysisResult.analysis.season.undertone}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <h3 className="font-semibold text-green-800">Match Quality</h3>
                      <p className="text-2xl font-bold text-green-900">
                        {analysisResult.analysis.confidence > 80 ? 'Ottimo' : 
                         analysisResult.analysis.confidence > 60 ? 'Buono' : 'Discreto'}
                      </p>
                    </div>
                  </div>

                  {/* Google Vision Analysis Details */}
                  {analysisResult.analysis.dominantColors && (
                    <div className="bg-purple-50 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-semibold text-purple-900 mb-4">
                        🔍 Analisi AI Dettagliata
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-purple-800 mb-2">Colori Dominanti Rilevati</h4>
                          <div className="flex gap-2 flex-wrap">
                            {analysisResult.analysis.dominantColors.slice(0, 5).map((color: string, index: number) => (
                              <div
                                key={index}
                                className="w-10 h-10 rounded-full border-2 border-purple-200 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-700">Luminosità:</span>
                            <span className="font-medium text-purple-900">{analysisResult.analysis.skinTone?.luminance || 'N/A'}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-700">Saturazione:</span>
                            <span className="font-medium text-purple-900">{analysisResult.analysis.skinTone?.saturation || 'N/A'}%</span>
                          </div>
                          {analysisResult.analysis.visionConfidence && (
                            <div className="flex justify-between items-center">
                              <span className="text-purple-700">Precision AI:</span>
                              <span className="font-medium text-purple-900">{(analysisResult.analysis.visionConfidence * 100).toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-display font-bold mb-6">
                    🎨 I Tuoi Colori Perfetti
                  </h2>
                  
                  <div className="space-y-6">
                    {analysisResult.recommendations.top3.map((color, index) => (
                      <div key={index} className={`p-6 rounded-xl border-2 ${
                        index === 0 ? 'border-gold-300 bg-gold-50' : 'border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              {index === 0 && '🏆'} {color.name}
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {color.code}
                              </span>
                            </h3>
                            <p className="text-gray-600">{color.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              €{color.price.min} - €{color.price.max}
                            </p>
                            <p className="text-sm text-gray-500">
                              Difficoltà: {color.difficulty}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Sessioni:</strong> {color.sessions}
                          </div>
                          <div>
                            <strong>Manutenzione:</strong> {color.maintenance}
                          </div>
                          <div>
                            <strong>Benefici:</strong>
                            <ul className="mt-1">
                              {color.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="text-gray-600">• {benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {index === 0 && (
                          <div className="mt-4 pt-4 border-t border-gold-200">
                            <Button 
                              href="https://wa.me/393392399044?text=Ciao! Ho fatto l'AI Color Analysis e vorrei prenotare per il colore raccomandato!"
                              external
                              className="w-full"
                            >
                              📞 Prenota Questo Colore su WhatsApp
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Colors to Avoid */}
                  <div className="mt-8 p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Colori da Evitare:</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.recommendations.avoid.map((color, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Tips */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">💡 Consigli Personalizzati:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {analysisResult.recommendations.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    Pronta per la Trasformazione?
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Prenota una consulenza gratuita per realizzare il tuo colore perfetto
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      href="https://wa.me/393392399044?text=Ciao! Ho completato l'AI Color Analysis e vorrei prenotare una consulenza!"
                      external
                      size="lg"
                    >
                      📱 Prenota su WhatsApp
                    </Button>
                    <Button variant="outline" href="/contatti" size="lg">
                      📞 Altri Contatti
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}