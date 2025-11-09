#!/bin/bash

###############################################################################
# Setup Automated Blog Publishing
# Configures cron job to run blog generation twice per week
###############################################################################

set -e

echo "🚀 Setting up automated blog publishing..."
echo ""

# Configuration
PROJECT_DIR="/var/www/paparazzo"
SCRIPT_PATH="$PROJECT_DIR/scripts/auto-blog-publish.sh"
CRON_SCHEDULE="0 10 * * 2,5"  # Tuesday and Friday at 10:00 AM

# Make scripts executable
echo "📝 Making scripts executable..."
chmod +x "$PROJECT_DIR/scripts/auto-blog-publish.sh"
chmod +x "$PROJECT_DIR/scripts/cron-blog-generator.js"

# Create log directory
echo "📁 Creating log directory..."
mkdir -p "$PROJECT_DIR/logs"

# Remove existing cron job if present
echo "🧹 Removing existing cron job (if any)..."
crontab -l 2>/dev/null | grep -v "auto-blog-publish.sh" | crontab - 2>/dev/null || true

# Add new cron job
echo "⏰ Adding cron job..."
(crontab -l 2>/dev/null; echo "$CRON_SCHEDULE $SCRIPT_PATH") | crontab -

echo ""
echo "✅ Blog automation setup completed!"
echo ""
echo "📅 Schedule: Tuesday and Friday at 10:00 AM (Europe/Rome)"
echo "📝 Log file: $PROJECT_DIR/logs/blog-automation.log"
echo ""
echo "🔍 Verify cron job:"
echo "   crontab -l"
echo ""
echo "📋 Manual test:"
echo "   bash $SCRIPT_PATH"
echo ""
echo "📄 View logs:"
echo "   tail -f $PROJECT_DIR/logs/blog-automation.log"
echo ""

# Display current crontab
echo "Current crontab:"
crontab -l

exit 0
