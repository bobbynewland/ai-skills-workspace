#!/bin/bash
# Generate Service Professionals Pack 2
# Run this script to create all 4 templates

echo "🎨 Generating Service Professionals Pack 2..."
echo ""

# Template 1: Auto Mechanic
echo "1️⃣ Auto Mechanic Template"
curl -X POST https://queue.fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image \
  -H "Authorization: Key f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional auto mechanic shop advertisement, confident Hispanic male mechanic in navy blue coveralls working on car engine in modern garage, tools and equipment visible, text PREMIER AUTO CARE at top, COMPLETE CAR CARE headline, WE KEEP YOU MOVING tagline, professional automotive advertisement, navy blue and orange color scheme, full-bleed edge-to-edge, high-end commercial quality, 1080x1920px vertical format",
    "aspect_ratio": "9:16"
  }' > auto_mechanic_response.json

# Template 2: Landscaper
echo "2️⃣ Landscaper Template"
curl -X POST https://queue.fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image \
  -H "Authorization: Key f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional landscaping company advertisement, African American male landscaper in green polo shirt and khaki pants standing in beautifully manicured garden with trimmers, lush greenery and flowers, text GREEN THUMB LANDSCAPING at top, TRANSFORM YOUR OUTDOORS headline, YOUR DREAM YARD AWAITS tagline, professional landscaping advertisement, green and earth tone color scheme, full-bleed edge-to-edge, high-end commercial quality, 1080x1920px vertical format",
    "aspect_ratio": "9:16"
  }' > landscaper_response.json

# Template 3: Handyman
echo "3️⃣ Handyman Template"
curl -X POST https://queue.fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image \
  -H "Authorization: Key f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional handyman services advertisement, Caucasian male handyman in red flannel shirt with tool belt holding power drill in modern home interior, tools visible, text MR FIXIT HANDYMAN at top, NO JOB TOO SMALL headline, HOME REPAIR EXPERTS tagline, professional handyman advertisement, red and gray color scheme, full-bleed edge-to-edge, high-end commercial quality, 1080x1920px vertical format",
    "aspect_ratio": "9:16"
  }' > handyman_response.json

# Template 4: HVAC Technician
echo "4️⃣ HVAC Technician Template"
curl -X POST https://queue.fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image \
  -H "Authorization: Key f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional HVAC technician advertisement, Asian male technician in blue uniform holding tablet near modern air conditioning unit in clean attic space, professional equipment visible, text COOL BREEZE HVAC at top, STAY COMFORTABLE YEAR-ROUND headline, HEATING AND COOLING EXPERTS tagline, professional HVAC advertisement, blue and white color scheme, full-bleed edge-to-edge, high-end commercial quality, 1080x1920px vertical format",
    "aspect_ratio": "9:16"
  }' > hvac_response.json

echo ""
echo "✅ Generation requests submitted!"
echo "Check response JSON files for image URLs"
