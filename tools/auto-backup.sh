#!/bin/bash
# Auto-backup script for OpenClaw workspace
# Runs daily via cron to commit and push changes

WORKSPACE_DIR="/root/.openclaw/workspace"
REPO_URL="https://github.com/bobbynewland/ai-skills-workspace.git"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

cd "$WORKSPACE_DIR" || exit 1

# Check if there are any changes
if git status --porcelain | grep -q .; then
    echo "Changes detected at $DATE"
    git add -A
    git commit -m "Auto-backup: $DATE" -m "Daily automated backup of workspace changes"
    git push origin main
    echo "Backup completed successfully"
else
    echo "No changes to backup at $DATE"
fi