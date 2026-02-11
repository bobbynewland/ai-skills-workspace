#!/usr/bin/env python3
"""
MiniMax Usage Tracker
Run this to check your MiniMax usage
"""
import os
import json
from datetime import datetime, timedelta, timezone

TRACKING_FILE = '/root/.openclaw/workspace/.minimax_usage.json'

def load_usage():
    if os.path.exists(TRACKING_FILE):
        with open(TRACKING_FILE, 'r') as f:
            return json.load(f)
    return {'prompts': [], 'tokens': {'in': 0, 'out': 0}}

def check_limits():
    data = load_usage()
    now = datetime.now(timezone.utc)
    five_hours_ago = now - timedelta(hours=5)
    
    recent_prompts = [p for p in data['prompts'] 
                      if datetime.fromisoformat(p['time']) > five_hours_ago]
    
    print(f"\n📊 MiniMax Usage Tracker")
    print("="*40)
    print(f"🕐 Last 5 hours:")
    print(f"   Prompts: {len(recent_prompts)} / 300")
    print(f"   Tokens In: {data['tokens']['in']:,}")
    print(f"   Tokens Out: {data['tokens']['out']:,}")
    
    remaining = 300 - len(recent_prompts)
    if remaining > 0:
        print(f"\n✅ Remaining: {remaining} prompts")
    else:
        print(f"\n⚠️  LIMIT REACHED!")
    
    print("="*40)
    return len(recent_prompts)

if __name__ == '__main__':
    check_limits()
