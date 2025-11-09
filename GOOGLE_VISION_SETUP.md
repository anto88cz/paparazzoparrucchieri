# Configurazione Google Vision API

Questa guida ti aiuterà a configurare Google Cloud Vision API per l'analisi AI dei colori.

## Passaggi per la Configurazione

### 1. Crea un Progetto Google Cloud
1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Annota il **Project ID**

### 2. Abilita l'API Vision
1. Nel menu di navigazione, vai su "APIs & Services" > "Library"
2. Cerca "Cloud Vision API"
3. Clicca su "Enable"

### 3. Crea un Service Account
1. Vai su "IAM & Admin" > "Service Accounts"
2. Clicca "Create Service Account"
3. Inserisci nome: `ai-color-analysis`
4. Descrizione: `Service account per AI Color Matching`
5. Clicca "Create and Continue"

### 4. Assegna Permessi
1. Aggiungi ruolo: "Cloud Vision AI Service Agent"
2. Clicca "Continue" > "Done"

### 5. Crea API Key (Metodo Semplice)
1. Vai su "APIs & Services" > "Credentials"
2. Clicca "Create Credentials" > "API Key"
3. Copia l'API Key generata
4. **Opzionale ma raccomandato:** Clicca su "Restrict Key" e limita a "Cloud Vision API"

### 6. Configura il Progetto
1. Aggiorna `.env.local` con la tua API Key e Project ID:
   ```
   GOOGLE_VISION_API_KEY=your-api-key-here
   GOOGLE_CLOUD_PROJECT_ID=gen-lang-client-0783211476
   ```

### 7. Test della Configurazione
```bash
# Riavvia il server di sviluppo
npm run dev
```

Ora l'AI Color Matching utilizzerà Google Vision API per l'analisi reale delle immagini!

## Fallback
Se Google Vision non è configurato, il sistema utilizzerà automaticamente la simulazione avanzata basata sulla teoria dei colori stagionali.

## Costi
- Google Vision API: ~$1.50 per 1000 richieste
- Il primo milione di richieste al mese sono gratuite per nuovi utenti

## Troubleshooting

### Errore "Cannot find credentials"
- Verifica che `google-cloud-credentials.json` sia nella root del progetto
- Controlla che il file non sia corrotto

### Errore "API not enabled"
- Assicurati di aver abilitato Cloud Vision API nel tuo progetto

### Errore "Permission denied"
- Verifica che il service account abbia i ruoli corretti