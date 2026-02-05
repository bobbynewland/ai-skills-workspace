#!/usr/bin/env python3
"""
Gemini Task Runner
Uses Gemini 3 Flash for non-coding tasks
Kimi reserved for chat only
"""
import os
import sys

def get_api_key():
    """Get Gemini API key"""
    return os.getenv('GEMINI_API_KEY')

def call_gemini(prompt, model="gemini-2.0-flash"):
    """Call Gemini API"""
    import requests
    
    api_key = get_api_key()
    if not api_key:
        print("❌ Set GEMINI_API_KEY environment variable")
        return None
    
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
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def summarize_text(text):
    """Summarize text using Flash"""
    prompt = f"Summarize this text concisely:\n\n{text}"
    return call_gemini(prompt, model="gemini-2.0-flash")

def answer_question(question):
    """Answer general questions using Flash"""
    return call_gemini(question, model="gemini-2.0-flash")

def generate_documentation(code):
    """Generate docs for code using Flash"""
    prompt = f"Generate documentation for this code:\n\n{code}"
    return call_gemini(prompt, model="gemini-2.0-flash")

def translate_text(text, target_language="Spanish"):
    """Translate text using Flash"""
    prompt = f"Translate this to {target_language}:\n\n{text}"
    return call_gemini(prompt, model="gemini-2.0-flash")

def extract_data(text, format="JSON"):
    """Extract structured data using Flash"""
    prompt = f"Extract key information from this text and format as {format}:\n\n{text}"
    return call_gemini(prompt, model="gemini-2.0-flash")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Gemini Task Runner (Flash for tasks)')
    parser.add_argument('task', choices=['summarize', 'ask', 'docs', 'translate', 'extract'])
    parser.add_argument('input', help='Input text or file')
    parser.add_argument('--output', '-o', help='Output file')
    parser.add_argument('--lang', default='Spanish', help='Target language for translation')
    
    args = parser.parse_args()
    
    # Read input
    if os.path.exists(args.input):
        with open(args.input, 'r') as f:
            content = f.read()
    else:
        content = args.input
    
    result = None
    
    if args.task == 'summarize':
        result = summarize_text(content)
    elif args.task == 'ask':
        result = answer_question(content)
    elif args.task == 'docs':
        result = generate_documentation(content)
    elif args.task == 'translate':
        result = translate_text(content, args.lang)
    elif args.task == 'extract':
        result = extract_data(content)
    
    if result:
        if args.output:
            with open(args.output, 'w') as f:
                f.write(result)
            print(f"✅ Output saved to: {args.output}")
        else:
            print(result)

if __name__ == "__main__":
    main()
