#!/usr/bin/env python3
"""
Training Video Content Calendar Generator
Creates 30-day content plans for AI Skills Bootcamp
"""
import json
from datetime import datetime, timedelta

CONTENT_PILLARS = {
    "onboarding": {
        "topics": [
            "Welcome to AI Skills Studio",
            "Your First Template in 60 Seconds",
            "Customizing Designs Like a Pro",
            "Exporting & Sharing Made Easy",
            "5 Pro Tips for Beginners"
        ],
        "platforms": ["youtube", "tiktok"],
        "duration": "quick_win"
    },
    "templates": {
        "topics": [
            "Beauty Templates That Convert",
            "Restaurant Marketing Made Easy",
            "3D Product Ads That Sell",
            "Service Professional Templates",
            "Creating Your Own Templates"
        ],
        "platforms": ["youtube", "instagram"],
        "duration": "deep_dive"
    },
    "advanced": {
        "topics": [
            "Master Brand Kits",
            "Team Collaboration Features",
            "Analytics Deep Dive",
            "API Integrations",
            "White-Label Options"
        ],
        "platforms": ["youtube", "linkedin"],
        "duration": "deep_dive"
    },
    "success": {
        "topics": [
            "How Sarah Scaled Her Salon",
            "Restaurant 10X'd Revenue",
            "E-commerce Success Story",
            "Ambassador Program Explained",
            "Roadmap to $1M with AI"
        ],
        "platforms": ["youtube", "tiktok", "instagram"],
        "duration": "quick_win"
    }
}

def generate_calendar(start_date=None, days=30):
    """Generate 30-day content calendar"""
    if start_date is None:
        start_date = datetime.now()
    
    calendar = []
    pillars = list(CONTENT_PILLARS.keys())
    
    for day in range(days):
        current_date = start_date + timedelta(days=day)
        pillar = pillars[day % len(pillars)]
        pillar_data = CONTENT_PILLARS[pillar]
        
        # Get topic (cycle through topics)
        topic_index = (day // len(pillars)) % len(pillar_data["topics"])
        topic = pillar_data["topics"][topic_index]
        
        video = {
            "day": day + 1,
            "date": current_date.strftime("%Y-%m-%d"),
            "pillar": pillar,
            "topic": topic,
            "platforms": pillar_data["platforms"],
            "template": pillar_data["duration"],
            "status": "planned",
            "script": "",
            "thumbnail": "",
            "video_file": "",
            "published": False
        }
        
        calendar.append(video)
    
    return calendar

def format_calendar(calendar):
    """Format calendar for display"""
    lines = []
    lines.append("📅 AI SKILLS BOOTCAMP - 30 DAY VIDEO CALENDAR")
    lines.append("=" * 70)
    
    current_week = 0
    for video in calendar:
        week = (video["day"] - 1) // 7 + 1
        if week != current_week:
            current_week = week
            lines.append(f"\n📆 WEEK {week}")
            lines.append("-" * 70)
        
        lines.append(f"\nDay {video['day']} ({video['date']})")
        lines.append(f"  Pillar: {video['pillar'].upper()}")
        lines.append(f"  Topic: {video['topic']}")
        lines.append(f"  Platforms: {', '.join(video['platforms'])}")
        lines.append(f"  Template: {video['template']}")
        lines.append(f"  Status: {video['status']}")
    
    lines.append("\n" + "=" * 70)
    lines.append("📊 SUMMARY")
    lines.append("=" * 70)
    
    pillars = {}
    platforms = {}
    for video in calendar:
        pillars[video["pillar"]] = pillars.get(video["pillar"], 0) + 1
        for platform in video["platforms"]:
            platforms[platform] = platforms.get(platform, 0) + 1
    
    lines.append("\nBy Pillar:")
    for pillar, count in pillars.items():
        lines.append(f"  {pillar}: {count} videos")
    
    lines.append("\nBy Platform:")
    for platform, count in platforms.items():
        lines.append(f"  {platform}: {count} videos")
    
    return "\n".join(lines)

if __name__ == "__main__":
    import sys
    
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 30
    
    calendar = generate_calendar(days=days)
    
    print(format_calendar(calendar))
    
    # Save to JSON
    filename = f"content_calendar_{days}days.json"
    with open(filename, 'w') as f:
        json.dump(calendar, f, indent=2)
    
    print(f"\n💾 Saved to: {filename}")
    
    # Generate script commands
    print("\n📝 To generate scripts for all videos, run:")
    for video in calendar[:5]:  # Show first 5 as example
        print(f"python3 create_training_script.py '{video['topic']}' {video['template']}")
