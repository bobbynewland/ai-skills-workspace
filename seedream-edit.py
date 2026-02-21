#!/usr/bin/env python3
"""Seedream 4.5 Image Edit - using reference image + prompt to remix"""
import base64
import json
import requests
import argparse
import subprocess

API_KEY_FILE = '/root/.openclaw/workspace/.keys/fal_ai.key'
API_ENDPOINT = 'https://fal.run/fal-ai/bytedance/seedream/v4.5/edit'
ARCHIVER = '/root/.openclaw/workspace/auto_drive_archive.py'

def get_api_key():
    with open(API_KEY_FILE, 'r') as f:
        return f.read().strip()

def archive_output(output_path):
    """Upload to Drive + delete local file (VPS storage saver)."""
    try:
        proc = subprocess.run(
            [ARCHIVER, output_path],
            capture_output=True,
            text=True,
            check=False,
        )
        if proc.stdout:
            print(proc.stdout.strip())
        if proc.returncode != 0 and proc.stderr:
            print(proc.stderr.strip())
    except Exception as e:
        print(f"Archive step skipped: {e}")


def edit_image(image_path, prompt, output_path):
    """Edit image using Seedream 4.5"""
    print(f"🎨 Seedream v4.5 editing...")
    print(f"📝 Prompt: {prompt[:80]}...")
    
    api_key = get_api_key()
    
    # Read and encode image as base64 data URI
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    image_url = f"data:image/jpeg;base64,{image_data}"
    
    # Build JSON payload
    payload = {
        "prompt": prompt,
        "image_urls": [image_url]
    }
    
    headers = {
        "Authorization": f"Key {api_key}",
        "Content-Type": "application/json"
    }
    
    # Submit request
    response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=180)
    
    if response.status_code != 200:
        print(f"Error: {response.text}")
        raise Exception(f'HTTP {response.status_code}')
    
    result = response.json()
    print(f"Result: {json.dumps(result, indent=2)[:500]}")
    
    # Save images
    if 'images' in result and result['images']:
        img_data = result['images'][0]
        if isinstance(img_data, dict) and 'url' in img_data:
            # Download from URL
            img_resp = requests.get(img_data['url'])
            with open(output_path, 'wb') as f:
                f.write(img_resp.content)
            print(f"✅ Saved: {output_path}")
            archive_output(output_path)
        elif isinstance(img_data, str) and img_data.startswith('data:'):
            # Base64 data
            img_bytes = base64.b64decode(img_data.split(',')[1])
            with open(output_path, 'wb') as f:
                f.write(img_bytes)
            print(f"✅ Saved: {output_path}")
            archive_output(output_path)
    
    return output_path

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', required=True, help='Input image path')
    parser.add_argument('--prompt', required=True, help='Edit prompt')
    parser.add_argument('--output', required=True, help='Output path')
    args = parser.parse_args()
    
    edit_image(args.image, args.prompt, args.output)
