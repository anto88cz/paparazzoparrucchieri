#!/bin/bash

# =============================================================================
# VPS Deploy Script - Paparazzo Parrucchieri AI Color System
# =============================================================================
# Esegui questo script sul VPS dopo aver clonato il repository
# Usage: sudo bash deploy-vps.sh
# =============================================================================

set -e  # Exit on error

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configurazione
PROJECT_NAME="paparazzo-salon"
DOMAIN="paparazzoparrucchieri.it"
PROJECT_DIR="/var/www/$PROJECT_NAME"
PM2_APP_NAME="paparazzo-app"
NODE_VERSION="20"

echo -e "${PURPLE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║   🚀 Paparazzo Parrucchieri - VPS Deploy Script   🎨  ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# =============================================================================
# 1. Verifica privilegi
# =============================================================================
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Questo script deve essere eseguito come root (usa sudo)${NC}"
   exit 1
fi

echo -e "${BLUE}✓ Privilegi root verificati${NC}"

# =============================================================================
# 2. Aggiornamento sistema
# =============================================================================
echo -e "\n${YELLOW}📦 Aggiornamento sistema...${NC}"
apt update && apt upgrade -y

# =============================================================================
# 3. Installazione Node.js
# =============================================================================
echo -e "\n${YELLOW}📦 Installazione Node.js $NODE_VERSION...${NC}"
curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash -
apt-get install -y nodejs

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM: $(npm --version)${NC}"

# =============================================================================
# 4. Installazione PM2
# =============================================================================
echo -e "\n${YELLOW}📦 Installazione PM2...${NC}"
npm install -g pm2

# =============================================================================
# 5. Installazione Nginx
# =============================================================================
echo -e "\n${YELLOW}📦 Installazione Nginx...${NC}"
apt install -y nginx

# =============================================================================
# 6. Installazione Certbot (SSL)
# =============================================================================
echo -e "\n${YELLOW}🔒 Installazione Certbot per SSL...${NC}"
apt install -y certbot python3-certbot-nginx

# =============================================================================
# 7. Setup directory progetto
# =============================================================================
echo -e "\n${YELLOW}📁 Setup directory progetto...${NC}"

if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Directory $PROJECT_DIR non trovata!${NC}"
    echo -e "${YELLOW}Clona prima il repository:${NC}"
    echo -e "  cd /var/www"
    echo -e "  git clone https://github.com/anto88cz/styleai-salone.git $PROJECT_NAME"
    exit 1
fi

cd $PROJECT_DIR
echo -e "${GREEN}✅ Directory progetto: $PROJECT_DIR${NC}"

# =============================================================================
# 8. Installazione dipendenze
# =============================================================================
echo -e "\n${YELLOW}📦 Installazione dipendenze NPM...${NC}"
npm install --production=false

# =============================================================================
# 9. Verifica .env.local
# =============================================================================
echo -e "\n${YELLOW}🔐 Verifica file .env.local...${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ File .env.local non trovato!${NC}"
    echo -e "${YELLOW}Creazione template .env.local...${NC}"
    
    cat > .env.local << 'EOL'
# Google Cloud Vision API
GOOGLE_VISION_API_KEY=your_api_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL_TEXT=deepseek-chat
DEEPSEEK_MAX_TOKENS=3500
DEEPSEEK_TEMPERATURE=0.7

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://paparazzoparrucchieri.it
SITE_NAME=Paparazzo Parrucchieri
BUSINESS_WHATSAPP=+393392399044
BUSINESS_PHONE=+393392399044
BUSINESS_EMAIL=info@paparazzoparrucchieri.it
BUSINESS_ADDRESS=Via Formia 47, Catanzaro
BUSINESS_CITY=Catanzaro
BUSINESS_REGION=Calabria
BUSINESS_POSTAL_CODE=88100
BUSINESS_COUNTRY=IT

# Blog Automation
BLOG_AUTO_PUBLISH=true
BLOG_POSTS_PER_WEEK=3
BLOG_PUBLISH_DAYS=1,3,5
BLOG_PUBLISH_TIME=09:30

# Environment
NODE_ENV=production
EOL
    
    echo -e "${YELLOW}⚠️  IMPORTANTE: Modifica .env.local con i tuoi dati reali!${NC}"
    echo -e "${YELLOW}   nano .env.local${NC}"
    read -p "Premi ENTER dopo aver modificato .env.local..."
fi

echo -e "${GREEN}✅ File .env.local presente${NC}"

# =============================================================================
# 10. Build produzione
# =============================================================================
echo -e "\n${YELLOW}🔨 Build produzione Next.js...${NC}"
npm run build

echo -e "${GREEN}✅ Build completata${NC}"

# =============================================================================
# 11. Setup PM2
# =============================================================================
echo -e "\n${YELLOW}⚙️  Configurazione PM2...${NC}"

# Stop se già in esecuzione
pm2 stop $PM2_APP_NAME 2>/dev/null || true
pm2 delete $PM2_APP_NAME 2>/dev/null || true

# Start applicazione
pm2 start npm --name $PM2_APP_NAME -- start
pm2 save

# Auto-start on reboot
pm2 startup systemd -u root --hp /root

echo -e "${GREEN}✅ PM2 configurato e avviato${NC}"
pm2 status

# =============================================================================
# 12. Configurazione Nginx
# =============================================================================
echo -e "\n${YELLOW}🌐 Configurazione Nginx...${NC}"

cat > /etc/nginx/sites-available/$PROJECT_NAME << EOL
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
        
        # Timeout per AI analysis
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Static files optimization
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Images optimization
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }

    # Upload size for AI Color Analysis
    client_max_body_size 10M;
}
EOL

# Abilita sito
ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/

# Test configurazione
nginx -t

# Restart Nginx
systemctl restart nginx

echo -e "${GREEN}✅ Nginx configurato${NC}"

# =============================================================================
# 13. Setup SSL con Certbot
# =============================================================================
echo -e "\n${YELLOW}🔒 Setup SSL certificato (questo richiederà conferma)...${NC}"
echo -e "${YELLOW}Assicurati che il dominio $DOMAIN punti a questo server!${NC}"
read -p "Vuoi configurare SSL ora? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email info@$DOMAIN || {
        echo -e "${YELLOW}⚠️  SSL non configurato. Puoi farlo manualmente dopo con:${NC}"
        echo -e "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    }
else
    echo -e "${YELLOW}⚠️  SSL non configurato. Configuralo manualmente con:${NC}"
    echo -e "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# =============================================================================
# 14. Setup Cron Job per Blog
# =============================================================================
echo -e "\n${YELLOW}⏰ Setup Cron Job per blog automation...${NC}"

cat > /usr/local/bin/paparazzo-blog-cron.sh << 'EOL'
#!/bin/bash

# Configurazione
PROJECT_DIR="/var/www/paparazzo-salon"
LOG_FILE="/var/log/paparazzo-blog-auto.log"

# Logging
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting blog generation..." >> $LOG_FILE

# Vai nella directory del progetto
cd $PROJECT_DIR

# Esegui script generazione blog
/usr/bin/node scripts/generate-blog-post.js >> $LOG_FILE 2>&1

# Log completamento
if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Blog post generated successfully" >> $LOG_FILE
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Blog generation failed" >> $LOG_FILE
fi
EOL

chmod +x /usr/local/bin/paparazzo-blog-cron.sh

# Aggiungi a crontab (Lunedì, Mercoledì, Venerdì alle 9:30)
(crontab -l 2>/dev/null | grep -v "paparazzo-blog-cron"; echo "30 9 * * 1,3,5 /usr/local/bin/paparazzo-blog-cron.sh") | crontab -

echo -e "${GREEN}✅ Cron job configurato (Lun, Mer, Ven alle 9:30)${NC}"

# =============================================================================
# 15. Setup directory logs e backup
# =============================================================================
echo -e "\n${YELLOW}📝 Setup directory logs e backup...${NC}"
mkdir -p /var/log/paparazzo-salon
mkdir -p /var/backups/paparazzo-salon
touch /var/log/paparazzo-blog-auto.log
chown -R www-data:www-data /var/log/paparazzo-salon

echo -e "${GREEN}✅ Directory logs e backup create${NC}"

# =============================================================================
# 16. Firewall (UFW)
# =============================================================================
echo -e "\n${YELLOW}🔥 Configurazione Firewall...${NC}"
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
echo "y" | ufw enable 2>/dev/null || true

echo -e "${GREEN}✅ Firewall configurato${NC}"

# =============================================================================
# DEPLOY COMPLETATO
# =============================================================================
echo -e "\n${PURPLE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║          🎉 DEPLOY COMPLETATO CON SUCCESSO! 🎉         ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Applicazione: http://$DOMAIN${NC}"
echo -e "${GREEN}✅ PM2 Status: pm2 status${NC}"
echo -e "${GREEN}✅ Logs: pm2 logs $PM2_APP_NAME${NC}"
echo -e "${GREEN}✅ Nginx: systemctl status nginx${NC}"
echo ""
echo -e "${BLUE}📊 Comandi utili:${NC}"
echo -e "  ${YELLOW}pm2 restart $PM2_APP_NAME${NC}    # Riavvia app"
echo -e "  ${YELLOW}pm2 logs $PM2_APP_NAME${NC}       # Visualizza logs"
echo -e "  ${YELLOW}pm2 monit${NC}                    # Monitor risorse"
echo -e "  ${YELLOW}systemctl restart nginx${NC}      # Riavvia Nginx"
echo ""
echo -e "${BLUE}🔄 Per aggiornare il codice:${NC}"
echo -e "  ${YELLOW}cd $PROJECT_DIR${NC}"
echo -e "  ${YELLOW}git pull${NC}"
echo -e "  ${YELLOW}npm install${NC}"
echo -e "  ${YELLOW}npm run build${NC}"
echo -e "  ${YELLOW}pm2 restart $PM2_APP_NAME${NC}"
echo ""
echo -e "${GREEN}🚀 Visita: https://$DOMAIN${NC}"
echo ""
