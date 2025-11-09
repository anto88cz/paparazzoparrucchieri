# =============================================================================
# GUIDA DEPLOY SU VPS - Paparazzo Hair Salon
# =============================================================================

## 🚀 Deploy Automatico su VPS Linux

### **Prerequisiti VPS**
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- Minimo 1GB RAM, 1 CPU
- Accesso root o sudo
- Dominio puntato al VPS

### **1. Connessione al VPS**
```bash
ssh root@your-vps-ip
# oppure
ssh username@your-vps-ip
```

### **2. Upload dei File**
```bash
# Opzione A: Via SCP
scp -r C:\Users\Utente\styleai-salone username@your-vps-ip:/tmp/

# Opzione B: Via Git (raccomandato)
# Prima pusha il progetto su GitHub, poi:
git clone https://github.com/your-username/styleai-salone.git
```

### **3. Esecuzione Setup Automatico**
```bash
cd styleai-salone/paparazzo
chmod +x deploy/vps-setup.sh
sudo ./deploy/vps-setup.sh
```

## ⚙️ Configurazione Manuale (se preferisci)

### **Step 1: Aggiorna il Sistema**
```bash
sudo apt update && sudo apt upgrade -y
```

### **Step 2: Installa Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **Step 3: Installa PM2 e Nginx**
```bash
sudo npm install -g pm2
sudo apt install -y nginx
```

### **Step 4: Setup Progetto**
```bash
sudo mkdir -p /var/www/paparazzo-salon
sudo chown -R $USER:$USER /var/www/paparazzo-salon
cd /var/www/paparazzo-salon
git clone https://github.com/your-username/styleai-salone.git .
cd paparazzo
npm install
npm run build
```

### **Step 5: Configurazione Environment**
```bash
nano .env.local
```
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
DEEPSEEK_API_KEY=sk-a00da698d8e74c3893ed8733e9a2a25a
BLOG_AUTO_GENERATION=true
BLOG_POSTS_PER_WEEK=3
BLOG_GENERATION_DAYS=1,3,5
BLOG_GENERATION_TIME=09:30
ADMIN_PASSWORD=paparazzo2025!
```

### **Step 6: PM2 Configuration**
```bash
nano ecosystem.config.js
```

### **Step 7: Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/paparazzo-salon
```

### **Step 8: Cron Job per Blog**
```bash
sudo nano /usr/local/bin/vps-blog-cron.sh
sudo chmod +x /usr/local/bin/vps-blog-cron.sh
echo "30 9 * * 1,3,5 /usr/local/bin/vps-blog-cron.sh" | sudo crontab -
```

### **Step 9: Avvio Applicazione**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Step 10: SSL Certificate**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Monitoraggio e Manutenzione

### **Controllo Stato Applicazione**
```bash
pm2 status
pm2 monit
pm2 logs paparazzo-app
```

### **Controllo Cron Job Blog**
```bash
# Verifica cron
sudo crontab -l

# Controllo log
tail -f /var/log/paparazzo-salon-blog-auto.log

# Test manuale
sudo /usr/local/bin/vps-blog-cron.sh
```

### **Aggiornamento Applicazione**
```bash
cd /var/www/paparazzo-salon/paparazzo
git pull origin main
npm install
npm run build
pm2 restart paparazzo-app
```

### **Backup Automatico**
```bash
# Crea script backup
sudo nano /usr/local/bin/backup-blog.sh
```

## 🚨 Troubleshooting

### **Problema: Sito non raggiungibile**
```bash
# Controllo Nginx
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx

# Controllo PM2
pm2 status
pm2 restart paparazzo-app
```

### **Problema: Blog non si generano**
```bash
# Controllo cron
sudo systemctl status cron
tail -f /var/log/paparazzo-salon-blog-auto.log

# Test API DeepSeek
curl -H "Authorization: Bearer sk-a00da698d8e74c3893ed8733e9a2a25a" \
     https://api.deepseek.com/v1/models
```

### **Problema: Permessi file**
```bash
sudo chown -R www-data:www-data /var/www/paparazzo-salon
sudo chmod -R 755 /var/www/paparazzo-salon
```

## 📊 Monitoring Setup

### **Logs Principali**
- **Applicazione**: `/var/log/paparazzo-salon-combined.log`
- **Blog Automation**: `/var/log/paparazzo-salon-blog-auto.log`  
- **Nginx Access**: `/var/log/nginx/access.log`
- **Nginx Error**: `/var/log/nginx/error.log`

### **Comandi Utili**
```bash
# Stato sistema
htop
df -h
free -h

# Stato servizi
sudo systemctl status nginx
sudo systemctl status cron
pm2 status

# Monitoring live
pm2 monit
tail -f /var/log/paparazzo-salon-blog-auto.log
```

## 🔒 Sicurezza

### **Firewall**
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### **Aggiornamenti Automatici**
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### **Backup Database Blog**
```bash
# Script backup settimanale
echo "0 2 * * 0 tar -czf /backups/blog-$(date +\%Y\%m\%d).tar.gz /var/www/paparazzo-salon/paparazzo/content" | sudo crontab -
```

## ✅ Checklist Post-Deploy

- [ ] Sito raggiungibile su dominio
- [ ] SSL Certificate attivo (https://)
- [ ] PM2 applicazione running
- [ ] Cron job blog automation attivo
- [ ] Logs funzionanti
- [ ] Admin panel accessibile e sicuro
- [ ] API DeepSeek funzionante
- [ ] Backup automatico configurato
- [ ] Firewall attivo
- [ ] Monitoring setup

Il tuo sito sarà live su **https://your-domain.com** con blog automation completa! 🎉