# AI Architecture

## The Stack

| Role | Model | Purpose | Rate Limit |
|------|-------|---------|------------|
| **Strategist** | Kimi K2.5 (NVIDIA) | Planning, architecture, thinking | 40 RPM (FREE) |
| **Coder** | Kimi K2.5 (Codex) | Implementation, production code | 40 RPM (FREE) |
| **Win** | Gemini CLI / MiniMax | Project management, coordination | Unlimited |

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

### Fallback / Chat
1. MiniMax M2.1 - Primary ($20/mo)
2. Gemini 2.5 Flash - Free fallback

## Skills Available

| Skill | Purpose |
|-------|---------|
| `kimistrat` | Strategic planning with Kimi K2.5 |
| `codex` | Production coding with Kimi K2.5 |

## Commands
```
/model codex - Production coding (Kimi K2.5 via Codex)
/model gemini-2.5-flash - Fast reasoning
/model pony-alpha - Free OpenRouter fallback
```

## Keys
`/root/.openclaw/workspace/.keys/`
- `nvidia.key` ✅ - Kimi K2.5 (40 RPM free)
- `openrouter.key` ✅ - Codex + fallback models

## Rate Limit Safety
- Respect 40 RPM on Kimi endpoints
- Batch requests when possible
- Use Gemini CLI for quick checks
- Win coordinates to avoid rate limits

## Workflow

1. **Plan** → Kimi Strategist (NVIDIA)
2. **Build** → Codex Coder (Kimi K2.5)
3. **Review** → Win (Gemini CLI)
4. **Deploy** → Vercel

## Example Session
```
> kimistrat "Plan a mobile touch drag feature"

[Kimi provides detailed plan]

> codex "Implement the touch drag with 25px threshold"

[Codex generates production code]
```
