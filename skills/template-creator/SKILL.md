---
name: template-creator
description: Create professional marketing templates (social media posts, print ads) for the AI Skills Bootcamp Portal. Generates high-quality template images and JSON template files that sync with the platform. Use when users need to create, design, or upload marketing templates for their business. Handles image generation, JSON template creation, and platform upload as drafts.
---

# Template Creator

Creates professional marketing templates for the AI Skills Bootcamp Portal platform.

## What This Skill Does

1. Generates high-quality marketing template images using AI image generation
2. Creates JSON template files with layer data, text positions, and metadata
3. Uploads both files to the platform API
4. Saves as drafts for user remixing

## Workflow

### 1. Understand Template Requirements

Ask the user:
- **Template type**: Instagram post, Facebook ad, print flyer, story, etc.
- **Business niche**: Kids clothing, restaurant, gym, real estate, etc.
- **Style**: Modern, vintage, minimalist, bold, luxury, playful
- **Color scheme**: Brand colors or specific palette
- **Content elements**: Text placeholders, image areas, logos, CTAs

### 2. Generate Template Image

Use image generation to create the base template. Include:
- Professional layout design
- Placeholder areas for user content (products, photos)
- Text areas with placeholder copy
- Brand-appropriate styling
- High resolution (1080x1080 for square posts, 1080x1920 for stories, etc.)

**Prompt formula:**
```
Professional [template type] template for [business niche], [style] design, [color scheme], featuring placeholder areas for [product/photo] and text sections, clean layout, marketing-ready, high quality
```

### 3. Create JSON Template File

Generate a JSON template with this structure:

```json
{
  "templateId": "unique-id",
  "name": "Template Name",
  "type": "instagram-post|facebook-ad|print-flyer|story",
  "category": "business-niche",
  "dimensions": {
    "width": 1080,
    "height": 1080
  },
  "layers": [
    {
      "id": "background",
      "type": "image",
      "src": "template-image-url",
      "position": {"x": 0, "y": 0},
      "size": {"width": 1080, "height": 1080}
    },
    {
      "id": "headline-text",
      "type": "text",
      "placeholder": "Your Headline Here",
      "position": {"x": 100, "y": 200},
      "font": "Arial",
      "size": 48,
      "color": "#000000",
      "editable": true
    },
    {
      "id": "product-image-area",
      "type": "image-placeholder",
      "position": {"x": 300, "y": 400},
      "size": {"width": 500, "height": 500},
      "placeholder": "Drop your product photo here",
      "editable": true
    }
  ],
  "metadata": {
    "createdAt": "timestamp",
    "style": "modern",
    "colors": ["#FF5733", "#33FF57"],
    "tags": ["fashion", "kids", "sale"]
  }
}
```

### 4. Upload to Platform

Upload both files to the platform:

**API Endpoint:** `POST https://ai-skills-bootcamp-portal.vercel.app/api/templates`

**FormData:**
- `image`: The generated template image file
- `template`: The JSON template file
- `status`: "draft"

**Headers:**
- `Authorization`: Bearer token (if required)
- `Content-Type`: multipart/form-data

### 5. Confirm Upload

Verify the template was saved as a draft and provide the user with:
- Template ID
- Preview URL
- Status confirmation

## Example Usage

**User:** "Create a kids clothing brand Instagram post template"

**Process:**
1. Generate image: "Professional Instagram post template for kids clothing brand, playful colorful design with pastel pink and blue, featuring placeholder area for product photo and text sections for headline and price, clean modern layout, marketing-ready"
2. Create JSON with layers for background, headline, description, product image area, CTA button
3. Upload to platform API
4. Confirm draft saved

## Reference Files

- [API_REFERENCE.md](references/API_REFERENCE.md) - Platform API documentation
- [TEMPLATE_SCHEMA.md](references/TEMPLATE_SCHEMA.md) - Full JSON schema for templates
- [STYLE_GUIDE.md](references/STYLE_GUIDE.md) - Design guidelines by business niche