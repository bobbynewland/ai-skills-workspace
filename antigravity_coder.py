#!/usr/bin/env python3
"""
Antigravity Coding Assistant
Uses Google Antigravity OAuth to access Gemini models for FREE coding
No API key needed - uses OAuth tokens from auth-profiles.json
"""
import json
import os
import sys

def get_antigravity_token():
    """Get OAuth token from antigravity auth profile"""
    auth_file = "/root/.openclaw/agents/main/agent/auth-profiles.json"
    
    if not os.path.exists(auth_file):
        print("❌ Antigravity auth not found. Run: openclaw agents add google-antigravity")
        return None
    
    with open(auth_file, 'r') as f:
        auth = json.load(f)
    
    profile = auth.get("profiles", {}).get("google-antigravity:framelensmedia@gmail.com")
    if not profile:
        print("❌ Antigravity profile not found")
        return None
    
    # Check if token is expired
    import time
    if profile.get("expires", 0) < time.time() * 1000:
        print("⚠️ Token may be expired. Try refreshing.")
    
    return profile.get("access")

def call_gemini_antigravity(prompt, model="gemini-1.5-flash"):
    """Call Gemini using Antigravity OAuth"""
    import requests
    
    token = get_antigravity_token()
    if not token:
        return None
    
    # Use OAuth token as bearer token
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192,
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            text = result['candidates'][0]['content']['parts'][0]['text']
            return text
        elif response.status_code == 401:
            print("❌ OAuth token expired. Need to refresh antigravity auth.")
            print("   Run: openclaw agents add google-antigravity")
            return None
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def generate_code(description, output_file=None):
    """Generate code using Antigravity OAuth"""
    prompt = f"""Generate clean, well-documented code for:

{description}

Requirements:
- Include comments explaining the code
- Add error handling where appropriate
- Follow best practices
- Make it production-ready

Provide only the code without additional explanation."""

    print("🤖 Asking Gemini via Antigravity OAuth...")
    print("   (FREE - using your OAuth connection)")
    code = call_gemini_antigravity(prompt)
    
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
    """Review code file using Antigravity"""
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

    print(f"🤖 Reviewing {file_path} via Antigravity OAuth...")
    review = call_gemini_antigravity(prompt, model="gemini-1.5-pro")  # Use Pro for reviews
    
    if review:
        print("\n" + "="*60)
        print(review)
        print("="*60)
        return True
    return False

def explain_code(file_path):
    """Explain what code does"""
    with open(file_path, 'r') as f:
        code = f.read()
    
    prompt = f"""Explain this code in simple terms:

```
{code}
```

Break down:
1. Overall purpose
2. Key functions/components
3. How it works step by step"""

    print(f"🤖 Explaining {file_path} via Antigravity...")
    explanation = call_gemini_antigravity(prompt)
    
    if explanation:
        print("\n" + "="*60)
        print(explanation)
        print("="*60)
        return True
    return False

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Antigravity Coding Assistant (FREE via OAuth)')
    parser.add_argument('action', choices=['generate', 'review', 'explain'],
                       help='Action to perform')
    parser.add_argument('input', help='Input description or file path')
    parser.add_argument('--output', '-o', help='Output file path')
    parser.add_argument('--model', default='gemini-1.5-flash',
                       choices=['gemini-1.5-flash', 'gemini-1.5-pro'],
                       help='Model to use (default: gemini-1.5-flash)')
    
    args = parser.parse_args()
    
    if args.action == 'generate':
        generate_code(args.input, args.output)
    elif args.action == 'review':
        review_code(args.input)
    elif args.action == 'explain':
        explain_code(args.input)

if __name__ == "__main__":
    main()
