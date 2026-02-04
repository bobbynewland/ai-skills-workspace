#!/usr/bin/env python3
"""
Notebook LM → Video Script Converter
Takes Notebook LM research output and converts to video script
"""
import sys
import json

def convert_notebooklm_to_script(notebooklm_text, topic, video_type="deep_dive"):
    """
    Convert Notebook LM research into structured video script
    
    Args:
        notebooklm_text: Raw text output from Notebook LM
        topic: Video topic/title
        video_type: quick_win, deep_dive, or comparison
    """
    
    # Parse Notebook LM output (assuming it's structured)
    lines = notebooklm_text.strip().split('\n')
    
    # Extract key points (bullet points or numbered lists)
    key_points = []
    for line in lines:
        line = line.strip()
        if line.startswith('- ') or line.startswith('* ') or line[0:2].isdigit():
            key_points.append(line.lstrip('- *0123456789.').strip())
    
    # Create script structure based on video type
    if video_type == "quick_win":
        script = {
            "hook": f"Stop struggling with {topic.lower()}",
            "problem": key_points[0] if len(key_points) > 0 else f"Most people do {topic} wrong",
            "solution": " → ".join(key_points[1:4]) if len(key_points) > 3 else "Here's the better way",
            "cta": f"Try AI Skills Studio free - link in bio"
        }
    elif video_type == "deep_dive":
        script = {
            "intro": f"Today we're mastering {topic}",
            "why": key_points[0] if len(key_points) > 0 else f"Why {topic} matters",
            "walkthrough": key_points[1:6] if len(key_points) > 5 else key_points[1:],
            "pro_tips": key_points[-2:] if len(key_points) > 2 else ["Practice daily"],
            "next_steps": f"Start your first {topic} project today"
        }
    else:  # comparison
        script = {
            "hook": f"{topic} vs the old way - which wins?",
            "option_a": key_points[0] if len(key_points) > 0 else "Traditional method",
            "option_b": key_points[1] if len(key_points) > 1 else "AI-powered method",
            "comparison": key_points[2:5] if len(key_points) > 4 else ["Faster", "Cheaper", "Better"],
            "verdict": f"AI Skills Studio makes {topic} 10x easier"
        }
    
    return {
        "topic": topic,
        "video_type": video_type,
        "source_points": len(key_points),
        "script": script,
        "b_roll_suggestions": generate_b_roll_suggestions(topic, key_points),
        "google_vids_notes": generate_vids_notes(video_type)
    }

def generate_b_roll_suggestions(topic, key_points):
    """Generate B-roll suggestions for video"""
    suggestions = [
        f"Screen recording: Dashboard showing {topic}",
        f"Close-up: Template customization",
        f"Wide shot: Full platform interface",
        "Text overlay: Key statistics",
        "Animation: Before/After comparison"
    ]
    
    # Add specific suggestions based on content
    if "template" in topic.lower():
        suggestions.extend([
            "Screen: Template gallery scrolling",
            "Screen: Drag-and-drop editing",
            "Screen: Export process"
        ])
    elif "beauty" in topic.lower() or "restaurant" in topic.lower():
        suggestions.extend([
            "Screen: Industry-specific templates",
            "Screen: Customization options",
            "Split screen: Multiple template variations"
        ])
    
    return suggestions[:8]  # Limit to 8 suggestions

def generate_vids_notes(video_type):
    """Generate Google Vids editing notes"""
    notes = {
        "transitions": "Use 'Clean Cut' for professional feel",
        "captions": "Enable auto-captions (90% watch muted!)",
        "music": "Choose 'Upbeat Corporate' from library",
        "branding": {
            "primary_color": "#00d4ff",
            "secondary_color": "#7b2cbf",
            "logo": "Add OpenClaw mascot to corner",
            "lower_thirds": "Gradient blue-purple with white text"
        }
    }
    
    if video_type == "quick_win":
        notes["pacing"] = "Fast cuts every 3-5 seconds"
        notes["text_overlays"] = "Bold text for key points"
    elif video_type == "deep_dive":
        notes["pacing"] = "Slower pace, let concepts sink in"
        notes["zoom"] = "Use zoom on important UI elements"
    
    return notes

def format_script_output(script_data):
    """Format script for display"""
    lines = []
    lines.append(f"🎬 VIDEO SCRIPT: {script_data['topic']}")
    lines.append(f"Type: {script_data['video_type']} | Source Points: {script_data['source_points']}")
    lines.append("=" * 60)
    
    lines.append("\n📝 SCRIPT CONTENT:")
    for section, content in script_data['script'].items():
        lines.append(f"\n[{section.upper()}]")
        if isinstance(content, list):
            for item in content:
                lines.append(f"  • {item}")
        else:
            lines.append(f"  {content}")
    
    lines.append("\n\n🎥 B-ROLL SUGGESTIONS:")
    for suggestion in script_data['b_roll_suggestions']:
        lines.append(f"  • {suggestion}")
    
    lines.append("\n\n🎨 GOOGLE VIDS NOTES:")
    vids = script_data['google_vids_notes']
    lines.append(f"  Transitions: {vids['transitions']}")
    lines.append(f"  Captions: {vids['captions']}")
    lines.append(f"  Music: {vids['music']}")
    lines.append(f"  Pacing: {vids.get('pacing', 'Standard')}")
    
    lines.append("\n  BRANDING:")
    for key, value in vids['branding'].items():
        lines.append(f"    {key}: {value}")
    
    return "\n".join(lines)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 notebooklm_to_script.py 'Topic' [video_type]")
        print("\nExample:")
        print("  python3 notebooklm_to_script.py 'Template Customization' deep_dive")
        print("\nPaste Notebook LM output when prompted:")
        sys.exit(1)
    
    topic = sys.argv[1]
    video_type = sys.argv[2] if len(sys.argv) > 2 else "deep_dive"
    
    print(f"📋 Paste your Notebook LM research for: {topic}")
    print("(Press Ctrl+D when done)")
    
    notebooklm_text = sys.stdin.read()
    
    if not notebooklm_text.strip():
        print("❌ No input provided. Using sample data...")
        # Sample data for demo
        notebooklm_text = """
        - Users struggle with customizing templates quickly
        - Most platforms require design skills
        - AI Skills Studio has drag-and-drop simplicity
        - 100+ templates across industries
        - Export to any format instantly
        - Brand kit feature maintains consistency
        """
    
    script_data = convert_notebooklm_to_script(notebooklm_text, topic, video_type)
    
    print("\n" + format_script_output(script_data))
    
    # Save to file
    filename = f"script_notebooklm_{topic.lower().replace(' ', '_')}.json"
    with open(filename, 'w') as f:
        json.dump(script_data, f, indent=2)
    
    print(f"\n💾 Saved to: {filename}")
    print(f"\n🎬 Next: Import into Google Vids at https://vids.google.com")
