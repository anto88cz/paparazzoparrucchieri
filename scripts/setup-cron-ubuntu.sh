#!/bin/bash
# Script per configurare il cron job su VPS Ubuntu
# Esegui questo script dopo aver fatto il deploy sul server

echo "🚀 Configurazione Cron Job per Blog Auto-Generator"
echo "=================================================="

# Directory del progetto
PROJECT_DIR="/var/www/paparazzo"  # Modifica se necessario
SCRIPT_PATH="$PROJECT_DIR/scripts/cron-blog-generator.sh"

# Verifica che lo script esista
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Errore: Script non trovato in $SCRIPT_PATH"
    exit 1
fi

# Rendi eseguibile lo script
chmod +x "$SCRIPT_PATH"
echo "✅ Script reso eseguibile"

# Crea entry per crontab
# Lunedì, Mercoledì, Venerdì alle 09:30
CRON_ENTRY="30 9 * * 1,3,5 cd $PROJECT_DIR && /bin/bash $SCRIPT_PATH >> $PROJECT_DIR/logs/cron.log 2>&1"

# Controlla se il cron job esiste già
if crontab -l 2>/dev/null | grep -q "cron-blog-generator.sh"; then
    echo "⚠️  Cron job già esistente. Rimozione..."
    crontab -l | grep -v "cron-blog-generator.sh" | crontab -
fi

# Aggiungi il nuovo cron job
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

echo ""
echo "✅ Cron job configurato con successo!"
echo ""
echo "📅 Programmazione:"
echo "   - Lunedì ore 09:30"
echo "   - Mercoledì ore 09:30"
echo "   - Venerdì ore 09:30"
echo ""
echo "📝 Log file: $PROJECT_DIR/logs/cron.log"
echo ""
echo "🔍 Per verificare i cron job attivi:"
echo "   crontab -l"
echo ""
echo "🧪 Per testare manualmente lo script:"
echo "   cd $PROJECT_DIR && bash $SCRIPT_PATH"
echo ""
