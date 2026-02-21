#!/usr/bin/env python3
"""Write agent fleet status to Firebase via REST API"""
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone

MINIMAX_FILE = '/root/.openclaw/workspace/.minimax_usage.json'
FIREBASE_URL = 'https://winslow-756c3-default-rtdb.firebaseio.com/workspaces/winslow_main/agent_fleet_status.json'

def get_minimax_status():
    """Get MiniMax usage from tracker"""
    try:
        if os.path.exists(MINIMAX_FILE):
            with open(MINIMAX_FILE, 'r') as f:
                data = json.load(f)
            
            now = datetime.now(timezone.utc)
            five_hours_ago = now - timedelta(hours=5)
            
            recent_prompts = [p for p in data.get('prompts', []) 
                            if datetime.fromisoformat(p['time']) > five_hours_ago]
            
            return {
                'prompts_used': len(recent_prompts),
                'prompts_total': 300,
                'tokens_in': data.get('tokens', {}).get('in', 0),
                'tokens_out': data.get('tokens', {}).get('out', 0)
            }
    except Exception as e:
        print(f"Error getting minimax status: {e}")
    
    return {'prompts_used': 0, 'prompts_total': 300, 'tokens_in': 0, 'tokens_out': 0}

def get_kimi_status():
    """Get Kimi Swarm status - 10 keys"""
    return {
        'keys_total': 10,
        'keys_used': 0,
        'model': 'Kimi K2.5'
    }

def get_glm_status():
    """Get GLM Swarm status - 10 keys"""
    return {
        'keys_total': 10,
        'keys_used': 0,
        'model': 'GLM-4'
    }

def write_to_firebase():
    """Write status to Firebase via REST"""
    try:
        status = {
            'minimax': get_minimax_status(),
            'kimi': get_kimi_status(),
            'glm': get_glm_status(),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        data = json.dumps(status).encode('utf-8')
        req = urllib.request.Request(
            FIREBASE_URL,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='PUT'
        )
        
        with urllib.request.urlopen(req) as response:
            print(f"✅ Written to Firebase: {json.dumps(status, indent=2)}")
    except Exception as e:
        print(f"Firebase write error: {e}")

if __name__ == '__main__':
    write_to_firebase()
