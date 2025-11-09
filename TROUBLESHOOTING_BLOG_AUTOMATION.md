# 🚨 RISOLUZIONE PROBLEMA BLOG AUTOMATION

## Situazione
Il sito è stato lanciato la settimana scorsa ma **gli articoli del blog non vengono pubblicati automaticamente**.

## 📋 Diagnosi Rapida

### 1. Connettiti al VPS
```bash
ssh root@il-tuo-vps-ip
# oppure
ssh username@il-tuo-vps-ip
```

### 2. Vai alla directory del progetto
```bash
cd /var/www/paparazzo-salon/paparazzo
# oppure cerca il progetto se è in una directory diversa:
find /var/www -name "package.json" -path "*/paparazzo/*"
```

### 3. Esegui la diagnosi automatica
```bash
# Carica lo script di diagnosi
wget https://raw.githubusercontent.com/your-repo/paparazzo/main/scripts/diagnose-blog-automation.sh
chmod +x diagnose-blog-automation.sh
./diagnose-blog-automation.sh
```

**OPPURE** copia manualmente il file `scripts/diagnose-blog-automation.sh` sul VPS e eseguilo.

## 🔧 Soluzioni Automatiche

### Opzione 1: Script di Riparazione Automatica
```bash
# Carica lo script di riparazione
wget https://raw.githubusercontent.com/your-repo/paparazzo/main/scripts/fix-blog-automation.sh
chmod +x fix-blog-automation.sh
sudo ./fix-blog-automation.sh
```

### Opzione 2: Test Manuale Immediato
```bash
# Test di generazione manuale
wget https://raw.githubusercontent.com/your-repo/paparazzo/main/scripts/test-blog-generation.sh
chmod +x test-blog-generation.sh
./test-blog-generation.sh
```

## 🔍 Controlli Manuali

### 1. Verifica Cron Job
```bash
# Controlla se il cron job è configurato
crontab -l

# Dovrebbe mostrare qualcosa come:
# 30 9 * * 1,3,5 /usr/local/bin/vps-blog-cron.sh
```

### 2. Verifica Script Cron
```bash
# Controlla se lo script esiste
ls -la /usr/local/bin/vps-blog-cron.sh

# Dovrebbe essere eseguibile (-rwxr-xr-x)
```

### 3. Verifica Configurazione
```bash
cd /var/www/paparazzo-salon/paparazzo  # o la tua directory
cat .env.local | grep BLOG_
```

**Dovrebbe mostrare:**
```
BLOG_AUTO_GENERATION=true
BLOG_GENERATION_DAYS=1,3,5
BLOG_GENERATION_TIME=09:30
```

### 4. Verifica Log
```bash
# Controlla se ci sono log di esecuzione
tail -20 /var/log/paparazzo-salon-blog-auto.log
```

## 🛠️ Riparazione Manuale

### Se manca il Cron Job:
```bash
# Configura il cron job
echo "30 9 * * 1,3,5 /usr/local/bin/vps-blog-cron.sh" | crontab -
```

### Se manca lo Script Cron:
```bash
# Crea lo script cron (utilizza il contenuto dal file deploy/vps-setup.sh)
sudo nano /usr/local/bin/vps-blog-cron.sh
sudo chmod +x /usr/local/bin/vps-blog-cron.sh
```

### Se manca .env.local:
```bash
cd /var/www/paparazzo-salon/paparazzo
nano .env.local
```

Aggiungi:
```env
NEXT_PUBLIC_SITE_URL=https://paparazzoparrucchieri.it
NODE_ENV=production
DEEPSEEK_API_KEY=sk-a00da698d8e74c3893ed8733e9a2a25a
BLOG_AUTO_GENERATION=true
BLOG_POSTS_PER_WEEK=3
BLOG_GENERATION_DAYS=1,3,5
BLOG_GENERATION_TIME=09:30
ADMIN_PASSWORD=paparazzo2025!
```

## ✅ Test Finale

### Test Manuale Immediato
```bash
cd /var/www/paparazzo-salon/paparazzo
node scripts/generate-blog-post.js
```

Se funziona, dovresti vedere un nuovo file in `content/blog/`.

### Verifica Prossima Esecuzione
```bash
# Il cron job è configurato per: Lunedì, Mercoledì, Venerdì alle 09:30
# Controlla il log per la prossima esecuzione:
tail -f /var/log/paparazzo-salon-blog-auto.log
```

## 📅 Schedulazione

- **Giorni**: Lunedì (1), Mercoledì (3), Venerdì (5)  
- **Orario**: 09:30 (fuso orario del server)
- **Frequenza**: 3 post a settimana

## 🚨 Problemi Comuni

### 1. "Directory non trovata"
- Il progetto potrebbe essere in una directory diversa
- Cerca con: `find /var/www -name "package.json" -path "*/paparazzo/*"`

### 2. "API Key non funziona"  
- Verifica che `DEEPSEEK_API_KEY` sia corretta nel file `.env.local`
- Testa manualmente: `node scripts/generate-blog-post.js`

### 3. "Cron job non si esegue"
- Verifica che il servizio cron sia attivo: `sudo systemctl status cron`
- Controlla i permessi dello script: `ls -la /usr/local/bin/vps-blog-cron.sh`

### 4. "Post già generato oggi"
- Il sistema evita duplicati
- Per forzare un nuovo post, elimina i post di oggi e riesegui

## 📞 Supporto Rapido

**Se hai ancora problemi**, esegui questo comando e invia l'output:

```bash
# Raccolta informazioni per debug
echo "=== DIAGNOSTICA COMPLETA ===" > debug.log
echo "Data: $(date)" >> debug.log
echo "Directory corrente: $(pwd)" >> debug.log
echo "" >> debug.log
echo "=== CRONTAB ===" >> debug.log
crontab -l >> debug.log 2>&1
echo "" >> debug.log
echo "=== SCRIPT CRON ===" >> debug.log
ls -la /usr/local/bin/vps-blog-cron.sh >> debug.log 2>&1
echo "" >> debug.log
echo "=== ENV LOCAL ===" >> debug.log
cat .env.local | grep -v "API_KEY\|PASSWORD" >> debug.log 2>&1
echo "" >> debug.log
echo "=== LOG ===" >> debug.log
tail -20 /var/log/paparazzo-salon-blog-auto.log >> debug.log 2>&1
echo "" >> debug.log
echo "=== BLOG POSTS ===" >> debug.log
ls -la content/blog/ | tail -10 >> debug.log 2>&1

cat debug.log
```

## ⚡ Soluzione Veloce (1 minuto)

Se vuoi una soluzione rapida senza diagnosi:

```bash
# 1. Vai al progetto
cd /var/www/paparazzo-salon/paparazzo

# 2. Esegui riparazione automatica
curl -s https://raw.githubusercontent.com/your-repo/paparazzo/main/scripts/fix-blog-automation.sh | sudo bash

# 3. Test immediato
node scripts/generate-blog-post.js
```

**Se questo funziona, il problema è risolto! 🎉**