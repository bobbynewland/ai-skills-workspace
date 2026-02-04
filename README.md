# OpenClaw Workspace

AI-powered marketing and automation workspace.

## 📁 Structure

```
├── skills/                 # Custom OpenClaw skills
│   ├── github/            # GitHub CLI integration
│   ├── gemini-cli/        # Google Gemini integration
│   ├── nano-banana/       # Image generation
│   ├── template-creator/  # Marketing template generator
│   └── template-pack-factory/  # Template pack workflow
│
├── templates/             # Generated template packs
│   ├── beauty_glow/       # Celebrity beauty campaigns
│   ├── luxury_beauty_generic/  # Generic luxury beauty
│   ├── restaurant_pack/   # Restaurant templates
│   └── cool_3d/          # 3D product ads
│
├── command-board/         # Mission Control Kanban
│   └── command-board.html
│
└── docs/                 # Documentation
    └── README.md
```

## 🚀 Quick Start

### Skills
- **Nano Banana**: AI image generation via fal.ai
- **Template Creator**: Marketing template workflow
- **GitHub**: Repo management and backup
- **Gemini CLI**: AI coding assistant

### Template Packs
Upload to AI Skills Studio:
- Beauty & Skincare
- Restaurants & Food
- 3D Product Ads
- Luxury Brands

## 🔧 Tools

- **Image Generation**: Seedream v4.5 via fal.ai
- **Storage**: Google Drive
- **Sync**: Firebase (planned)
- **Backup**: GitHub

## 📱 Mobile

Access Command Board:
- URL: `http://147.93.40.188:8080/command-board.html`
- Sync: LocalStorage (Firebase coming soon)

## 🔐 Credentials

Stored in `/workspace/.keys/`:
- fal.ai API key
- Google service accounts
- GitHub tokens (add yours)

## 📝 Backup

```bash
# Daily backup
git add .
git commit -m "Backup $(date)"
git push
```

## 🎯 Mission

Scale AI Skills Bootcamp to $1M+ with automated template generation and marketing workflows.

---

Built with OpenClaw + fal.ai + Google AI
