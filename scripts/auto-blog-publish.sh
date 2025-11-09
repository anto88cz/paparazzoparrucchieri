#!/bin/bash

###############################################################################
# Automated Blog Post Generation and Deployment
# Runs: Tuesday and Friday at 10:00 AM (Europe/Rome)
# 
# Setup: bash scripts/setup-blog-cron.sh
###############################################################################

set -e

# Configuration
PROJECT_DIR="/var/www/paparazzo"
LOG_FILE="$PROJECT_DIR/logs/blog-automation.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Ensure log directory exists
mkdir -p "$PROJECT_DIR/logs"

echo "=====================================" >> "$LOG_FILE"
echo "[$DATE] Starting automated blog generation" >> "$LOG_FILE"
echo "=====================================" >> "$LOG_FILE"

# Change to project directory
cd "$PROJECT_DIR"

# Step 1: Generate blog post
echo "[$DATE] Step 1/3: Generating blog post..." >> "$LOG_FILE"
if node scripts/cron-blog-generator.js >> "$LOG_FILE" 2>&1; then
    echo "[$DATE] ✅ Blog post generated successfully" >> "$LOG_FILE"
else
    echo "[$DATE] ❌ Blog generation failed" >> "$LOG_FILE"
    exit 1
fi

# Step 2: Build Next.js
echo "[$DATE] Step 2/3: Building Next.js..." >> "$LOG_FILE"
if npm run build >> "$LOG_FILE" 2>&1; then
    echo "[$DATE] ✅ Build completed successfully" >> "$LOG_FILE"
else
    echo "[$DATE] ❌ Build failed" >> "$LOG_FILE"
    exit 1
fi

# Step 3: Restart PM2
echo "[$DATE] Step 3/3: Restarting PM2..." >> "$LOG_FILE"
if pm2 restart paparazzo >> "$LOG_FILE" 2>&1; then
    echo "[$DATE] ✅ PM2 restarted successfully" >> "$LOG_FILE"
else
    echo "[$DATE] ❌ PM2 restart failed" >> "$LOG_FILE"
    exit 1
fi

# Success
echo "[$DATE] 🎉 Blog automation completed successfully!" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Keep only last 100 lines of log
tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"

exit 0
