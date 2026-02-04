#!/bin/bash
# Create Pack with Thumbnail - Automated Workflow
# Usage: ./create_pack.sh "Pack Name" "pack-slug" "thumbnail-prompt"

PACK_NAME="$1"
PACK_SLUG="$2"
THUMB_PROMPT="$3"
API_KEY="f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03"
API_ENDPOINT="https://ai-skills-bootcamp-portal.vercel.app/api/v1/clawdbot/upload-pack"

if [ -z "$PACK_NAME" ] || [ -z "$PACK_SLUG" ] || [ -z "$THUMB_PROMPT" ]; then
    echo "Usage: ./create_pack.sh 'Pack Name' 'pack-slug' 'thumbnail description'"
    exit 1
fi

echo "🎨 Step 1: Generating thumbnail for '$PACK_NAME'..."

# Generate thumbnail
THUMB_FILE="/root/.openclaw/workspace/template_packs/${PACK_SLUG}/pack_thumbnail.png"
mkdir -p "$(dirname "$THUMB_FILE")"

python3 << PYTHON
import sys
sys.path.insert(0, '/root/.openclaw/workspace/skills/nano-banana')
from nano_banana import generate_image

generate_image(
    """${THUMB_PROMPT}""",
    "$THUMB_FILE",
    1200,
    800
)
PYTHON

if [ ! -f "$THUMB_FILE" ]; then
    echo "❌ Thumbnail generation failed"
    exit 1
fi

THUMB_URL="http://147.93.40.188:8080/template_packs/${PACK_SLUG}/pack_thumbnail.png"

echo "✅ Thumbnail generated: $THUMB_URL"
echo ""
echo "📦 Step 2: Creating API payload..."

# Create payload with thumbnail
cat > "/tmp/${PACK_SLUG}_payload.json" << EOF
{
  "pack": {
    "name": "${PACK_NAME}",
    "slug": "${PACK_SLUG}",
    "access_level": "free",
    "is_published": false,
    "thumbnail_url": "${THUMB_URL}"
  },
  "templates": []
}
EOF

echo "🚀 Step 3: Uploading pack to CMS..."

# Upload pack
curl -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d @"/tmp/${PACK_SLUG}_payload.json"

echo ""
echo "✅ Pack '$PACK_NAME' created with thumbnail!"
echo "Thumbnail URL: $THUMB_URL"
