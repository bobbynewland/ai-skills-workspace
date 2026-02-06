#!/usr/bin/env python3
"""
Gemini CLI Pro - Free Coding Assistant
Uses Google AI Studio API (free tier)
Replaces expensive API calls with generous free limits
"""
import os
import sys
import argparse

# Gemini API Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCDHTGxm3wFtoNHCkl__k1YNvi_n9KxycA')
GEMINI_MODEL = "gemini-2.0-flash"  # Free tier model

def call_gemini(prompt, model=GEMINI_MODEL):
    """Call Gemini API"""
    import requests
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192,
        }
    }
    
    try:
        response = requests.post(url, json=data, timeout=60)
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def generate_code(description, output_file=None):
    """Generate code"""
    prompt = f"""Generate clean, production-ready code for:

{description}

Requirements:
- Include comments explaining the code
- Add error handling where appropriate
- Follow best practices
- Make it complete and functional

Provide only the code without additional explanation."""

    print(f"🤖 Generating code with Gemini Flash (FREE tier)...")
    code = call_gemini(prompt)
    
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
    try:
        with open(file_path, 'r') as f:
            code = f.read()
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        return
    
    prompt = f"""Review this code and provide detailed feedback:

```
{code}
```

Provide:
1. Potential bugs or issues
2. Security concerns
3. Performance improvements
4. Code style suggestions
5. Best practice recommendations"""

    print(f"🔍 Reviewing {file_path}...")
    review = call_gemini(prompt, model="gemini-2.5-pro")  # Use Pro for reviews
    
    if review:
        print("\n" + "="*60)
        print(review)
        print("="*60)

def explain_code(file_path):
    """Explain code"""
    try:
        with open(file_path, 'r') as f:
            code = f.read()
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        return
    
    prompt = f"""Explain what this code does in simple terms:

```
{code}
```

Break down:
1. Overall purpose
2. Key functions/components
3. How it works step by step"""

    print(f"📖 Explaining {file_path}...")
    explanation = call_gemini(prompt)
    
    if explanation:
        print("\n" + "="*60)
        print(explanation)
        print("="*60)

def chat_mode():
    """Interactive chat mode"""
    print("💬 Gemini CLI Chat Mode (type 'exit' to quit)")
    print("="*60)
    
    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ['exit', 'quit', 'q']:
            print("👋 Goodbye!")
            break
        
        if not user_input:
            continue
        
        print("\nGemini: ", end="")
        response = call_gemini(user_input)
        if response:
            print(response)

def main():
    parser = argparse.ArgumentParser(description='Gemini CLI Pro - Free Coding Assistant')
    parser.add_argument('action', choices=['generate', 'review', 'explain', 'chat', 'ask'], 
                       help='Action to perform')
    parser.add_argument('input', nargs='?', help='Input prompt or file path')
    parser.add_argument('--output', '-o', help='Output file path')
    parser.add_argument('--model', '-m', default='gemini-2.0-flash',
                       choices=['gemini-2.0-flash', 'gemini-2.5-pro'],
                       help='Model to use (default: gemini-2.0-flash)')
    
    args = parser.parse_args()
    
    if args.action == 'generate':
        if not args.input:
            print("❌ Please provide a description for code generation")
            sys.exit(1)
        generate_code(args.input, args.output)
    
    elif args.action == 'review':
        if not args.input:
            print("❌ Please provide a file path to review")
            sys.exit(1)
        review_code(args.input)
    
    elif args.action == 'explain':
        if not args.input:
            print("❌ Please provide a file path to explain")
            sys.exit(1)
        explain_code(args.input)
    
    elif args.action == 'chat':
        chat_mode()
    
    elif args.action == 'ask':
        if not args.input:
            print("❌ Please provide a question")
            sys.exit(1)
        print(f"🤖 Asking Gemini...")
        response = call_gemini(args.input, model=args.model)
        if response:
            print("\n" + response)

if __name__ == "__main__":
    main()
