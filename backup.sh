#!/bin/bash
# Backup workspace to GitHub
# Run: curl -X POST "https://api.github.com/repos/YOUR_ORG/YOUR_REPO/contents/backup-$(date +%Y%m%d).tar.gz" -H "Authorization: token YOUR_TOKEN" --data-binary @/tmp/workspace.tar.gz

WORKSPACE="/root/.openclaw/workspace"
BACKUP_DIR="/root/.openclaw/backups"
DATE=$(date +%Y%m%d_%H%M)
mkdir -p $BACKUP_DIR

# Backup workspace (exclude node_modules, .git)
echo "Backing up workspace..."
tar --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='.vercel' -czf $BACKUP_DIR/workspace_$DATE.tar.gz -C $WORKSPACE .

# Backup SQLite databases
echo "Backing up databases..."
cp /root/.openclaw/workspace/custom-workflows.db $BACKUP_DIR/workflows_$DATE.db 2>/dev/null

# Keep only the most recent backup
ls -t $BACKUP_DIR/workspace_*.tar.gz | tail -n +2 | xargs -r rm
ls -t $BACKUP_DIR/workflows_*.db | tail -n +2 | xargs -r rm 2>/dev/null

echo "Backup complete: $DATE"
