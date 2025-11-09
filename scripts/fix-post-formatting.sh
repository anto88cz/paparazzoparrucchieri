#!/bin/bash

# =============================================================================
# Script di Correzione Post-Pubblicazione
# =============================================================================
# Questo script corregge automaticamente gli errori di formattazione 
# nei post pubblicati

echo "🔧 CORREZIONE POST-PUBBLICAZIONE"
echo "================================"
echo "Data: $(date)"
echo ""

PROJECT_DIR="/var/www/paparazzo"
BLOG_DIR="$PROJECT_DIR/content/blog"

if [ ! -d "$BLOG_DIR" ]; then
    echo "❌ Directory blog non trovata: $BLOG_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

echo "📁 Directory blog: $BLOG_DIR"
echo "📊 Post totali: $(find $BLOG_DIR -name '*.md' | wc -l)"
echo ""

# =============================================================================
# 1. CORREZIONE FRONTMATTER YAML
# =============================================================================
echo "🔧 1. CORREZIONE FRONTMATTER YAML"

# Trova file con frontmatter malformato
malformed_files=$(find "$BLOG_DIR" -name "*.md" -exec grep -l "^- --$" {} \;)
malformed_count=$(echo "$malformed_files" | grep -v '^$' | wc -l)

if [ "$malformed_count" -gt 0 ]; then
    echo "⚠️  Trovati $malformed_count file con frontmatter malformato"
    
    for file in $malformed_files; do
        echo "   🔧 Correggendo: $(basename "$file")"
        # Sostituisci - -- con ---
        sed -i 's/^- --$/---/g' "$file"
    done
    
    echo "✅ Frontmatter YAML corretti"
else
    echo "✅ Nessun problema di frontmatter trovato"
fi

# =============================================================================
# 2. CORREZIONE NOMI CON UNDERSCORE
# =============================================================================
echo ""
echo "🔧 2. CORREZIONE NOMI BUSINESS"

# Trova file con underscore nei nomi business
underscore_files=$(find "$BLOG_DIR" -name "*.md" -exec grep -l "Paparazzo_Parrucchieri\|Via_Formia_47_Catanzaro" {} \;)
underscore_count=$(echo "$underscore_files" | grep -v '^$' | wc -l)

if [ "$underscore_count" -gt 0 ]; then
    echo "⚠️  Trovati $underscore_count file con underscore nei nomi"
    
    for file in $underscore_files; do
        echo "   🔧 Correggendo nomi in: $(basename "$file")"
        # Correggi nome business
        sed -i 's/Paparazzo_Parrucchieri/Paparazzo Parrucchieri/g' "$file"
        # Correggi indirizzo
        sed -i 's/Via_Formia_47_Catanzaro/Via Formia 47, Catanzaro/g' "$file"
    done
    
    echo "✅ Nomi business corretti"
else
    echo "✅ Nessun problema di underscore trovato"
fi

# =============================================================================
# 3. VERIFICA LINK WHATSAPP
# =============================================================================
echo ""
echo "🔧 3. VERIFICA LINK WHATSAPP"

# Trova link WhatsApp potenzialmente spezzati
broken_wa_files=$(find "$BLOG_DIR" -name "*.md" -exec grep -l "\[https://wa.me.*\](" {} \;)
broken_wa_count=$(echo "$broken_wa_files" | grep -v '^$' | wc -l)

if [ "$broken_wa_count" -gt 0 ]; then
    echo "⚠️  Trovati $broken_wa_count file con possibili link WhatsApp spezzati"
    for file in $broken_wa_files; do
        echo "   ℹ️  Verificare manualmente: $(basename "$file")"
    done
else
    echo "✅ Link WhatsApp sembrano corretti"
fi

# =============================================================================
# 4. CONTROLLO GENERALE QUALITÀ
# =============================================================================
echo ""
echo "🔧 4. CONTROLLO QUALITÀ GENERALE"

total_issues=0

# Verifica titoli H1
files_without_h1=$(find "$BLOG_DIR" -name "*.md" -exec grep -L "^# " {} \;)
h1_issues=$(echo "$files_without_h1" | grep -v '^$' | wc -l)
total_issues=$((total_issues + h1_issues))

if [ "$h1_issues" -gt 0 ]; then
    echo "⚠️  $h1_issues file senza titolo H1"
else
    echo "✅ Tutti i file hanno titolo H1"
fi

# Verifica grassetto
files_without_bold=$(find "$BLOG_DIR" -name "*.md" -exec grep -L "\*\*.*\*\*" {} \;)
bold_issues=$(echo "$files_without_bold" | grep -v '^$' | wc -l)
total_issues=$((total_issues + bold_issues))

if [ "$bold_issues" -gt 0 ]; then
    echo "⚠️  $bold_issues file senza grassetto"
else
    echo "✅ Tutti i file hanno formattazione grassetto"
fi

# =============================================================================
# 5. REBUILD E RESTART (se ci sono state correzioni)
# =============================================================================
if [ "$malformed_count" -gt 0 ] || [ "$underscore_count" -gt 0 ]; then
    echo ""
    echo "🔨 5. REBUILD E RESTART"
    
    echo "📦 Building Next.js..."
    if npm run build > /dev/null 2>&1; then
        echo "✅ Build completato"
        
        echo "🔄 Restarting PM2..."
        if pm2 restart paparazzo > /dev/null 2>&1; then
            echo "✅ PM2 riavviato"
        else
            echo "⚠️  Errore riavvio PM2"
        fi
    else
        echo "❌ Errore nel build"
    fi
else
    echo ""
    echo "ℹ️  Nessuna correzione applicata, skip rebuild"
fi

# =============================================================================
# 6. RIEPILOGO
# =============================================================================
echo ""
echo "📊 RIEPILOGO CORREZIONI"
echo "======================="
echo "✅ Frontmatter YAML corretti: $malformed_count"
echo "✅ Nomi business corretti: $underscore_count" 
echo "ℹ️  Link WhatsApp da verificare: $broken_wa_count"
echo "⚠️  Problemi qualità rimanenti: $total_issues"
echo ""

if [ "$total_issues" -eq 0 ]; then
    echo "🎉 TUTTI I POST SONO CORRETTI!"
else
    echo "⚠️  Alcuni problemi richiedono attenzione manuale"
fi

echo ""
echo "🌐 Controlla il sito: https://paparazzoparrucchieri.it/blog"

exit 0