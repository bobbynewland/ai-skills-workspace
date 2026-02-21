import base64
import json
import requests

# Read and encode the image
with open('/root/.openclaw/media/inbound/8451ba9d-e694-4383-bcfe-94ae5deeb5fb.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCLOCwyuavtdN-hEHkraOrsOJgMWYEz-FI"

payload = {
    "contents": [{
        "parts": [
            {"text": "Look at this event flyer image. Create a detailed prompt to generate a similar birthday party flyer in the SAME style, composition, colors, and typography. Keep the woman centered, red/black/white colors, club party vibe."},
            {"inline_data": {"mime_type": "image/jpeg", "data": image_data}}
        ]
    }],
    "generationConfig": {
        "temperature": 0.9,
        "maxOutputTokens": 1024
    }
}

response = requests.post(url, json=payload, timeout=120)
print(json.dumps(response.json(), indent=2))
