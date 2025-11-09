# 🎯 Paparazzo Parrucchieri - Sito Vetrina Completo

Sito web professionale per Paparazzo Parrucchieri, salone di lusso a Catanzaro specializzato in Nanoplastia, Hair Extensions e Color Correction.

## ✨ Caratteristiche

- ✅ **Next.js 14+** con App Router e TypeScript
- ✅ **Tailwind CSS** per styling moderno e responsive
- ✅ **SEO Ottimizzato** con next-seo, sitemap e meta tags
- ✅ **Blog Automatico** con DeepSeek AI (3 post/settimana)
- ✅ **WhatsApp Integration** con CTA strategici
- ✅ **Google Analytics 4** con tracking eventi
- ✅ **Cookie Banner** conforme GDPR
- ✅ **Schema.org** strutturato (HairSalon, Service, Article)
- ✅ **Mobile-First** design completamente responsive
- ✅ **Performance Optimized** - Target Lighthouse >90

## 📁 Struttura del Progetto

```
paparazzo/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Layout globale con metadata
│   │   ├── page.tsx            # Homepage
│   │   ├── servizi/            # Pagine servizi
│   │   ├── blog/               # Sistema blog
│   │   ├── dove-siamo/         # Mappa e contatti
│   │   ├── contatti/           # Form contatti
│   │   ├── privacy/            # Privacy Policy
│   │   └── cookie/             # Cookie Policy
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── home/               # Sezioni homepage
│   │   ├── ui/                 # Componenti riutilizzabili
│   │   ├── WhatsAppButton.tsx
│   │   └── CookieBanner.tsx
│   ├── config/
│   │   └── constants.ts        # Configurazione business
│   └── lib/
│       ├── whatsapp.ts         # Utilità WhatsApp
│       ├── date-utils.ts       # Utilità date/timezone
│       └── deepseek.ts         # Client DeepSeek API
├── scripts/
│   ├── generate-blog-post.js   # Generazione automatica blog
│   ├── generate-sitemap.js     # Generazione sitemap
│   └── schedule-blog.js        # Scheduler articoli
├── public/
│   ├── images/                 # Immagini statiche
│   └── robots.txt
├── content/
│   └── blog/                   # Articoli blog generati
├── .env.example                # Template variabili ambiente
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## 🚀 Setup Iniziale

### 1. Installa Dipendenze

```bash
cd paparazzo
npm install
```

### 2. Configura Variabili Ambiente

Crea un file `.env.local` nella root del progetto:

```env
# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL_TEXT=deepseek-chat
DEEPSEEK_MAX_TOKENS=3500
DEEPSEEK_TEMPERATURE=0.7

# Business Info
SITE_NAME="Paparazzo Parrucchieri"
SITE_URL=https://paparazzoparrucchieri.it
BUSINESS_WHATSAPP=+393392399044
BUSINESS_PHONE=+393392399044
BUSINESS_EMAIL=info@paparazzoparrucchieri.it
BUSINESS_ADDRESS="Via Formia 47, Catanzaro"

# Timezone
TIMEZONE=Europe/Rome

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Blog Configuration
BLOG_AUTO_PUBLISH=true
BLOG_POSTS_PER_WEEK=3
BLOG_PUBLISH_DAYS=1,3,5  # Lunedì, Mercoledì, Venerdì
BLOG_PUBLISH_TIME=09:30
```

### 3. Ottieni API Key DeepSeek

1. Registrati su [https://platform.deepseek.com](https://platform.deepseek.com)
2. Vai alla sezione "API Keys"
3. Crea una nuova API key
4. Copia e incolla nel file `.env.local`

## 💻 Comandi di Sviluppo

### Avvia Development Server

```bash
npm run dev
```

Il sito sarà disponibile su [http://localhost:3000](http://localhost:3000)

### Build per Produzione

```bash
npm run build
npm run start
```

### Lint e Format

```bash
npm run lint
npm run format
```

### Type Check

```bash
npm run type-check
```

## 📝 Sistema Blog Automatico

### Generazione Manuale Articolo

Genera un singolo articolo blog:

```bash
npm run generate-blog
```

### Automazione con Cron (Linux/Mac)

Apri crontab:

```bash
crontab -e
```

Aggiungi questo per pubblicare Lun/Mer/Ven alle 09:30:

```bash
30 9 * * 1,3,5 cd /path/to/paparazzo && npm run generate-blog
```

### Automazione con Task Scheduler (Windows)

1. Apri "Utilità di pianificazione"
2. Crea nuova attività
3. Trigger: Lun/Mer/Ven alle 09:30
4. Azione: `C:\Program Files\nodejs\node.exe`
5. Argomenti: `C:\path\to\paparazzo\scripts\generate-blog-post.js`

### Vercel Cron Jobs (Hosting Cloud)

Aggiungi in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-blog",
      "schedule": "30 9 * * 1,3,5"
    }
  ]
}
```

## 🎨 Personalizzazione Contenuti

### Modificare Informazioni Business

Apri `src/config/constants.ts` e modifica:

```typescript
export const BUSINESS = {
  name: 'Paparazzo Parrucchieri',
  phone: '+39 339 239 9044',
  email: 'info@paparazzoparrucchieri.it',
  address: {
    street: 'Via Formia 47',
    city: 'Catanzaro',
    // ...
  },
  // ...
};
```

### Modificare Servizi

Nello stesso file `constants.ts`, sezione `SERVICES`:

```typescript
export const SERVICES = [
  {
    id: 'nuovo-servizio',
    slug: 'nuovo-servizio',
    name: 'Nome Servizio',
    description: '...',
    benefits: ['...'],
    // ...
  },
];
```

### Modificare Orari

In `constants.ts`, sezione `BUSINESS.hours`:

```typescript
hours: {
  monday: { open: '09:00', close: '19:00', closed: false },
  // ...
}
```

### Modificare Colori Brand

Apri `tailwind.config.ts`:

```typescript
colors: {
  gold: {
    500: '#f59e0b',  // Colore principale
    600: '#d97706',  // Hover
    // ...
  }
}
```

## 📱 WhatsApp Integration

### Modificare Messaggio Predefinito

In `src/lib/whatsapp.ts`:

```typescript
export function getWhatsAppLink(message?: string): string {
  const defaultMessage = 'Ciao, vorrei prenotare un appuntamento!';
  // ...
}
```

### Tracking Click WhatsApp

Tutti i click su WhatsApp vengono automaticamente tracciati in Google Analytics con evento `whatsapp_click`.

## 🔍 SEO e Meta Tags

### Modificare Meta Tags Globali

In `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Paparazzo Parrucchieri | Titolo',
    template: '%s | Paparazzo',
  },
  description: 'Descrizione sito...',
  // ...
};
```

### Aggiungere Meta Tags Pagina Specifica

In ogni `page.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Titolo Pagina',
  description: 'Descrizione pagina...',
};
```

## 📊 Google Analytics

### Setup GA4

1. Crea proprietà GA4 su [analytics.google.com](https://analytics.google.com)
2. Copia il Measurement ID (formato: G-XXXXXXXXXX)
3. Aggiungi in `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Eventi Tracciati

- `whatsapp_click` - Click su pulsanti WhatsApp
- `phone_call` - Click su numero telefono
- `form_submit` - Invio form contatti
- `service_view` - Visualizzazione pagina servizio
- `blog_read` - Lettura articolo blog

## 🌐 Deploy

### Deploy su Vercel (Raccomandato)

1. Push su GitHub repository
2. Importa progetto su [vercel.com](https://vercel.com)
3. Aggiungi variabili ambiente
4. Deploy automatico!

```bash
# Oppure usa Vercel CLI
npm install -g vercel
vercel
```

### Deploy su VPS con Nginx

```bash
# Build
npm run build

# Start con PM2
npm install -g pm2
pm2 start npm --name "paparazzo" -- start
pm2 save
pm2 startup
```

Configurazione Nginx:

```nginx
server {
    listen 80;
    server_name paparazzoparrucchieri.it;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Troubleshooting

### Le immagini non si caricano

Aggiungi domini in `next.config.js`:

```javascript
images: {
  domains: ['yourdomain.com', 'maps.googleapis.com'],
}
```

### Errori build TypeScript

```bash
npm run type-check
```

Verifica errori e correggi in base ai messaggi.

### Blog non viene generato

1. Verifica API Key DeepSeek in `.env.local`
2. Controlla log con `node scripts/generate-blog-post.js`
3. Verifica crediti API su DeepSeek dashboard

### Analytics non funziona

1. Verifica `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`
2. Controlla console browser per errori
3. Usa [GA Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/) Chrome extension

## 📄 Licenza e Supporto

© 2025 Paparazzo Parrucchieri. Tutti i diritti riservati.

Per supporto tecnico o modifiche personalizzate, contatta lo sviluppatore.

---

## 🎯 Checklist di Completamento

- [x] Struttura base Next.js
- [x] Layout globale (Navbar, Footer)
- [x] Homepage completa (Hero, Philosophy, Services, Gallery, Testimonials, Blog, Location, CTA)
- [x] Componenti UI riutilizzabili (Button, Card, Container, Section)
- [x] WhatsApp integration
- [x] Cookie banner
- [ ] Pagine servizi (/servizi, /servizi/[slug])
- [ ] Sistema blog (/blog, /blog/[slug])
- [ ] Script generazione automatica DeepSeek
- [ ] Pagine utility (dove-siamo, contatti, privacy, cookie, 404)
- [ ] SEO completo (sitemap, robots.txt, Schema.org)
- [ ] Google Analytics tracking
- [ ] Testing finale e ottimizzazione Lighthouse

## 🚀 Prossimi Passi

1. Installa dipendenze: `npm install`
2. Configura `.env.local` con API keys
3. Completa le pagine mancanti (vedi checklist sopra)
4. Aggiungi immagini reali in `public/images/`
5. Testa funzionalità WhatsApp
6. Configura scheduler blog (cron/Task Scheduler)
7. Deploy su Vercel o VPS
8. Setup Google Analytics
9. Test Lighthouse performance
10. Go live! 🎉

**Per continuare lo sviluppo delle pagine mancanti, chiedi "Continua con le pagine servizi" o "Implementa sistema blog".**
