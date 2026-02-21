#!/usr/bin/env python3
"""
Template Pack Agent
Research, generate, and upload template packs to AI Skills Studio
"""
import os
import json
import subprocess
import requests
from datetime import datetime

# Config
API_KEY = "f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03"
API_URL = "https://www.aiskills.studio/api/v1/clawdbot/upload-pack"
OUTPUT_DIR = "/root/.openclaw/workspace/ai-skills-studio"

def generate_image(prompt, output_path):
    """Generate image using Nano Banana"""
    result = subprocess.run(
        ["nano-banana", "generate", prompt, "--output", output_path],
        capture_output=True, text=True
    )
    return result.returncode == 0

def upload_pack(pack_data):
    """Upload pack to AI Skills Studio"""
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }
    resp = requests.post(API_URL, json=pack_data, headers=headers)
    return resp.json()

def create_pack(pack_idea):
    """Create a complete template pack"""
    pack_id = f"pack-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    slug = pack_idea["slug"]
    
    print(f"\n🎨 Creating pack: {pack_idea['name']}")
    
    # Generate thumbnail
    thumb_path = f"{OUTPUT_DIR}/{slug}-thumb.png"
    generate_image(pack_idea["thumbnail_prompt"], thumb_path)
    
    templates = []
    for i, tpl in enumerate(pack_idea["templates"], 1):
        print(f"  📷 Generating template {i}: {tpl['title']}")
        img_path = f"{OUTPUT_DIR}/{slug}-tpl-{i}.png"
        generate_image(tpl["prompt"], img_path)
        
        templates.append({
            "id": f"tpl-{i:03d}",
            "title": tpl["title"],
            "slug": tpl["slug"],
            "description": tpl["description"],
            "prompt": tpl["prompt"],
            "imageUrl": f"https://placeholder.com/{tpl['aspectRatio'].replace(':', 'x')}.png",
            "aspectRatio": tpl["aspectRatio"],
            "styleMode": tpl.get("styleMode", "modern"),
            "messyMode": tpl.get("messyMode", False),
            "packOnly": tpl.get("packOnly", False),
            "orderIndex": i
        })
    
    pack_data = {
        "pack": {
            "id": pack_id,
            "slug": slug,
            "name": pack_idea["name"],
            "title": pack_idea["name"],
            "description": pack_idea["description"],
            "features": pack_idea["features"],
            "thumbnailUrl": f"https://placeholder.com/1200x800.png",
            "accessLevel": pack_idea.get("accessLevel", "free")
        },
        "templates": templates
    }
    
    print(f"\n📤 Uploading pack...")
    result = upload_pack(pack_data)
    print(f"✅ Uploaded: {result}")
    return result

if __name__ == "__main__":
    import sys
    
    # Example: Create a pack from command line
    if len(sys.argv) > 1:
        niche = " ".join(sys.argv[1:])
        print(f"Researching: {niche}")
        # TODO: Call Gemini to research and generate pack idea
    else:
        print("Usage: python3 template-pack-agent.py 'niche idea'")
