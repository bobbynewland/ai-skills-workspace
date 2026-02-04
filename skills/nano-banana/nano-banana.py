#!/usr/bin/env python3
"""
Nano Banana Pro - fal.ai Implementation
Uses fal-ai/nano-banana-pro model for text-aware generation
"""
import os
import sys
import json
import base64
import requests
from pathlib import Path

API_KEY_FILE = '/root/.openclaw/workspace/.keys/fal_ai.key'
API_ENDPOINT = 'https://fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image'

def get_api_key():
    with open(API_KEY_FILE, 'r') as f:
        return f.read().strip()

def generate_image(prompt, output_path, width=1080, height=1920):
    """
    Generate image using fal.ai nano-banana-pro
    """
    print(f"🎨 Seedream v4.5 (fal.ai) generating...")
    print(f"📝 Prompt: {prompt[:60]}...")
    print(f"📐 Size: {width}x{height}")
    
    api_key = get_api_key()
    
    # fal.ai payload
    payload = {
        "prompt": prompt,
        "image_size": {
            "width": width,
            "height": height
        }
    }
    
    headers = {
        "Authorization": f"Key {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=120)
        data = response.json()
        
        if response.status_code != 200:
            raise Exception(data.get('detail', f'HTTP {response.status_code}'))
        
        # Get image URL from response
        image_url = data.get('images', [{}])[0].get('url')
        if not image_url:
            raise Exception("No image URL in response")
        
        # Download image
        img_response = requests.get(image_url, timeout=60)
        image_data = img_response.content
        
        # Save image
        with open(output_path, 'wb') as f:
            f.write(image_data)
        
        size_kb = len(image_data) / 1024
        print(f"✅ Image saved: {output_path}")
        print(f"📊 Size: {size_kb:.1f} KB")
        return output_path
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"💾 Saving prompt for manual generation...")
        prompt_file = output_path.replace('.png', '.txt')
        with open(prompt_file, 'w') as f:
            f.write(f"FAL.AI NANO BANANA PRO PROMPT:\n{'='*50}\n\n{prompt}\n\nERROR: {e}\n")
        return prompt_file

def main():
    if len(sys.argv) < 3:
        print("🍌 Nano Banana Pro - fal.ai")
        print(f"Model: fal-ai/nano-banana-pro")
        print("\nUsage:")
        print("  nano-banana generate 'prompt text' --output filename.png")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "generate":
        prompt = sys.argv[2]
        output = "output.png"
        
        for i, arg in enumerate(sys.argv):
            if arg == "--output" and i + 1 < len(sys.argv):
                output = sys.argv[i + 1]
        
        dir_path = os.path.dirname(output)
        if dir_path:
            os.makedirs(dir_path, exist_ok=True)
        
        generate_image(prompt, output)
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()
