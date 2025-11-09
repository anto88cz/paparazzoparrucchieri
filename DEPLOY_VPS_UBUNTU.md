# 🚀 Guida Deploy VPS Ubuntu - Paparazzo Parrucchieri

## 📋 Prerequisiti VPS
- Ubuntu 20.04 LTS o superiore
- Accesso root o sudo
- Dominio configurato (paparazzoparrucchieri.it)

## 🔧 Step 1: Installazione Dipendenze

```bash
# Aggiorna il sistema
sudo apt update && sudo apt upgrade -y

# Installa Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifica installazione
node --version  # Dovrebbe mostrare v18.x.x
npm --version

# Installa PM2 per gestione processi
sudo npm install -g pm2

# Installa Nginx
sudo apt install -y nginx

# Installa Git
sudo apt install -y git
```

## 📦 Step 2: Clone Repository

```bash
# Crea directory web
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/anto88cz/styleai-salone.git paparazzo
cd paparazzo

# Imposta permessi
sudo chown -R $USER:$USER /var/www/paparazzo
```

## 🔐 Step 3: Configurazione Environment

```bash
# Copia file environment
cp .env.production .env.local

# IMPORTANTE: Aggiungi la chiave API DeepSeek
nano .env.local

# Inserisci questa riga (premi i per edit mode):
DEEPSEEK_API_KEY=sk-7dc7d085aaa948bbb17fe1bff0bf927f

# Salva e esci (Ctrl+X, Y, Enter)
```

## 📝 Step 4: Build Next.js

```bash
# Installa dipendenze
npm install

# Build production
npm run build

# Testa l'applicazione
npm start
# Dovrebbe avviarsi su http://localhost:3000
# Premi Ctrl+C per fermare
```

## 🔄 Step 5: Configurazione PM2

```bash
# Avvia applicazione con PM2
pm2 start npm --name "paparazzo" -- start

# Configura PM2 per avvio automatico
pm2 startup
# Copia e esegui il comando che viene mostrato

pm2 save

# Verifica status
pm2 status
pm2 logs paparazzo
```

## 🌐 Step 6: Configurazione Nginx

```bash
# Crea file configurazione Nginx
sudo nano /etc/nginx/sites-available/paparazzo

# Incolla questa configurazione:
```

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
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Ottimizzazione per file statici
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
```

```bash
# Abilita il sito
sudo ln -s /etc/nginx/sites-available/paparazzo /etc/nginx/sites-enabled/

# Rimuovi default se esiste
sudo rm /etc/nginx/sites-enabled/default

# Testa configurazione
sudo nginx -t

# Riavvia Nginx
sudo systemctl restart nginx
```

## 🔒 Step 7: Configurazione SSL con Let's Encrypt

```bash
# Installa Certbot
sudo apt install -y certbot python3-certbot-nginx

# Ottieni certificato SSL
sudo certbot --nginx -d paparazzoparrucchieri.it -d www.paparazzoparrucchieri.it

# Segui le istruzioni
# Inserisci email per notifiche
# Accetta Terms of Service
# Scegli opzione 2: Redirect HTTP a HTTPS

# Rinnovo automatico (già configurato)
sudo certbot renew --dry-run
```

## ⏰ Step 8: Configurazione Cron Job Blog

```bash
# Crea directory logs
mkdir -p /var/www/paparazzo/logs

# Rendi eseguibile lo script di setup
chmod +x /var/www/paparazzo/scripts/setup-cron-ubuntu.sh

# Esegui setup cron
bash /var/www/paparazzo/scripts/setup-cron-ubuntu.sh

# Verifica cron job
crontab -l

# Dovresti vedere:
# 30 9 * * 1,3,5 cd /var/www/paparazzo && /bin/bash /var/www/paparazzo/scripts/cron-blog-generator.sh
```

## 🧪 Step 9: Test Completo

```bash
# 1. Testa l'applicazione
curl http://localhost:3000

# 2. Testa Nginx
curl http://paparazzoparrucchieri.it

# 3. Testa HTTPS
curl https://paparazzoparrucchieri.it

# 4. Testa generazione blog manuale
cd /var/www/paparazzo
bash scripts/cron-blog-generator.sh

# 5. Controlla logs
tail -f logs/cron.log
pm2 logs paparazzo
```

## 🔄 Step 10: Aggiornamenti Futuri

```bash
# Per aggiornare il sito dopo modifiche su GitHub:
cd /var/www/paparazzo

# Pull modifiche
git pull origin main

# Installa eventuali nuove dipendenze
npm install

# Rebuild
npm run build

# Riavvia PM2
pm2 restart paparazzo

# Verifica
pm2 logs paparazzo
```

## 📊 Monitoraggio

```bash
# Status PM2
pm2 status

# Logs in tempo reale
pm2 logs paparazzo --lines 100

# Monitoraggio risorse
pm2 monit

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs cron blog
tail -f /var/www/paparazzo/logs/cron.log
```

## 🛡️ Sicurezza (Opzionale ma Raccomandato)

```bash
# Configura Firewall
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable

# Disabilita password SSH (usa solo chiavi)
sudo nano /etc/ssh/sshd_config
# Imposta: PasswordAuthentication no
sudo systemctl restart sshd

# Installa Fail2Ban contro brute force
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📞 Troubleshooting

### Applicazione non si avvia
```bash
pm2 logs paparazzo
# Controlla errori e correggi .env.local
```

### Nginx non risponde
```bash
sudo nginx -t
sudo systemctl status nginx
```

### Blog non si genera
```bash
# Verifica permessi
ls -la /var/www/paparazzo/scripts/

# Testa manualmente
bash /var/www/paparazzo/scripts/cron-blog-generator.sh

# Controlla logs
tail -f /var/www/paparazzo/logs/cron.log
```

### Recensioni non funzionano
```bash
# Verifica permessi directory data
chmod 755 /var/www/paparazzo/data
chmod 644 /var/www/paparazzo/data/reviews.json

# Se non esiste, creala
mkdir -p /var/www/paparazzo/data
echo "[]" > /var/www/paparazzo/data/reviews.json
```

## ✅ Checklist Deploy

- [ ] Node.js 18+ installato
- [ ] Repository clonato
- [ ] .env.local configurato con DEEPSEEK_API_KEY
- [ ] npm install completato
- [ ] npm run build completato
- [ ] PM2 avviato e salvato
- [ ] Nginx configurato
- [ ] SSL Let's Encrypt attivo
- [ ] Cron job configurato
- [ ] Test homepage funzionante
- [ ] Test recensioni funzionante
- [ ] Test generazione blog manuale

## 🎉 Deploy Completato!

Il tuo sito è ora live su:
- 🌐 https://paparazzoparrucchieri.it
- 📝 Blog auto-generato 3x/settimana (Lun/Mer/Ven alle 09:30)
- ⭐ Sistema recensioni attivo
- 📱 Responsive e ottimizzato

---

**Supporto:** In caso di problemi, controlla sempre i logs con `pm2 logs paparazzo`
