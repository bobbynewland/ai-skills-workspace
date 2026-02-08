# TOOLS.md - Model Configuration

## Model Priority Chain

### Chat (Telegram, Webchat)
1. **MiniMax M2.1** - Primary chat brain
2. **Gemini 1.5 Flash** - Fallback

### Coding Tasks
1. **Gemini CLI** (free tier) - First attempt
2. **Gemini 1.5 Flash** (AI Studio API) - If rate limited
3. **MiniMax M2.1** - Final fallback

### General Tasks
1. **Gemini 1.5 Flash** - Fast, efficient
2. **Gemini 1.5 Pro** - Complex reasoning
3. **MiniMax M2.1** - Final fallback

## API Keys

Store in `/root/.openclaw/workspace/.keys/`:
- `google_ai_studio.key` - Google AI Studio API key
- `vertex_ai.json` - Vertex AI service account (for credits)

## Usage Examples

```bash
# Chat with MiniMax (default)
# Just talk - uses MiniMax

# Use Gemini directly
gemini ask "Explain recursion"

# Force a specific model (in OpenClaw)
/model gemini-1.5-pro
```

## Keys Location
`/root/.openclaw/workspace/.keys/`
