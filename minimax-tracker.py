#!/usr/bin/env python3
"""
MiniMax Usage Tracker - Now with JSON API
"""

import os
import json
import requests
import time
from datetime import datetime, timedelta

API_KEY_FILE = "/root/.openclaw/workspace/.keys/minimax.key"
USAGE_FILE = "/root/.openclaw/workspace/.minimax_usage.json"

def get_api_key():
    if os.path.exists(API_KEY_FILE):
        with open(API_KEY_FILE, 'r') as f:
            return f.read().strip()
    return None

def load_usage():
    if os.path.exists(USAGE_FILE):
        with open(USAGE_FILE, 'r') as f:
            return json.load(f)
    return {"requests": 0, "prompts": 0, "tokens_in": 0, "tokens_out": 0, "window_start": time.time()}

def save_usage(usage):
    with open(USAGE_FILE, 'w') as f:
        json.dump(usage, f)

def fetch_live_usage():
    """Fetch live usage from MiniMax API"""
    key = get_api_key()
    if not key:
        return None
    
    try:
        response = requests.get(
            "https://api.minimax.chat/v1/usage",
            headers={"Authorization": f"Bearer {key}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            return {
                "requests": data.get("data", {}).get("total_completion_tokens", 0) // 1000 or 0,  # Approximate
                "prompts": data.get("data", {}).get("total_prompt_tokens", 0) // 100 or 0,
                "tokens_in": data.get("data", {}).get("total_prompt_tokens", 0),
                "tokens_out": data.get("data", {}).get("total_completion_tokens", 0),
            }
    except:
        pass
    return None

def main():
    import sys
    
    # Check for JSON flag
    if len(sys.argv) > 1 and sys.argv[1] == "--json":
        usage = load_usage()
        print(json.dumps({
            "requests": usage.get("requests", 0),
            "prompts": usage.get("prompts", 0),
            "tokensIn": usage.get("tokens_in", 0),
            "tokensOut": usage.get("tokens_out", 0),
            "limit": 300,
            "windowHours": 5,
            "remaining": 300 - usage.get("requests", 0)
        }))
        return
    
    # Normal output
    print("📊 MiniMax Usage Tracker")
    print("=" * 40)
    
    usage = load_usage()
    requests = usage.get("requests", 0)
    tokens_in = usage.get("tokens_in", 0)
    tokens_out = usage.get("tokens_out", 0)
    
    print("🕐 Last 5 hours:")
    print(f"   Requests: {requests} / 300")
    print(f"   Tokens In: {tokens_in}")
    print(f"   Tokens Out: {tokens_out}")
    
    remaining = 300 - requests
    print()
    if remaining > 50:
        print(f"✅ Remaining: {remaining} requests")
    elif remaining > 20:
        print(f"⚠️  Low: {remaining} requests remaining")
    else:
        print(f"🚨 Critical: Only {remaining} requests left!")
    print("=" * 40)

if __name__ == "__main__":
    main()
