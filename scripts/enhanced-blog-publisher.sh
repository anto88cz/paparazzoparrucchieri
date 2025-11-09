#!/bin/bash

# =============================================================================
# Enhanced Blog Auto Publisher for VPS
# =============================================================================
# Script migliorato per la pubblicazione automatica di articoli blog
# con formattazione perfetta e controlli di qualità

set -e

PROJECT_DIR="/var/www/paparazzo"
LOG_FILE="$PROJECT_DIR/logs/blog-automation.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Crea directory logs se non esiste
mkdir -p "$PROJECT_DIR/logs"

# Funzione di logging migliorata
log_message() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

log_message "====================================="
log_message "🚀 STARTING ENHANCED BLOG GENERATION"
log_message "====================================="

cd "$PROJECT_DIR"

# Controlla se Node.js è disponibile
if ! command -v node &> /dev/null; then
    log_message "❌ Node.js non trovato. Installazione necessaria."
    exit 1
fi

# Controlla se il file .env.local esiste
if [ ! -f ".env.local" ]; then
    log_message "❌ File .env.local mancante"
    exit 1
fi

# Carica variabili d'ambiente
source .env.local

# Controlla se l'auto-pubblicazione è abilitata
if [ "$BLOG_AUTO_PUBLISH" != "true" ]; then
    log_message "ℹ️  Auto-pubblicazione disabilitata (BLOG_AUTO_PUBLISH != true)"
    exit 0
fi

# Verifica API key
if [ -z "$DEEPSEEK_API_KEY" ]; then
    log_message "❌ DEEPSEEK_API_KEY mancante nel file .env.local"
    exit 1
fi

log_message "✅ Prerequisiti verificati"

# Controlla se è già stato pubblicato oggi
today=$(date '+%Y-%m-%d')
today_posts=$(find content/blog -name "*.md" -newermt "$today 00:00:00" 2>/dev/null | wc -l)

if [ "$today_posts" -gt 0 ]; then
    log_message "ℹ️  Post già pubblicato oggi ($today_posts post trovati)"
    exit 0
fi

log_message "📝 Nessun post pubblicato oggi, procedo con la generazione..."

# Step 1: Generazione articolo con script migliorato
log_message "Step 1/3: Generazione articolo blog migliorato..."

# Usa lo script enhanced se esiste, altrimenti quello standard
if [ -f "scripts/generate-blog-post-enhanced.js" ]; then
    GENERATOR_SCRIPT="scripts/generate-blog-post-enhanced.js"
    log_message "✨ Usando generatore migliorato (enhanced)"
else
    GENERATOR_SCRIPT="scripts/cron-blog-generator.js"
    log_message "📝 Usando generatore standard"
fi

if timeout 300 node "$GENERATOR_SCRIPT" >> "$LOG_FILE" 2>&1; then
    log_message "✅ Articolo generato con successo"
    
    # Verifica che il post sia stato creato
    new_posts=$(find content/blog -name "*.md" -newermt "$today 00:00:00" 2>/dev/null | wc -l)
    if [ "$new_posts" -gt 0 ]; then
        newest_post=$(find content/blog -name "*.md" -newermt "$today 00:00:00" -printf '%T+ %p\n' | sort -r | head -1 | awk '{print $2}')
        log_message "📄 Nuovo post creato: $(basename "$newest_post")"
        
        # Verifica qualità del contenuto
        if grep -q "##" "$newest_post" && grep -q "**" "$newest_post"; then
            log_message "✅ Formattazione Markdown verificata"
        else
            log_message "⚠️  Possibili problemi di formattazione rilevati"
        fi
        
        # Conta parole (approssimativo)
        word_count=$(wc -w < "$newest_post")
        log_message "📊 Conteggio parole: $word_count"
        
    else
        log_message "⚠️  Nessun nuovo file creato"
    fi
else
    log_message "❌ Errore nella generazione dell'articolo"
    exit 1
fi

# Step 2: Build Next.js
log_message "Step 2/3: Build Next.js..."

if timeout 600 npm run build >> "$LOG_FILE" 2>&1; then
    log_message "✅ Build Next.js completata"
else
    log_message "❌ Errore nel build Next.js"
    exit 1
fi

# Step 3: Restart PM2
log_message "Step 3/3: Restart applicazione PM2..."

if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "paparazzo"; then
        if pm2 restart paparazzo >> "$LOG_FILE" 2>&1; then
            log_message "✅ PM2 riavviato con successo"
        else
            log_message "⚠️  Errore nel riavvio PM2, ma il post è comunque pubblicato"
        fi
    else
        log_message "⚠️  App PM2 'paparazzo' non trovata"
    fi
else
    log_message "⚠️  PM2 non installato, skip restart"
fi

# Pulizia log (mantieni solo le ultime 200 righe)
if [ -f "$LOG_FILE" ]; then
    tail -n 200 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

log_message "🎉 AUTOMAZIONE BLOG COMPLETATA CON SUCCESSO!"
log_message "====================================="

# Invia notifica di successo (opzionale)
if [ -n "$BUSINESS_WHATSAPP" ]; then
    log_message "✉️  Post pubblicato e sito aggiornato automaticamente"
fi

exit 0