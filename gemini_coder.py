#!/usr/bin/env python3
"""
Gemini Pro Coding Assistant
Use Gemini Pro for coding tasks to save Kimi API credits
"""
import os
import sys
import json
import argparse

def call_gemini(prompt, model="gemini-1.5-flash", api_key=None):
    """Call Gemini API with prompt"""
    import requests
    
    if api_key is None:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("❌ Error: Set GEMINI_API_KEY environment variable")
            print("   Get your key at: https://makersuite.google.com/app/apikey")
            sys.exit(1)
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    headers = {
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
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def generate_code(description, output_file=None):
    """Generate code from description"""
    prompt = f"""Generate clean, well-documented code for the following:

{description}

Requirements:
- Include comments explaining the code
- Add error handling where appropriate
- Follow best practices
- Make it production-ready

Provide only the code without additional explanation."""

    print("🤖 Asking Gemini to generate code...")
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
    with open(file_path, 'r') as f:
        code = f.read()
    
    prompt = f"""Review the following code and provide:
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
    review = call_gemini(prompt)
    
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
    
    prompt = f"""Explain what this code does in simple terms:

```
{code}
```

Break down:
1. Overall purpose
2. Key functions/components
3. How it works step by step"""

    print(f"🤖 Explaining {file_path}...")
    explanation = call_gemini(prompt)
    
    if explanation:
        print("\n" + "="*60)
        print(explanation)
        print("="*60)
        return True
    return False

def refactor_code(file_path, output_file=None):
    """Refactor/improve code"""
    with open(file_path, 'r') as f:
        code = f.read()
    
    prompt = f"""Refactor and improve this code:

```
{code}
```

Improvements to make:
- Better variable names
- More efficient algorithms
- Cleaner structure
- Add type hints if Python
- Better error handling

Provide only the improved code."""

    print(f"🤖 Refactoring {file_path}...")
    improved = call_gemini(prompt)
    
    if improved:
        if output_file:
            with open(output_file, 'w') as f:
                f.write(improved)
            print(f"✅ Refactored code saved to: {output_file}")
        else:
            print("\n" + "="*60)
            print(improved)
            print("="*60)
        return True
    return False

def main():
    parser = argparse.ArgumentParser(description='Gemini Pro Coding Assistant')
    parser.add_argument('action', choices=['generate', 'review', 'explain', 'refactor'],
                       help='Action to perform')
    parser.add_argument('input', help='Input description or file path')
    parser.add_argument('--output', '-o', help='Output file path')
    parser.add_argument('--model', default='gemini-1.5-flash',
                       choices=['gemini-1.5-flash', 'gemini-1.5-pro'],
                       help='Model to use (default: gemini-1.5-flash)')
    
    args = parser.parse_args()
    
    # Set model
    os.environ['GEMINI_MODEL'] = args.model
    
    if args.action == 'generate':
        generate_code(args.input, args.output)
    elif args.action == 'review':
        review_code(args.input)
    elif args.action == 'explain':
        explain_code(args.input)
    elif args.action == 'refactor':
        refactor_code(args.input, args.output)

if __name__ == "__main__":
    main()
