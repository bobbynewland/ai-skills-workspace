#!/usr/bin/env python3
"""
AI Avatar Script Generator
Creates scripts optimized for AI avatar delivery
"""
import json
import sys

def create_avatar_script(topic, duration=60, tone="energetic", audience="beginner"):
    """Create script optimized for AI avatar delivery"""
    
    scripts = {
        60: {
            "sections": [
                {
                    "time": "0:00-0:05",
                    "label": "Hook",
                    "text": f"Stop struggling with {topic.lower()}!",
                    "gesture": "point_at_camera",
                    "emotion": "concerned"
                },
                {
                    "time": "0:05-0:15",
                    "label": "Problem",
                    "text": f"Most businesses waste hours on {topic.lower()} every week.",
                    "gesture": "shake_head",
                    "emotion": "frustrated"
                },
                {
                    "time": "0:15-0:45",
                    "label": "Solution",
                    "text": f"But with AI Skills Studio, you can automate {topic.lower()} in seconds. Just choose a template, customize it, and export. It's that simple!",
                    "gesture": "present_to_screen",
                    "emotion": "excited"
                },
                {
                    "time": "0:45-0:60",
                    "label": "CTA",
                    "text": f"Click the link in bio and try it free today!",
                    "gesture": "point_down",
                    "emotion": "happy"
                }
            ]
        },
        180: {
            "sections": [
                {
                    "time": "0:00-0:15",
                    "label": "Intro",
                    "text": f"Hey there! Today I'm going to show you exactly how to master {topic} in just a few minutes.",
                    "gesture": "wave",
                    "emotion": "happy"
                },
                {
                    "time": "0:15-0:30",
                    "label": "Why",
                    "text": f"Here's why this matters: getting {topic} right can save you 10 hours every week and help you attract more customers.",
                    "gesture": "explain",
                    "emotion": "serious"
                },
                {
                    "time": "0:30-1:30",
                    "label": "Walkthrough",
                    "text": f"Step 1: Log into AI Skills Studio. Step 2: Choose the {topic} template. Step 3: Customize colors, text, and images. Step 4: Export in any format. That's it!",
                    "gesture": "count_on_fingers",
                    "emotion": "excited"
                },
                {
                    "time": "1:30-1:45",
                    "label": "Pro Tips",
                    "text": f"Pro tip: Use the brand kit feature to keep all your {topic} materials consistent across every platform.",
                    "gesture": "point_up",
                    "emotion": "confident"
                },
                {
                    "time": "1:45-2:00",
                    "label": "CTA",
                    "text": f"Ready to get started? Click the link below for a free trial. See you inside!",
                    "gesture": "point_down",
                    "emotion": "happy"
                }
            ]
        },
        300: {
            "sections": [
                {
                    "time": "0:00-0:30",
                    "label": "Intro",
                    "text": f"Welcome! In this video, I'm going to give you a complete walkthrough of {topic} and show you how to use it to grow your business.",
                    "gesture": "present_open",
                    "emotion": "welcoming"
                },
                {
                    "time": "0:30-1:00",
                    "label": "Problem",
                    "text": f"Let's be honest - {topic} used to be complicated, expensive, and time-consuming. You needed designers, expensive software, and hours of work.",
                    "gesture": "frustrated_gesture",
                    "emotion": "concerned"
                },
                {
                    "time": "1:00-4:00",
                    "label": "Solution",
                    "text": f"But now, with AI Skills Studio, everything changes. Let me show you exactly how it works...",
                    "gesture": "present_to_screen",
                    "emotion": "excited"
                },
                {
                    "time": "4:00-4:30",
                    "label": "Results",
                    "text": f"Just imagine - what used to take days now takes minutes. Our users report saving 20+ hours per week on average.",
                    "gesture": "count_on_fingers",
                    "emotion": "proud"
                },
                {
                    "time": "4:30-5:00",
                    "label": "CTA",
                    "text": f"Don't wait - join thousands of businesses already using AI Skills Studio. Click the link and start your free trial today!",
                    "gesture": "point_down",
                    "emotion": "enthusiastic"
                }
            ]
        }
    }
    
    return {
        "metadata": {
            "topic": topic,
            "duration": duration,
            "tone": tone,
            "audience": audience,
            "total_words": 0,  # Calculated below
            "estimated_chars": 0
        },
        "avatar_settings": {
            "recommended_avatar": "business_casual_female" if tone == "energetic" else "business_professional_male",
            "gesture_level": "high" if tone == "energetic" else "moderate",
            "emotion_baseline": "happy" if tone == "energetic" else "professional",
            "eye_contact": "camera",
            "background": "gradient_blue_purple" if tone == "energetic" else "clean_office"
        },
        "voice_settings": {
            "recommended_voice": "Bella" if tone == "energetic" else "Adam",
            "speed": "medium",
            "pitch": "normal",
            "emotion": tone,
            "language": "en"
        },
        "script": scripts.get(duration, scripts[60])
    }

def format_script(script_data):
    """Format script for display"""
    lines = []
    lines.append(f"🎬 AI AVATAR SCRIPT: {script_data['metadata']['topic']}")
    lines.append(f"Duration: {script_data['metadata']['duration']}s | Tone: {script_data['metadata']['tone']}")
    lines.append("=" * 70)
    
    lines.append("\n🎭 AVATAR SETTINGS:")
    avatar = script_data['avatar_settings']
    lines.append(f"  Avatar: {avatar['recommended_avatar']}")
    lines.append(f"  Gestures: {avatar['gesture_level']}")
    lines.append(f"  Emotion: {avatar['emotion_baseline']}")
    lines.append(f"  Background: {avatar['background']}")
    
    lines.append("\n🎙️ VOICE SETTINGS:")
    voice = script_data['voice_settings']
    lines.append(f"  Voice: {voice['recommended_voice']}")
    lines.append(f"  Speed: {voice['speed']}")
    lines.append(f"  Emotion: {voice['emotion']}")
    
    lines.append("\n📝 SCRIPT:")
    lines.append("-" * 70)
    
    full_text = []
    for section in script_data['script']['sections']:
        lines.append(f"\n[{section['time']}] {section['label'].upper()}")
        lines.append(f"Text: \"{section['text']}\"")
        lines.append(f"Gesture: {section['gesture']} | Emotion: {section['emotion']}")
        full_text.append(section['text'])
    
    # Calculate totals
    full_script = " ".join(full_text)
    script_data['metadata']['total_words'] = len(full_script.split())
    script_data['metadata']['estimated_chars'] = len(full_script)
    
    lines.append("\n" + "=" * 70)
    lines.append(f"Total Words: {script_data['metadata']['total_words']}")
    lines.append(f"Est. Characters: {script_data['metadata']['estimated_chars']}")
    lines.append(f"Voice Cost: ~${script_data['metadata']['estimated_chars'] / 1000 * 0.10:.2f} (ElevenLabs)")
    
    return "\n".join(lines)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 create_avatar_script.py 'Topic' [duration] [tone] [audience]")
        print("\nDurations:")
        print("  60 = Quick win (60 seconds)")
        print("  180 = Deep dive (3 minutes)")
        print("  300 = Masterclass (5 minutes)")
        print("\nTones: energetic, professional, casual")
        print("\nExample:")
        print("  python3 create_avatar_script.py 'Template Customization' 60 energetic")
        sys.exit(1)
    
    topic = sys.argv[1]
    duration = int(sys.argv[2]) if len(sys.argv) > 2 else 60
    tone = sys.argv[3] if len(sys.argv) > 3 else "energetic"
    audience = sys.argv[4] if len(sys.argv) > 4 else "beginner"
    
    script = create_avatar_script(topic, duration, tone, audience)
    
    print(format_script(script))
    
    # Save to file
    filename = f"avatar_script_{topic.lower().replace(' ', '_')}_{duration}s.json"
    with open(filename, 'w') as f:
        json.dump(script, f, indent=2)
    
    print(f"\n💾 Saved to: {filename}")
    print(f"\n🎬 Next steps:")
    print(f"  1. Generate voice: python3 generate_voice.py {filename}")
    print(f"  2. Create avatar video: Use HeyGen or Synthesia")
    print(f"  3. Publish to platforms")
