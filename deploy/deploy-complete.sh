#!/bin/bash
# =============================================================================
# SCRIPT DEPLOY COMPLETO - Paparazzo Parrucchieri
# =============================================================================

set -e  # Exit on error

echo "🚀 Inizio Deploy Paparazzo Parrucchieri..."

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Aggiorna sistema
echo -e "${YELLOW}📦 Step 1: Aggiornamento sistema...${NC}"
apt update && apt upgrade -y

# Step 2: Installa Node.js 18.x
echo -e "${YELLOW}📦 Step 2: Installazione Node.js 18.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo -e "${GREEN}✓ Node.js $(node --version) installato${NC}"

# Step 3: Installa PM2, Nginx, Git
echo -e "${YELLOW}📦 Step 3: Installazione PM2, Nginx, Git...${NC}"
npm install -g pm2
apt install -y nginx git
echo -e "${GREEN}✓ PM2, Nginx, Git installati${NC}"

# Step 4: Clone repository
echo -e "${YELLOW}📦 Step 4: Clone repository...${NC}"
if [ -d "/var/www/paparazzo" ]; then
    echo "Directory già esistente, eseguo pull..."
    cd /var/www/paparazzo
    git pull origin main
else
    mkdir -p /var/www
    cd /var/www
    git clone https://github.com/anto88cz/styleai-salone.git paparazzo
fi
cd /var/www/paparazzo/paparazzo
echo -e "${GREEN}✓ Repository clonato/aggiornato${NC}"

# Step 5: Configurazione Environment
echo -e "${YELLOW}📦 Step 5: Configurazione environment...${NC}"
cat > .env.local << 'EOF'
NEXT_PUBLIC_SITE_URL=http://188.245.216.184
NODE_ENV=production
DEEPSEEK_API_KEY=sk-a00da698d8e74c3893ed8733e9a2a25a
BLOG_AUTO_GENERATION=true
BLOG_POSTS_PER_WEEK=3
BLOG_GENERATION_DAYS=1,3,5
BLOG_GENERATION_TIME=09:30
ADMIN_PASSWORD=paparazzo2025!
EOF
echo -e "${GREEN}✓ Environment configurato${NC}"

# Step 6: Build applicazione
echo -e "${YELLOW}📦 Step 6: Build Next.js...${NC}"
npm install
npm run build
echo -e "${GREEN}✓ Build completato${NC}"

# Step 7: Setup PM2
echo -e "${YELLOW}📦 Step 7: Configurazione PM2...${NC}"
pm2 delete paparazzo 2>/dev/null || true
pm2 start npm --name "paparazzo" -- start
pm2 save
pm2 startup systemd -u root --hp /root
echo -e "${GREEN}✓ PM2 configurato${NC}"

# Step 8: Configurazione Nginx
echo -e "${YELLOW}📦 Step 8: Configurazione Nginx...${NC}"
cat > /etc/nginx/sites-available/paparazzo << 'EOF'
server {
    listen 80;
    server_name 188.245.216.184 paparazzoparrucchieri.it www.paparazzoparrucchieri.it;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    location /images/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
EOF

ln -sf /etc/nginx/sites-available/paparazzo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
echo -e "${GREEN}✓ Nginx configurato${NC}"

# Step 9: Setup Cron Job Blog
echo -e "${YELLOW}📦 Step 9: Configurazione Cron Job Blog...${NC}"
mkdir -p /var/www/paparazzo/paparazzo/logs
chmod +x /var/www/paparazzo/paparazzo/scripts/cron-blog-generator.sh
(crontab -l 2>/dev/null | grep -v "cron-blog-generator.sh"; echo "30 9 * * 1,3,5 cd /var/www/paparazzo/paparazzo && /bin/bash /var/www/paparazzo/paparazzo/scripts/cron-blog-generator.sh >> /var/www/paparazzo/paparazzo/logs/cron.log 2>&1") | crontab -
echo -e "${GREEN}✓ Cron Job configurato${NC}"

# Step 10: Firewall
echo -e "${YELLOW}📦 Step 10: Configurazione Firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "${GREEN}✓ Firewall configurato${NC}"
fi

# Test finale
echo -e "${YELLOW}🧪 Test finale...${NC}"
sleep 5
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Applicazione funzionante su porta 3000${NC}"
else
    echo -e "${RED}✗ Errore: applicazione non risponde${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 DEPLOY COMPLETATO CON SUCCESSO! 🎉${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📊 Informazioni:"
echo "   🌐 URL: http://188.245.216.184"
echo "   📂 Path: /var/www/paparazzo/paparazzo"
echo "   🔄 PM2: pm2 status"
echo "   📝 Logs: pm2 logs paparazzo"
echo "   📅 Cron: crontab -l"
echo ""
echo "📚 Comandi utili:"
echo "   pm2 status              # Stato applicazione"
echo "   pm2 logs paparazzo      # Logs in tempo reale"
echo "   pm2 restart paparazzo   # Riavvia app"
echo "   systemctl status nginx  # Stato Nginx"
echo "   tail -f /var/www/paparazzo/paparazzo/logs/cron.log  # Logs blog"
echo ""
