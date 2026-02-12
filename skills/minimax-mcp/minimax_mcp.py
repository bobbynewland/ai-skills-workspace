#!/usr/bin/env python3
"""
MiniMax MCP Wrapper - Vision and Web Search
Usage:
  minimax-mcp.py vision "prompt" "image_url"
  minimax-mcp.py search "query"
"""

import os
import sys
import json
import argparse

# Load MiniMax key (skip comments, get first non-empty line)
KEY_PATH = os.path.expanduser("~/.openclaw/workspace/.keys/minimax.key")
with open(KEY_PATH) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#"):
            API_KEY = line
            break
    else:
        raise ValueError("No valid API key found in key file")

BASE_URL = "https://api.minimax.chat/v1"


def vision(prompt: str, image_url: str):
    """Analyze an image using MiniMax vision"""
    import requests
    
    url = f"{BASE_URL}/text/chatcompletion_v2"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "MiniMax-M2.5",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ],
        "max_tokens": 2048,
        "temperature": 0.7
    }
    
    resp = requests.post(url, headers=headers, json=payload, timeout=60)
    resp.raise_for_status()
    
    result = resp.json()
    print(result["choices"][0]["message"]["content"])


def search(query: str):
    """Web search using MiniMax"""
    import requests
    
    url = f"{BASE_URL}/text/chatcompletion_v2"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "MiniMax-M2.5",
        "messages": [
            {
                "role": "system", 
                "content": "You are a helpful assistant with web search capabilities. Search for the user's query and provide relevant, up-to-date information."
            },
            {
                "role": "user",
                "content": f"Search for: {query}. Provide a concise summary of the top results."
            }
        ],
        "max_tokens": 2048,
        "temperature": 0.7
    }
    
    resp = requests.post(url, headers=headers, json=payload, timeout=60)
    resp.raise_for_status()
    
    result = resp.json()
    print(result["choices"][0]["message"]["content"])


def main():
    parser = argparse.ArgumentParser(description="MiniMax MCP Wrapper")
    parser.add_argument("command", choices=["vision", "search"], help="Command to run")
    parser.add_argument("prompt", help="Prompt or query")
    parser.add_argument("image_url", nargs="?", help="Image URL (for vision command)")
    
    args = parser.parse_args()
    
    if args.command == "vision":
        if not args.image_url:
            print("Error: image_url required for vision command", file=sys.stderr)
            sys.exit(1)
        vision(args.prompt, args.image_url)
    elif args.command == "search":
        search(args.prompt)


if __name__ == "__main__":
    main()
