import requests
import json

with open('/root/.openclaw/workspace/.keys/openrouter.key', 'r') as f:
    keys = [line.strip() for line in f if line.strip()]

url = "https://openrouter.ai/api/v1/auth/key"
headers = {"Authorization": f"Bearer {keys[0]}"}
resp = requests.get(url, headers=headers)
print("Key 1 auth status:", resp.status_code, resp.text)
