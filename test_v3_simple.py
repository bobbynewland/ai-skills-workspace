import requests
import json

HEYGEN_API_KEY = open('/root/.openclaw/workspace/.keys/heygen.key').read().strip()

def generate_v3_video():
    url = "https://api.heygen.com/v2/video/generate"
    
    payload = {
        "title": "Remix Tutorial Test",
        "video_setting": {
            "aspect_ratio": "16:9"
        },
        "video_inputs": [
            {
                "character": {
                    "type": "avatar",
                    "avatar_id": "Abigail_expressive_2024112501",
                    "avatar_style": "normal"
                },
                "voice": {
                    "type": "text",
                    "input_text": "Yo, welcome to the lab. Today, I'm showing you exactly how to lock in a flawless digital likeness using our Remix tool. It all starts with one thing: the perfect source photo.",
                    "voice_id": "f38a635bee7a4d1f9b0a654a31d050d2"
                }
            }
        ]
    }
    
    headers = {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

print("🚀 Firing off V3 single-shot test...")
result = generate_v3_video()
print(json.dumps(result, indent=2))
