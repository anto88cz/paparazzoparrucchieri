'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Image from 'next/image';

// Tipi per le immagini
type MediaType = 
  | { src: string; alt: string }
  | { placeholder: true; alt: string };

export default function GallerySection() {
  // Caroselli per ogni servizio
  const services: { name: string; description: string; images: MediaType[] }[] = [
    {
      name: 'Color Correction',
      description: 'Trasformazioni professionali di correzione colore',
      images: [
        { src: '/images/services/color-correction-1.jpg', alt: 'Trasformazione biondo perfetto' },
        { src: '/images/services/color-correction-2.jpg', alt: 'Balayage professionale' },
        { src: '/images/services/color-correction-3.jpg', alt: 'Biondo cenere perfetto' },
        { src: '/images/services/color-correction-4.jpg', alt: 'Capelli lunghi biondi' },
        { src: '/images/services/color-correction-5.jpg', alt: 'Degradé naturale' },
      ]
    },
    {
      name: 'Nanoplastia',
      description: 'Trattamento lisciante rivoluzionario senza formaldeide',
      images: [
        { src: '/images/services/nanoplastia-1.jpg', alt: 'Nanoplastia - Trattamento lisciante professionale' },
        { src: '/images/services/nanoplastia-2.jpg', alt: 'Nanoplastia - Risultato capelli setosi e naturali' },
        { placeholder: true, alt: 'Altri risultati Nanoplastia in arrivo' }
      ]
    },
    {
      name: 'Hair Extensions',
      description: 'Extension di alta qualità per lunghezza e volume',
      images: [
        { src: '/images/services/hair-extensions-1.jpg', alt: 'Hair Extensions - Trasformazione lunghezza e volume' },
        { src: '/images/services/hair-extensions-2.jpg', alt: 'Hair Extensions - Risultato naturale e setoso' },
        { placeholder: true, alt: 'Altri risultati Hair Extensions in arrivo' }
      ]
    }
  ];

  // Stati per controllo caroselli
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>(
    services.reduce((acc, _, index) => ({ ...acc, [index]: 0 }), {} as { [key: number]: number })
  );

  const nextSlide = (serviceIndex: number) => {
    const service = services[serviceIndex];
    setCurrentSlides(prev => ({
      ...prev,
      [serviceIndex]: (prev[serviceIndex] + 1) % service.images.length
    }));
  };

  const prevSlide = (serviceIndex: number) => {
    const service = services[serviceIndex];
    setCurrentSlides(prev => ({
      ...prev,
      [serviceIndex]: prev[serviceIndex] === 0 ? service.images.length - 1 : prev[serviceIndex] - 1
    }));
  };

  return (
    <Section background="white" padding="xl">
      <Container>
        <div className="text-center">
          <h2 className="section-heading">I Nostri Lavori</h2>
          <p className="section-subtitle">
            Trasformazioni reali che parlano da sole
          </p>
        </div>

        {/* Layout orizzontale con 3 colonne */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {services.map((service, serviceIndex) => (
            <div key={serviceIndex} className="space-y-4">
              {/* Titolo Servizio */}
              <div className="text-center">
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>

              {/* Carosello compatto */}
              <div className="relative">
                <div className="overflow-hidden rounded-xl shadow-lg">
                  <div className="relative aspect-[4/5]">
                    {service.images.map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          currentSlides[serviceIndex] === imageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {'placeholder' in image ? (
                          /* Placeholder */
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-gold-100 to-gold-200">
                            <div className="text-center px-4">
                              <div className="mb-3 text-4xl">✨</div>
                              <p className="font-display text-lg font-bold text-gray-700 mb-1">{service.name}</p>
                              <p className="text-xs text-gray-600">{image.alt}</p>
                            </div>
                          </div>
                        ) : (
                          /* Immagine reale */
                          <Image
                            src={'src' in image ? image.src : ''}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            priority={imageIndex === 0 && serviceIndex === 0}
                          />
                        )}
                        
                        {/* Overlay con descrizione */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="font-display text-sm font-bold text-white mb-1">
                              {service.name}
                            </p>
                            <p className="text-xs text-white/90 line-clamp-2">{image.alt}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controlli carosello - mostra solo se ci sono più di 1 immagine */}
                {service.images.length > 1 && (
                  <>
                    {/* Frecce più piccole */}
                    <button
                      onClick={() => prevSlide(serviceIndex)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white/30 hover:scale-110"
                      aria-label="Immagine precedente"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => nextSlide(serviceIndex)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white/30 hover:scale-110"
                      aria-label="Immagine successiva"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Indicatori puntini più piccoli */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {service.images.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          onClick={() => setCurrentSlides(prev => ({ ...prev, [serviceIndex]: imageIndex }))}
                          className={`h-2 w-2 rounded-full transition-all ${
                            currentSlides[serviceIndex] === imageIndex
                              ? 'bg-white scale-125'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Vai all'immagine ${imageIndex + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Counter immagini più compatto */}
              {service.images.length > 1 && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    {currentSlides[serviceIndex] + 1} di {service.images.length}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Vuoi vedere più trasformazioni? Seguici su{' '}
            <a
              href="https://www.instagram.com/paparazzoparrucchieri/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold-600 hover:text-gold-700"
            >
              Instagram
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
