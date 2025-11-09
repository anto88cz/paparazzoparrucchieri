#!/bin/bash

# =============================================================================
# Script di Riparazione per Blog Automation su VPS
# =============================================================================
# Questo script ripara automaticamente i problemi comuni del sistema di automazione

echo "🔧 RIPARAZIONE SISTEMA BLOG AUTOMATION"
echo "====================================="
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

# Trova il progetto se non è nella posizione standard
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}🔍 Ricerca directory progetto...${NC}"
    FOUND_DIR=$(find /var/www -name "package.json" -path "*/paparazzo/*" 2>/dev/null | head -1 | dirname)
    if [ -n "$FOUND_DIR" ]; then
        PROJECT_DIR="$FOUND_DIR"
        echo -e "✅ Progetto trovato in: $PROJECT_DIR"
    else
        echo -e "${RED}❌ Progetto non trovato. Uscita.${NC}"
        exit 1
    fi
fi

cd "$PROJECT_DIR"

# =============================================================================
# 1. CONTROLLO E CREAZIONE DIRECTORY LOG
# =============================================================================
echo -e "${BLUE}1. CONFIGURAZIONE LOG${NC}"
sudo mkdir -p /var/log
sudo touch "$LOG_FILE"
sudo chmod 666 "$LOG_FILE"
echo "✅ Log file configurato: $LOG_FILE"

# =============================================================================
# 2. CONTROLLO .ENV.LOCAL
# =============================================================================
echo -e "\n${BLUE}2. CONTROLLO CONFIGURAZIONE${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Creazione .env.local di base...${NC}"
    cat > .env.local << 'EOL'
# =============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# =============================================================================

# Next.js
NEXT_PUBLIC_SITE_URL=https://paparazzoparrucchieri.it
NODE_ENV=production

# DeepSeek AI API
DEEPSEEK_API_KEY=sk-a00da698d8e74c3893ed8733e9a2a25a

# Blog Automation
BLOG_AUTO_GENERATION=true
BLOG_POSTS_PER_WEEK=3
BLOG_GENERATION_DAYS=1,3,5
BLOG_GENERATION_TIME=09:30

# Admin
ADMIN_PASSWORD=paparazzo2025!
EOL
    echo "✅ File .env.local creato"
else
    echo "✅ File .env.local già presente"
    
    # Verifica e aggiunge variabili mancanti
    if ! grep -q "BLOG_AUTO_GENERATION" .env.local; then
        echo "BLOG_AUTO_GENERATION=true" >> .env.local
        echo "   + Aggiunta BLOG_AUTO_GENERATION"
    fi
    
    if ! grep -q "BLOG_GENERATION_DAYS" .env.local; then
        echo "BLOG_GENERATION_DAYS=1,3,5" >> .env.local
        echo "   + Aggiunta BLOG_GENERATION_DAYS"
    fi
    
    if ! grep -q "BLOG_GENERATION_TIME" .env.local; then
        echo "BLOG_GENERATION_TIME=09:30" >> .env.local
        echo "   + Aggiunta BLOG_GENERATION_TIME"
    fi
fi

# =============================================================================
# 3. CREAZIONE SCRIPT CRON
# =============================================================================
echo -e "\n${BLUE}3. CONFIGURAZIONE SCRIPT CRON${NC}"
sudo tee "$CRON_SCRIPT" > /dev/null << EOL
#!/bin/bash

# =============================================================================
# VPS Blog Auto Generator Cron Script
# =============================================================================

# Configurazione
PROJECT_DIR="$PROJECT_DIR"
LOG_FILE="$LOG_FILE"
LOCK_FILE="/tmp/blog-generator.lock"

# Funzione di logging
log_message() {
    echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" >> "\$LOG_FILE"
}

# Controllo lock file (evita esecuzioni multiple)
if [ -f "\$LOCK_FILE" ]; then
    log_message "[WARNING] Script già in esecuzione, uscita..."
    exit 1
fi

# Crea lock file
touch "\$LOCK_FILE"

# Cleanup function
cleanup() {
    rm -f "\$LOCK_FILE"
}
trap cleanup EXIT

log_message "[INFO] === Avvio controllo generazione blog ==="

# Verifica directory progetto
if [ ! -d "\$PROJECT_DIR" ]; then
    log_message "[ERROR] Directory progetto non trovata: \$PROJECT_DIR"
    exit 1
fi

cd "\$PROJECT_DIR"

# Carica variabili d'ambiente
if [ -f ".env.local" ]; then
    source .env.local
else
    log_message "[ERROR] File .env.local non trovato"
    exit 1
fi

# Controllo se l'auto-generazione è abilitata
if [ "\$BLOG_AUTO_GENERATION" != "true" ]; then
    log_message "[INFO] Auto-generazione disabilitata"
    exit 0
fi

# Ottieni giorno della settimana (1=Lunedì, 7=Domenica)
current_day=\$(date +%u)
current_time=\$(date +%H:%M)

# Converti giorni nel formato giusto
IFS=',' read -ra GENERATION_DAYS <<< "\$BLOG_GENERATION_DAYS"

# Controllo se oggi è un giorno di generazione
is_generation_day=false
for day in "\${GENERATION_DAYS[@]}"; do
    if [ "\$current_day" = "\$day" ]; then
        is_generation_day=true
        break
    fi
done

if [ "\$is_generation_day" = false ]; then
    log_message "[INFO] Oggi non è un giorno di generazione (giorno \$current_day)"
    exit 0
fi

log_message "[INFO] Oggi è un giorno di generazione (giorno \$current_day), orario corrente: \$current_time"

# Controllo se è già stato generato un post oggi
today_date=\$(date +%Y-%m-%d)
todays_posts=\$(find content/blog -name "*\$today_date*.md" 2>/dev/null | wc -l)
if [ "\$todays_posts" -gt 0 ]; then
    log_message "[INFO] Post già generato oggi (\$todays_posts post trovati)"
    exit 0
fi

log_message "[INFO] Avvio generazione blog post..."

# Esecuzione script di generazione con PATH completo
export PATH="/usr/local/bin:/usr/bin:/bin:\$PATH"
if /usr/bin/node scripts/generate-blog-post.js >> "\$LOG_FILE" 2>&1; then
    log_message "[SUCCESS] Blog post generato con successo"
    
    # Ricostruisci il sito se PM2 è attivo
    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "paparazzo"; then
            npm run build >> "\$LOG_FILE" 2>&1
            pm2 restart paparazzo >> "\$LOG_FILE" 2>&1
            log_message "[INFO] Sito ricostruito e riavviato"
        fi
    fi
else
    log_message "[ERROR] Errore nella generazione del blog post"
    exit 1
fi

log_message "[INFO] === Fine controllo generazione blog ==="
EOL

sudo chmod +x "$CRON_SCRIPT"
echo "✅ Script cron creato: $CRON_SCRIPT"

# =============================================================================
# 4. CONFIGURAZIONE CRONTAB
# =============================================================================
echo -e "\n${BLUE}4. CONFIGURAZIONE CRONTAB${NC}"

# Rimuovi vecchie entries
crontab -l 2>/dev/null | grep -v "vps-blog-cron.sh" | crontab -

# Aggiungi nuova entry
(crontab -l 2>/dev/null; echo "30 9 * * 1,3,5 $CRON_SCRIPT") | crontab -

echo "✅ Cron job configurato: Lunedì, Mercoledì, Venerdì alle 09:30"

# =============================================================================
# 5. TEST IMMEDIATO
# =============================================================================
echo -e "\n${BLUE}5. TEST IMMEDIATO${NC}"
echo "Eseguendo test del sistema..."

# Test di generazione manuale
if node scripts/generate-blog-post.js; then
    echo -e "✅ Test generazione manuale: ${GREEN}SUCCESSO${NC}"
else
    echo -e "❌ Test generazione manuale: ${RED}FALLITO${NC}"
fi

# =============================================================================
# 6. RIEPILOGO
# =============================================================================
echo -e "\n${GREEN}🎉 RIPARAZIONE COMPLETATA${NC}"
echo "=================================="
echo "✅ Log file: $LOG_FILE"
echo "✅ Script cron: $CRON_SCRIPT"
echo "✅ Crontab: Lun/Mer/Ven alle 09:30"
echo "✅ Configurazione: .env.local"
echo ""
echo -e "${BLUE}Per verificare il funzionamento:${NC}"
echo "1. Controlla il log: tail -f $LOG_FILE"
echo "2. Testa manualmente: cd $PROJECT_DIR && node scripts/generate-blog-post.js"
echo "3. Verifica cron: crontab -l"
echo ""
echo -e "${YELLOW}Il prossimo post sarà generato il prossimo Lunedì, Mercoledì o Venerdì alle 09:30${NC}"