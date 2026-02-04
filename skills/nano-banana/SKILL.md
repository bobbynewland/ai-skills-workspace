---
name: nano-banana
description: Image generation skill using Google AI Studio (Gemini API). Generates high-quality marketing images for template packs.
---

# Nano Banana — Image Generation

Uses Google AI Studio API for generating template images.

## Setup

API key stored at: `/root/.openclaw/workspace/.keys/google_ai_studio.key`

## Usage

Generate images for template packs:

```bash
# Generate single image
nano-banana generate "prompt here" --output filename.png

# Generate variation set
nano-banana generate-batch prompts.txt --output-dir ./images/
```

## API Endpoints

Base: `https://generativelanguage.googleapis.com/v1beta/models/`

Model: `gemini-pro-vision` (for prompts) or `gemini-1.5-flash` for generation

## Image Generation Prompts

### Template Featured Images
```
Professional [niche] marketing template, [style] design, [color scheme], 
featuring [subject], clean layout, high resolution, 1080x1080px, 
marketing-ready, no text overlays
```

### Pack Thumbnails
```
Premium template pack thumbnail, [niche] collection, marketplace style, 
grid layout preview, professional mockup, 1200x800px
```

## Workflow Integration

1. Receive prompt from template-pack-factory
2. Call Google AI Studio API
3. Save generated image to workspace
4. Return file path for JSON assembly

## Example

**Input:** "Kids clothing boutique Instagram post, playful pastel design, featuring children's apparel, clean modern layout"

**Output:** `kids-boutique-01.png` (1080x1080px)

## Rate Limits

- 60 requests/minute (free tier)
- Monitor credit usage: $300 total

## Safety

- API key never exposed in logs
- All requests use HTTPS
- Images saved to workspace only
