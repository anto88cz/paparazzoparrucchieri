#!/bin/bash

# =============================================================================
# Script di Aggiornamento Rapido Blog System
# =============================================================================
# Questo script aggiorna il sistema blog sul VPS per migliorare la formattazione

echo "🔧 AGGIORNAMENTO SISTEMA BLOG - FORMATTAZIONE MIGLIORATA"
echo "========================================================"
echo "Data: $(date)"
echo ""

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/var/www/paparazzo"

if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Directory progetto non trovata: $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"
echo -e "${BLUE}📁 Directory di lavoro: $(pwd)${NC}"

# =============================================================================
# 1. BACKUP SCRIPT ESISTENTI
# =============================================================================
echo -e "\n${BLUE}1. BACKUP SCRIPT ESISTENTI${NC}"

backup_dir="scripts/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"

if [ -f "scripts/cron-blog-generator.js" ]; then
    cp "scripts/cron-blog-generator.js" "$backup_dir/"
    echo "✅ Backup cron-blog-generator.js"
fi

if [ -f "scripts/auto-blog-publish.sh" ]; then
    cp "scripts/auto-blog-publish.sh" "$backup_dir/"
    echo "✅ Backup auto-blog-publish.sh"
fi

echo "💾 Backup salvato in: $backup_dir"

# =============================================================================
# 2. CREAZIONE SCRIPT ENHANCED (da input locale)
# =============================================================================
echo -e "\n${BLUE}2. CREAZIONE GENERATORE MIGLIORATO${NC}"

# Qui dovresti incollare il contenuto del file generate-blog-post-enhanced.js
# Per ora creiamo un placeholder che ti dice cosa fare

cat > scripts/generate-blog-post-enhanced.js << 'EOL'
/**
 * PLACEHOLDER - DA SOSTITUIRE CON IL CONTENUTO REALE
 * 
 * ISTRUZIONI:
 * 1. Copia il contenuto completo di generate-blog-post-enhanced.js dal workspace locale
 * 2. Incolla qui per sostituire questo placeholder
 * 3. Salva il file
 */

console.log("❌ Questo è un placeholder. Sostituire con il contenuto reale dello script enhanced.");
process.exit(1);
EOL

echo "📝 Script enhanced creato (PLACEHOLDER - da aggiornare manualmente)"

# =============================================================================
# 3. CREAZIONE PUBLISHER MIGLIORATO
# =============================================================================
echo -e "\n${BLUE}3. CREAZIONE PUBLISHER MIGLIORATO${NC}"

cat > scripts/enhanced-blog-publisher.sh << 'EOL'
#!/bin/bash

# Enhanced Blog Auto Publisher for VPS
# Script migliorato per la pubblicazione automatica

set -e

PROJECT_DIR="/var/www/paparazzo"
LOG_FILE="$PROJECT_DIR/logs/blog-automation.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

mkdir -p "$PROJECT_DIR/logs"

log_message() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

log_message "====================================="
log_message "🚀 STARTING ENHANCED BLOG GENERATION"
log_message "====================================="

cd "$PROJECT_DIR"

# Controlla prerequisiti
if ! command -v node &> /dev/null; then
    log_message "❌ Node.js non trovato"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    log_message "❌ File .env.local mancante"
    exit 1
fi

source .env.local

if [ "$BLOG_AUTO_PUBLISH" != "true" ]; then
    log_message "ℹ️  Auto-pubblicazione disabilitata"
    exit 0
fi

# Controlla se già pubblicato oggi
today=$(date '+%Y-%m-%d')
today_posts=$(find content/blog -name "*.md" -newermt "$today 00:00:00" 2>/dev/null | wc -l)

if [ "$today_posts" -gt 0 ]; then
    log_message "ℹ️  Post già pubblicato oggi ($today_posts post)"
    exit 0
fi

log_message "📝 Generazione nuovo post..."

# Usa script enhanced se disponibile
if [ -f "scripts/generate-blog-post-enhanced.js" ]; then
    GENERATOR_SCRIPT="scripts/generate-blog-post-enhanced.js"
    log_message "✨ Usando generatore migliorato"
else
    GENERATOR_SCRIPT="scripts/cron-blog-generator.js"
    log_message "📝 Usando generatore standard"
fi

# Generazione post
if timeout 300 node "$GENERATOR_SCRIPT" >> "$LOG_FILE" 2>&1; then
    log_message "✅ Articolo generato"
    
    # Verifica qualità
    newest_post=$(find content/blog -name "*.md" -newermt "$today 00:00:00" -printf '%T+ %p\n' 2>/dev/null | sort -r | head -1 | awk '{print $2}')
    if [ -n "$newest_post" ]; then
        log_message "📄 Post: $(basename "$newest_post")"
        
        if grep -q "##" "$newest_post" && grep -q "**" "$newest_post"; then
            log_message "✅ Formattazione verificata"
        else
            log_message "⚠️  Formattazione da controllare"
        fi
        
        word_count=$(wc -w < "$newest_post")
        log_message "📊 Parole: $word_count"
    fi
else
    log_message "❌ Errore generazione"
    exit 1
fi

# Build
log_message "🔨 Building Next.js..."
if timeout 600 npm run build >> "$LOG_FILE" 2>&1; then
    log_message "✅ Build completata"
else
    log_message "❌ Errore build"
    exit 1
fi

# Restart PM2
log_message "🔄 Restart PM2..."
if command -v pm2 &> /dev/null && pm2 list | grep -q "paparazzo"; then
    pm2 restart paparazzo >> "$LOG_FILE" 2>&1
    log_message "✅ PM2 riavviato"
fi

# Pulizia log
tail -n 200 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"

log_message "🎉 AUTOMAZIONE COMPLETATA!"
exit 0
EOL

chmod +x scripts/enhanced-blog-publisher.sh
echo "✅ Publisher migliorato creato e reso eseguibile"

# =============================================================================
# 4. TEST GENERATORE STANDARD
# =============================================================================
echo -e "\n${BLUE}4. TEST GENERATORE ATTUALE${NC}"

if [ -f "scripts/cron-blog-generator.js" ]; then
    echo "📝 Testando il generatore attuale..."
    
    # Crea un backup del contenuto attuale
    if [ -d "content/blog" ]; then
        blog_count_before=$(find content/blog -name "*.md" | wc -l)
        echo "📊 Post attuali: $blog_count_before"
    fi
    
    echo "⚠️  Per sicurezza, NON eseguo il test automaticamente"
    echo "   Comando per test manuale: node scripts/cron-blog-generator.js"
else
    echo "❌ Generatore standard non trovato"
fi

# =============================================================================
# 5. AGGIORNAMENTO CRON JOB
# =============================================================================
echo -e "\n${BLUE}5. AGGIORNAMENTO CRON JOB (OPZIONALE)${NC}"

current_cron=$(crontab -l 2>/dev/null | grep "auto-blog-publish.sh" || echo "nessun cron trovato")
echo "📅 Cron attuale: $current_cron"

echo ""
echo -e "${YELLOW}Per aggiornare il cron job al publisher migliorato:${NC}"
echo "   crontab -e"
echo "   Sostituisci:"
echo "   0 10 * * 2,5 /var/www/paparazzo/scripts/auto-blog-publish.sh"
echo "   Con:"
echo "   0 10 * * 2,5 /var/www/paparazzo/scripts/enhanced-blog-publisher.sh"

# =============================================================================
# 6. ISTRUZIONI FINALI
# =============================================================================
echo -e "\n${GREEN}🎉 AGGIORNAMENTO PREPARATO!${NC}"
echo "=========================="
echo ""
echo -e "${YELLOW}PROSSIMI PASSI MANUALI:${NC}"
echo ""
echo -e "${BLUE}1. AGGIORNA LO SCRIPT ENHANCED:${NC}"
echo "   nano scripts/generate-blog-post-enhanced.js"
echo "   # Copia e incolla il contenuto completo dello script migliorato"
echo ""
echo -e "${BLUE}2. TESTA LA GENERAZIONE:${NC}"
echo "   node scripts/generate-blog-post-enhanced.js"
echo ""
echo -e "${BLUE}3. AGGIORNA IL CRON JOB:${NC}"
echo "   crontab -e"
echo "   # Cambia lo script da auto-blog-publish.sh a enhanced-blog-publisher.sh"
echo ""
echo -e "${BLUE}4. VERIFICA IL PROSSIMO POST:${NC}"
echo "   # Il prossimo post sarà generato martedì o venerdì alle 10:00"
echo "   # Controlla il log: tail -f logs/blog-automation.log"
echo ""
echo -e "${BLUE}5. TEST MANUALE (OPZIONALE):${NC}"
echo "   ./scripts/enhanced-blog-publisher.sh"
echo ""
echo -e "${GREEN}✨ Il nuovo sistema includerà:${NC}"
echo "   ✅ Formattazione Markdown perfetta"
echo "   ✅ Titoli in grassetto automatici"
echo "   ✅ Struttura SEO ottimizzata"
echo "   ✅ Link interni e WhatsApp CTA"
echo "   ✅ Validazione qualità contenuto"
echo "   ✅ Log dettagliati migliorati"

exit 0