#!/usr/bin/env python3
"""
FULLY AUTOMATED AI Video Production
Uses your ElevenLabs + HeyGen API keys to create complete videos
"""
import json
import sys
import os
import time

def create_full_video(script_file, elevenlabs_key, heygen_key, output_name="ai_video"):
    """
    Complete pipeline: Script → Voice → Avatar Video
    """
    
    print("🎬 FULL AI VIDEO PRODUCTION")
    print("=" * 60)
    
    # Step 1: Load script
    print("\n1️⃣ Loading script...")
    with open(script_file, 'r') as f:
        script = json.load(f)
    
    topic = script['metadata']['topic']
    print(f"   Topic: {topic}")
    
    # Extract full text
    text_parts = [section['text'] for section in script['script']['sections']]
    full_text = " ".join(text_parts)
    print(f"   Script length: {len(full_text)} characters")
    
    # Step 2: Generate Voice (ElevenLabs)
    print("\n2️⃣ Generating voice with ElevenLabs...")
    voice_file = f"{output_name}_voice.mp3"
    
    voice_success = generate_elevenlabs_voice(
        full_text, 
        elevenlabs_key,
        voice_id="XB0fDUnXU5powFXDhCwa",  # Bella
        output_file=voice_file
    )
    
    if not voice_success:
        print("   ❌ Voice generation failed")
        return False
    
    print(f"   ✅ Voice saved: {voice_file}")
    
    # Step 3: Create Avatar Video (HeyGen)
    print("\n3️⃣ Creating avatar video with HeyGen...")
    video_file = f"{output_name}_video.mp4"
    
    video_success = create_heygen_video(
        voice_file,
        heygen_key,
        avatar_id="Daisy-inskirt-20220818",  # Free tier avatar
        output_file=video_file
    )
    
    if not video_success:
        print("   ❌ Video creation failed")
        return False
    
    print(f"   ✅ Video saved: {video_file}")
    
    # Step 4: Create summary
    print("\n4️⃣ Creating production summary...")
    summary = {
        "topic": topic,
        "voice_file": voice_file,
        "video_file": video_file,
        "status": "complete",
        "next_steps": [
            "Download video file",
            "Upload to YouTube/TikTok/Instagram",
            "Add custom thumbnail",
            "Publish!"
        ]
    }
    
    summary_file = f"{output_name}_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("\n" + "=" * 60)
    print("✅ VIDEO PRODUCTION COMPLETE!")
    print("=" * 60)
    print(f"\n📁 Files created:")
    print(f"   Voice: {voice_file}")
    print(f"   Video: {video_file}")
    print(f"   Summary: {summary_file}")
    print(f"\n🎬 Your AI avatar video is ready!")
    
    return True

def generate_elevenlabs_voice(text, api_key, voice_id="XB0fDUnXU5powFXDhCwa", output_file="voice.mp3"):
    """Generate voice using ElevenLabs API"""
    
    try:
        import requests
        
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": api_key
        }
        
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=60)
        
        if response.status_code == 200:
            with open(output_file, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"   Error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"   Error: {e}")
        return False

def create_heygen_video(voice_file, api_key, avatar_id="Daisy-inskirt-20220818", output_file="video.mp4"):
    """Create avatar video using HeyGen API"""
    
    try:
        import requests
        
        # Step 1: Upload voice file to get URL
        print("   Uploading voice file...")
        upload_url = "https://api.heygen.com/v1/upload"
        
        with open(voice_file, 'rb') as f:
            files = {'file': f}
            headers = {'x-api-key': api_key}
            upload_response = requests.post(upload_url, files=files, headers=headers, timeout=60)
        
        if upload_response.status_code != 200:
            print(f"   Upload error: {upload_response.text}")
            return False
        
        voice_url = upload_response.json().get('data', {}).get('url')
        print(f"   Voice uploaded: {voice_url}")
        
        # Step 2: Create video
        print("   Creating video (this takes 2-3 minutes)...")
        
        video_url = "https://api.heygen.com/v1/video.generate"
        
        payload = {
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": avatar_id,
                        "avatar_style": "normal"
                    },
                    "voice": {
                        "type": "audio",
                        "audio_url": voice_url
                    },
                    "background": {
                        "type": "color",
                        "value": "#1a1a2e"
                    }
                }
            ],
            "dimension": {
                "width": 1280,
                "height": 720
            },
            "caption": False
        }
        
        headers = {
            'x-api-key': api_key,
            'Content-Type': 'application/json'
        }
        
        response = requests.post(video_url, json=payload, headers=headers, timeout=60)
        
        if response.status_code != 200:
            print(f"   Video creation error: {response.text}")
            return False
        
        video_id = response.json().get('data', {}).get('video_id')
        print(f"   Video ID: {video_id}")
        
        # Step 3: Wait for processing
        print("   Waiting for processing...")
        status_url = f"https://api.heygen.com/v1/video_status.get?video_id={video_id}"
        
        max_attempts = 30
        for i in range(max_attempts):
            time.sleep(10)  # Wait 10 seconds between checks
            status_response = requests.get(status_url, headers=headers, timeout=30)
            
            if status_response.status_code == 200:
                status_data = status_response.json()
                status = status_data.get('data', {}).get('status')
                
                if status == 'completed':
                    video_url = status_data.get('data', {}).get('video_url')
                    
                    # Download video
                    video_content = requests.get(video_url, timeout=60)
                    with open(output_file, 'wb') as f:
                        f.write(video_content.content)
                    
                    print(f"   Video downloaded!")
                    return True
                    
                elif status == 'failed':
                    print(f"   Video processing failed")
                    return False
                    
                else:
                    print(f"   Status: {status}... ({i+1}/{max_attempts})")
        
        print("   Timeout waiting for video")
        return False
        
    except Exception as e:
        print(f"   Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 auto_produce_video.py script.json ELEVENLABS_KEY HEYGEN_KEY [output_name]")
        print("\nExample:")
        print("  python3 auto_produce_video.py avatar_script.json sk_xxx xxx test_video")
        print("\nGet your API keys:")
        print("  ElevenLabs: https://elevenlabs.io/app/settings/api-keys")
        print("  HeyGen: https://app.heygen.com/settings/api-keys")
        sys.exit(1)
    
    script_file = sys.argv[1]
    elevenlabs_key = sys.argv[2]
    heygen_key = sys.argv[3]
    output_name = sys.argv[4] if len(sys.argv) > 4 else "ai_video"
    
    if not os.path.exists(script_file):
        print(f"❌ Script file not found: {script_file}")
        sys.exit(1)
    
    success = create_full_video(script_file, elevenlabs_key, heygen_key, output_name)
    
    if success:
        print("\n🎉 All done! Check your video file.")
        sys.exit(0)
    else:
        print("\n❌ Production failed. Check errors above.")
        sys.exit(1)
