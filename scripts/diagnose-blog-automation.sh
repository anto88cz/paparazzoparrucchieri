#!/bin/bash

# =============================================================================
# Script di Diagnosi per Blog Automation su VPS
# =============================================================================
# Questo script verifica lo stato del sistema di automazione blog
# e identifica eventuali problemi di configurazione

echo "🔍 DIAGNOSI SISTEMA BLOG AUTOMATION"
echo "=================================="
echo "Data: $(date)"
echo ""

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/var/www/paparazzo-salon/paparazzo"
LOG_FILE="/var/log/paparazzo-salon-blog-auto.log"
CRON_SCRIPT="/usr/local/bin/vps-blog-cron.sh"

# =============================================================================
# 1. CONTROLLO DIRECTORY PROGETTO
# =============================================================================
echo -e "${BLUE}1. CONTROLLO DIRECTORY PROGETTO${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "✅ Directory progetto trovata: $PROJECT_DIR"
    cd "$PROJECT_DIR"
    echo "   - Directory corrente: $(pwd)"
else
    echo -e "${RED}❌ Directory progetto NON trovata: $PROJECT_DIR${NC}"
    echo "   Possibili percorsi alternativi:"
    find /var/www -name "package.json" -path "*/paparazzo/*" 2>/dev/null | head -5
    echo ""
fi

# =============================================================================
# 2. CONTROLLO FILE .ENV.LOCAL
# =============================================================================
echo -e "\n${BLUE}2. CONTROLLO CONFIGURAZIONE${NC}"
if [ -f ".env.local" ]; then
    echo "✅ File .env.local trovato"
    
    # Controllo variabili critiche (senza mostrare valori sensibili)
    if grep -q "BLOG_AUTO_GENERATION=true" .env.local; then
        echo "✅ BLOG_AUTO_GENERATION=true"
    else
        echo -e "${RED}❌ BLOG_AUTO_GENERATION non settata o false${NC}"
    fi
    
    if grep -q "DEEPSEEK_API_KEY=" .env.local; then
        echo "✅ DEEPSEEK_API_KEY configurata"
    else
        echo -e "${RED}❌ DEEPSEEK_API_KEY mancante${NC}"
    fi
    
    echo "   - BLOG_POSTS_PER_WEEK: $(grep BLOG_POSTS_PER_WEEK .env.local | cut -d'=' -f2)"
    echo "   - BLOG_GENERATION_DAYS: $(grep BLOG_GENERATION_DAYS .env.local | cut -d'=' -f2)"
    echo "   - BLOG_GENERATION_TIME: $(grep BLOG_GENERATION_TIME .env.local | cut -d'=' -f2)"
    
else
    echo -e "${RED}❌ File .env.local NON trovato${NC}"
fi

# =============================================================================
# 3. CONTROLLO CRON JOB
# =============================================================================
echo -e "\n${BLUE}3. CONTROLLO CRON JOB${NC}"
if crontab -l 2>/dev/null | grep -q "vps-blog-cron.sh"; then
    echo "✅ Cron job configurato"
    echo "   Configurazione:"
    crontab -l | grep "vps-blog-cron.sh"
else
    echo -e "${RED}❌ Cron job NON configurato${NC}"
    echo "   Crontab attuale:"
    crontab -l 2>/dev/null || echo "   (nessun crontab)"
fi

# =============================================================================
# 4. CONTROLLO SCRIPT CRON
# =============================================================================
echo -e "\n${BLUE}4. CONTROLLO SCRIPT CRON${NC}"
if [ -f "$CRON_SCRIPT" ]; then
    echo "✅ Script cron trovato: $CRON_SCRIPT"
    echo "   - Permessi: $(ls -l $CRON_SCRIPT | awk '{print $1}')"
    echo "   - Proprietario: $(ls -l $CRON_SCRIPT | awk '{print $3":"$4}')"
else
    echo -e "${RED}❌ Script cron NON trovato: $CRON_SCRIPT${NC}"
fi

# =============================================================================
# 5. CONTROLLO LOG FILE
# =============================================================================
echo -e "\n${BLUE}5. CONTROLLO LOG${NC}"
if [ -f "$LOG_FILE" ]; then
    echo "✅ Log file trovato: $LOG_FILE"
    echo "   - Dimensione: $(du -h $LOG_FILE | cut -f1)"
    echo "   - Ultime 5 righe:"
    tail -5 "$LOG_FILE" | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠️  Log file NON trovato: $LOG_FILE${NC}"
    echo "   Questo indica che il cron job non è mai stato eseguito"
fi

# =============================================================================
# 6. CONTROLLO ARTICOLI BLOG
# =============================================================================
echo -e "\n${BLUE}6. CONTROLLO ARTICOLI BLOG${NC}"
if [ -d "content/blog" ]; then
    echo "✅ Directory blog trovata: content/blog"
    
    # Conta articoli totali
    total_posts=$(find content/blog -name "*.md" | wc -l)
    echo "   - Articoli totali: $total_posts"
    
    # Articoli dell'ultima settimana
    week_ago=$(date -d '7 days ago' '+%Y-%m-%d')
    recent_posts=$(find content/blog -name "*.md" -newer <(date -d "$week_ago" '+%Y%m%d') | wc -l)
    echo "   - Articoli ultima settimana: $recent_posts"
    
    # Ultimi 3 articoli
    echo "   - Ultimi articoli:"
    find content/blog -name "*.md" -printf '%T+ %p\n' | sort -r | head -3 | sed 's/^/     /'
    
else
    echo -e "${RED}❌ Directory blog NON trovata${NC}"
fi

# =============================================================================
# 7. TEST MANUALE
# =============================================================================
echo -e "\n${BLUE}7. TEST MANUALE${NC}"
if [ -f "scripts/generate-blog-post.js" ]; then
    echo "✅ Script generazione trovato"
    echo "   - Per testare manualmente: cd $PROJECT_DIR && node scripts/generate-blog-post.js"
else
    echo -e "${RED}❌ Script generazione NON trovato${NC}"
fi

# =============================================================================
# 8. RACCOMANDAZIONI
# =============================================================================
echo -e "\n${BLUE}8. RACCOMANDAZIONI${NC}"

if ! crontab -l 2>/dev/null | grep -q "vps-blog-cron.sh"; then
    echo -e "${YELLOW}⚠️  Configurare cron job:${NC}"
    echo "   echo '30 9 * * 1,3,5 /usr/local/bin/vps-blog-cron.sh' | crontab -"
fi

if [ ! -f "$CRON_SCRIPT" ]; then
    echo -e "${YELLOW}⚠️  Creare script cron: copiare da deploy/vps-setup.sh${NC}"
fi

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Configurare .env.local con le variabili necessarie${NC}"
fi

echo -e "\n${GREEN}✅ Diagnosi completata!${NC}"
echo "Per maggiori dettagli, controlla il log: $LOG_FILE"