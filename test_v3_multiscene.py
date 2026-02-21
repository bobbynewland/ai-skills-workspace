import requests
import json
import time
import os

HEYGEN_API_KEY = open('/root/.openclaw/workspace/.keys/heygen.key').read().strip()

def generate_v3_video(scenes, title="V3 Multi-Scene Test"):
    url = "https://api.heygen.com/v2/video/generate"
    
    payload = {
        "title": title,
        "video_setting": {
            "aspect_ratio": "16:9",
            "format": "mp4"
        },
        "dimension": {
            "width": 1920,
            "height": 1080
        },
        "scenes": scenes
    }
    
    headers = {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

# Scene Blueprints for Remix Tutorial
scenes = [
    {
        "scene_id": "intro",
        "character": {
            "type": "avatar",
            "avatar_id": "Abigail_expressive_2024112501",
            "avatar_style": "normal"
        },
        "voice": {
            "type": "text",
            "input_text": "Yo, welcome to the lab. Today, I'm showing you exactly how to lock in a flawless digital likeness using our Remix tool. It all starts with one thing: the perfect source photo.",
            "voice_id": "f8c69e517f424cafaecde32dde57096b" # Allison (Female)
        },
        "background": {
            "type": "color",
            "value": "#101013"
        }
    },
    {
        "scene_id": "the_right_way",
        "character": {
            "type": "avatar",
            "avatar_id": "Abigail_expressive_2024112501",
            "avatar_style": "circle"
        },
        "voice": {
            "type": "text",
            "input_text": "This is what we need. A high-res, medium close-up. Notice how the full face is unobstructed. We need the shoulders and the top of the chest in the frame to build an accurate representation.",
            "voice_id": "f8c69e517f424cafaecde32dde57096b"
        },
        "background": {
            "type": "color",
            "value": "#1a1a2e"
        }
    },
    {
        "scene_id": "the_wrong_way",
        "character": {
            "type": "avatar",
            "avatar_id": "Abigail_expressive_2024112501",
            "avatar_style": "circle"
        },
        "voice": {
            "type": "text",
            "input_text": "Avoid the noise. Blurry shots or faces hidden by shadows and accessories will trash your results. Don't waste your tokens on a bad start.",
            "voice_id": "f8c69e517f424cafaecde32dde57096b"
        },
        "background": {
            "type": "color",
            "value": "#2e1a1a"
        }
    }
]

print("🚀 Firing off multi-scene V3 generation...")
result = generate_v3_video(scenes)
print(json.dumps(result, indent=2))
