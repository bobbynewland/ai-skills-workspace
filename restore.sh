#!/bin/bash
# Restore Script for AI Skills Workspace
# Run this on new server to restore from backup

set -e  # Exit on error

echo "🔄 AI Skills Workspace Restore"
echo "==============================="

# Check if backup file provided
if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file.tar.gz>"
    echo ""
    echo "Or restore from GitHub:"
    echo "  ./restore.sh --from-github"
    exit 1
fi

if [ "$1" == "--from-github" ]; then
    echo "📥 Restoring from GitHub..."
    
    # Clone main workspace
    git clone https://github.com/bobbynewland/ai-skills-workspace.git ~/.openclaw/workspace
    cd ~/.openclaw/workspace
    
    # Clone websites repo
    git clone https://github.com/bobbynewland/Webistes.git ~/Webistes
    
    echo "✅ GitHub restore complete!"
    echo ""
    echo "Next steps:"
    echo "1. Create ~/.openclaw/openclaw.json with your config"
    echo "2. Add API keys to .keys/ directory"
    echo "3. Run: npx http-server . -p 8080 --cors"
    exit 0
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "📦 Restoring from: $BACKUP_FILE"

# Extract backup
RESTORE_DIR="/tmp/restore_$(date +%s)"
mkdir -p $RESTORE_DIR
tar -xzf $BACKUP_FILE -C $RESTORE_DIR

echo "📁 Extracted to: $RESTORE_DIR"

# Find the backup directory (it will have a subdirectory)
BACKUP_DIR=$(find $RESTORE_DIR -maxdepth 1 -type d | grep -v "^$RESTORE_DIR$")

echo "🔍 Found backup directory: $BACKUP_DIR"

# Restore workspace
echo "📂 Restoring workspace..."
if [ -d "$BACKUP_DIR/workspace" ]; then
    rm -rf ~/.openclaw/workspace
    cp -r $BACKUP_DIR/workspace ~/.openclaw/
    echo "✅ Workspace restored"
fi

# Restore OpenClaw config
echo "⚙️ Restoring OpenClaw config..."
if [ -d "$BACKUP_DIR/openclaw_config" ]; then
    rm -rf ~/.openclaw
    cp -r $BACKUP_DIR/openclaw_config ~/.openclaw
    echo "✅ OpenClaw config restored"
fi

# Restore SSH keys
echo "🔐 Restoring SSH keys..."
if [ -d "$BACKUP_DIR/.ssh" ]; then
    rm -rf ~/.ssh
    cp -r $BACKUP_DIR/.ssh ~/
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/*
    echo "✅ SSH keys restored"
fi

# Cleanup
rm -rf $RESTORE_DIR

echo ""
echo "🎉 Restore Complete!"
echo ""
echo "Next steps:"
echo "1. cd ~/.openclaw/workspace"
echo "2. Install dependencies: npm install"
echo "3. Start server: npx http-server . -p 8080 --cors"
echo "4. Test all services"
echo ""
echo "⚠️  Remember to:"
echo "   - Update API keys if needed"
echo "   - Check Firebase connection"
echo "   - Test Telegram bot"
echo "   - Verify all integrations"
