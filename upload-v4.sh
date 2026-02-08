#!/bin/bash
# Bold Fashion V4 - Batch Upload Script
# Usage: ./upload-v4.sh YOUR_API_TOKEN

TOKEN=${1:-}
BASE_URL="https://ai-skills-bootcamp-portal.vercel.app/api"

if [ -z "$TOKEN" ]; then
    echo "❌ Error: API token required"
    echo "Usage: ./upload-v4.sh YOUR_API_TOKEN"
    echo ""
    echo "To get your token:"
    echo "1. Go to https://ai-skills-bootcamp-portal.vercel.app/admin"
    echo "2. Settings → API → Generate Token"
    exit 1
fi

echo "🚀 Uploading Bold Fashion V4 Templates..."
echo ""

upload_template() {
    local IMAGE=$1
    local JSON=$2
    local NAME=$3
    
    echo "📤 Uploading $NAME..."
    curl -X POST "$BASE_URL/templates" \
        -H "Authorization: Bearer $TOKEN" \
        -F "image=@$IMAGE" \
        -F "template=@$JSON" \
        -F "status=draft" \
        --silent --show-error \
        -w "\nStatus: %{http_code}\n" | jq . 2>/dev/null || echo "Response received"
    
    echo ""
}

# Upload all templates
upload_template "v4-a.png" "v4-a-upload.json" "Template A - BOLD EARTH"
upload_template "v4-b.png" "v4-b-upload.json" "Template B - NEON NOIR"
upload_template "v4-c.png" "v4-c-upload.json" "Template C - JEWEL TONES"

echo "✅ All templates uploaded! Check the admin panel to publish."
