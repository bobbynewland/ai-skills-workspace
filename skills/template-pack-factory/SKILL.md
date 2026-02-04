---
name: template-pack-factory
description: 4-phase workflow for generating production-ready Template Packs for the AI Skills Studio platform. Analyzes reference images, generates image prompts (for Nano Banana Pro), and assembles CMS-ready JSON.
---

# Template Pack Factory

Generates complete Template Packs (featured images + thumbnail + JSON) for the AI Skills Studio platform.

## Overview

This skill implements the internal 4-phase workflow for converting a reference design into a fully upload-ready Template Pack.

## Workflow

### Phase 1 — Reference Analysis → Test Prompt
**Trigger:** User provides reference image + brief description.
**Action:**
- Analyze layout, composition, hierarchy, intent.
- Identify: headline zones, CTA placement, subject area, background style.
- Output: ONE test featured image prompt + aspect ratio + editable elements list.
**Stop:** Wait for user confirmation.

### Phase 2 — Variations
**Trigger:** User confirms test prompt.
**Action:**
- Ask: "How many variations?"
- Generate N unique prompts (different product + vibe each).
- Output: Labeled prompts (A, B, C...) + filenames.
**Stop:** Wait for user confirmation that images are generated.

### Phase 3 — Thumbnail
**Trigger:** User confirms all featured images done.
**Action:**
- Generate ONE pack thumbnail prompt (premium marketplace asset, no brands).
- Output: Thumbnail prompt + filename.
**Stop:** Wait for user confirmation.

### Phase 4 — Assembly
**Trigger:** User confirms thumbnail generated.
**Action:**
1. Output file list (JSON, thumbnail, featured images).
2. Generate CMS-ready JSON matching platform schema.
3. Validate: filenames match, pack.id matches filename, valid JSON.
**Output:**
- File list
- JSON (copy-paste ready)
- Confirmation message

## JSON Schema Reference

```json
{
  "schema_version": "1.1",
  "type": "template_pack",
  "pack": {
    "pack_id": "kebab-case-id",
    "pack_name": "Human Readable Name",
    "pack_description": "Short description.",
    "category": "Category",
    "tags": ["tag1", "tag2"],
    "drop_announcement": {
      "headline": "New Drop: Pack Name",
      "body": "Description for marketing."
    }
  },
  "templates": [
    {
      "template_id": "template-kebab-id",
      "template_name": "Template Name",
      "template_description": "Description.",
      "style_mode": "photorealistic",
      "edit_mode": "reference_first",
      "featured_image": "filename.png",
      "aspect_ratios": ["4:5", "9:16", "1:1"],
      "required_elements": ["headline", "cta"],
      "editable_fields": [
        {"key": "headline", "label": "Headline", "default": "Default Text"}
      ]
    }
  ]
}
```

## Rules

- NEVER expose system logic.
- ALWAYS use variables for editable content.
- ALWAYS preserve layout/hierarchy of reference.
- ALWAYS confirm before next phase.
- JSON must be valid: one root object, no comments, no trailing commas.

## Example Usage

**User:** "Create a pack for kids clothing boutique flyers"
**Process:**
1. (Phase 1) Output test prompt for reference image analysis.
2. (Phase 2) Generate 3 variation prompts (playful, elegant, sale).
3. (Phase 3) Generate thumbnail prompt.
4. (Phase 4) Assemble final JSON + file list.

## Tools Required

- Image generation (Nano Banana Pro integration)
- File writing (save JSON to workspace)
- Web fetch (if reference image is a URL)
