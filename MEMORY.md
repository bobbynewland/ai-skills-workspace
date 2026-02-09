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
1. MiniMax M2.1 (Primary)
2. Gemini 1.5 Flash (Fallback)

**Coding:**
1. Pony Alpha (OpenRouter - FREE!)
2. Gemini CLI / Gemini API (Fallback)
3. MiniMax M2.1 (Final)

**General Tasks:**
1. Gemini Flash (Speed)
2. Gemini Pro (Complex reasoning)
3. MiniMax M2.1 (Final)

### API Keys
- `/root/.openclaw/workspace/.keys/google_ai_studio.key`
- `/root/.openclaw/workspace/.keys/vertex_ai.json`
- `/root/.openclaw/workspace/.keys/fal.key` (for seedream4k)
- `/root/.openclaw/workspace/.keys/heygen.key` (for training videos)
- `/root/.openclaw/workspace/.keys/openrouter.key` (for Pony Alpha)

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

- Telegram gateway needs periodic restarts
- seedream4k requires specific Fal API endpoint: `fal-ai/bytedance/seedream/v4.5/text-to-image`
- Backup workspace regularly with `tar` excluding venv/node_modules
- "run a back" = push to GitHub
- OpenRouter config requires `"api": "openai-completions"` format (not "openai-chat")
- Google Slides scope (`https://www.googleapis.com/auth/slides`) is invalid for this OAuth token

---

## Todo

- [ ] Implement textured backgrounds in V4
- [ ] Apply creative director research findings
- [ ] Get Firebase/command board operational
- [ ] Generate V4 templates with enhanced design elements
- [x] Create HeyGen training video skill
- [x] Configure OpenRouter Pony Alpha for free coding
- [ ] Create Link in Bio page templates
