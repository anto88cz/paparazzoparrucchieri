import { BUSINESS } from '@/config/constants';

/**
 * Structured data for Local Business (Schema.org)
 * Helps Google understand business details and appear in local search results
 */
export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': 'https://paparazzoparrucchieri.it/#organization',
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: 'https://paparazzoparrucchieri.it',
    logo: 'https://paparazzoparrucchieri.it/images/Marchio_trasparente.png',
    image: [
      'https://paparazzoparrucchieri.it/images/Marchio_trasparente.png',
      'https://paparazzoparrucchieri.it/images/Marchio.jpg',
    ],
    priceRange: '€€',
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.coordinates.lat,
      longitude: BUSINESS.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Monday',
        closes: null,
        opens: null,
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '13:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '15:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '18:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        closes: null,
        opens: null,
      },
    ],
    sameAs: [
      BUSINESS.social.instagram,
      BUSINESS.social.facebook,
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Catanzaro',
      },
      {
        '@type': 'City',
        name: 'Lamezia Terme',
      },
      {
        '@type': 'City',
        name: 'Soverato',
      },
      {
        '@type': 'City',
        name: 'Crotone',
      },
      {
        '@type': 'State',
        name: 'Calabria',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servizi Parrucchiere',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Nanoplastia',
            description: 'Trattamento rivoluzionario per lisciare i capelli in modo naturale senza danneggiare la struttura capillare',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hair Extensions',
            description: 'Extensions di alta qualità per volume e lunghezza con applicazione professionale invisibile',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Color Correction',
            description: 'Correzione colore professionale per riparare tinte sbagliate e creare il colore perfetto',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Taglio Donna',
            description: 'Tagli personalizzati studiati sulla forma del viso e stile personale',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Taglio Uomo',
            description: 'Tagli maschili moderni e classici con cura dei dettagli',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Colorazione',
            description: 'Colorazione professionale con prodotti di alta gamma per risultati duraturi',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Trattamenti Capelli',
            description: 'Trattamenti riparatori e ristrutturanti per capelli danneggiati',
          },
        },
      ],
    },
    knowsAbout: [
      'Nanoplastia',
      'Hair Extensions',
      'Color Correction',
      'Balayage',
      'Shatush',
      'Taglio capelli',
      'Colorazione capelli',
      'Trattamenti capelli',
      'Cheratina',
      'Meches',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
