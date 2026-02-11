# TOOLS.md - Model Configuration

## Model Priority Chain (OPTIMIZED)

### Chat (Telegram, WhatsApp, Webchat)
1. **MiniMax M2.1** - Primary brain ($20/mo, 300 prompts/5hrs)
2. **Gemini 2.5 Flash** (AI Studio API) - Fallback, 1M tokens

### Coding Tasks ⭐ PIXEL-PERFECT QUALITY
1. **Codex OAuth** (/model codex) - GPT-4o production coding - BEST for premium code
2. **Gemini CLI** (free) - No limits, runs locally - Excellent for React/JavaScript
3. **Gemini 2.5 Flash** (AI Studio API) - Fast, free, 1M tokens
4. **Antigravity OAuth** - Free Google account access
5. **Pony Alpha** (OpenRouter) - FREE fallback
6. **MiniMax M2.1** - Emergency fallback only

### General Tasks & Reasoning
1. **Gemini 2.5 Pro** (AI Studio API) - Deep reasoning, 1M tokens
2. **Gemini 2.5 Flash** - Speed + reasoning balance
3. **Gemini CLI** - Free tier
4. **Vertex AI Pro** - $300 credits (high-volume)
5. **MiniMax M2.1** - Final fallback

### Image/Video Generation
1. **seedream4k** (Fal API) - Text-to-image
2. **Imagen 4.0** (Google AI Studio) - High-quality images
3. **Veo 3.0** (Google AI Studio) - Video generation

## Capabilities

### Transcription
- **Whisper CLI** - Local video/audio transcription (100% free)
- Supported: MP4, MP3, WAV, M4A, YouTube URLs
- Output: TXT, VTT, SRT, TSV, JSON
- Models: tiny/base/small/medium/large

### Content Creation Stack (Free!)
- 💬 Chat: MiniMax M2.1 → Gemini 2.5 Flash
- 🖼️ Images: Imagen 4.0 (Google AI Studio)
- 🎬 Videos: Veo 3.0 (Google AI Studio)
- 🎙️ Transcription: Whisper (local)
- 🤖 AI Avatars: HeyGen API
- 📝 Templates: seedream4k (Fal AI)

## Available Models (Google AI Studio)

**✅ ACCESSIBLE:**
- `gemini-2.5-flash` - Latest! 1M tokens, 65K output
- `gemini-2.5-pro` - Most capable, 1M tokens
- `gemini-2.0-flash` - Stable, fast
- `gemini-2.0-flash-lite` - Efficient
- `gemma-3-27b-it` - Open model, 128K context
- `imagen-4.0-generate` - Image generation
- `veo-3.0-generate` - Video generation

## API Keys

Store in `/root/.openclaw/workspace/.keys/`:

| Key File | Provider | Purpose |
|----------|----------|---------|
| `google_ai_studio.key` | Google AI Studio | Gemini 2.5 (FREE!) |
| `antigravity_oauth.json` | Google OAuth | Free Gemini via Google account |
| `vertex_ai.json` | Vertex AI | $300 credits, production |
| `openrouter.key` | OpenRouter | Pony Alpha + Codex OAuth |
| `fal.key` | Fal AI | seedream4k video/images |
| `heygen.key` | HeyGen | AI avatar training videos |

## Usage Examples

```bash
# Default (uses optimal model for task)
# Just talk - routes automatically

# Force specific models
/model gemini-2.5-pro    # Deep reasoning
/model gemini-2.5-flash  # Speed
/model codex             # Production coding
/model pony-alpha       # Free OpenRouter

# Gemini CLI (truly free, no API limits)
gemini ask "Explain recursion"
gemini -m gemini-2.5-pro "Write a Python script"

# Test API keys
python3 /root/.openclaw/workspace/google-models-tester.py
```

## Model Selection Guide

| Use Case | Best Model | Why |
|----------|-----------|-----|
| Quick chat | Gemini 2.5 Flash | Fast, 1M context |
| Deep reasoning | Gemini 2.5 Pro | Best for complex tasks |
| Coding | Gemini CLI / Codex | Free / Production |
| Long documents | Gemini 2.5 Pro | 1M token context |
| Image generation | Imagen 4.0 | Latest Google images |
| Video generation | Veo 3.0 | Latest Google video |
| High-volume | Vertex AI | $300 credits |
| Free backup | Pony Alpha | OpenRouter free tier |

## Keys Location
`/root/.openclaw/workspace/.keys/`

**Status:** All keys configured ✅
- Google AI Studio: API key set ✅
- Antigravity OAuth: (add `antigravity_oauth.json`)
- Vertex AI: Credentials set ✅
- OpenRouter: Key set ✅
