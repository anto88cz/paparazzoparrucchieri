# 🚀 Guida Deploy VPS - Paparazzo Parrucchieri

## Prerequisiti

### Sul tuo PC (Windows):
- ✅ Git installato
- ✅ Accesso SSH al VPS
- ✅ Repository GitHub configurato

### Sul VPS:
- Ubuntu 20.04+ / Debian 11+
- Minimo 1GB RAM, 1 vCPU
- Dominio puntato al VPS: **paparazzoparrucchieri.it**
- Accesso root o sudo

---

## 📦 STEP 1: Push su GitHub

### 1.1 Inizializza Git (se non fatto):
```bash
cd C:\Users\Utente\Desktop\bot\paparazzo
git init
git add .
git commit -m "Initial commit - Paparazzo AI Color System"
```

### 1.2 Connetti a GitHub:
```bash
git remote add origin https://github.com/anto88cz/styleai-salone.git
git branch -M main
git push -u origin main
```

> **Nota:** Se chiede username/password, usa un **Personal Access Token** invece della password.
> Crea token qui: https://github.com/settings/tokens

---

## 🖥️ STEP 2: Connessione al VPS

```bash
ssh root@YOUR_VPS_IP
# oppure
ssh username@YOUR_VPS_IP
```

---

## ⚙️ STEP 3: Setup Automatico VPS

### 3.1 Clona il repository:
```bash
cd /var/www
git clone https://github.com/anto88cz/styleai-salone.git paparazzo-salon
cd paparazzo-salon
```

### 3.2 Esegui lo script di setup:
```bash
chmod +x deploy/vps-setup.sh
sudo ./deploy/vps-setup.sh
```

Lo script installerà automaticamente:
- ✅ Node.js (LTS)
- ✅ PM2 (Process Manager)
- ✅ Nginx (Web Server)
- ✅ Configurazione SSL (Certbot)
- ✅ Cron job per blog automation

---

## 🔐 STEP 4: Configurazione Environment Variables

Modifica il file `.env.local`:

```bash
cd /var/www/paparazzo-salon
nano .env.local
```

Inserisci le tue variabili (copia da locale):

```env
# Google Cloud Vision API
GOOGLE_VISION_API_KEY=AIzaSyA9cgdNrifDcnfhC2ZAGY-bOl1TLCKzgKA
GOOGLE_CLOUD_PROJECT_ID=gen-lang-client-0783211476

# DeepSeek API
DEEPSEEK_API_KEY=sk-7dc7d085aaa948bbb17fe1bff0bf927f
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL_TEXT=deepseek-chat

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://paparazzoparrucchieri.it
BUSINESS_WHATSAPP=+393392399044
BUSINESS_PHONE=+393392399044
BUSINESS_EMAIL=info@paparazzoparrucchieri.it

# Blog Auto
BLOG_AUTO_PUBLISH=true
BLOG_POSTS_PER_WEEK=3
BLOG_PUBLISH_DAYS=1,3,5
BLOG_PUBLISH_TIME=09:30

NODE_ENV=production
```

Salva con `CTRL+X` → `Y` → `ENTER`

---

## 🔨 STEP 5: Build Produzione

```bash
npm install
npm run build
```

---

## 🚀 STEP 6: Avvio con PM2

```bash
pm2 start npm --name "paparazzo-app" -- start
pm2 save
pm2 startup
```

Verifica stato:
```bash
pm2 status
pm2 logs paparazzo-app
```

---

## 🌐 STEP 7: Configurazione Nginx

### 7.1 Crea configurazione Nginx:
```bash
sudo nano /etc/nginx/sites-available/paparazzo-salon
```

Incolla:
```nginx
server {
    listen 80;
    server_name paparazzoparrucchieri.it www.paparazzoparrucchieri.it;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
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

    # Upload size per AI Color Analysis
    client_max_body_size 10M;
}
```

### 7.2 Abilita sito:
```bash
sudo ln -s /etc/nginx/sites-available/paparazzo-salon /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 STEP 8: SSL con Certbot (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d paparazzoparrucchieri.it -d www.paparazzoparrucchieri.it
```

Segui il wizard e seleziona:
- Email per notifiche
- Accetta Terms of Service
- Redirect HTTP → HTTPS: **Yes**

---

## ⏰ STEP 9: Cron Job per Blog Automation

### 9.1 Crea script cron:
```bash
sudo nano /usr/local/bin/paparazzo-blog-cron.sh
```

Incolla:
```bash
#!/bin/bash

# Configurazione
PROJECT_DIR="/var/www/paparazzo-salon"
LOG_FILE="/var/log/paparazzo-blog-auto.log"
NODE_PATH="/usr/bin/node"
NPM_PATH="/usr/bin/npm"

# Logging
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting blog generation..." >> $LOG_FILE

# Vai nella directory del progetto
cd $PROJECT_DIR

# Esegui script generazione blog
$NODE_PATH scripts/generate-blog-post.js >> $LOG_FILE 2>&1

# Log completamento
if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Blog post generated successfully" >> $LOG_FILE
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Blog generation failed" >> $LOG_FILE
fi
```

### 9.2 Rendi eseguibile:
```bash
sudo chmod +x /usr/local/bin/paparazzo-blog-cron.sh
```

### 9.3 Aggiungi a crontab:
```bash
crontab -e
```

Aggiungi questa riga (esegue Lunedì, Mercoledì, Venerdì alle 9:30):
```bash
30 9 * * 1,3,5 /usr/local/bin/paparazzo-blog-cron.sh
```

---

## 🔍 STEP 10: Verifica Deploy

### 10.1 Controlla PM2:
```bash
pm2 status
pm2 logs paparazzo-app --lines 50
```

### 10.2 Controlla Nginx:
```bash
sudo systemctl status nginx
sudo nginx -t
```

### 10.3 Test nel browser:
```
https://paparazzoparrucchieri.it
```

### 10.4 Test AI Color Analysis:
```
https://paparazzoparrucchieri.it/ai-color
```

---

## 📊 Comandi Utili Post-Deploy

### Restart applicazione:
```bash
pm2 restart paparazzo-app
```

### Aggiorna codice da GitHub:
```bash
cd /var/www/paparazzo-salon
git pull origin main
npm install
npm run build
pm2 restart paparazzo-app
```

### Visualizza logs:
```bash
pm2 logs paparazzo-app
tail -f /var/log/paparazzo-blog-auto.log
```

### Monitor risorse:
```bash
pm2 monit
htop
```

### Backup database leads:
```bash
cp /var/www/paparazzo-salon/data/leads.json /var/backups/leads-$(date +%Y%m%d).json
```

---

## 🆘 Troubleshooting

### Applicazione non parte:
```bash
pm2 logs paparazzo-app --err
cd /var/www/paparazzo-salon
npm run build
```

### Nginx errori:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### SSL non funziona:
```bash
sudo certbot renew --dry-run
sudo systemctl restart nginx
```

### AI Color Analysis lento:
- Aumenta timeout Nginx (già configurato a 300s)
- Verifica memoria: `free -h`
- Scala PM2 instances: `pm2 scale paparazzo-app 2`

---

## 📈 Ottimizzazioni Post-Deploy

### 1. Redis per caching (opzionale):
```bash
sudo apt install redis-server -y
sudo systemctl enable redis-server
```

### 2. Monitoring con PM2 Plus:
```bash
pm2 link YOUR_SECRET_KEY YOUR_PUBLIC_KEY
```

### 3. Backup automatico settimanale:
```bash
echo "0 2 * * 0 tar -czf /var/backups/paparazzo-$(date +\%Y\%m\%d).tar.gz /var/www/paparazzo-salon/data" | crontab -
```

---

## ✅ Checklist Finale

- [ ] Applicazione accessibile via HTTPS
- [ ] AI Color Analysis funzionante
- [ ] SSL certificato attivo
- [ ] PM2 auto-restart configurato
- [ ] Blog automation attiva
- [ ] Backup configurato
- [ ] Logs monitorabili
- [ ] Google Analytics configurato
- [ ] WhatsApp buttons funzionanti
- [ ] Admin panel accessibile

---

## 🎉 Deploy Completato!

Il tuo sito è ora live su: **https://paparazzoparrucchieri.it** 🚀

Per supporto: anto88cz
