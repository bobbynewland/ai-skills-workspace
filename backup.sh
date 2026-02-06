#!/bin/bash
# Backup Script for AI Skills Workspace
# Run this daily or before major changes

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="ai_skills_backup_$DATE"

echo "🔄 Starting backup: $BACKUP_NAME"

# Create backup directory
mkdir -p $BACKUP_DIR/$BACKUP_NAME

# 1. Backup Workspace (Git should have most, but just in case)
echo "📁 Backing up workspace..."
cp -r /root/.openclaw/workspace $BACKUP_DIR/$BACKUP_NAME/

# 2. Backup OpenClaw Configuration
echo "⚙️ Backing up OpenClaw config..."
cp -r /root/.openclaw $BACKUP_DIR/$BACKUP_NAME/openclaw_config/

# 3. Backup Environment Variables
echo "🔑 Backing up environment..."
env > $BACKUP_DIR/$BACKUP_NAME/environment.txt

# 4. Backup SSH Keys (if any custom)
if [ -d ~/.ssh ]; then
    echo "🔐 Backing up SSH keys..."
    cp -r ~/.ssh $BACKUP_DIR/$BACKUP_NAME/
fi

# 5. Backup Firebase Data
echo "🔥 Exporting Firebase data..."
# Note: Requires Firebase CLI installed and logged in
# firebase database:get / --project winslow-756c3 --output $BACKUP_DIR/$BACKUP_NAME/firebase_backup.json

# 6. Create backup manifest
echo "📝 Creating manifest..."
cat > $BACKUP_DIR/$BACKUP_NAME/MANIFEST.txt << EOF
AI Skills Workspace Backup
==========================
Date: $(date)
Hostname: $(hostname)
IP: $(curl -s ifconfig.me)

Contents:
- workspace/ : All project files
- openclaw_config/ : OpenClaw configuration
- environment.txt : Environment variables
- .ssh/ : SSH keys (if present)
- MANIFEST.txt : This file

GitHub Repositories:
- https://github.com/bobbynewland/ai-skills-workspace
- https://github.com/bobbynewland/Webistes

Firebase Projects:
- winslow-756c3 (Realtime Database + Auth)

Restore Instructions:
1. Clone GitHub repos
2. Copy openclaw_config to ~/.openclaw
3. Restore Firebase data (if needed)
4. Reinstall dependencies (npm, etc.)

Contact: framelensmedia@gmail.com
EOF

# 7. Compress backup
echo "🗜️ Compressing backup..."
cd $BACKUP_DIR
tar -czf ${BACKUP_NAME}.tar.gz $BACKUP_NAME
rm -rf $BACKUP_NAME

# 8. Upload to safe location (optional)
# scp ${BACKUP_NAME}.tar.gz user@backup-server:/backups/
# Or upload to cloud storage

echo "✅ Backup complete: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo "📊 Size: $(du -h ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz | cut -f1)"

# Keep only last 10 backups
echo "🧹 Cleaning old backups..."
cd $BACKUP_DIR
ls -t *.tar.gz | tail -n +11 | xargs -r rm

echo "🎉 Backup process complete!"
