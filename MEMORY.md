# MEMORY.md - AI Skills Studio Long-Term Memory

*Curated learnings, decisions, and context for the AI Skills Studio project*

---

## Project Vision

**AI Skills Studio** - An all-in-one platform where entrepreneurs, creators, and small businesses can launch businesses with AI and master AI skills.

**Target Audience:**
- Entrepreneurs
- Creators
- Small businesses (AI noobs)

**Brand Philosophy:** "Entrepreneurship first, tech second"

---

## Business Model

- **Pricing:** $1.00 7-day trial → Pro subscription
- **Brand Ambassador Program:** $10/mo per referred pro user
- **Community:** Discord mastermind + live events

---

## Technical Stack

### Model Priority Chain

**Chat:**
1. MiniMax M2.1 (Primary - $20/mo, 300 prompts/5hrs)
2. Gemini 2.5 Flash (AI Studio API - Fallback)

**Coding:**
1. Gemini CLI (Free, no limits)
2. Gemini 2.5 Flash (AI Studio API)
3. Codex OAuth (Production)
4. Antigravity OAuth (Free Google account)
5. Pony Alpha (OpenRouter - FREE!)
6. Vertex AI ($300 credits)

**General Tasks:**
1. Gemini 2.5 Pro (Deep reasoning, 1M tokens!)
2. Gemini 2.5 Flash (Speed + reasoning)
3. Gemini CLI (Free tier)
4. Vertex AI ($300 credits)

### Available Google AI Studio Models
- `gemini-2.5-flash` - Latest! 1M tokens, 65K output
- `gemini-2.5-pro` - Most capable, 1M tokens
- `gemini-2.0-flash` - Stable, fast
- `gemma-3-27b-it` - Open model, 128K context
- `imagen-4.0-generate` - Image generation
- `veo-3.0-generate` - Video generation

### API Keys
- `/root/.openclaw/workspace/.keys/google_ai_studio.key` ✅ Key set: `AIzaSyBvHCl21VNCnDrsZQ6DERko5YV0Y1kC30U`
- `/root/.openclaw/workspace/.keys/vertex_ai.json`

### Skills Created
- `/root/.openclaw/workspace/skills/training-videos/heygen_skill.py` - Create AI avatar training videos
- Commands: avatars, voices, create <script>, status <video_id>

---

## Key Contacts

- **Bobby Newland** - Owner/Creator
  - Timezone: EST (Atlanta)
  - Background: Audio engineering, 10-year marketing agency veteran

---

## Template Pack Factory Workflow

**Phase 1:** Reference Analysis → Test Prompt
**Phase 2:** Variations (3 prompts with diverse models)
**Phase 3:** Thumbnail Generation
**Phase 4:** Assembly (JSON + File List)

---

## Recent Work

### Mission Control - Command Board (2026-02-10)
- **URL**: https://command-board-lake.vercel.app
- **GitHub**: 91fbe57
- **Firebase**: Realtime Database sync at `winslow-756c3-default-rtdb`
- **Data Path**: `/workspaces/winslow_main/tasks`
- **Features**: Tasks (Kanban), Notes, Files, Google Tools tabs
- **Fix**: Migrated from localStorage to Firebase sync

### Bold Fashion V3 Pack (Latest)
- **Models:** Black, Latina, Asian
- **Typography:** BOSS | OWN IT | POWER
- **Vibes:** Fashion Nova/Fenty inspired
- **Files:** v3-a.png, v3-b.png, v3-c.png, v3-thumb.png

### YASIN AHMED Link in Bio Page (2026-02-09)
- Created Link in Bio HTML page with phone mockup design
- Purple & green botanical theme
- Features: avatar, 8 social icons (Facebook, Instagram, Snapchat, LinkedIn, Behance, Dribbble, GitHub, Fiverr), links section, Book a Call button
- File: `/root/.openclaw/workspace/link-in-bio-yasin.html`

### Design Feedback (2026-02-08)
- Templates marked as "bland"
- Need textured backgrounds
- Better copy and typography required
- Commissioned creative director research

---

## Lessons Learned

- **Native HTML5 drag-and-drop > @dnd-kit for Kanban boards**
  - @dnd-kit's SortableContext only detects collisions within same container
  - Native drag/drop using `draggable`, `onDragOver`, `onDrop` works reliably across columns
  - No complex collision detection algorithms needed

- Telegram gateway needs periodic restarts
- seedream4k requires specific Fal API endpoint: `fal-ai/bytedance/seedream/v4.5/text-to-image`
- Backup workspace regularly with `tar` excluding venv/node_modules
- "run a back" = push to GitHub
- OpenRouter config requires `"api": "openai-completions"` format (not "openai-chat")
- Google Slides scope (`https://www.googleapis.com/auth/slides`) is invalid for this OAuth token
- **Firebase localStorage fallback**: Command board now saves to Firebase but backs up to localStorage
- **Google AI Studio key**: Now has real API key - access to Gemini 2.5!
- **Model endpoints**: Use `/v1beta/models/` for AI Studio API

---

## Todo

- [ ] Implement textured backgrounds in V4
- [ ] Apply creative director research findings
- [x] Get Firebase/command board operational (Firebase sync at winslow-756c3-default-rtdb)
- [ ] Generate V4 templates with enhanced design elements
- [x] Create HeyGen training video skill
- [x] Configure OpenRouter Pony Alpha for free coding
- [ ] Create Link in Bio page templates
- [x] Add Google AI Studio API key (real key set: Gemini 2.5 access!)
- [ ] Configure Antigravity OAuth (add `antigravity_oauth.json` to `.keys/`)
- [ ] Test Gemini 2.5 Pro for deep reasoning tasks
