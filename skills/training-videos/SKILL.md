# Training Video Skill - HeyGen Integration

Create AI avatar training videos using HeyGen API.

## Setup

1. Get HeyGen API key: https://app.heygen.com/settings/api
2. Save key: `echo "YOUR_KEY" > /root/.openclaw/workspace/.keys/heygen.key`

## Usage

```bash
# Create avatar video
python3 /root/.openclaw/workspace/skills/training-videos/heygen_skill.py create "Your script here"

# List avatars
python3 /root/.openclaw/workspace/skills/training-videos/heygen_skill.py avatars

# List voices
python3 /root/.openclaw/workspace/skills/training-videos/heygen_skill.py voices

# Create video from template
python3 /root/.openclaw/workspace/skills/training-videos/heygen_skill.py video "Script" --avatar "avatar_id" --voice "voice_id"

# Check status
python3 /root/.openclaw/workspace/skills/training-videos/heygen_skill.py status <video_id>
```

## OpenClaw Integration

Add to skills directory to use via command center.
