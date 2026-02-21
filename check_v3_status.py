import requests
import json
import sys

HEYGEN_API_KEY = open('/root/.openclaw/workspace/.keys/heygen.key').read().strip()

def get_status(video_id):
    url = f"https://api.heygen.com/v1/video_status.get?video_id={video_id}"
    headers = {
        "X-Api-Key": HEYGEN_API_KEY,
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    return response.json()

video_id = sys.argv[1] if len(sys.argv) > 1 else "17e8df80ade143f682a6d539fb827976"
print(json.dumps(get_status(video_id), indent=2))
