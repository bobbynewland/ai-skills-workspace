#!/usr/bin/env python3
"""
Kimi K2.5 Strategist CLI
Usage: python3 kimistrategy.py "Your planning request"
"""

import requests
import sys
import os
import time

KEY_FILE = '/root/.openclaw/workspace/.keys/nvidia.key'
with open(KEY_FILE) as f:
    API_KEY = f.read().strip()

ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions'
MODEL = 'moonshotai/kimi-k2.5'

def chat(messages, temperature=0.7):
    payload = {
        'model': MODEL,
        'messages': messages,
        'max_tokens': 4096,
        'temperature': temperature,
        'top_p': 1.0
    }
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(ENDPOINT, json=payload, headers=headers, timeout=30)
    response.raise_for_status()
    
    data = response.json()
    return data['choices'][0]['message']['content']

def strategy_mode(prompt):
    system = """You are a senior software architect. Provide detailed technical plans with:
- Architecture overview
- Component breakdown  
- Implementation steps
- Edge cases"""
    
    return chat([
        {'role': 'system', 'content': system},
        {'role': 'user', 'content': prompt}
    ], temperature=0.7)

def fast_mode(prompt):
    return chat([
        {'role': 'system', 'content': 'Concise answers only. 2-3 paragraphs.'},
        {'role': 'user', 'content': prompt}
    ], temperature=0.5)

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 kimistrategy.py \"Your request\" [--fast]")
        sys.exit(1)
    
    prompt = ' '.join(sys.argv[1:])
    mode = 'fast' if '--fast' in sys.argv else 'strategy'
    
    print(f"\n🤔 Kimi thinking...")
    
    try:
        result = fast_mode(prompt) if mode == 'fast' else strategy_mode(prompt)
        
        print(f"\n{'='*60}")
        print(result)
        print(f"{'='*60}\n")
        print("💡 40 RPM limit - space requests 1.5s+ apart\n")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
