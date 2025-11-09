# =============================================================================
# DEPLOYMENT CHECKLIST - Paparazzo Hair Salon VPS
# =============================================================================

## 📋 Pre-Deploy Checklist

### **Repository Setup**
- [ ] Codice pushato su GitHub repository
- [ ] Branch `main` aggiornato con latest changes  
- [ ] File `.env.local` rimosso dal repository (solo template)
- [ ] File `deploy/` creati e testati

### **VPS Preparazione**
- [ ] VPS attivo e accessibile via SSH
- [ ] Dominio configurato e DNS puntato al VPS
- [ ] Accesso root o sudo disponibile
- [ ] Connessione internet stabile sul VPS

### **Credenziali e API**
- [ ] API Key DeepSeek valida e testata
- [ ] Password admin modificata da default
- [ ] Email per notifiche configurata (opzionale)

## 🚀 Deploy Steps

### **Step 1: Connessione VPS**
```bash
ssh root@your-vps-ip
# o ssh username@your-vps-ip
```
- [ ] Connessione stabilita
- [ ] Accesso sudo verificato

### **Step 2: Download Setup Script**  
```bash
cd /tmp
wget https://raw.githubusercontent.com/your-username/styleai-salone/main/paparazzo/deploy/vps-setup.sh
chmod +x vps-setup.sh
```
- [ ] Script scaricato
- [ ] Permessi esecuzione impostati

### **Step 3: Modifica Configurazione**
```bash
nano vps-setup.sh
```
**Modifica le seguenti variabili:**
- [ ] `DOMAIN="your-actual-domain.com"`
- [ ] GitHub repository URL se diverso
- [ ] Project paths se necessario

### **Step 4: Esecuzione Setup Automatico**
```bash
sudo ./vps-setup.sh 2>&1 | tee setup.log
```
- [ ] Script eseguito senza errori
- [ ] Log salvato per troubleshooting

### **Step 5: Configurazione Environment**
```bash
cd /var/www/paparazzo-salon/paparazzo
nano .env.local
```
**Configura le variabili essenziali:**
- [ ] `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- [ ] `DEEPSEEK_API_KEY=sk-your-actual-api-key`
- [ ] `ADMIN_PASSWORD=your-secure-password`
- [ ] `BLOG_AUTO_GENERATION=true`

### **Step 6: Test Applicazione**
```bash
npm run build
pm2 start ecosystem.config.js
pm2 status
```
- [ ] Build completato senza errori
- [ ] PM2 applicazione running
- [ ] Nessun errore nei log: `pm2 logs`

### **Step 7: Configurazione SSL**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```
- [ ] Certificato SSL installato
- [ ] Redirect HTTPS funzionante
- [ ] Certificato valido (test: https://www.ssllabs.com/ssltest/)

### **Step 8: Test Sistema Completo**
- [ ] Sito raggiungibile su `https://your-domain.com`
- [ ] Homepage carica correttamente
- [ ] Gallery carousel funzionante
- [ ] Blog page accessibile
- [ ] Admin panel login funzionante
- [ ] API DeepSeek test: `curl -H "Authorization: Bearer your-api-key" https://api.deepseek.com/v1/models`

### **Step 9: Test Blog Automation**
```bash
# Test manuale generazione blog
sudo /usr/local/bin/vps-blog-cron.sh

# Verifica cron job
sudo crontab -l

# Controllo log automation
tail -f /var/log/paparazzo-salon-blog-auto.log
```
- [ ] Generazione blog manuale funzionante
- [ ] Cron job configurato (Lun/Mer/Ven 09:30)
- [ ] Log automation attivo

### **Step 10: Setup Monitoring**
```bash
# Test monitoring script
sudo /usr/local/bin/monitoring-backup.sh

# Aggiungi cron settimanale per monitoring
echo "0 2 * * 0 /usr/local/bin/monitoring-backup.sh" | sudo crontab -e
```
- [ ] Script monitoring funzionante  
- [ ] Backup automatico attivo
- [ ] Report sistema generato

## ✅ Post-Deploy Verification

### **Functional Testing**
- [ ] **Homepage**: Layout, immagini, testi corretti
- [ ] **Services Page**: Tutti i servizi visualizzati
- [ ] **Gallery**: Carousel funzionante per tutti i set immagini
- [ ] **Blog**: Lista post, singolo post leggibile
- [ ] **Contatti**: Informazioni corrette
- [ ] **Admin Panel**: Login, editing, salvataggio post

### **Performance Testing**  
- [ ] **PageSpeed**: Score >90 su mobile e desktop
- [ ] **Loading Time**: < 3 secondi primo caricamento
- [ ] **Images**: Tutte caricate e ottimizzate
- [ ] **SSL**: Certificato valido e A+ rating

### **SEO Testing**
- [ ] **Meta Tags**: Title, description per ogni pagina
- [ ] **Structured Data**: Schema.org per business
- [ ] **Sitemap**: Generato e accessibile
- [ ] **Robots.txt**: Configurato correttamente

### **Blog Automation Testing**
- [ ] **Generazione Automatica**: Test nei giorni programmati
- [ ] **Contenuto Qualità**: Post generati sono coerenti e utili
- [ ] **SEO Blog**: Meta tags, slug URL corretti
- [ ] **Admin Editing**: Possibilità modificare post generati

### **Security Testing**
- [ ] **HTTPS**: Forzato su tutto il sito
- [ ] **Admin Access**: Password protetto
- [ ] **API Endpoints**: Solo autenticati possono accedere
- [ ] **File Permissions**: Corretti su server
- [ ] **Firewall**: Attivo con regole appropriate

### **Monitoring & Backup**
- [ ] **System Health**: CPU, memoria, disco monitorati
- [ ] **Application Status**: PM2, Nginx status tracking
- [ ] **Blog Automation**: Log e errori tracciati
- [ ] **Backup Schedule**: Settimanale automatico
- [ ] **Log Rotation**: Automatic cleanup configurato

## 🚨 Troubleshooting Common Issues

### **Issue: Sito non raggiungibile**
```bash
# Check nginx
sudo systemctl status nginx
sudo nginx -t

# Check PM2
pm2 status
pm2 logs paparazzo-app

# Check firewall  
sudo ufw status
```

### **Issue: SSL Certificate Problems**
```bash
sudo certbot renew --dry-run
sudo nginx -t && sudo systemctl reload nginx
```

### **Issue: Blog Non Genera**
```bash
# Check cron
sudo systemctl status cron
sudo crontab -l

# Check API
curl -H "Authorization: Bearer your-api-key" https://api.deepseek.com/v1/models

# Check logs
tail -f /var/log/paparazzo-salon-blog-auto.log
```

### **Issue: Performance Slow**
```bash
# Check resources
htop
df -h
free -h

# Restart services
pm2 restart paparazzo-app
sudo systemctl restart nginx
```

## 📊 Success Metrics

### **Technical Metrics**
- [ ] **Uptime**: > 99.5%
- [ ] **Response Time**: < 2 seconds average
- [ ] **Error Rate**: < 0.1%
- [ ] **SSL Score**: A+ rating

### **Content Metrics** 
- [ ] **Blog Posts**: 3 per week automated
- [ ] **Content Quality**: Relevant to hair salon business
- [ ] **SEO Optimization**: All posts optimized

### **Business Metrics**
- [ ] **Website Traffic**: Tracking setup
- [ ] **Lead Generation**: Contact forms working
- [ ] **Local SEO**: Business info accurate

## 🎉 Go-Live Checklist

### **Final Verification**
- [ ] All tests passed
- [ ] Performance optimized  
- [ ] Security verified
- [ ] Backups working
- [ ] Monitoring active
- [ ] DNS propagated globally
- [ ] Google Search Console setup
- [ ] Google Analytics active (if configured)

### **Documentation**
- [ ] Admin credentials documented securely
- [ ] Monitoring procedures documented
- [ ] Backup/restore procedures tested
- [ ] Update procedures documented

### **Handover**
- [ ] Client training on admin panel completed
- [ ] Emergency contacts provided
- [ ] Maintenance schedule established
- [ ] Support procedures defined

---

**🚀 Your Paparazzo Hair Salon website is now LIVE!**

**Site URL**: https://your-domain.com  
**Admin Panel**: https://your-domain.com/admin  
**Blog Automation**: Active (Mon/Wed/Fri 09:30)  
**Monitoring**: Weekly reports generated  
**Backup**: Weekly automatic backup  

**Support**: All systems operational and ready for production! 🎊