import requests
import json
import os

# Config
HEYGEN_API_KEY = open('/root/.openclaw/workspace/.keys/heygen.key').read().strip()

def generate_test_course_video():
    url = "https://api.heygen.com/v2/video/generate"
    
    # Using 'Chill Brian' (f38a635bee7a4d1f9b0a654a31d050d2) 
    # and Abigail (Abigail_expressive_2024112501)
    
    payload = {
        "title": "AI Skills Studio - Introduction Test (FIXED VOICE)",
        "video_setting": {
            "aspect_ratio": "16:9",
            "format": "mp4"
        },
        "dimension": {
            "width": 1280,
            "height": 720
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
                    "input_text": "Yo, welcome to AI Skills Studio. I'm Win, your CTO and guide. We're building the future of entrepreneurship here, where tech meets execution. Today, we're firing up the first test of our automated course factory. Let's get to work.",
                    "voice_id": "f8c69e517f424cafaecde32dde57096b" # Allison (Female)
                }
            }
        ]
    }
    
    headers = {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
    }
    
    print(f"🚀 Firing V2 Video Generate request...")
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

if __name__ == "__main__":
    result = generate_test_course_video()
    print(json.dumps(result, indent=2))
    
    if 'data' in result and 'video_id' in result['data']:
        video_id = result['data']['video_id']
        with open('/root/.openclaw/workspace/video_id.txt', 'w') as f:
            f.write(video_id)
        print(f"\n✅ Success! Video ID saved: {video_id}")
    else:
        print("\n❌ Failed to start generation.")
