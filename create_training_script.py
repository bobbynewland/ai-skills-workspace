#!/usr/bin/env python3
"""
Training Video Script Generator
Creates structured scripts for AI Skills Bootcamp training videos
"""
import sys
import json
from datetime import datetime

TEMPLATES = {
    "quick_win": {
        "duration": 60,
        "sections": [
            {"time": "0:00-0:05", "label": "Hook", "prompt": "Stop doing {topic} the hard way"},
            {"time": "0:05-0:15", "label": "Problem", "prompt": "Show common mistake with {topic}"},
            {"time": "0:15-0:45", "label": "Solution", "prompt": "Step-by-step {topic} demo"},
            {"time": "0:45-0:60", "label": "CTA", "prompt": "Try this now - link in bio"}
        ]
    },
    "deep_dive": {
        "duration": 300,
        "sections": [
            {"time": "0:00-0:30", "label": "Intro", "prompt": "What you'll learn about {topic}"},
            {"time": "0:30-1:00", "label": "Why", "prompt": "Why {topic} matters for your business"},
            {"time": "1:00-4:00", "label": "Walkthrough", "prompt": "Detailed {topic} demonstration"},
            {"time": "4:00-4:30", "label": "Pro Tips", "prompt": "Advanced {topic} techniques"},
            {"time": "4:30-5:00", "label": "Next Steps", "prompt": "How to get started with {topic}"}
        ]
    },
    "comparison": {
        "duration": 180,
        "sections": [
            {"time": "0:00-0:15", "label": "Hook", "prompt": "{topic} vs Alternative - which wins?"},
            {"time": "0:15-1:00", "label": "Option A", "prompt": "Breakdown of {topic}"},
            {"time": "1:00-1:45", "label": "Option B", "prompt": "Breakdown of alternative"},
            {"time": "1:45-2:30", "label": "Comparison", "prompt": "Side-by-side comparison"},
            {"time": "2:30-3:00", "label": "Verdict", "prompt": "Recommendation and CTA"}
        ]
    }
}

def generate_script(topic, template="quick_win", audience="beginner"):
    """Generate structured training script"""
    
    if template not in TEMPLATES:
        print(f"Available templates: {', '.join(TEMPLATES.keys())}")
        return None
    
    tmpl = TEMPLATES[template]
    script = {
        "metadata": {
            "topic": topic,
            "template": template,
            "audience": audience,
            "duration_seconds": tmpl["duration"],
            "created": datetime.now().isoformat()
        },
        "sections": []
    }
    
    for section in tmpl["sections"]:
        script["sections"].append({
            "time": section["time"],
            "label": section["label"],
            "prompt": section["prompt"].format(topic=topic),
            "script_text": "",
            "visual_notes": ""
        })
    
    return script

def format_script(script):
    """Format script for display"""
    lines = []
    lines.append(f"🎬 TRAINING VIDEO SCRIPT")
    lines.append(f"Topic: {script['metadata']['topic']}")
    lines.append(f"Template: {script['metadata']['template']}")
    lines.append(f"Duration: {script['metadata']['duration_seconds']} seconds")
    lines.append(f"Audience: {script['metadata']['audience']}")
    lines.append("=" * 60)
    
    for section in script["sections"]:
        lines.append(f"\n[{section['time']}] {section['label'].upper()}")
        lines.append(f"Prompt: {section['prompt']}")
        lines.append(f"Script: _________________________________")
        lines.append(f"Visual: _________________________________")
    
    lines.append("\n" + "=" * 60)
    lines.append("THUMBNAIL TEXT: _________________________")
    lines.append("DESCRIPTION: ____________________________")
    lines.append("HASHTAGS: #AISkills #Marketing #AI #Business")
    
    return "\n".join(lines)

def generate_thumbnail_prompt(topic, style="bold"):
    """Generate thumbnail prompt"""
    prompts = {
        "bold": f"YouTube thumbnail, bold text '{topic}' in large white Impact font with black outline, cartoon lobster mascot pointing, gradient blue-purple background, high contrast, clickbait style, 1280x720px",
        "clean": f"YouTube thumbnail, minimalist design, '{topic}' text, professional business aesthetic, OpenClaw branding, blue accent color, 1280x720px",
        "comparison": f"YouTube thumbnail, split screen VS style, '{topic} vs Old Way', dramatic lighting, bold typography, 1280x720px"
    }
    return prompts.get(style, prompts["bold"])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 create_training_script.py 'Topic Name' [template] [audience]")
        print("\nTemplates:")
        for t in TEMPLATES:
            print(f"  - {t}: {TEMPLATES[t]['duration']} seconds")
        sys.exit(1)
    
    topic = sys.argv[1]
    template = sys.argv[2] if len(sys.argv) > 2 else "quick_win"
    audience = sys.argv[3] if len(sys.argv) > 3 else "beginner"
    
    script = generate_script(topic, template, audience)
    
    if script:
        print(format_script(script))
        print("\n" + "=" * 60)
        print("THUMBNAIL PROMPT:")
        print(generate_thumbnail_prompt(topic))
        
        # Save to file
        filename = f"script_{topic.lower().replace(' ', '_')}.json"
        with open(filename, 'w') as f:
            json.dump(script, f, indent=2)
        print(f"\n💾 Saved to: {filename}")
