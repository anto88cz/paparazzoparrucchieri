#!/bin/bash

# =============================================================================
# VPS Setup Script per Paparazzo Hair Salon Website
# =============================================================================
# Questo script configura automaticamente l'ambiente di produzione su VPS Linux
# Include: Node.js, PM2, Nginx, SSL, Cron Job per blog automation
# =============================================================================

set -e  # Exit on any error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurazione
PROJECT_NAME="paparazzo-salon"
DOMAIN="your-domain.com"  # Sostituire con il dominio reale
PROJECT_DIR="/var/www/$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
PM2_APP_NAME="paparazzo-app"

echo -e "${BLUE}🚀 Inizializzazione setup VPS per $PROJECT_NAME${NC}"

# =============================================================================
# 1. AGGIORNAMENTO SISTEMA
# =============================================================================
echo -e "${YELLOW}📦 Aggiornamento sistema...${NC}"
sudo apt update && sudo apt upgrade -y

# =============================================================================
# 2. INSTALLAZIONE NODE.JS (LTS)
# =============================================================================
echo -e "${YELLOW}📦 Installazione Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

echo -e "${GREEN}✅ Node.js versione: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM versione: $(npm --version)${NC}"

# =============================================================================
# 3. INSTALLAZIONE PM2 (Process Manager)
# =============================================================================
echo -e "${YELLOW}📦 Installazione PM2...${NC}"
sudo npm install -g pm2

# =============================================================================
# 4. INSTALLAZIONE NGINX
# =============================================================================
echo -e "${YELLOW}📦 Installazione Nginx...${NC}"
sudo apt install -y nginx

# =============================================================================
# 5. SETUP DIRECTORY PROGETTO
# =============================================================================
echo -e "${YELLOW}📁 Creazione directory progetto...${NC}"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# =============================================================================
# 6. CLONAZIONE PROGETTO (da modificare con il tuo repo GitHub)
# =============================================================================
echo -e "${YELLOW}📥 Clonazione progetto...${NC}"
cd /var/www
sudo git clone https://github.com/your-username/styleai-salone.git $PROJECT_NAME
cd $PROJECT_DIR

# Navigazione nella sottocartella paparazzo
cd paparazzo

# =============================================================================
# 7. INSTALLAZIONE DIPENDENZE
# =============================================================================
echo -e "${YELLOW}📦 Installazione dipendenze NPM...${NC}"
npm install

# =============================================================================
# 8. BUILD PRODUZIONE
# =============================================================================
echo -e "${YELLOW}🔨 Build produzione...${NC}"
npm run build

# =============================================================================
# 9. CONFIGURAZIONE ENVIRONMENT VARIABLES
# =============================================================================
echo -e "${YELLOW}⚙️  Configurazione variabili d'ambiente...${NC}"
cat > .env.local << EOL
# =============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# =============================================================================

# Next.js
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NODE_ENV=production

# DeepSeek AI API
DEEPSEEK_API_KEY=sk-a00da698d8e74c3893ed8733e9a2a25a

# Blog Auto Generation
BLOG_AUTO_GENERATION=true
BLOG_POSTS_PER_WEEK=3
BLOG_GENERATION_DAYS=1,3,5
BLOG_GENERATION_TIME=09:30

# Admin Authentication
ADMIN_PASSWORD=paparazzo2025!

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/$PROJECT_NAME-blog-auto.log
EOL

echo -e "${GREEN}✅ File .env.local creato${NC}"

# =============================================================================
# 10. CONFIGURAZIONE PM2
# =============================================================================
echo -e "${YELLOW}⚙️  Configurazione PM2...${NC}"
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$PROJECT_DIR/paparazzo',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/$PROJECT_NAME-error.log',
    out_file: '/var/log/$PROJECT_NAME-out.log',
    log_file: '/var/log/$PROJECT_NAME-combined.log',
    time: true
  }]
};
EOL

# =============================================================================
# 11. CONFIGURAZIONE NGINX
# =============================================================================
echo -e "${YELLOW}⚙️  Configurazione Nginx...${NC}"
sudo tee $NGINX_CONFIG > /dev/null << EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static assets caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Images optimization
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOL

# Abilitazione sito
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# =============================================================================
# 12. SETUP CRON JOB PER BLOG AUTOMATION
# =============================================================================
echo -e "${YELLOW}⏰ Configurazione Cron Job...${NC}"

# Crea script cron ottimizzato per VPS
cat > /tmp/vps-blog-cron.sh << 'EOL'
#!/bin/bash

# =============================================================================
# VPS Blog Auto Generator Cron Script
# =============================================================================

# Configurazione
PROJECT_DIR="/var/www/paparazzo-salon/paparazzo"
LOG_FILE="/var/log/paparazzo-salon-blog-auto.log"
LOCK_FILE="/tmp/blog-generator.lock"

# Funzione di logging
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Controllo lock file (evita esecuzioni multiple)
if [ -f "$LOCK_FILE" ]; then
    log_message "[WARNING] Script già in esecuzione, uscita..."
    exit 1
fi

# Crea lock file
touch "$LOCK_FILE"

# Cleanup function
cleanup() {
    rm -f "$LOCK_FILE"
}
trap cleanup EXIT

log_message "[INFO] === Avvio controllo generazione blog ==="

# Verifica directory progetto
if [ ! -d "$PROJECT_DIR" ]; then
    log_message "[ERROR] Directory progetto non trovata: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Carica variabili d'ambiente
if [ -f ".env.local" ]; then
    source .env.local
else
    log_message "[ERROR] File .env.local non trovato"
    exit 1
fi

# Controllo se l'auto-generazione è abilitata
if [ "$BLOG_AUTO_GENERATION" != "true" ]; then
    log_message "[INFO] Auto-generazione disabilitata"
    exit 0
fi

# Ottieni giorno della settimana (1=Lunedì, 7=Domenica)
current_day=$(date +%u)
current_time=$(date +%H:%M)

# Converti giorni nel formato giusto (1=Lunedì nell'env, 1=Lunedì in date +%u)
IFS=',' read -ra GENERATION_DAYS <<< "$BLOG_GENERATION_DAYS"

# Controllo se oggi è un giorno di generazione
is_generation_day=false
for day in "${GENERATION_DAYS[@]}"; do
    if [ "$current_day" = "$day" ]; then
        is_generation_day=true
        break
    fi
done

if [ "$is_generation_day" = false ]; then
    log_message "[INFO] Oggi non è un giorno di generazione (giorno $current_day)"
    exit 0
fi

# Controllo orario
if [ "$current_time" != "$BLOG_GENERATION_TIME" ]; then
    log_message "[INFO] Orario non corretto ($current_time vs $BLOG_GENERATION_TIME)"
    exit 0
fi

# Controllo se è già stato generato un post oggi
today_date=$(date +%Y-%m-%d)
if find content/blog -name "*.md" -newer <(date -d "$today_date" +%Y%m%d) | head -1 | grep -q .; then
    log_message "[INFO] Post già generato oggi"
    exit 0
fi

log_message "[INFO] Avvio generazione blog post..."

# Esecuzione script di generazione
if node scripts/generate-blog-post.js >> "$LOG_FILE" 2>&1; then
    log_message "[SUCCESS] Blog post generato con successo"
else
    log_message "[ERROR] Errore nella generazione del blog post"
    exit 1
fi

log_message "[INFO] === Fine controllo generazione blog ==="
EOL

# Sposta script nella directory corretta e rendi eseguibile
sudo mv /tmp/vps-blog-cron.sh /usr/local/bin/vps-blog-cron.sh
sudo chmod +x /usr/local/bin/vps-blog-cron.sh

# Aggiungi al crontab
echo "30 9 * * 1,3,5 /usr/local/bin/vps-blog-cron.sh" | sudo crontab -

# =============================================================================
# 13. CREAZIONE FILE DI LOG
# =============================================================================
echo -e "${YELLOW}📝 Configurazione logging...${NC}"
sudo touch /var/log/$PROJECT_NAME-blog-auto.log
sudo chown $USER:$USER /var/log/$PROJECT_NAME-blog-auto.log

# =============================================================================
# 14. AVVIO APPLICAZIONE
# =============================================================================
echo -e "${YELLOW}🚀 Avvio applicazione con PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# =============================================================================
# 15. INSTALLAZIONE CERTBOT PER SSL (Opzionale)
# =============================================================================
echo -e "${YELLOW}🔒 Installazione Certbot per SSL...${NC}"
sudo apt install -y certbot python3-certbot-nginx

echo -e "${BLUE}📋 Per configurare SSL, esegui:${NC}"
echo -e "${GREEN}sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"

# =============================================================================
# 16. FIREWALL CONFIGURATION
# =============================================================================
echo -e "${YELLOW}🔥 Configurazione firewall...${NC}"
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# =============================================================================
# RIEPILOGO FINALE
# =============================================================================
echo -e "${GREEN}"
echo "============================================================================="
echo "🎉 SETUP VPS COMPLETATO CON SUCCESSO!"
echo "============================================================================="
echo "✅ Node.js e NPM installati"
echo "✅ PM2 configurato e avviato"
echo "✅ Nginx configurato come reverse proxy"
echo "✅ Cron job per blog automation attivo"
echo "✅ Logging configurato"
echo "✅ Firewall configurato"
echo ""
echo "🌐 Sito accessibile su: http://$DOMAIN"
echo "📊 Monitoraggio PM2: pm2 monit"
echo "📝 Log blog automation: tail -f /var/log/$PROJECT_NAME-blog-auto.log"
echo "⏰ Cron job attivo: Lun/Mer/Ven alle 09:30"
echo ""
echo "🔒 Per SSL esegui: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "============================================================================="
echo -e "${NC}"

# Log finale
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SUCCESS] VPS setup completato" >> /var/log/$PROJECT_NAME-blog-auto.log