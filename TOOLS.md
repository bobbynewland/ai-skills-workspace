# AI Architecture

## The Stack

| Role | Model | Purpose | Rate Limit |
|------|-------|---------|------------|
| **Strategist** | Kimi K2.5 (NVIDIA) | Planning, architecture, thinking | 40 RPM (FREE) |
| **Coder** | Kimi K2.5 (Codex) | Implementation, production code | 40 RPM (FREE) |
| **Win** | MiniMax 2.5 | Project management, coordination | 300 prompts/5hr |

## Model Priority

### Strategic Planning ⭐
**Kimi K2.5** (NVIDIA) - Free, 40 RPM
- Planning features
- System architecture
- Risk analysis
- Strategic decisions

### Coding Tasks ⭐
**Kimi K2.5** (OpenRouter/Codex) - Free, 40 RPM
- Implementation
- Production code
- Bug fixes
- Refactoring

### Primary / Chat ⭐
**MiniMax M2.5** (Direct API) - Primary
- 204,800 context window
- ~60 tps output speed
- Direct API key in `/root/.openclaw/workspace/.keys/minimax.key`
- Fallback: MiniMax M2.5 Lightning (~100 tps)
- Backup: MiniMax OAuth (M2.1)

## Commands
```
/model minimax - MiniMax 2.5 (direct)
/model minimax-lightning - MiniMax 2.5 Lightning (faster)
/model minimax-oauth - MiniMax M2.1 (OAuth backup)
/model codex - Production coding (Kimi K2.5 via Codex)
/model gemini-2.5-flash - Fast reasoning
/model pony-alpha - Free OpenRouter fallback
```

## Keys
`/root/.openclaw/workspace/.keys/`
- `nvidia.key` ✅ - Kimi K2.5 (40 RPM free)
- `openrouter.key` ✅ - Codex + fallback models
- `minimax.key` ✅ - MiniMax 2.5 direct API (204,800 context)
- `google_ai_studio.key` ✅ - Gemini fallback

## Rate Limit Safety
- Respect 40 RPM on Kimi endpoints
- MiniMax: 300 prompts/5hr limit (alert at 250)
- Batch requests when possible
- Use Gemini CLI for quick checks
- Win coordinates to avoid rate limits

## Workflow

1. **Plan** → Kimi Strategist (NVIDIA)
2. **Build** → Codex Coder (Kimi K2.5)
3. **Review** → Win (MiniMax 2.5 direct)
4. **Deploy** → Vercel

## API Reference

### MiniMax 2.5 (Direct API) - PRIMARY
```
POST https://api.minimax.chat/v1/text/chatcompletion_v2

Headers:
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

Body:
{
  "model": "MiniMax-M2.5",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Your prompt here"}
  ],
  "max_tokens": 16384,
  "temperature": 0.7,
  "stream": false
}
```

### MiniMax M2.1 (OAuth Backup)
```
POST https://api.minimax.io/anthropic/v1/messages

Headers:
Authorization: Bearer oauth-token
Content-Type: application/json

Body:
{
  "model": "MiniMax-M2.1",
  "max_tokens": 8192,
  "messages": [...]
}
```

### Kimi K2.5 (NVIDIA)
```
POST https://integrate.api.nvidia.com/v1/chat/completions

Headers:
Authorization: Bearer YOUR_NVIDIA_KEY
Content-Type: application/json

Body:
{
  "model": "moonshotai/kimi-k2.5",
  "messages": [{"role": "user", "content": "Your prompt"}],
  "max_tokens": 16384,
  "temperature": 0.7,
  "stream": false
}
```

## MiniMax 2.5 Models

| Model | Context | Speed | Best For |
|-------|---------|-------|----------|
| MiniMax-M2.5 | 204,800 | ~60 tps | Complex reasoning, coding |
| MiniMax-M2.5-lightning | 204,800 | ~100 tps | Fast responses |
| MiniMax-M2.1 (OAuth) | 200,000 | ~60 tps | Backup, legacy |
