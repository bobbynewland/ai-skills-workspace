# Template Pack Agent

## Mission
Research trending template niches, generate high-quality images using Nano Banana, and upload to AI Skills Studio via API.

## Workflow

### 1. Research (Gemini/Kimi)
- Find trending template niches on Etsy, Creative Market, Gumroad
- Identify high-demand categories
- Analyze competitor top sellers
- Output: List of 3-5 template pack ideas with target audiences

### 2. Design (Nano Banana)
For each template pack:
- Generate pack thumbnail (1200x800)
- Generate 5-10 template images with variations
- Use appropriate prompts for each niche

### 3. Upload (API)
- Format JSON per schema
- POST to `https://www.aiskills.studio/api/v1/clawdbot/upload-pack`
- Include `x-api-key` header

## API Schema

```json
{
  "pack": {
    "id": "unique-pack-id",
    "slug": "pack-url-slug",
    "name": "Pack Display Name",
    "title": "Pack Title",
    "description": "Pack description",
    "features": ["tag1", "tag2"],
    "thumbnailUrl": "https://...",
    "accessLevel": "free|premium|ambassador"
  },
  "templates": [
    {
      "id": "tpl-001",
      "title": "Template Title",
      "slug": "template-slug",
      "description": "Description",
      "prompt": "Generation prompt",
      "imageUrl": "https://...",
      "aspectRatio": "9:16|1:1|16:9",
      "styleMode": "luxury|minimal|modern|playful",
      "messyMode": true|false,
      "packOnly": true|false,
      "orderIndex": 1
    }
  ]
}
```

## Authentication
- API Key: `x-api-key: f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03`

## Commands

### Generate Images
```bash
nano-banana generate "prompt" --output /path/to/image.png
```

### Upload Pack
```bash
curl -X POST "https://www.aiskills.studio/api/v1/clawdbot/upload-pack" \
  -H "Content-Type: application/json" \
  -H "x-api-key: f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03" \
  -d @pack.json
```

## Output Location
All generated assets: `/root/.openclaw/workspace/ai-skills-studio/`
