#!/usr/bin/env python3
"""
HeyGen Training Video Skill
Create AI avatar training videos
"""
import os
import sys
import json
import requests
import time

# Config
HEYGEN_API_KEY = open('/root/.openclaw/workspace/.keys/heygen.key').read().strip()
BASE_URL = "https://api.heygen.com"

headers = {
    "Authorization": f"Bearer {HEYGEN_API_KEY}",
    "Content-Type": "application/json"
}

def get_avatars():
    """List available avatars"""
    r = requests.get(f"{BASE_URL}/v2/avatars", headers=headers)
    if r.status_code == 200:
        data = r.json()
        return data.get('data', {}).get('avatars', [])
    return []

def get_voices():
    """List available voices"""
    r = requests.get(f"{BASE_URL}/v2/voices", headers=headers)
    if r.status_code == 200:
        data = r.json()
        return data.get('data', {}).get('voices', [])
    return []

def create_video(script, avatar_id=None, voice_id=None, title="Training Video"):
    """Create avatar video from script"""
    payload = {
        "title": title,
        "script": {
            "type": "text",
            "input_text": script
        }
    }
    
    if avatar_id:
        payload["avatar_id"] = avatar_id
    if voice_id:
        payload["voice_id"] = voice_id
    
    r = requests.post(f"{BASE_URL}/v2/videos", headers=headers, json=payload)
    
    if r.status_code == 200:
        return r.json()
    return {"error": r.text}

def get_video_status(video_id):
    """Check video status"""
    r = requests.get(f"{BASE_URL}/v2/videos/{video_id}", headers=headers)
    if r.status_code == 200:
        return r.json()
    return {"error": r.text}

def main():
    if len(sys.argv) < 2:
        print("""
🎬 HeyGen Training Video Skill
==============================

Commands:
  avatars          List available avatars
  voices          List available voices
  create <script>  Create video from script
  status <id>     Check video status

Examples:
  python3 heygen_skill.py create "Welcome to the AI Skills Bootcamp!"
  python3 heygen_skill.py status abc123
""")
        return
    
    cmd = sys.argv[1].lower()
    
    if cmd == "avatars":
        print("🎭 Available Avatars:")
        avatars = get_avatars()
        for a in avatars[:10]:
            name = a.get('avatar_name') or a.get('name') or 'Unknown'
            aid = a.get('avatar_id') or a.get('id') or '?'
            print(f"  - {name} ({aid})")
    
    elif cmd == "voices":
        print("🎤 Available Voices:")
        voices = get_voices()
        for v in voices[:10]:
            name = v.get('name') or 'Unknown'
            vid = v.get('voice_id') or v.get('id') or '?'
            print(f"  - {name} ({vid})")
    
    elif cmd == "create" and len(sys.argv) > 2:
        script = " ".join(sys.argv[2:])
        print(f"🎬 Creating video: {script[:50]}...")
        result = create_video(script)
        if 'data' in result:
            video_id = result['data'].get('video_id')
            print(f"✅ Video created! ID: {video_id}")
            print(f"   Status: {result['data'].get('status')}")
        else:
            print(f"❌ Error: {result}")
    
    elif cmd == "status" and len(sys.argv) > 2:
        video_id = sys.argv[2]
        status = get_video_status(video_id)
        if 'data' in status:
            d = status['data']
            print(f"📹 Video {video_id}")
            print(f"   Status: {d.get('status')}")
            if d.get('download_url'):
                print(f"   Download: {d['download_url']}")
        else:
            print(f"❌ Error: {status}")
    
    else:
        print("Unknown command. Run without args for help.")

if __name__ == "__main__":
    main()
