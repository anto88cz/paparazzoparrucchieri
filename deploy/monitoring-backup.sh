#!/bin/bash

# =============================================================================
# SISTEMA DI MONITORING E BACKUP - Paparazzo Hair Salon
# =============================================================================
# Script per monitoraggio automatico e backup del sistema blog
# Da eseguire tramite cron job settimanale
# =============================================================================

set -e

# Configurazione
PROJECT_NAME="paparazzo-salon"
PROJECT_DIR="/var/www/$PROJECT_NAME/paparazzo"
BACKUP_DIR="/var/backups/$PROJECT_NAME"
LOG_FILE="/var/log/$PROJECT_NAME-monitoring.log"
BLOG_CONTENT_DIR="$PROJECT_DIR/content/blog"
ADMIN_EMAIL="admin@your-domain.com"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funzione di logging
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Funzione per inviare notifiche email (opzionale)
send_notification() {
    local subject="$1"
    local message="$2"
    
    if command -v mail >/dev/null 2>&1 && [ -n "$ADMIN_EMAIL" ]; then
        echo "$message" | mail -s "$subject" "$ADMIN_EMAIL"
    fi
}

# Funzione per controllo salute sistema
check_system_health() {
    log_message "[INFO] === Controllo salute sistema ==="
    
    # Controllo spazio disco
    local disk_usage=$(df /var | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 85 ]; then
        log_message "[WARNING] Spazio disco alto: ${disk_usage}%"
        send_notification "ALERT: Spazio disco alto" "Utilizzo disco: ${disk_usage}%"
    else
        log_message "[INFO] Spazio disco OK: ${disk_usage}%"
    fi
    
    # Controllo memoria
    local mem_usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    if [ "$mem_usage" -gt 90 ]; then
        log_message "[WARNING] Memoria alta: ${mem_usage}%"
        send_notification "ALERT: Memoria alta" "Utilizzo memoria: ${mem_usage}%"
    else
        log_message "[INFO] Memoria OK: ${mem_usage}%"
    fi
    
    # Controllo PM2
    if ! pm2 list | grep -q "paparazzo-app.*online"; then
        log_message "[ERROR] Applicazione PM2 non online"
        send_notification "CRITICAL: App offline" "L'applicazione paparazzo-app non è online"
        pm2 restart paparazzo-app
    else
        log_message "[INFO] Applicazione PM2 online"
    fi
    
    # Controllo Nginx
    if ! systemctl is-active --quiet nginx; then
        log_message "[ERROR] Nginx non attivo"
        send_notification "CRITICAL: Nginx offline" "Il server web Nginx non è attivo"
        sudo systemctl restart nginx
    else
        log_message "[INFO] Nginx attivo"
    fi
    
    # Controllo cron
    if ! systemctl is-active --quiet cron; then
        log_message "[ERROR] Servizio cron non attivo"
        send_notification "CRITICAL: Cron offline" "Il servizio cron non è attivo"
    else
        log_message "[INFO] Servizio cron attivo"
    fi
}

# Funzione per controllo blog automation
check_blog_automation() {
    log_message "[INFO] === Controllo blog automation ==="
    
    # Controlla ultimo post generato
    if [ -d "$BLOG_CONTENT_DIR" ]; then
        local last_post=$(find "$BLOG_CONTENT_DIR" -name "*.md" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
        if [ -n "$last_post" ]; then
            local last_post_date=$(stat -c %Y "$last_post")
            local current_date=$(date +%s)
            local days_ago=$(( (current_date - last_post_date) / 86400 ))
            
            if [ "$days_ago" -gt 4 ]; then
                log_message "[WARNING] Ultimo post generato $days_ago giorni fa"
                send_notification "ALERT: Blog automation" "Ultimo post generato $days_ago giorni fa"
            else
                log_message "[INFO] Ultimo post generato $days_ago giorni fa"
            fi
            
            log_message "[INFO] Ultimo post: $(basename "$last_post")"
        else
            log_message "[WARNING] Nessun post trovato nella directory blog"
        fi
        
        # Conta totale post
        local total_posts=$(find "$BLOG_CONTENT_DIR" -name "*.md" -type f | wc -l)
        log_message "[INFO] Totale post nel blog: $total_posts"
    else
        log_message "[ERROR] Directory blog non trovata: $BLOG_CONTENT_DIR"
    fi
    
    # Controlla log automation
    local blog_log="/var/log/$PROJECT_NAME-blog-auto.log"
    if [ -f "$blog_log" ]; then
        local last_success=$(grep -n "SUCCESS.*generato con successo" "$blog_log" | tail -1 | cut -d: -f1)
        local last_error=$(grep -n "ERROR" "$blog_log" | tail -1 | cut -d: -f1)
        
        if [ -n "$last_error" ] && [ "$last_error" -gt "${last_success:-0}" ]; then
            log_message "[WARNING] Errori recenti nell'automation blog"
            local error_line=$(sed -n "${last_error}p" "$blog_log")
            log_message "[INFO] Ultimo errore: $error_line"
        fi
    fi
}

# Funzione per backup completo
perform_backup() {
    log_message "[INFO] === Avvio backup completo ==="
    
    # Crea directory backup se non esistente
    mkdir -p "$BACKUP_DIR"
    
    local backup_date=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/backup_${backup_date}.tar.gz"
    
    # Backup del progetto completo
    log_message "[INFO] Creazione backup: $backup_file"
    
    if tar -czf "$backup_file" \
        -C "$(dirname "$PROJECT_DIR")" \
        --exclude="node_modules" \
        --exclude=".next" \
        --exclude="logs" \
        --exclude=".git" \
        "$(basename "$PROJECT_DIR")"; then
        
        log_message "[SUCCESS] Backup creato: $(du -h "$backup_file" | cut -f1)"
        
        # Backup database blog separato (più leggero)
        local blog_backup="$BACKUP_DIR/blog_content_${backup_date}.tar.gz"
        tar -czf "$blog_backup" -C "$PROJECT_DIR" content/blog
        log_message "[INFO] Backup contenuti blog: $(du -h "$blog_backup" | cut -f1)"
        
    else
        log_message "[ERROR] Errore nella creazione del backup"
        send_notification "ERROR: Backup failed" "Errore nella creazione del backup"
        return 1
    fi
    
    # Pulizia backup vecchi (mantieni ultimi 30 giorni)
    log_message "[INFO] Pulizia backup vecchi..."
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +30 -delete
    find "$BACKUP_DIR" -name "blog_content_*.tar.gz" -mtime +7 -delete
    
    local backup_count=$(find "$BACKUP_DIR" -name "backup_*.tar.gz" | wc -l)
    log_message "[INFO] Backup totali conservati: $backup_count"
}

# Funzione per ottimizzazione sistema
optimize_system() {
    log_message "[INFO] === Ottimizzazione sistema ==="
    
    # Pulizia log vecchi
    log_message "[INFO] Pulizia log vecchi..."
    find /var/log -name "*$PROJECT_NAME*" -mtime +30 -delete 2>/dev/null || true
    
    # Restart PM2 se memoria alta
    local pm2_memory=$(pm2 jlist | jq -r '.[] | select(.name=="paparazzo-app") | .memory' 2>/dev/null || echo "0")
    if [ "$pm2_memory" -gt 1073741824 ]; then  # 1GB
        log_message "[INFO] Restart PM2 per ottimizzazione memoria"
        pm2 restart paparazzo-app
    fi
    
    # Ottimizzazione Nginx log
    if [ -f "/var/log/nginx/access.log" ] && [ $(stat -c%s "/var/log/nginx/access.log") -gt 104857600 ]; then  # 100MB
        log_message "[INFO] Rotazione log Nginx"
        sudo logrotate -f /etc/logrotate.d/nginx
    fi
}

# Funzione per report di sistema
generate_report() {
    log_message "[INFO] === Generazione report sistema ==="
    
    local report_file="$BACKUP_DIR/system_report_$(date +%Y%m%d).txt"
    
    cat > "$report_file" << EOF
# =============================================================================
# REPORT SISTEMA PAPARAZZO SALON - $(date)
# =============================================================================

## STATO SERVIZI
$(systemctl status nginx --no-pager -l)

$(pm2 list)

## UTILIZZO RISORSE
$(df -h)

$(free -h)

$(ps aux --sort=-%mem | head -10)

## BLOG STATISTICS  
Totale post: $(find "$BLOG_CONTENT_DIR" -name "*.md" -type f | wc -l 2>/dev/null || echo "0")
Ultimo post: $(find "$BLOG_CONTENT_DIR" -name "*.md" -type f -printf '%T+ %p\n' | sort | tail -1 | cut -d' ' -f2- 2>/dev/null || echo "Nessuno")

## LOG AUTOMATION (Ultimi 10 eventi)
$(tail -10 "/var/log/$PROJECT_NAME-blog-auto.log" 2>/dev/null || echo "Log non disponibile")

## BACKUP STATUS
$(ls -la "$BACKUP_DIR" | tail -5)

# =============================================================================
EOF

    log_message "[INFO] Report generato: $report_file"
}

# =============================================================================
# ESECUZIONE PRINCIPALE
# =============================================================================

log_message "[INFO] ========================================"
log_message "[INFO] AVVIO MONITORING E BACKUP SISTEMA"
log_message "[INFO] ========================================"

# Controllo se siamo in directory corretta
if [ ! -d "$PROJECT_DIR" ]; then
    log_message "[ERROR] Directory progetto non trovata: $PROJECT_DIR"
    exit 1
fi

# Esecuzione controlli e operazioni
check_system_health
check_blog_automation
perform_backup
optimize_system
generate_report

log_message "[INFO] ========================================"
log_message "[INFO] MONITORING E BACKUP COMPLETATO"
log_message "[INFO] ========================================"

# Statistiche finali
log_message "[INFO] Spazio backup utilizzato: $(du -sh "$BACKUP_DIR" | cut -f1)"
log_message "[INFO] Prossima esecuzione programmata in 7 giorni"

exit 0