# Guida all'Installazione del Sistema Automatico di Blog

## 📋 Panoramica
Questo sistema automatico genera blog post utilizzando l'AI di DeepSeek secondo la programmazione configurata nel tuo `.env.local`:
- **Frequenza**: 3 post a settimana
- **Giorni**: Lunedì, Mercoledì, Venerdì
- **Orario**: 09:30

## 🪟 Installazione su Windows (Task Scheduler)

### Metodo 1: Importa file XML (Raccomandato)
1. Apri **Task Scheduler** (Utilità di pianificazione)
   - Premi `Win + R`, digita `taskschd.msc` e premi Invio

2. Nel pannello di destra, clicca **"Importa attività..."**

3. Seleziona il file: `C:\Users\Utente\styleai-salone\paparazzo\scripts\windows-task-scheduler.xml`

4. Modifica il nome dell'attività se necessario (es. "Blog Auto Generator")

5. Clicca **"OK"** per salvare

### Metodo 2: Creazione manuale
1. Apri **Task Scheduler**

2. Clicca **"Crea attività di base..."**

3. **Nome**: `Blog Auto Generator`
   **Descrizione**: `Genera automaticamente blog post per il salone`

4. **Trigger**: Seleziona "Settimanale"
   - **Ora**: 09:30
   - **Giorni**: Lunedì, Mercoledì, Venerdì

5. **Azione**: "Avvia un programma"
   - **Programma**: `C:\Windows\System32\cmd.exe`
   - **Argomenti**: `/c "C:\Users\Utente\styleai-salone\paparazzo\scripts\cron-blog-generator.bat"`
   - **Directory**: `C:\Users\Utente\styleai-salone\paparazzo`

6. Clicca **"Fine"**

### Metodo 3: PowerShell (Avanzato)
```powershell
# Esegui PowerShell come Amministratore
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument '/c "C:\Users\Utente\styleai-salone\paparazzo\scripts\cron-blog-generator.bat"' -WorkingDirectory "C:\Users\Utente\styleai-salone\paparazzo"

$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Wednesday,Friday -At 9:30AM

Register-ScheduledTask -TaskName "Blog Auto Generator" -Action $action -Trigger $trigger -Description "Genera blog post automaticamente"
```

## 🐧 Installazione su Linux/macOS (Cron)

### 1. Rendi eseguibile lo script
```bash
chmod +x /path/to/your/project/scripts/cron-blog-generator.sh
```

### 2. Modifica il crontab
```bash
crontab -e
```

### 3. Aggiungi una delle seguenti righe:

**Opzione A - Controllo ogni minuto (raccomandato):**
```bash
* * * * * /bin/bash /path/to/your/project/scripts/cron-blog-generator.sh
```

**Opzione B - Esecuzione diretta negli orari:**
```bash
30 9 * * 1,3,5 /bin/bash /path/to/your/project/scripts/cron-blog-generator.sh
```

### 4. Salva e chiudi l'editor

### 5. Verifica il crontab
```bash
crontab -l
```

## 🔧 Configurazione e Test

### Variabili d'Ambiente Richieste (.env.local)
Assicurati che il tuo `.env.local` contenga:
```env
DEEPSEEK_API_KEY=sk-a00da698d8e74c3893ed8733e9a2a25a
BLOG_AUTO_GENERATION=true
BLOG_POSTS_PER_WEEK=3
BLOG_GENERATION_DAYS=1,3,5
BLOG_GENERATION_TIME=09:30
ADMIN_PASSWORD=paparazzo2025!
```

### Test Manuale
**Windows:**
```cmd
C:\Users\Utente\styleai-salone\paparazzo\scripts\cron-blog-generator.bat
```

**Linux/macOS:**
```bash
/path/to/your/project/scripts/cron-blog-generator.sh
```

### Verifica Logs
I log vengono salvati in:
- **Windows**: `C:\Users\Utente\styleai-salone\paparazzo\logs\blog-auto-generator.log`
- **Linux/macOS**: `/path/to/your/project/logs/blog-auto-generator.log`

## 📊 Monitoraggio

### Controllo Ultimo Log
**Windows:**
```cmd
type "C:\Users\Utente\styleai-salone\paparazzo\logs\blog-auto-generator.log" | findstr /C:"[INFO]" | more
```

**Linux/macOS:**
```bash
tail -f /path/to/your/project/logs/blog-auto-generator.log
```

### Stato dell'Attività (Windows)
1. Apri **Task Scheduler**
2. Trova "Blog Auto Generator" nella lista
3. Controlla **"Ultima esecuzione"** e **"Prossima esecuzione"**

### Stato Cron (Linux/macOS)
```bash
# Verifica se cron è attivo
systemctl status cron

# Controlla i log di sistema
grep CRON /var/log/syslog | tail -10
```

## 🚨 Risoluzione Problemi

### Problema: Script non si avvia
- **Windows**: Controlla che cmd.exe abbia i permessi
- **Linux/macOS**: Verifica i permessi di esecuzione (`chmod +x`)

### Problema: Errori di rete
- Controlla la connessione internet
- Verifica che l'API key di DeepSeek sia valida

### Problema: File non trovati
- Controlla che tutti i percorsi negli script siano corretti
- Verifica che Node.js sia installato e accessibile

### Problema: Encoding caratteri
- Assicurati che il terminale supporti UTF-8
- Su Windows, usa `chcp 65001` prima di eseguire

## 📈 Personalizzazione

### Cambiare l'orario di generazione
Modifica la variabile `BLOG_GENERATION_TIME` nel file `.env.local`:
```env
BLOG_GENERATION_TIME=14:30  # Per le 14:30
```

### Cambiare i giorni
Modifica `BLOG_GENERATION_DAYS`:
```env
BLOG_GENERATION_DAYS=2,4,6  # Martedì, Giovedì, Sabato
```
(1=Lunedì, 2=Martedì, 3=Mercoledì, 4=Giovedì, 5=Venerdì, 6=Sabato, 0=Domenica)

### Cambiare la frequenza
```env
BLOG_POSTS_PER_WEEK=5  # 5 post a settimana
```

## ✅ Checklist Post-Installazione

- [ ] Script batch/shell creati e con permessi corretti
- [ ] Task Scheduler/Cron configurato
- [ ] File `.env.local` configurato correttamente
- [ ] Test manuale eseguito con successo
- [ ] Directory logs creata
- [ ] Monitoraggio attivo

Il tuo sistema di blog automatico è ora pronto! 🎉