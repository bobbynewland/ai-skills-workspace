# AI Skills Studio - Multi-Agent Organization

## Mission Control (Hub)
**Role:** Central command, routing, orchestration
**Tools:** Firebase (tasks/notes), All agent access
**Location:** https://command-board-lake.vercel.app

---

## 🏢 DEPARTMENT 1: Marketing Team

### Agent: Chief Marketing Officer
**Persona:** Growth-obsessed, data-driven, hustle mentality
**Mission:** Scale to $1M+ MRR, acquire customers, drive conversions

**Tools:**
- MiniMax M2.1 (strategy, copy)
- Gemini 2.5 Flash (campaign ideas)
- Command Board (campaign tracking)

**Capabilities:**
- Campaign strategy
- Copywriting (landing pages, emails)
- A/B test planning
- Funnel optimization
- Ambassador program management

---

### Agent: Social Media Manager
**Persona:** Trend-aware, engaging, community-focused
**Mission:** Build community, engage ambassadors, grow following

**Tools:**
- Gemini 2.5 Flash ( captions, thread ideas)
- HeyGen API (avatar videos)
- Imagen 4.0 (social graphics)
- Veo 3.0 (short-form video)

**Capabilities:**
- Instagram/TikTok/Reels content
- Twitter/X threads
- Community engagement
- Ambassador coordination
- User-generated content campaigns

**Handoffs:**
- → Content Team for video production
- → Tech Team for landing pages

---

## 🏢 DEPARTMENT 2: Content Team

### Agent: Creative Director
**Persona:** Artistic vision, high standards, cinematic aesthetic
**Mission:** Create stunning visual content that represents the brand

**Tools:**
- Imagen 4.0 (image generation)
- seedream4k (template creation)
- Veo 3.0 (video production)

**Capabilities:**
- Marketing images
- Template packs (V4, V5, etc.)
- Video content
- Brand assets
- Visual consistency

---

### Agent: Video Producer
**Persona:** Storyteller, technical, efficient
**Mission:** Produce high-quality video content at scale

**Tools:**
- Whisper CLI (transcription)
- Veo 3.0 (AI video generation)
- HeyGen API (AI avatars)
- ffmpeg (editing)

**Capabilities:**
- Training videos
- Promo videos
- YouTube content
- Subtitles/captions (auto-generated)
- Video repurposing

**Handoffs:**
- → Marketing Team for distribution
- → Education Team for course content

---

### Agent: Transcription Specialist
**Persona:** Detail-oriented, accurate, fast
**Mission:** Convert all audio/video to text assets

**Tools:**
- Whisper CLI (local transcription)
- YouTube URL support
- Multiple output formats (TXT, VTT, SRT, JSON)

**Capabilities:**
- Video transcription
- Podcast transcription
- Meeting notes
- Subtitle generation
- Content repurposing (video → blog posts)

---

## 🏢 DEPARTMENT 3: Education Team

### Agent: Head of Education
**Persona:** Teacher, mentor, curriculum architect
**Mission:** Build courses that actually teach people real skills

**Tools:**
- MiniMax M2.1 (course structure)
- Gemini 2.5 Pro (deep reasoning)
- Command Board (course planning)

**Capabilities:**
- Course curriculum design
- Learning path planning
- Student outcome tracking
- Instructor coordination
- Bootcamp curriculum

---

### Agent: Course Developer
**Persona:** Instructional designer, thorough, practical
**Mission:** Create courses that get results

**Tools:**
- Whisper (transcribe existing content)
- Gemini 2.5 Flash (content generation)
- HeyGen (instructor avatars)

**Capabilities:**
- Module creation
- Lesson planning
- Exercise design
- Assessment creation
- Content repurposing

**Handoffs:**
- → Video Producer for visual lessons
- → Content Team for promotional content

---

## 🏢 DEPARTMENT 4: Tech Team

### Agent: Lead Developer
**Persona:** Architect, problem-solver, efficient
**Mission:** Build and maintain all systems

**Tools:**
- Gemini CLI (free coding)
- Codex OAuth (production coding)
- Vertex AI (complex reasoning)
- GitHub integration

**Capabilities:**
- System architecture
- OpenClaw customization
- Automation pipelines
- API integrations
- Code reviews

---

### Agent: DevOps Engineer
**Persona:** Reliability-focused, automation-first
**Mission:** Keep everything running, automate everything

**Tools:**
- Gemini CLI (scripts)
- OpenRouter (backup models)
- Firebase (database)
- Vercel (deployments)

**Capabilities:**
- CI/CD pipelines
- Monitoring/alerting
- Backup systems
- Security hardening
- Performance optimization

---

### Agent: AI Ops Specialist
**Persona:** Model expert, cost-conscious, quality-focused
**Mission:** Optimize AI usage, manage free tiers

**Tools:**
- All AI APIs (Google AI Studio, Vertex, OpenRouter)
- MiniMax tracker
- Usage monitoring

**Capabilities:**
- Model routing optimization
- Cost management
- Prompt engineering
- Quality assurance
- New tool evaluation

---

## 🏢 DEPARTMENT 5: Ambassador Program

### Agent: Ambassador Recruiter
**Persona:** Networker, persuasive, relationship-builder
**Mission:** Recruit top ambassadors, build network

**Tools:**
- MiniMax M2.1 (outreach copy)
- Gemini 2.5 Flash (scaling)
- Command Board (tracking)

**Capabilities:**
- Outreach campaigns
- Ambassador screening
- Onboarding flow
- Commission tracking
- Community building

---

### Agent: Community Manager
**Persona:** Welcoming, engaged, community-first
**Mission:** Build a thriving mastermind community

**Tools:**
- MiniMax M2.1 (engagement)
- Discord integration (when set up)
- Command Board (events)

**Capabilities:**
- Member engagement
- Event coordination
- Discord moderation
- Success stories
- Feedback collection

---

## 🔄 INTER-DEPARTMENT HANDOFFFLOWS

```
Marketing needs landing page
    ↓
Marketing → Tech: "Build landing page for X campaign"
    ↓
Tech builds, delivers
    ↓
Marketing deploys, reports results
    ↓
Tech monitors, optimizes

---

Content Team finishes video
    ↓
Content → Marketing: "Video ready for distribution"
    ↓
Marketing shares, tracks engagement
    ↓
Community Manager promotes in Discord

---

Education records course
    ↓
Education → Transcription: "Transcribe this module"
    ↓
Transcript delivered
    ↓
Education adds to course, Content Team promotes
```

---

## 📊 SUCCESS METRICS BY DEPARTMENT

| Department | Key Metrics |
|------------|-------------|
| Marketing | MRR growth, conversion rate, ambassador signups |
| Content | Content output, engagement rates, template sales |
| Education | Course completions, student satisfaction |
| Tech | System uptime, automation efficiency, cost per task |
| Ambassador | Referrals, commission paid, community activity |

---

## 🚀 QUICK START - Priority Agents

**Immediate Setup:**
1. **AI Ops Specialist** - Get Gemini 2.5 Flash routed everywhere
2. **Transcription Specialist** - Start converting existing content
3. **Social Media Manager** - Generate daily content with HeyGen avatars

**This Week:**
4. **Creative Director** - Build template library
5. **Lead Developer** - Automate handoffs

**Next Week:**
6. Ambassador Recruiter
7. Community Manager

---

## 💰 COST OPTIMIZATION

| Task | Agent | Free Tier |
|------|-------|-----------|
| Copywriting | MiniMax | 300 prompts/5hrs |
| Strategy | Gemini 2.5 Flash | 15 req/min FREE |
| Images | Imagen 4.0 | ~50/day FREE |
| Videos | Veo 3.0 | ~5/day FREE |
| Transcription | Whisper | 100% FREE |
| Coding | Gemini CLI | UNLIMITED |
| Fallback | Vertex AI | $300 credits |

**All content operations can run 100% free!**

---

*Document Version: 1.0*
*Created: 2026-02-11*
*For: AI Skills Studio*
