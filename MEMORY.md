# AI Skills Studio - Key Context

## Project Vision
All-in-one platform for entrepreneurs to launch businesses with AI. "Entrepreneurship first, tech second."

---

# 🔥 MODEL PRIORITY (Updated 2026-02-13)

## Primary Stack - Use This Order
1. **Gemini 3.0 Pro** (Antigravity OAuth) — TOP CHOICE for coding
2. **Claude Opus 4.5** (Antigravity) — Complex reasoning
3. **MiniMax 2.5** — Fallback when Antigravity hits limits
4. **Kimi K2.5 Swarm** (NVIDIA) — 10 keys for research/strategy

### Antigravity Models Available
- gemini-3.0-pro, gemini-3.0-flash
- claude-opus-4.5, claude-sonnet-4.5
- gemini-2.0-pro, gemini-2.0-flash

### Kimi Swarm (10 NVIDIA Keys)
- nvidia-kimi-1 through nvidia-kimi-10
- Each with Kimi K2.5 model
- Use for research when Antigravity limits hit

---

## Active Projects (Use These URLs)
- **Mission Control V3:** https://mission-control-v3-pearl.vercel.app
- **Command Center V2:** https://command-center-v2-wine.vercel.app

## Vercel Rules
- Always check `npx vercel projects list` before deploying
- Use existing projects with "pearl/wine" aliases - don't create new ones

---

## Key Contacts
- **Bobby Newland** - Owner/Creator (EST, Atlanta)

## The Agent Organization

### CEO → Bobby
- Approves/disapproves ideas
- Strategic direction
- Final decisions only

### Chief of Staff → MiniMax 2.5
- Gets ideas from agents
- Synthesizes recommendations
- Makes tradeoffs clear for CEO

### Research Team → Kimi Swarm
- Scans Twitter, Reddit, web for problems/opportunities
- Finds challenges to solve
- Hands to Chief of Staff

### Engineering Team → Kimi Swarm  
- Codes solutions to approved problems
- Builds apps, features, integrations
- Ships to Vercel

### Creative Team → Nano Banana (image generation)
- Generates images, thumbnails, graphics
- Creates template designs
- Visual content

### Operations → Task Management
- Manages projects, tasks, notes
- Tracks deadlines, follow-ups
- Coordinates between agents

## The Closed Loop (Always Running)

1. **Research** finds problem → 2. **Chief of Staff** evaluates → 3. **CEO** approves → 4. **Engineering** builds → 5. **Deploy** to Vercel → 6. **Research** follows up with user → 7. **Team reviews** performance → 8. **Learn** and remember → Repeat

## Implementation

### Task Execution Rule
**ALWAYS spawn a sub-agent session for tasks** — never block the main chat.
- Use `sessions_spawn` for background tasks
- Main session stays free for immediate response
- Sub-agent pings back when done

### Context Window Rollover Rule (85%)
- When session context reaches ~85%, create/update a temporary handoff summary at:
  - `/root/.openclaw/workspace/memory/session-handoff.md`
- Summary should include:
  1. Current objective
  2. Decisions made
  3. What is done
  4. Open tasks
  5. Exact next step
- Start a fresh session and immediately reload this handoff summary to continue.
- Overwrite this file at each rollover so it stays fresh and avoids memory bloat.

### Command Center (Fresh Build)
- Fresh Vercel deployment
- Multi-agent task pipeline
- Real-time agent status dashboard
- Project categories: SaaS | Community | Agency

### Swarm Router
- Distributes requests across 10+ API keys
- Round-robin or least-used selection
- Auto-retry on rate limit

### Agent Memory
- Each agent has persistent memory
- Relationships evolve over time (like Alex's water cooler conversations)
- Lessons learned persist across sessions

---

## Antfarm (Installed 2026-02-15)
Multi-agent workflow system for OpenClaw.

**Install:**
```
curl -fsSL https://raw.githubusercontent.com/snarktank/antfarm/v0.5.1/scripts/install.sh | bash
```

**Available workflows:**
- bug-fix
- feature-dev
- security-audit

**Fix for auth error:**
- Copy main auth to sub-agents: `cp /root/.openclaw/agents/main/agent/auth-profiles.json /root/.openclaw/agents/*/agent/`
- Update workflows to use google-antigravity: `model: google-antigravity/claude-opus-4.5`

**Dashboard:** http://localhost:3333

---

## Legacy Context (Below)

## Business Model
- $1/7-day trial → Pro subscription
- Ambassadors earn $10/mo per referred pro user
- Discord mastermind + live events

## Key Contacts
- **Bobby Newland** - Owner/Creator (EST, Atlanta)
- Audio engineering + 10yr marketing agency background

## Recent Work

### Mission Control (2026-02-10)
- URL: https://ai-skills-workspace.vercel.app
- Firebase sync: winslow-756c3-default-rtdb
- Features: Tasks (Kanban), Notes, Files, Google Tools tabs
- Mobile: Touch drag (25px threshold), horizontal scroll, scroll indicator

### Template Packs
- Bold Fashion V3 (Black/Latina/Asian models, BOSS|OWN IT|POWER typography)

### Link in Bio
- YASIN AHMED page (purple/green botanical, 8 social icons)

## Lessons Learned
- Native HTML5 drag-drop > @dnd-kit for cross-column Kanban
- Firebase localStorage fallback pattern
- seedream4k needs: `fal-ai/bytedance/seedream/v4.5/text-to-image`
- OpenRouter: `"api": "openai-completions"` not "openai-chat"
- **Mobile touch scroll**: Don't use `touch-action: none` on containers - it blocks scroll. Use 25px threshold on cards for drag vs scroll distinction
- **Scroll indicators**: Must be fixed-position OUTSIDE scroll container, track via window.scrollY not container.scrollTop

## Active Todo
- [ ] V4 templates with textured backgrounds
- [ ] Apply creative director research
- [ ] Generate enhanced template designs
- [ ] Create Link in Bio page templates

## User Preferences (2026-02-16)
- On VPS, generated images should be uploaded to Google Drive immediately and deleted from local disk to save storage.
- ALWAYS set Google Drive links to public ("anyone" with "reader" role) before uploading to the production CMS or sharing for platform use.
- Remix requests should use inspiration-only transformations with different subjects (avoid near-duplicate likeness/composition).
- Mixtape templates should avoid tiny text; keep large, clean text-safe zones only.
- Pack thumbnails default to 4:5 unless explicitly changed.

## Recent Work (2026-02-16)
- Created and uploaded Mixtape Cover Pack assets (diverse subjects; 2 female + 1 male) with production-safe remix guidance.
- Added auto-archive workflow: generated images now upload to Drive then delete locally on VPS.
- Confirmed production endpoint for draft uploads: `https://aiskills.studio/api/v1/clawdbot/upload-pack`.
- Successful production draft upload:
  - Pack ID: `1607965b-28a2-4ed2-86aa-acca8cb15ad5`
  - Template IDs: `d19a5b84-ab9f-4205-a474-4a2bc67d3c56`, `76ab0b10-fb11-414d-bfd2-221dd5f731ee`, `1c76d798-e6a6-4546-acad-e97af2847f9c`
- Clawdbot schema reference source: `/root/.openclaw/workspace/clawdbot_schemas.md`.
