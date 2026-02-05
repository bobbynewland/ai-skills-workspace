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
    """Get auth token - tries OAuth first, then API key"""
    # Try Antigravity OAuth first
    auth_file = "/root/.openclaw/agents/main/agent/auth-profiles.json"
    if os.path.exists(auth_file):
        with open(auth_file, 'r') as f:
            auth = json.load(f)
        profile = auth.get("profiles", {}).get("google-antigravity:framelensmedia@gmail.com")
        if profile:
            import time
            if profile.get("expires", 0) > time.time() * 1000:
                print("✅ Using Antigravity OAuth (FREE)")
                return ("oauth", profile.get("access"))
            else:
                print("⚠️ Antigravity OAuth expired, falling back to API key")
    
    # Fall back to API key
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        print("✅ Using Gemini API key")
        return ("api", api_key)
    
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

def generate_code(description, output_file=None):
    """Generate code"""
    prompt = f"""Generate clean, well-documented code for:

{description}

Requirements:
- Include comments explaining the code
- Add error handling where appropriate
- Follow best practices
- Make it production-ready

Provide only the code without additional explanation."""

    print(f"🤖 Generating code with Gemini...")
    code = call_gemini(prompt, model="gemini-2.0-flash")
    
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

def review_code(file_path):
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

    print(f"🤖 Reviewing {file_path}...")
    review = call_gemini(prompt, model="gemini-2.5-pro")
    
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
    args = parser.parse_args()
    
    if args.action == 'generate':
        generate_code(args.input, args.output)
    elif args.action == 'review':
        review_code(args.input)

if __name__ == "__main__":
    main()
