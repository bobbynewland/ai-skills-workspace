#!/bin/bash
# Generate Training Video Thumbnails
# Usage: ./generate_video_thumbnails.sh "Video Title"

TITLE="$1"
STYLE="${2:-bold}"

if [ -z "$TITLE" ]; then
    echo "Usage: ./generate_video_thumbnails.sh 'Video Title' [style]"
    echo "Styles: bold, clean, comparison"
    exit 1
fi

OUTPUT_DIR="/root/.openclaw/workspace/training_thumbnails"
mkdir -p "$OUTPUT_DIR"

SAFE_TITLE=$(echo "$TITLE" | tr ' ' '_' | tr -cd '[:alnum:]_')

echo "🎨 Generating thumbnails for: $TITLE"

# YouTube Thumbnail (1280x720)
echo "Creating YouTube thumbnail..."
nano-banana generate "YouTube thumbnail, $STYLE style, bold text '$TITLE' in large white Impact font with black outline, cartoon lobster mascot with sunglasses, gradient blue-purple background #00d4ff to #7b2cbf, high contrast, viral clickbait style, excited energy, 1280x720px" --output "$OUTPUT_DIR/${SAFE_TITLE}_youtube.png"

# TikTok Cover (1080x1920)
echo "Creating TikTok cover..."
nano-banana generate "TikTok video cover, vertical format, $STYLE style, '$TITLE' text, cartoon lobster mascot center, neon glow effects, blue-purple gradient background, attention-grabbing, 1080x1920px" --output "$OUTPUT_DIR/${SAFE_TITLE}_tiktok.png"

# Instagram Square (1080x1080)
echo "Creating Instagram thumbnail..."
nano-banana generate "Instagram square post, $STYLE style, '$TITLE' text, cartoon lobster mascot, clean modern design, blue accent color #00d4ff, professional look, 1080x1080px" --output "$OUTPUT_DIR/${SAFE_TITLE}_instagram.png"

echo "✅ Thumbnails generated:"
ls -lh "$OUTPUT_DIR/${SAFE_TITLE}_"*.png
