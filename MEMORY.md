# AI Skills Studio - Key Context

## Project Vision
All-in-one platform for entrepreneurs to launch businesses with AI. "Entrepreneurship first, tech second."

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
