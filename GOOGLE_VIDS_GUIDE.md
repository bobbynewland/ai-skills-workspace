# Google Vids + Notebook LM - Video Creation Guide

Complete workflow for creating AI Skills Bootcamp training videos using Google's AI tools.

## 🚀 Quick Start (5 Minutes)

### 1. Research (Notebook LM - 2 min)
```
https://notebooklm.google.com
```
- Create notebook: "AI Skills Training"
- Upload docs or paste content
- Ask: "Create 60-sec tutorial outline"

### 2. Script (Notebook LM → Script - 1 min)
```bash
python3 notebooklm_to_script.py "Your Topic" quick_win
```
- Paste Notebook LM output
- Get structured script

### 3. Edit (Google Vids - 2 min)
```
https://vids.google.com
```
- Upload screen recording
- Apply AI features
- Export

## 📚 Detailed Workflows

### Workflow A: Quick Tutorial (60 seconds)

**Notebook LM Setup:**
1. Create notebook: "[Feature] Quick Tutorial"
2. Add sources:
   - Platform help docs
   - 2-3 competitor tutorial transcripts
   - User FAQ about this feature
3. Prompt: "Create a 60-second script for beginners"

**Output Format:**
```
HOOK: [Attention grabber]
PROBLEM: [Common pain point]
SOLUTION: [3 quick steps]
CTA: [Call to action]
```

**Google Vids Edit:**
1. New project → "Quick Tutorial" template
2. Import:
   - 10-sec screen recording (hook)
   - 20-sec problem demo
   - 25-sec solution walkthrough
   - 5-sec outro with logo
3. AI Features:
   - ✅ Smart Cut (remove pauses)
   - ✅ Auto Captions (style: Bold)
   - ✅ Scene Detection
4. Branding:
   - Add OpenClaw logo (bottom right)
   - Lower third: Gradient #00d4ff → #7b2cbf
   - Font: White, Impact-style
5. Export: 1080p, 16:9

---

### Workflow B: Deep Dive Tutorial (5 minutes)

**Notebook LM Setup:**
1. Create notebook: "[Feature] Masterclass"
2. Add sources:
   - Full documentation
   - Advanced use cases
   - Pro tips collection
   - Common mistakes
3. Prompt: "Create comprehensive outline with pro tips"

**Sections:**
```
1. INTRO (0:00-0:30)
   - What you'll learn
   - Who this is for

2. WHY IT MATTERS (0:30-1:00)
   - Business impact
   - Real examples

3. WALKTHROUGH (1:00-4:00)
   - Step 1: [Action]
   - Step 2: [Action]
   - Step 3: [Action]
   - Pro tip: [Advanced technique]

4. NEXT STEPS (4:00-5:00)
   - Try it yourself
   - Additional resources
   - CTA
```

**Google Vids Edit:**
1. New project → "Tutorial" template
2. Structure:
   - Chapter markers for each section
   - B-roll: Product shots, examples
   - Zoom: On important UI elements
3. AI Features:
   - ✅ Smart Cut
   - ✅ Background music (Corporate Upbeat)
   - ✅ Text overlays for key stats
4. Graphics:
   - Lower thirds with section titles
   - Progress bar (YouTube-style)
   - End screen with subscribe CTA
5. Export: 1080p + Captions SRT file

---

### Workflow C: Comparison Video (3 minutes)

**Notebook LM Setup:**
1. Create notebook: "[Topic] Comparison"
2. Add sources:
   - Method A documentation
   - Method B documentation
   - Expert reviews
3. Prompt: "Compare [method A] vs [method B] objectively"

**Script Structure:**
```
HOOK: "X vs Y - which is better?"
SECTION A: Method breakdown
SECTION B: Alternative breakdown
COMPARISON: Side-by-side
VERDICT: Recommendation
```

**Google Vids Edit:**
1. New project → "Comparison" template
2. Visuals:
   - Split screen for comparison
   - Checkmark/X overlays
   - Scorecard graphic
3. AI Features:
   - ✅ Scene matching
   - ✅ Smooth transitions
4. Export: 16:9 + 9:16 versions

---

## 🎨 Google Vids AI Features Guide

### Smart Cut
**What it does:** Removes silences, umms, mistakes automatically
**Best for:** Raw screen recordings, presenter videos
**How to use:**
1. Upload video
2. Click "Smart Cut"
3. Adjust sensitivity (Low/Med/High)
4. Review cuts
5. Apply

### Auto Captions
**What it does:** Generates captions with 95%+ accuracy
**Best for:** All videos (90% watch muted!)
**Style options:**
- **Bold:** Large, high contrast (recommended)
- **Minimal:** Small, bottom placement
- **Highlighted:** Background highlight

**AI Skills Branding:**
- Font: Sans-serif, bold
- Color: White text, black outline
- Position: Bottom center
- Animation: Pop-in

### Background Removal
**What it does:** Removes/replaces background without green screen
**Best for:** Presenter videos, talking head
**Use cases:**
- Clean office background
- Branded gradient background
- Blur background

### Scene Suggestions
**What it does:** AI suggests where to add B-roll
**Best for:** Tutorial videos, presentations
**How to use:**
1. Import main footage
2. Click "Scene Suggestions"
3. AI marks potential B-roll spots
4. Upload B-roll or use stock
5. Drag to suggested spots

---

## 🔄 Notebook LM → Google Vids Pipeline

### Step-by-Step

**1. Notebook LM Research (5 min)**
```bash
# Create comprehensive research doc
python3 notebooklm_to_script.py "Template Customization" deep_dive

# Paste research when prompted
# (Copy from Notebook LM export)
```

**2. Review Script Output**
```json
{
  "topic": "Template Customization",
  "script": {
    "intro": "Today we're mastering template customization",
    "walkthrough": ["Step 1", "Step 2", "Step 3"],
    ...
  },
  "b_roll_suggestions": [...],
  "google_vids_notes": {...}
}
```

**3. Prepare Assets**
- Screen recordings (OBS/Loom)
- Thumbnails (generated)
- Logo/branding files
- B-roll footage

**4. Google Vids Import**
- Upload all assets
- Organize in bins
- Create project from template

**5. AI-Assisted Edit**
- Apply Smart Cut
- Add Auto Captions
- Use Scene Suggestions
- Add branding

**6. Export Multi-Format**
- YouTube: 16:9, 1080p
- TikTok: 9:16, 1080p
- Instagram: 1:1, 1080p

---

## 🎬 Batch Creation Workflow

### Create 5 Videos in 1 Hour

**Minutes 0-10: Research (Notebook LM)**
- Create 5 notebooks (one per topic)
- Generate outlines for all 5

**Minutes 10-20: Script Generation**
```bash
for topic in "Getting Started" "Templates" "Customization" "Exporting" "Pro Tips"; do
  python3 notebooklm_to_script.py "$topic" quick_win > "script_$topic.txt"
done
```

**Minutes 20-40: Record Screen**
- Batch record all 5 tutorials
- Use OBS scene switching

**Minutes 40-60: Google Vids Batch Edit**
1. Import all 5 recordings
2. Apply Smart Cut to all
3. Add captions (bulk apply)
4. Add intro/outro
5. Export all

**Result:** 5 videos ready for publishing!

---

## 📊 AI Skills Brand Kit for Google Vids

### Colors
- **Primary:** #00d4ff (Cyan)
- **Secondary:** #7b2cbf (Purple)
- **Accent:** #00ff88 (Green - for CTAs)
- **Text:** White on dark, Black on light

### Fonts
- **Headings:** Montserrat Bold
- **Body:** Inter Regular
- **Captions:** Bold sans-serif

### Logo Usage
- **Position:** Bottom right corner
- **Size:** 10% of video height
- **Opacity:** 80% (subtle)
- **Animation:** Fade in at 0:03

### Lower Thirds
```
┌─────────────────────────┐
│  [Logo]  Title Text     │
│          Subtitle       │
└─────────────────────────┘

Style:
- Background: Gradient cyan→purple
- Text: White, bold
- Animation: Slide up from bottom
- Duration: 5 seconds
```

### Outro Template
```
[0:00-0:03] Logo animation
[0:03-0:08] "Thanks for watching!"
[0:08-0:12] Subscribe button animation
[0:12-0:15] Links to other videos
```

---

## 🎯 Optimization Tips

### For YouTube
- Use chapters ( timestamps)
- Add end screens
- Custom thumbnails (1200x675)
- SEO descriptions

### For TikTok/Reels
- Hook in first 3 seconds
- Text overlays for key points
- Trending sounds (if applicable)
- Fast pacing

### For LinkedIn
- Professional tone
- Business-focused tips
- Text + video combo posts
- Industry insights

---

## 🚀 Advanced: API Integration (Coming Soon)

### Future Automation
```python
# Automatically generate from Notebook LM API
# Auto-upload to Google Vids
# Schedule to social platforms
```

---

**Tools:**
- 📝 Notebook LM: https://notebooklm.google.com
- 🎬 Google Vids: https://vids.google.com
- 🎨 Thumbnails: `/root/.openclaw/workspace/generate_video_thumbnails.sh`
- 📝 Scripts: `/root/.openclaw/workspace/notebooklm_to_script.py`

**Support:** Message @Winslow974_bot on Telegram
