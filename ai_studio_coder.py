#!/usr/bin/env python3
"""
Google AI Studio Free Tier Coder
Uses AI Studio API which has more generous free limits
"""
import os
import sys

def get_ai_studio_key():
    """Get AI Studio API key"""
    # Try to read from file
    key_file = "/root/.openclaw/workspace/.keys/google_ai_studio.key"
    if os.path.exists(key_file):
        with open(key_file, 'r') as f:
            return f.read().strip()
    
    # Try environment variable
    return os.getenv('GOOGLE_AI_STUDIO_KEY') or os.getenv('GEMINI_API_KEY')

def call_ai_studio(prompt, model="gemini-2.0-flash"):
    """Call Google AI Studio API"""
    import requests
    
    api_key = get_ai_studio_key()
    if not api_key:
        print("❌ No AI Studio API key found")
        print("   Set GOOGLE_AI_STUDIO_KEY or add to .keys/google_ai_studio.key")
        return None
    
    # AI Studio uses different endpoint
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
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
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def generate_code(description, output_file=None):
    """Generate code using AI Studio"""
    prompt = f"""Generate clean, well-documented code for:

{description}

Requirements:
- Include comments explaining the code
- Add error handling where appropriate
- Follow best practices
- Make it production-ready

Provide only the code without additional explanation."""

    print(f"🤖 Generating code with AI Studio (FREE tier)...")
    code = call_ai_studio(prompt, model="gemini-2.0-flash")
    
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

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Google AI Studio Coder (FREE)')
    parser.add_argument('action', choices=['generate'], help='Action')
    parser.add_argument('input', help='Input description')
    parser.add_argument('--output', '-o', help='Output file path')
    args = parser.parse_args()
    
    if args.action == 'generate':
        generate_code(args.input, args.output)

if __name__ == "__main__":
    main()
