#!/bin/bash
# Blog Auto-Generator Cron Script
# Questo script viene eseguito dal cron job per generare automaticamente articoli

# Naviga nella directory del progetto
cd "$(dirname "$0")/.."

# Carica le variabili d'ambiente
export NODE_ENV=production

# Log file per debugging
LOG_FILE="logs/blog-auto-generator.log"
mkdir -p logs

# Funzione di logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "Starting blog auto-generation..."

# Controlla se è un giorno di pubblicazione
CURRENT_DAY=$(date +%u)  # 1=Monday, 2=Tuesday, ..., 7=Sunday
PUBLISH_DAYS="1,3,5"     # Lunedì, Mercoledì, Venerdì

if [[ ",$PUBLISH_DAYS," == *",$CURRENT_DAY,"* ]]; then
    log "Today is a publish day (day $CURRENT_DAY)"
    
    # Controlla l'orario
    CURRENT_TIME=$(date +%H:%M)
    PUBLISH_TIME="09:30"
    
    if [[ "$CURRENT_TIME" == "$PUBLISH_TIME" ]]; then
        log "It's publish time! Generating new blog post..."
        
        # Esegui il generatore di blog
        node scripts/generate-blog-post.js >> "$LOG_FILE" 2>&1
        
        if [ $? -eq 0 ]; then
            log "Blog post generated successfully!"
        else
            log "ERROR: Failed to generate blog post"
        fi
    else
        log "Not publish time yet. Current: $CURRENT_TIME, Publish: $PUBLISH_TIME"
    fi
else
    log "Today is not a publish day (day $CURRENT_DAY)"
fi

log "Blog auto-generation check completed"