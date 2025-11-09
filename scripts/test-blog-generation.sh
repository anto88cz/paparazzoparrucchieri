#!/bin/bash

# =============================================================================
# Script per Test Manuale Blog Generation su VPS
# =============================================================================
# Questo script testa manualmente la generazione di un blog post
# senza attendere il cron job

echo "🧪 TEST MANUALE BLOG GENERATION"
echo "==============================="
echo "Data: $(date)"
echo ""

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/var/www/paparazzo-salon/paparazzo"

# Trova il progetto se non è nella posizione standard
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}🔍 Ricerca directory progetto...${NC}"
    FOUND_DIR=$(find /var/www -name "package.json" -path "*/paparazzo/*" 2>/dev/null | head -1 | dirname)
    if [ -n "$FOUND_DIR" ]; then
        PROJECT_DIR="$FOUND_DIR"
        echo -e "✅ Progetto trovato in: $PROJECT_DIR"
    else
        echo -e "${RED}❌ Progetto non trovato. Uscita.${NC}"
        exit 1
    fi
fi

cd "$PROJECT_DIR"
echo "📁 Directory di lavoro: $(pwd)"
echo ""

# =============================================================================
# 1. CONTROLLO PREREQUISITI
# =============================================================================
echo -e "${BLUE}1. CONTROLLO PREREQUISITI${NC}"

# Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo -e "${RED}❌ Node.js non installato${NC}"
    exit 1
fi

# File .env.local
if [ -f ".env.local" ]; then
    echo "✅ File .env.local presente"
    source .env.local
else
    echo -e "${RED}❌ File .env.local mancante${NC}"
    exit 1
fi

# Script di generazione
if [ -f "scripts/generate-blog-post.js" ]; then
    echo "✅ Script di generazione presente"
else
    echo -e "${RED}❌ Script di generazione mancante${NC}"
    exit 1
fi

# API Key
if [ -n "$DEEPSEEK_API_KEY" ]; then
    echo "✅ API Key DeepSeek configurata"
else
    echo -e "${RED}❌ API Key DeepSeek mancante${NC}"
    exit 1
fi

echo ""

# =============================================================================
# 2. STATO PRE-GENERAZIONE
# =============================================================================
echo -e "${BLUE}2. STATO ATTUALE BLOG${NC}"

if [ -d "content/blog" ]; then
    total_posts=$(find content/blog -name "*.md" | wc -l)
    echo "📊 Articoli totali: $total_posts"
    
    # Ultimi 3 articoli
    echo "📄 Ultimi 3 articoli:"
    find content/blog -name "*.md" -printf '%T+ %p\n' | sort -r | head -3 | while read line; do
        filename=$(echo "$line" | awk '{print $2}' | xargs basename)
        date_part=$(echo "$line" | awk '{print $1}' | cut -d'T' -f1)
        echo "   - $filename ($date_part)"
    done
else
    echo "📁 Directory blog non trovata, verrà creata"
fi

echo ""

# =============================================================================
# 3. GENERAZIONE TEST
# =============================================================================
echo -e "${BLUE}3. GENERAZIONE POST TEST${NC}"
echo "🚀 Avvio generazione..."

# Backup del contatore se esiste per non interferire con il normale funzionamento
if [ -f ".blog-counter" ]; then
    cp .blog-counter .blog-counter.backup
    echo "💾 Backup contatore creato"
fi

# Esegui la generazione
start_time=$(date +%s)
if node scripts/generate-blog-post.js; then
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    echo -e "\n${GREEN}✅ GENERAZIONE COMPLETATA${NC}"
    echo "⏱️  Tempo impiegato: ${duration}s"
else
    echo -e "\n${RED}❌ GENERAZIONE FALLITA${NC}"
    # Ripristina backup se necessario
    if [ -f ".blog-counter.backup" ]; then
        mv .blog-counter.backup .blog-counter
        echo "🔄 Contatore ripristinato"
    fi
    exit 1
fi

echo ""

# =============================================================================
# 4. VERIFICA RISULTATI
# =============================================================================
echo -e "${BLUE}4. VERIFICA RISULTATI${NC}"

# Controlla se è stato creato un nuovo post
new_total_posts=$(find content/blog -name "*.md" | wc -l)
posts_difference=$((new_total_posts - total_posts))

if [ "$posts_difference" -gt 0 ]; then
    echo -e "${GREEN}✅ Nuovo post creato!${NC}"
    echo "📊 Articoli totali: $new_total_posts (+$posts_difference)"
    
    # Mostra il nuovo post
    echo "📄 Nuovo post:"
    newest_post=$(find content/blog -name "*.md" -printf '%T+ %p\n' | sort -r | head -1 | awk '{print $2}')
    if [ -n "$newest_post" ]; then
        filename=$(basename "$newest_post")
        echo "   - $filename"
        
        # Mostra le prime righe del post
        echo -e "\n📖 Prime righe del nuovo post:"
        head -10 "$newest_post" | sed 's/^/   /'
    fi
else
    echo -e "${YELLOW}⚠️  Nessun nuovo post generato${NC}"
    echo "   Possibili cause:"
    echo "   - Post già generato oggi"
    echo "   - Errore nell'API DeepSeek"
    echo "   - Configurazione incorretta"
fi

echo ""

# =============================================================================
# 5. TEST BUILD (se Next.js è configurato)
# =============================================================================
echo -e "${BLUE}5. TEST BUILD${NC}"
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    echo "🔨 Test build Next.js..."
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build completata con successo${NC}"
    else
        echo -e "${YELLOW}⚠️  Build fallita (normale in ambiente di test)${NC}"
    fi
else
    echo "⏭️  Skip build test (package.json non configurato)"
fi

echo ""

# =============================================================================
# 6. CLEANUP E RIEPILOGO
# =============================================================================
echo -e "${BLUE}6. CLEANUP${NC}"

# Rimuovi backup se tutto è andato bene
if [ -f ".blog-counter.backup" ]; then
    rm .blog-counter.backup
    echo "🗑️  Backup temporaneo rimosso"
fi

echo ""
echo -e "${GREEN}🎉 TEST COMPLETATO${NC}"
echo "===================="
if [ "$posts_difference" -gt 0 ]; then
    echo -e "${GREEN}✅ SUCCESSO: Nuovo post generato${NC}"
    echo "📁 File: $newest_post"
    echo ""
    echo -e "${BLUE}Prossimi passi:${NC}"
    echo "1. Verifica il contenuto del post"
    echo "2. Se tutto è OK, il cron job funzionerà correttamente"
    echo "3. Controlla il log: tail -f /var/log/paparazzo-salon-blog-auto.log"
else
    echo -e "${YELLOW}⚠️  ATTENZIONE: Nessun nuovo post generato${NC}"
    echo ""
    echo -e "${BLUE}Possibili soluzioni:${NC}"
    echo "1. Controlla il file .env.local"
    echo "2. Verifica la connessione internet"
    echo "3. Testa l'API DeepSeek manualmente"
    echo "4. Controlla i log per errori dettagliati"
fi

echo ""
echo -e "${BLUE}Per monitoraggio continuo:${NC}"
echo "- Log automation: tail -f /var/log/paparazzo-salon-blog-auto.log"
echo "- Cron jobs attivi: crontab -l"
echo "- Test manuale: cd $PROJECT_DIR && node scripts/generate-blog-post.js"