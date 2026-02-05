#!/usr/bin/env python3
"""
Google AI Coding Assistant
Uses Google Gemini models for FREE coding
Tries Antigravity OAuth first, falls back to API key
"""
import json
import os
import sys

def get_auth_token():
    """Get auth token - prefers API key, tries OAuth as fallback"""
    import time
    
    # Prefer API key if set (works with billing enabled)
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        print("✅ Using Gemini API key")
        return ("api", api_key)
    
    # Try Antigravity OAuth as fallback
    agent = os.getenv('OPENCLAW_AGENT', 'main')
    auth_paths = [
        f"/root/.openclaw/agents/{agent}/agent/auth-profiles.json",
        "/root/.openclaw/agents/google-antigravity/agent/auth-profiles.json",
        "/root/.openclaw/agents/main/agent/auth-profiles.json"
    ]
    
    for auth_file in auth_paths:
        if os.path.exists(auth_file):
            with open(auth_file, 'r') as f:
                auth = json.load(f)
            profile = auth.get("profiles", {}).get("google-antigravity:framelensmedia@gmail.com")
            if profile:
                if profile.get("expires", 0) > time.time() * 1000:
                    print(f"✅ Using Antigravity OAuth from {auth_file} (FREE)")
                    return ("oauth", profile.get("access"))
                else:
                    print(f"⚠️ OAuth expired in {auth_file}")
    
    print("❌ No auth found. Set GEMINI_API_KEY or refresh Antigravity OAuth")
    return None

def call_gemini(prompt, model="gemini-1.5-flash"):
    """Call Gemini API"""
    import requests
    
    auth = get_auth_token()
    if not auth:
        return None
    
    auth_type, auth_token = auth
    
    if auth_type == "oauth":
        # Use OAuth bearer token
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        headers = {
            'Authorization': f'Bearer {auth_token}',
            'Content-Type': 'application/json'
        }
    else:
        # Use API key
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={auth_token}"
        headers = {'Content-Type': 'application/json'}
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192,
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        elif response.status_code == 401:
            print("❌ Authentication failed. Check OAuth or API key.")
            return None
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def generate_code(description, output_file=None, model="gemini-2.0-flash"):
    """Generate code"""
    prompt = f"""Generate clean, well-documented code for:

{description}

Requirements:
- Include comments explaining the code
- Add error handling where appropriate
- Follow best practices
- Make it production-ready

Provide only the code without additional explanation."""

    print(f"🤖 Generating code with {model}...")
    code = call_gemini(prompt, model=model)
    
    if code:
        if output_file:
            with open(output_file, 'w') as f:
                f.write(code)
            print(f"✅ Code saved to: {output_file}")
        else:
            print("\n" + "="*60)
            print(code)
            print("="*60)
        return True
    return False

def review_code(file_path, model="gemini-3-pro-preview"):
    """Review code file"""
    with open(file_path, 'r') as f:
        code = f.read()
    
    prompt = f"""Review this code and provide:
1. Potential bugs or issues
2. Performance improvements
3. Security concerns
4. Code style suggestions
5. Overall rating (1-10)

Code:
```
{code}
```"""

    print(f"🤖 Reviewing {file_path} with {model}...")
    review = call_gemini(prompt, model=model)
    
    if review:
        print("\n" + "="*60)
        print(review)
        print("="*60)
        return True
    return False

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Google AI Coding Assistant (FREE)')
    parser.add_argument('action', choices=['generate', 'review', 'explain'], help='Action')
    parser.add_argument('input', help='Input description or file path')
    parser.add_argument('--output', '-o', help='Output file path')
    parser.add_argument('--model', '-m', 
                       choices=['gemini-3-pro-preview', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'],
                       default='gemini-2.0-flash',
                       help='Model to use (default: gemini-2.0-flash)')
    args = parser.parse_args()
    
    # Override model for specific actions
    model = args.model
    if args.action == 'review' and args.model == 'gemini-2.0-flash':
        model = 'gemini-3-pro-preview'  # Use best model for reviews by default
    
    if args.action == 'generate':
        generate_code(args.input, args.output, model)
    elif args.action == 'review':
        review_code(args.input, model)

if __name__ == "__main__":
    main()
