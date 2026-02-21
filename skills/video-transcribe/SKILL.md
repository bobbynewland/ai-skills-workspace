---
name: video-transcribe
description: Transcribe YouTube videos. Requires cookies file from browser.
emoji: 🎬
requires:
  bins: [python3, yt-dlp, whisper]
  files: []
install:
  [
    {
      id: "deps",
      kind: "pip",
      pkgs: ["yt-dlp"],
      label: "Install yt-dlp",
    },
  ]
---

# Video Transcribe Skill

Transcribe YouTube videos by URL.

## ⚠️ YouTube Authentication Required

YouTube blocks automated downloads. You must provide a cookies file from your browser.

## Setup Instructions

### Step 1: Get Cookies File
1. Install "Get cookies.txt" extension in Chrome/Firefox
2. Go to YouTube and sign in
3. Click the extension icon → Download cookies
4. Save the file

### Step 2: Transfer to VPS
```bash
scp cookies.txt user@vps:/root/.openclaw/workspace/cookies.txt
```

### Step 3: Transcribe
```bash
video-transcribe "https://youtu.be/..." --cookies /root/.openclaw/workspace/cookies.txt
```

## Usage

```bash
# With cookies file (required for YouTube)
video-transcribe "URL" --cookies /path/to/cookies.txt

# Check system status
video-transcribe --check

# Different options
video-transcribe "URL" --model medium --format srt --cookies cookies.txt
```

## Options

| Flag | Description |
|------|-------------|
| `--cookies FILE` | Cookies file from browser (REQUIRED for YouTube) |
| `--model SIZE` | Whisper model: tiny/base/small/medium/large/turbo |
| `--format FMT` | Output: txt/srt/vtt/json |

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Sign in to confirm" | Get fresh cookies from browser |
| "No JavaScript runtime" | Install Node.js (apt install nodejs) |
| Cookies expired | Re-download cookies from browser |
