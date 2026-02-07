# API Key Rotation Guide

## Current Setup: Kimi K2.5 (NVIDIA → Moonshot Fallback)

### Priority Order
1. **NVIDIA** (5k free credits) - Primary
2. **Moonshot** (your paid API) - Fallback

---

## Quick Key Rotation

### To Update NVIDIA API Key:
```bash
# Edit the config
nano /root/.openclaw/openclaw.json

# Find NVIDIA_API_KEY and replace
"NVIDIA_API_KEY": "nvapi-YOUR-NEW-KEY-HERE"

# Restart OpenClaw
openclaw gateway restart
```

### To Update Moonshot API Key:
```bash
# Edit the config
nano /root/.openclaw/openclaw.json

# Find MOONSHOT_API_KEY and replace
"MOONSHOT_API_KEY": "sk-YOUR-NEW-KEY-HERE"

# Restart OpenClaw
openclaw gateway restart
```

---

## When Credits Run Out

### Switch to Moonshot Only (Temporary)
If NVIDIA credits are depleted:

1. Edit `/root/.openclaw/openclaw.json`
2. Change primary model:
```json
"model": {
  "primary": "moonshot/kimi-k2.5",
  "fallbacks": []
}
```
3. Restart: `openclaw gateway restart`

### Get New NVIDIA Credits
1. Sign up with different email at [NVIDIA Developer](https://developer.nvidia.com/)
2. Generate new API key
3. Update `NVIDIA_API_KEY` in config
4. Switch back to NVIDIA primary

---

## Check Current Usage

```bash
# View recent model calls
openclaw sessions list --limit 5

# Check which model is being used
openclaw session status
```

---

## Cost Tracking

| Provider | Cost | Status |
|----------|------|--------|
| NVIDIA | FREE (5k credits) | 🟢 Primary |
| Moonshot | PAID | 🟡 Fallback |

---

## Troubleshooting

**"Rate limited on NVIDIA"** → Automatically falls back to Moonshot

**"NVIDIA API error"** → Check key validity at https://build.nvidia.com/

**"Both APIs failing"** → Falls back to Gemini CLI (free tier)
