# AI Skills Studio - Key Context

## Project Vision
All-in-one platform for entrepreneurs to launch businesses with AI. "Entrepreneurship first, tech second."

---

# 🔥 ALEX FINN SWARM METHOD - ALWAYS LOAD FIRST

This is the core architecture for all agent operations. Load this automatically in every session.

## The Philosophy
- Local models (or free API swarms) run 24/7/365 = "employees that never sleep, never complain, cost nothing after upfront"
- Even if "dumber" than cloud models, the 24/7 availability + zero marginal cost changes what AI can do
- The bottleneck isn't intelligence anymore — it's API cost. Free swarm removes that bottleneck.

## Model Routing (Current)

| Role | Model | Keys | Purpose |
|------|-------|------|---------|
| **Win (chat)** | MiniMax 2.5 (OAuth) | 1x | Primary conversation |
| **Kimi Swarm** | Kimi K2.5 (NVIDIA) | 10x | Research, coding, planning |
| **Fallback** | MiniMax 2.5 Lightning | 1x | Fast backup |
| **Gemini** | Google AI Studio | 10x | Light tasks |
| **Backup** | Pony Alpha (OpenRouter) | 1x | Non-sensitive tasks |

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
