/**
 * Business and brand constants for Paparazzo Parrucchieri
 */

export const BUSINESS = {
  name: 'Paparazzo Parrucchieri',
  tagline: 'Arte e tecnica per i tuoi capelli a Catanzaro',
  description:
    'Salone di lusso specializzato in Nanoplastia, Hair Extensions e Color Correction. Esperienza su misura nel cuore di Catanzaro.',
  
  // Contact Information
  phone: '+39 339 239 9044',
  phoneFormatted: '+39 339 239 9044',
  email: 'info@paparazzoparrucchieri.it',
  whatsapp: '+393392399044',
  whatsappLink: 'https://wa.me/393392399044',
  
  // Address
  address: {
    street: 'Via Formia 47',
    city: 'Catanzaro',
    region: 'Calabria',
    postalCode: '88100',
    country: 'Italia',
    countryCode: 'IT',
    full: 'Via Formia 47, 88100 Catanzaro (CZ), Italia',
  },
  
  // Coordinates for maps
  coordinates: {
    lat: 38.9098,
    lng: 16.5877,
  },
  
  // Business Hours
  hours: {
    monday: { open: null, close: null, closed: true },
    tuesday: { open: '09:00', close: '13:00', closeAfternoon: '15:00', reopenAfternoon: '19:00', closed: false },
    wednesday: { open: '09:00', close: '13:00', closeAfternoon: '15:00', reopenAfternoon: '19:00', closed: false },
    thursday: { open: '09:00', close: '13:00', closeAfternoon: '15:00', reopenAfternoon: '19:00', closed: false },
    friday: { open: '09:00', close: '13:00', closeAfternoon: '15:00', reopenAfternoon: '19:00', closed: false },
    saturday: { open: '09:00', close: '18:30', closed: false },
    sunday: { open: null, close: null, closed: true },
  },
  
  // Social Media
  social: {
    instagram: 'https://instagram.com/paparazzo_parrucchieri',
    facebook: 'https://facebook.com/paparazzoparrucchieri',
  },
} as const;

/**
 * Brand values and philosophy
 */
export const BRAND_VALUES = [
  {
    title: 'Lusso Accessibile',
    description:
      'Crediamo che ogni persona meriti un trattamento di lusso. Offriamo servizi premium a prezzi accessibili, senza compromessi sulla qualità.',
    icon: '✨',
  },
  {
    title: 'Personalizzazione',
    description:
      'Ogni cliente è unico. Studiamo la struttura del capello, il tuo stile di vita e i tuoi desideri per creare il look perfetto per te.',
    icon: '💎',
  },
  {
    title: 'Tecnica & Innovazione',
    description:
      'Utilizziamo le tecniche più avanzate come Nanoplastia e Color Correction, con formazione continua e prodotti professionali di alta gamma.',
    icon: '🎨',
  },
] as const;

/**
 * Main services
 */
export const SERVICES = [
  {
    id: 'nanoplastia',
    slug: 'nanoplastia',
    name: 'Nanoplastia',
    shortDescription:
      'Trattamento rivoluzionario per capelli lisci, luminosi e sani senza formaldeide.',
    description:
      'La Nanoplastia è un trattamento brasiliano di nuova generazione che ricostruisce la fibra capillare dall\'interno, eliminando il crespo e donando lucentezza straordinaria. A differenza della cheratina tradizionale, è completamente priva di formaldeide e sostanze nocive.',
    benefits: [
      'Elimina il crespo fino a 7 mesi',
      'Capelli visibilmente più sani e luminosi',
      'Riduce i tempi di piega del 70%',
      'Senza formaldeide né sostanze dannose',
      'Adatto anche a capelli colorati o decolorati',
      'Effetto naturale e morbido al tatto',
    ],
    duration: '2-4 ore',
    icon: '✨',
    image: '/images/services/nanoplastia-1.jpg',
  },
  {
    id: 'hair-extensions',
    slug: 'hair-extensions',
    name: 'Hair Extensions',
    shortDescription:
      'Extension di alta qualità con capelli 100% naturali da singolo donatore. Lunghezza e volume immediati con risultato invisibile e super naturale. Color matching perfetto garantito.',
    description:
      'Le nostre extension sono realizzate con capelli vergini da singolo donatore, applicati con la tecnica professionale Tape-In che rispetta la salute del capello. Sistema adesivo ultra-sottile per un risultato invisibile e naturale, con servizio di color matching perfetto.',
    benefits: [
      'Capelli vergini da singolo donatore di qualità premium',
      'Lunghezza e volume immediati',
      'Applicazione professionale senza danni',
      'Color matching perfetto con studio personalizzato',
      'Durata fino a 6 mesi con cura adeguata',
      'Risultato naturale e invisibile',
    ],
    duration: '90 minuti',
    icon: '💎',
    image: '/images/services/extensions.jpg',
  },
  {
    id: 'color-correction',
    slug: 'color-correction',
    name: 'Color Correction',
    shortDescription:
      'Correzione colore professionale per riparare errori e creare il biondo perfetto.',
    description:
      'La color correction è un\'arte che richiede esperienza e tecnica. Correggiamo colori sbagliati, rimuoviamo pigmenti indesiderati e creiamo biondi luminosi partendo da qualsiasi base, anche la più compromessa.',
    benefits: [
      'Diagnosi accurata del colore e della struttura',
      'Correzione di colori sbagliati o indesiderati',
      'Schiariture progressive per capelli sani',
      'Trattamenti ricostruttivi integrati',
      'Specializzazione in biondi freddi e caldi',
      'Follow-up per mantenimento ottimale',
    ],
    duration: '4-8 ore',
    icon: '🎨',
      image: '/images/services/color-correction-1.jpg',
  },
] as const;

/**
 * SEO Keywords - Primary targets
 */
export const SEO_KEYWORDS = {
  primary: [
    'Parrucchieri Catanzaro',
    'Hair Extensions Catanzaro',
    'Nanoplastia Catanzaro',
    'Biondo Catanzaro',
    'Color Correction Catanzaro',
  ],
  secondary: [
    'Hair Extensions Calabria',
    'Salone lusso Catanzaro',
    'Trattamento lisciante Catanzaro',
    'Parrucchiere professionale Catanzaro',
    'Extension capelli veri Catanzaro',
    'Colore capelli Calabria',
    'Degradé Catanzaro',
    'Balayage Catanzaro',
  ],
  local: [
    'Parrucchieri Via Formia Catanzaro',
    'Salone bellezza Catanzaro centro',
    'Hair stylist Catanzaro',
  ],
} as const;

/**
 * Site metadata
 */
export const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://paparazzoparrucchieri.it',
  locale: 'it_IT',
  defaultTitle: 'Paparazzo Parrucchieri | Nanoplastia, Extensions, Color Correction - Catanzaro',
  defaultDescription:
    'Salone di lusso a Catanzaro specializzato in Nanoplastia, Hair Extensions e Color Correction. Tecnica, personalizzazione ed esperienza su misura. Prenota ora!',
  titleTemplate: '%s | Paparazzo Parrucchieri Catanzaro',
} as const;
