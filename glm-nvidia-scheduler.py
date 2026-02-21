#!/usr/bin/env python3
"""GLM via NVIDIA NIM Scheduler"""
import os, json, time, sys

KEYS_FILE = "/root/.openclaw/workspace/.keys/nvidia.key"
RPM = 30
REQUEST_DELAY = 60.0 / RPM

def load_keys():
    with open(KEYS_FILE, 'r') as f:
        return [k.strip() for k in f.read().strip().split('\n') if k.strip()]

def get_key():
    keys = load_keys()
    return keys[0]  # Use first available key

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 glm-nvidia-scheduler.py 'prompt'")
        sys.exit(1)
    
    prompt = sys.argv[1]
    key = get_key()
    
    import requests
    resp = requests.post(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"model": "z-ai/glm5", "messages": [{"role": "user", "content": prompt}], "max_tokens": 4000},
        timeout=300
    )
    if resp.status_code == 200:
        print(resp.json()["choices"][0]["message"]["content"])
    else:
        print(f"Error: {resp.status_code}")
        print(resp.text[:500])
