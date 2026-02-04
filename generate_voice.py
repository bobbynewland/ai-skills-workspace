#!/usr/bin/env python3
"""
AI Voice Generator using ElevenLabs API
Generates professional voiceovers for avatar videos
"""
import json
import sys
import os

def generate_voice_elevenlabs(script_file, voice="Bella", output="voiceover.mp3"):
    """
    Generate voice using ElevenLabs
    Note: Requires ELEVENLABS_API_KEY environment variable
    """
    
    # Load script
    with open(script_file, 'r') as f:
        script = json.load(f)
    
    # Extract all text from script
    text_parts = []
    for section in script['script']['sections']:
        text_parts.append(section['text'])
    
    full_text = " ".join(text_parts)
    
    # ElevenLabs API call
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if not api_key:
        print("❌ Error: Set ELEVENLABS_API_KEY environment variable")
        print("   Get API key from: https://elevenlabs.io/app/settings/api-keys")
        return None
    
    print(f"🎙️ Generating voice with ElevenLabs...")
    print(f"   Voice: {voice}")
    print(f"   Text length: {len(full_text)} characters")
    print(f"   Estimated cost: ${len(full_text) / 1000 * 0.10:.2f}")
    
    # API endpoint
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    
    data = {
        "text": full_text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }
    
    try:
        import requests
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            with open(output, 'wb') as f:
                f.write(response.content)
            print(f"✅ Voice saved to: {output}")
            return output
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            return None
            
    except ImportError:
        print("⚠️ requests library not installed")
        print("   Run: pip install requests")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def generate_voice_curl(script_file, voice="Bella", output="voiceover.mp3"):
    """Generate voice using curl (alternative method)"""
    
    with open(script_file, 'r') as f:
        script = json.load(f)
    
    text_parts = [section['text'] for section in script['script']['sections']]
    full_text = " ".join(text_parts)
    
    print(f"🎙️ Generating voice...")
    print(f"   Voice: {voice}")
    print(f"   Text: {full_text[:100]}...")
    
    # Create curl command
    curl_cmd = f'''curl -X POST \
  https://api.elevenlabs.io/v1/text-to-speech/{voice} \
  -H "Content-Type: application/json" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -d '{{"text": "{full_text}", "model_id": "eleven_monolingual_v1"}}' \
  --output {output}'''
    
    print(f"\n📋 Run this command with your API key:")
    print(curl_cmd)
    print(f"\n💾 Output will be saved to: {output}")
    
    return curl_cmd

def format_voice_segments(script_file):
    """Generate individual voice segments for each section"""
    
    with open(script_file, 'r') as f:
        script = json.load(f)
    
    print("🎙️ VOICE SEGMENTS:")
    print("=" * 70)
    
    segments = []
    for i, section in enumerate(script['script']['sections']):
        segment = {
            "index": i,
            "label": section['label'],
            "text": section['text'],
            "time": section['time'],
            "emotion": section['emotion'],
            "filename": f"voice_segment_{i:02d}_{section['label'].lower()}.mp3"
        }
        segments.append(segment)
        
        print(f"\nSegment {i}: {section['label']}")
        print(f"  Time: {section['time']}")
        print(f"  Text: {section['text']}")
        print(f"  Emotion: {section['emotion']}")
        print(f"  File: {segment['filename']}")
    
    # Save segments manifest
    manifest_file = script_file.replace('.json', '_segments.json')
    with open(manifest_file, 'w') as f:
        json.dump(segments, f, indent=2)
    
    print(f"\n💾 Segments manifest saved to: {manifest_file}")
    print(f"\n📋 To generate all segments, run:")
    print(f"  for segment in $(cat {manifest_file} | jq -r '.[].text'); do")
    print(f"    # Generate voice for each segment")
    print(f"  done")
    
    return segments

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_voice.py script.json [voice] [output.mp3]")
        print("\nVoices:")
        print("  Bella - Friendly female, energetic")
        print("  Adam - Professional male, authoritative")
        print("  Rachel - Warm, conversational")
        print("  Clyde - Deep, trustworthy")
        print("\nExample:")
        print("  python3 generate_voice.py avatar_script_templates_60s.json Bella voiceover.mp3")
        print("\nNote: Set ELEVENLABS_API_KEY environment variable first")
        sys.exit(1)
    
    script_file = sys.argv[1]
    voice = sys.argv[2] if len(sys.argv) > 2 else "Bella"
    output = sys.argv[3] if len(sys.argv) > 3 else "voiceover.mp3"
    
    # Check if file exists
    if not os.path.exists(script_file):
        print(f"❌ Script file not found: {script_file}")
        sys.exit(1)
    
    # Show segments breakdown
    format_voice_segments(script_file)
    
    print("\n" + "=" * 70)
    
    # Try to generate voice
    if os.getenv('ELEVENLABS_API_KEY'):
        result = generate_voice_elevenlabs(script_file, voice, output)
        if result:
            print(f"\n🎬 Next: Import into HeyGen or Synthesia")
    else:
        print("⚠️ ELEVENLABS_API_KEY not set")
        print("Showing curl command instead:")
        generate_voice_curl(script_file, voice, output)
        print("\n🔧 To set API key:")
        print("  export ELEVENLABS_API_KEY='your_key_here'")
