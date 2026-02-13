# AI Architecture - Model Priority

## Model Priority (Use in this order)

| Priority | Model | Purpose | Rate Limit |
|----------|-------|---------|------------|
| **1st** | Gemini 3.0 (Antigravity) | Primary coding/reasoning | High limits |
| **2nd** | Claude Opus/Sonnet 4.5 (Antigravity) | Complex reasoning | High limits |
| **3rd** | MiniMax 2.5 | Fallback when Antigravity limits hit | 300 prompts/5hr |
| **4th** | Kimi K2.5 (NVIDIA) | Free backup | 40 RPM |

## Antigravity OAuth Models (PRIMARY)
- **gemini-3.0-pro** — Reasoning + coding (TOP CHOICE)
- **gemini-3.0-flash** — Fast responses
- **gemini-2.0-pro** — Gemini reasoning
- **gemini-2.0-flash** — Gemini fast
- **claude-opus-4.5** — Complex reasoning
- **claude-sonnet-4.5** — Fast coding
- **gemini-1.5-pro** — Legacy
- **gemini-1.5-flash** — Legacy

## MiniMax (FALLBACK)
- **minimax** — MiniMax 2.5 direct API (204,800 context)
- **minimax-lightning** — Fast mode (~100 tps)
- **minimax-oauth** — OAuth backup (M2.1)

## Commands
```
/model gemini-3.0-pro     # Primary (use first!)
/model gemini-3.0-flash  # Fast Gemini
/model claude-opus-4.5   # Claude reasoning
/model claude-sonnet-4.5 # Claude fast
/model minimax           # Fallback
/model minimax-lightning # Fast fallback
```

## Rate Limit Strategy
1. Use Antigravity models first (Gemini 3.0 → Claude → Gemini 2.0)
2. When Antigravity limits hit → switch to MiniMax
3. MiniMax has 300 prompts/5hr limit
4. Monitor with: `python3 /root/.openclaw/workspace/minimax-tracker.py`

## Keys (Antigravity)
- OAuth profile: `google-antigravity:framelensmedia@gmail.com`
- Configured in: `/root/.openclaw/agents/main/agent/auth-profiles.json`

## Workflow
1. **Code** → Gemini 3.0 Pro (Antigravity)
2. **Reason** → Claude Opus 4.5 (Antigravity)  
3. **Fallback** → MiniMax 2.5
4. **Deploy** → Vercel

---

# 🕸️ Kimi Swarm (10 NVIDIA Keys)

## Overview
- 10 NVIDIA API keys configured for parallel processing
- Each key runs Kimi K2.5 independently
- Use for research, parallel tasks, heavy lifting

## Scripts

### Swarm Scheduler
```bash
python3 /root/.openclaw/workspace/swarm-scheduler.py status   # Show all keys
python3 /root/.openclaw/workspace/swarm-scheduler.py get-key  # Get next available
python3 /root/.openclaw/workspace/swarm-scheduler.py run "task" # Run with least-used
python3 /root/.openclaw/workspace/swarm-scheduler.py use-key 3 "task" # Use specific key
```

### Kimi Worker (Direct API)
```bash
python3 /root/.openclaw/workspace/kimi-worker.py "prompt"           # Auto-select key
python3 /root/.openclaw/workspace/kimi-worker.py --key 5 "prompt"  # Use key 5
```

### Kimi Spawner
```bash
python3 /root/.openclaw/workspace/kimi-spawn.py spawn "task" [key-index]
python3 /root/.openclaw/workspace/kimi-spawn.py parallel "task1" "task2"
python3 /root/.openclaw/workspace/kimi-spawn.py status
```

## Status
- Key 1: Used
- Keys 2-10: Ready for parallel tasks
