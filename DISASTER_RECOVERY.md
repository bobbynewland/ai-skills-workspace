# Disaster Recovery & Migration Guide

## 🚨 Quick Recovery Checklist

If VPS fails or you need to migrate:

### 1. **Immediate Access to Critical Data**
- [ ] GitHub repos are safe (already committed)
- [ ] Firebase data persists (cloud-based)
- [ ] Only local config/files need restore

### 2. **What You Need to Backup Regularly**

| Priority | Item | Location | Backup Method |
|----------|------|----------|---------------|
| 🔴 Critical | Git Repos | GitHub | Auto-committed |
| 🔴 Critical | Firebase Config | Firebase Console | Cloud (auto) |
| 🟡 High | OpenClaw Config | `~/.openclaw/` | Manual backup |
| 🟡 High | API Keys | `.keys/` files | GitHub (encrypted) |
| 🟢 Medium | Workspace Files | `~/workspace/` | GitHub commits |
| 🟢 Medium | Custom Scripts | `~/workspace/` | GitHub commits |

---

## 🔄 Automated Daily Backup

### Set up cron job:
```bash
# Edit crontab
crontab -e

# Add this line for daily backup at 3 AM
0 3 * * * /root/.openclaw/workspace/backup.sh >> /var/log/backup.log 2>&1
```

---

## 🚀 Migration to New Server

### Step 1: Provision New Server
```bash
# Ubuntu 22.04 LTS recommended
# Minimum specs: 2GB RAM, 20GB storage
```

### Step 2: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install OpenClaw (when available)
# npm install -g openclaw
```

### Step 3: Restore Configuration
```bash
# Create directories
mkdir -p ~/.openclaw
mkdir -p ~/.openclaw/workspace

# Restore from backup (if available)
# tar -xzf backup.tar.gz -C /

# Or clone from GitHub
git clone https://github.com/bobbynewland/ai-skills-workspace.git ~/.openclaw/workspace
cd ~/.openclaw/workspace

# Setup OpenClaw config
cat > ~/.openclaw/openclaw.json << 'EOF'
{
  "env": {
    "MOONSHOT_API_KEY": "YOUR_API_KEY_HERE"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN",
      "allowFrom": ["1234548067"]
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "auth": {
      "mode": "token",
      "token": "GENERATE_NEW_TOKEN"
    }
  }
}
EOF
```

### Step 4: Restore API Keys
```bash
# Create .keys directory
mkdir -p ~/.openclaw/workspace/.keys

# Add your keys (from secure backup)
echo "YOUR_KEY" > ~/.openclaw/workspace/.keys/fal_ai.key
echo "YOUR_KEY" > ~/.openclaw/workspace/.keys/google_ai_studio.key
# etc...

# Set permissions
chmod 600 ~/.openclaw/workspace/.keys/*
```

### Step 5: Start Services
```bash
# Start HTTP server for file hosting
cd ~/.openclaw/workspace
npx http-server . -p 8080 --cors &

# Start OpenClaw (when configured)
# openclaw gateway start
```

---

## 📦 Firebase Data Export/Import

### Export Firebase Data:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Export database
firebase database:get / --project winslow-756c3 --output firebase_backup.json
```

### Import to New Project (if needed):
```bash
firebase database:set / firebase_backup.json --project NEW_PROJECT_ID
```

---

## 🔐 Critical Secrets to Save

Create this file and store it securely (1Password, etc.):

```
AI SKILLS WORKSPACE - CRITICAL SECRETS
======================================

⚠️  THIS TEMPLATE - FILL IN YOUR ACTUAL VALUES
⚠️  NEVER COMMIT REAL SECRETS TO GIT
⚠️  STORE IN 1PASSWORD OR SIMILAR

Firebase:
- Project ID: [YOUR_PROJECT_ID]
- API Key: [YOUR_API_KEY]
- Database: [YOUR_DATABASE_URL]

API Keys:
- Kimi (Moonshot): [YOUR_KIMI_KEY]
- Gemini: [YOUR_GEMINI_KEY]
- FAL.ai: [YOUR_FAL_KEY]
- HeyGen: [YOUR_HEYGEN_KEY]

Telegram Bot:
- Bot Token: [YOUR_BOT_TOKEN]
- Owner ID: [YOUR_TELEGRAM_ID]

Command Board:
- Workspace: winslow-main
- Password: WinDev2026@@

GitHub:
- Token: [YOUR_GITHUB_TOKEN]
- Repos: 
  - github.com/bobbynewland/ai-skills-workspace
  - github.com/bobbynewland/Webistes

Google OAuth:
- Email: [YOUR_EMAIL]
- Provider: google-antigravity
```

**Store actual values in a password manager!** 🔐

---

## 🆘 Emergency Contacts

If everything fails:
1. **GitHub**: Repos are safe, just need new token
2. **Firebase**: Data persists, just need new project access
3. **API Keys**: Can regenerate from respective dashboards
4. **Me**: Can help reconstruct from memory if needed

---

## 📋 Pre-Migration Checklist

Before moving to local machine:

- [ ] Run full backup script
- [ ] Export Firebase data
- [ ] Document all API keys
- [ ] Test restore on new VPS first
- [ ] Set up automated backups on new machine
- [ ] Update DNS if using custom domain
- [ ] Test all integrations

---

## 🎯 Local Machine Setup

For Mac/Windows local development:

```bash
# Install Node.js from nodejs.org
# Install Git from git-scm.com

# Clone repos
git clone https://github.com/bobbynewland/ai-skills-workspace.git
git clone https://github.com/bobbynewland/Webistes.git

# Install dependencies
cd ai-skills-workspace
npm install

# Start local server
npx http-server . -p 8080 --cors

# Access at: http://localhost:8080
```

---

**You're now protected!** 🛡️
