#!/usr/bin/env python3
"""
Create Pack with Thumbnail - All-in-one workflow
Generates thumbnail + creates pack + uploads to CMS in one command
"""
import os
import sys
import json
import subprocess
import time

API_KEY = "f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03"
API_ENDPOINT = "https://ai-skills-bootcamp-portal.vercel.app/api/v1/clawdbot/upload-pack"
BASE_URL = "http://147.93.40.188:8080"

def generate_thumbnail(pack_slug, prompt):
    """Generate pack thumbnail using Seedream"""
    output_dir = f"/root/.openclaw/workspace/template_packs/{pack_slug}"
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = f"{output_dir}/pack_thumbnail.png"
    
    print(f"🎨 Generating thumbnail for '{pack_slug}'...")
    
    # Use nano-banana skill
    result = subprocess.run([
        "python3", "/root/.openclaw/workspace/skills/nano-banana/nano-banana.py",
        "generate", prompt,
        "--output", output_file
    ], capture_output=True, text=True)
    
    if os.path.exists(output_file):
        size_kb = os.path.getsize(output_file) / 1024
        print(f"✅ Thumbnail generated: {size_kb:.1f} KB")
        return f"{BASE_URL}/template_packs/{pack_slug}/pack_thumbnail.png"
    else:
        print(f"❌ Thumbnail generation failed")
        print(result.stderr)
        return None

def create_pack_payload(pack_name, pack_slug, thumbnail_url, templates=None):
    """Create API payload with thumbnail"""
    if templates is None:
        templates = []
    
    payload = {
        "pack": {
            "name": pack_name,
            "slug": pack_slug,
            "access_level": "free",
            "is_published": False,
            "thumbnail_url": thumbnail_url
        },
        "templates": templates
    }
    
    return payload

def upload_pack(payload):
    """Upload pack to CMS"""
    import requests
    
    print(f"🚀 Uploading pack to CMS...")
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }
    
    try:
        response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                print(f"✅ Pack uploaded successfully!")
                print(f"   Pack ID: {data.get('pack_id')}")
                print(f"   Slug: {data.get('slug')}")
                print(f"   Templates: {len(data.get('results', []))}")
                return True
            else:
                print(f"⚠️ Upload response: {data}")
                return False
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return False

def create_pack_with_thumbnail(pack_name, pack_slug, thumbnail_prompt, templates=None):
    """Main workflow: Generate thumbnail + upload pack"""
    
    print(f"\n{'='*60}")
    print(f"Creating Pack: {pack_name}")
    print(f"{'='*60}\n")
    
    # Step 1: Generate thumbnail
    thumbnail_url = generate_thumbnail(pack_slug, thumbnail_prompt)
    if not thumbnail_url:
        return False
    
    # Step 2: Create payload
    payload = create_pack_payload(pack_name, pack_slug, thumbnail_url, templates)
    
    # Step 3: Upload pack
    success = upload_pack(payload)
    
    if success:
        print(f"\n✅ SUCCESS! Pack '{pack_name}' created with thumbnail")
        print(f"   Thumbnail: {thumbnail_url}")
        return True
    else:
        print(f"\n❌ Failed to upload pack")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 create_pack.py 'Pack Name' 'pack-slug' 'thumbnail description'")
        print("\nExample:")
        print("  python3 create_pack.py 'Fitness Gym Pack' 'fitness-gym' 'Fitness gym template pack thumbnail, showing workout equipment, energetic red and black colors, grid layout preview'")
        sys.exit(1)
    
    pack_name = sys.argv[1]
    pack_slug = sys.argv[2]
    thumb_prompt = sys.argv[3]
    
    # Add standard thumbnail framing to prompt
    full_prompt = f"{thumb_prompt}, professional template pack thumbnail, 1200x800px, marketplace preview style, clean modern design"
    
    success = create_pack_with_thumbnail(pack_name, pack_slug, full_prompt)
    sys.exit(0 if success else 1)
