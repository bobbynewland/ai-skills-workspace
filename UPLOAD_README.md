# Bold Fashion V4 - Upload Package

## Files Included

### Template Images
- `v4-a.png` - BOLD EARTH (Hero Center layout)
- `v4-b.png` - NEON NOIR (Split layout)  
- `v4-c.png` - JEWEL TONES (Typography Hero layout)
- `v4-thumb.png` - Pack thumbnail

### Upload JSON Files
- `v4-a-upload.json` - Upload config for Template A
- `v4-b-upload.json` - Upload config for Template B
- `v4-c-upload.json` - Upload config for Template C

### Full Schema
- `bold-fashion-v4-schema.json` - Complete remix system with prompt enhancers

## Upload Instructions

### Option 1: Using Upload Script

```bash
cd /root/.openclaw/workspace

# Upload Template A
python3 skills/template-creator/scripts/upload_template.py upload \
  v4-a.png v4-a-upload.json \
  --token YOUR_API_TOKEN \
  --url https://ai-skills-bootcamp-portal.vercel.app/api

# Upload Template B
python3 skills/template-creator/scripts/upload_template.py upload \
  v4-b.png v4-b-upload.json \
  --token YOUR_API_TOKEN

# Upload Template C
python3 skills/template-creator/scripts/upload_template.py upload \
  v4-c.png v4-c-upload.json \
  --token YOUR_API_TOKEN
```

### Option 2: Direct cURL

```bash
# Template A
curl -X POST https://ai-skills-bootcamp-portal.vercel.app/api/templates \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "image=@v4-a.png" \
  -F "template=@v4-a-upload.json" \
  -F "status=draft"

# Template B
curl -X POST https://ai-skills-bootcamp-portal.vercel.app/api/templates \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "image=@v4-b.png" \
  -F "template=@v4-b-upload.json" \
  -F "status=draft"

# Template C
curl -X POST https://ai-skills-bootcamp-portal.vercel.app/api/templates \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "image=@v4-c.png" \
  -F "template=@v4-c-upload.json" \
  -F "status=draft"
```

## API Token

You need to provide your API token. If you don't have one:
1. Log into the AI Skills Bootcamp Portal admin panel
2. Go to Settings → API
3. Generate a new API token
4. Copy the token and use it in the upload commands above

## After Upload

1. Go to admin panel to review uploaded templates
2. Publish templates when ready
3. They will appear in the template library for users

## File Sizes
- v4-a.png: 3.8 MB
- v4-b.png: 3.2 MB
- v4-c.png: 3.6 MB
- v4-thumb.png: 4.3 MB

All files are under 10MB limit ✓
