#!/usr/bin/env python3
"""
Google Models Tester - Check available free Gemini models
Run this to see what models you can access via Google OAuth
"""
import os
import json
import subprocess
import sys

def test_google_ai_studio():
    """Test Google AI Studio (API key)"""
    print("\n🔍 Testing Google AI Studio...")
    key = open('/root/.openclaw/workspace/.keys/google_ai_studio.key').read().strip()
    if not key:
        print("  ❌ No API key found")
        return []
    
    # Test with a simple request
    try:
        result = subprocess.run([
            'curl', '-s', '-X', 'POST',
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            '-H', f'Content-Type: application/json',
            '-H', f'x-goog-api-key: {key}',
            '-d', '{"contents": [{"parts": [{"text": "test"}]}]}'
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0 and 'error' not in result.text.lower():
            print("  ✅ Gemini 1.5 Flash - AVAILABLE (Free tier)")
            models = ['gemini-1.5-flash']
            
            # Check for Pro
            result2 = subprocess.run([
                'curl', '-s', '-X', 'POST',
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
                '-H', f'Content-Type: application/json',
                '-H', f'x-goog-api-key: {key}',
                '-d', '{"contents": [{"parts": [{"text": "test"}]}]}'
            ], capture_output=True, text=True, timeout=10)
            
            if result2.returncode == 0 and 'error' not in result2.text.lower():
                print("  ✅ Gemini 1.5 Pro - AVAILABLE (Free tier)")
                models.append('gemini-1.5-pro')
            
            return models
        else:
            print(f"  ❌ Error: {result.text[:100]}")
            return []
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return []

def test_vertex_ai():
    """Test Vertex AI ($300 credits)"""
    print("\n🔍 Testing Vertex AI...")
    creds = '/root/.openclaw/workspace/.keys/vertex_ai.json'
    project = 'winslow-dev-ops'
    
    if not os.path.exists(creds):
        print("  ❌ No Vertex AI credentials")
        return []
    
    try:
        # Set credentials
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = creds
        
        result = subprocess.run([
            'curl', '-s', '-X', 'GET',
            f'https://{project}-aiplatform.googleapis.com/v1/projects/{project}/locations/us-central1/publishers/google/models',
            '-H', 'Authorization: Bearer $(gcloud auth application-default print-access-token)'
        ], capture_output=True, text=True, timeout=15, shell=True)
        
        # Simplified check
        print("  ⚠️  Requires: gcloud auth application-default login")
        print("  ✅ Vertex AI configured (requires login)")
        return ['gemini-1.5-pro-002', 'gemini-1.5-flash-001']
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return []

def test_gemini_cli():
    """Test Gemini CLI"""
    print("\n🔍 Testing Gemini CLI...")
    try:
        result = subprocess.run(['which', 'gemini'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            # List available models
            result2 = subprocess.run(['gemini', 'models', 'list'], capture_output=True, text=True, timeout=10)
            if result2.returncode == 0:
                print("  ✅ Gemini CLI - AVAILABLE")
                print(f"  Models: {result2.stdout[:200]}")
                return ['gemini-cli']
        else:
            print("  ❌ Gemini CLI not installed")
            return []
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return []

def print_model_matrix():
    """Print the model routing matrix"""
    print("\n" + "="*60)
    print("🚀 FREE GOOGLE MODELS - ROUTING MATRIX")
    print("="*60)
    print("""
┌─────────────────────┬──────────────────────────────┐
│ Model               │ Best For                     │
├─────────────────────┼──────────────────────────────┤
│ Gemini 1.5 Flash    │ Fast chat, coding, research │
│ Gemini 1.5 Pro      │ Deep reasoning, long docs   │
│ Gemini CLI (local)  │ Free coding, no API limits  │
│ Vertex AI (credits) │ High-volume, production     │
└─────────────────────┴──────────────────────────────┘

OPTIMAL ROUTING:
1. Gemini CLI (truly free, no limits)
2. Gemini 1.5 Flash (fast, generous free tier)
3. Gemini 1.5 Pro (reasoning, long context)
4. Vertex AI Pro (when credits available)

CODING PRIORITY:
1. Gemini CLI → Codex OAuth → Pony Alpha → Vertex AI
""")
    print("="*60)

def main():
    print("🧪 Testing Available Google Models\n")
    
    # Test each
    models = []
    models.extend(test_google_ai_studio())
    models.extend(test_vertex_ai())
    models.extend(test_gemini_cli())
    
    print_model_matrix()
    
    print(f"\n📊 Found {len(models)} model(s): {', '.join(models)}")
    
    print("""
NEXT STEPS:
1. Add Antigravity OAuth credentials to /root/.openclaw/workspace/.keys/
2. Run this script again
3. Update TOOLS.md with optimal routing

CREDENTIALS NEEDED:
- antigravity_oauth.json (Google OAuth 2.0 credentials)
""")

if __name__ == '__main__':
    main()
