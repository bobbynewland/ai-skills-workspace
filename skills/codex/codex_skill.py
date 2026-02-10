#!/usr/bin/env python3
"""
OpenAI Codex Skill via OpenRouter
Generate, complete, and fix code
"""
import os
import sys
import json
import requests

# Config
OPENROUTER_KEY = open('/root/.openclaw/workspace/.keys/openrouter.key').read().strip()
CODEX_MODEL = "openai/codex"
BASE_URL = "https://openrouter.ai/api/v1"

headers = {
    "Authorization": f"Bearer {OPENROUTER_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://openclaw.ai",
    "X-Title": "OpenClaw Codex"
}

def generate_code(prompt, language="python", max_tokens=1024):
    """Generate code from description"""
    payload = {
        "model": CODEX_MODEL,
        "messages": [
            {"role": "system", "content": f"You are an expert {language} developer. Generate clean, well-commented code."},
            {"role": "user", "content": f"Write {language} code:\n\n{prompt}"}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.2
    }
    
    r = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
    if r.status_code == 200:
        return r.json()['choices'][0]['message']['content']
    return f"Error: {r.text}"

def complete_code(code, language="python", max_tokens=512):
    """Complete partial code"""
    payload = {
        "model": CODEX_MODEL,
        "messages": [
            {"role": "system", "content": f"You are a {language} code completion assistant. Complete the code naturally."},
            {"role": "user", "content": f"Complete this {language} code:\n\n```{language}\n{code}\n```"}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.1
    }
    
    r = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
    if r.status_code == 200:
        return r.json()['choices'][0]['message']['content']
    return f"Error: {r.text}"

def explain_code(code, language="python"):
    """Explain what code does"""
    payload = {
        "model": CODEX_MODEL,
        "messages": [
            {"role": "system", "content": "You are a code documentation assistant. Explain code clearly and concisely."},
            {"role": "user", "content": f"Explain this {language} code:\n\n```{language}\n{code}\n```"}
        ],
        "max_tokens": 512,
        "temperature": 0.3
    }
    
    r = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
    if r.status_code == 200:
        return r.json()['choices'][0]['message']['content']
    return f"Error: {r.text}"

def fix_buggy_code(code, language="python"):
    """Fix bugs in code"""
    payload = {
        "model": CODEX_MODEL,
        "messages": [
            {"role": "system", "content": f"You are a {language} debugging expert. Find and fix bugs, explain the fixes."},
            {"role": "user", "content": f"Find and fix bugs in this {language} code:\n\n```{language}\n{code}\n```"}
        ],
        "max_tokens": 1024,
        "temperature": 0.2
    }
    
    r = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
    if r.status_code == 200:
        return r.json()['choices'][0]['message']['content']
    return f"Error: {r.text}"

def generate_tests(code, language="python", framework="pytest"):
    """Generate unit tests"""
    payload = {
        "model": CODEX_MODEL,
        "messages": [
            {"role": "system", "content": f"You are a testing expert. Write comprehensive {framework} tests."},
            {"role": "user", "content": f"Write {framework} tests for this {language} code:\n\n```{language}\n{code}\n```"}
        ],
        "max_tokens": 1024,
        "temperature": 0.3
    }
    
    r = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
    if r.status_code == 200:
        return r.json()['choices'][0]['message']['content']
    return f"Error: {r.text}"

def get_languages():
    """List supported programming languages"""
    return """
Supported Languages:
- Python
- JavaScript
- TypeScript
- Java
- C/C++
- C#
- Go
- Rust
- Ruby
- PHP
- Swift
- Kotlin
- SQL
- HTML/CSS
- Shell/Bash
- And more!
""".strip()

def main():
    if len(sys.argv) < 2:
        print("""
💻 OpenAI Codex Skill
=====================

Commands:
  generate <prompt>   Generate code from description
  complete <code>    Complete partial code
  explain <code>     Explain what code does
  fix <code>         Find and fix bugs
  tests <code>       Generate unit tests
  languages          List supported languages

Examples:
  python3 codex_skill.py generate "Create a REST API with Flask"
  python3 codex_skill.py fix "def add(a, b) return a + b"
  python3 codex_skill.py languages
""")
        return
    
    cmd = sys.argv[1].lower()
    
    if cmd == "languages":
        print(get_languages())
    
    elif cmd == "generate" and len(sys.argv) > 2:
        prompt = " ".join(sys.argv[2:])
        print(f"Generating code...")
        result = generate_code(prompt)
        print(f"\n{result}")
    
    elif cmd == "complete" and len(sys.argv) > 2:
        code = " ".join(sys.argv[2:])
        print(f"Completing code...")
        result = complete_code(code)
        print(f"\n{result}")
    
    elif cmd == "explain" and len(sys.argv) > 2:
        code = " ".join(sys.argv[2:])
        print(f"Explaining code...")
        result = explain_code(code)
        print(f"\n{result}")
    
    elif cmd == "fix" and len(sys.argv) > 2:
        code = " ".join(sys.argv[2:])
        print(f"Finding and fixing bugs...")
        result = fix_buggy_code(code)
        print(f"\n{result}")
    
    elif cmd == "tests" and len(sys.argv) > 2:
        code = " ".join(sys.argv[2:])
        print(f"Generating tests...")
        result = generate_tests(code)
        print(f"\n{result}")
    
    else:
        print("Unknown command. Run without args for help.")

if __name__ == "__main__":
    main()
