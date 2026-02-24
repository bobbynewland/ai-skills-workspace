import requests
import json

with open('/root/.openclaw/workspace/.keys/openrouter.key', 'r') as f:
    keys = [line.strip() for line in f if line.strip()]

key = keys[0]
url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "z-ai/glm-5", "max_tokens": 512,
    "messages": [{"role": "user", "content": "Hello! What model are you?"}]
}
resp = requests.post(url, headers=headers, json=payload)
print(resp.status_code, resp.text)
