#!/usr/bin/env python3
"""
Command Board Marketing Tools
Integrates with Firebase to add tasks for marketing automation
"""
import requests
import json
import sys

# Firebase config
FIREBASE_URL = "https://winslow-756c3-default-rtdb.firebaseio.com"
WORKSPACE = "winslow_main"

def add_task(title, description, column="todo", priority="high", tags=None):
    """Add a task to Command Board"""
    task_data = {
        "title": title,
        "description": description,
        "column": column,
        "priority": priority,
        "tags": tags or [],
        "createdAt": int(requests.get("https://worldtimeapi.org/api/timezone/UTC").json()["unixtime"] * 1000) if False else int(__import__('time').time() * 1000),
        "assignedTo": None
    }
    
    url = f"{FIREBASE_URL}/workspaces/{WORKSPACE}/tasks.json"
    response = requests.post(url, json=task_data)
    
    if response.status_code == 200:
        print(f"✅ Added: {title}")
        return response.json()["name"]
    else:
        print(f"❌ Failed to add: {title}")
        return None

def setup_marketing_tasks():
    """Setup all marketing tool tasks"""
    
    tasks = [
        # Tool Development Tasks
        {
            "title": "🎯 Build Affiliate Tracking System",
            "description": "Create custom affiliate dashboard with referral tracking, commission calculations, and automated payouts. Include unique referral codes and performance analytics.",
            "column": "todo",
            "priority": "high",
            "tags": ["tool", "affiliate", "backend"]
        },
        {
            "title": "📱 Social Media Auto-Poster",
            "description": "Build automation to post template previews to TikTok, Instagram, LinkedIn, Twitter daily. Schedule content, generate captions with AI, track engagement.",
            "column": "todo",
            "priority": "high",
            "tags": ["tool", "social", "automation"]
        },
        {
            "title": "🎁 Lead Magnet Generator",
            "description": "Create system to generate free template packs as lead magnets. Auto-create landing pages, email capture forms, and deliver free templates via email.",
            "column": "todo",
            "priority": "high",
            "tags": ["tool", "leads", "marketing"]
        },
        {
            "title": "📊 Analytics Dashboard",
            "description": "Build dashboard to track member growth, conversion rates, template usage, affiliate performance, and revenue metrics in real-time.",
            "column": "todo",
            "priority": "high",
            "tags": ["tool", "analytics", "dashboard"]
        },
        {
            "title": "✍️ Content Generator",
            "description": "Create batch content generation tool for TikTok scripts, Instagram captions, YouTube video ideas, and blog posts using Gemini CLI.",
            "column": "todo",
            "priority": "medium",
            "tags": ["tool", "content", "ai"]
        },
        # Marketing Execution Tasks
        {
            "title": "📹 Record First TikTok Video",
            "description": "Create 'Before vs After' template transformation video. Show how small business can create professional marketing in 5 minutes.",
            "column": "todo",
            "priority": "high",
            "tags": ["content", "tiktok", "video"]
        },
        {
            "title": "📧 Setup Email Sequences in Go High Level",
            "description": "Create 5-day email welcome sequence. Day 1: Free templates, Day 2: How-to, Day 3: Success story, Day 4: Pro benefits, Day 5: Special offer.",
            "column": "todo",
            "priority": "high",
            "tags": ["email", "gohighlevel", "funnel"]
        },
        {
            "title": "🎨 Create 3 Lead Magnet Template Packs",
            "description": "Generate 3 free template packs: 'Small Business Starter Kit', 'Social Media Basics', 'Grand Opening Templates'. Use as lead magnets.",
            "column": "todo",
            "priority": "high",
            "tags": ["templates", "lead-magnet", "design"]
        },
        {
            "title": "🤝 Reach Out to 10 Affiliates",
            "description": "Find and contact 10 potential affiliates (AI YouTubers, marketing influencers, business coaches). Offer 30% commission + free Pro access.",
            "column": "todo",
            "priority": "high",
            "tags": ["affiliate", "outreach", "partners"]
        },
        {
            "title": "💰 Launch Facebook/Instagram Ads",
            "description": "Create ad campaigns targeting small business owners. Test 3 ad sets with $500 budget. Target: 25-55, entrepreneurs, interest in Canva/marketing.",
            "column": "todo",
            "priority": "medium",
            "tags": ["ads", "facebook", "paid"]
        },
        {
            "title": "📺 Create YouTube Tutorial Series",
            "description": "Record 4 videos: '5-Min Marketing Graphics with AI', 'How I Made $5K with Templates', 'Small Business Branding Guide', 'AI Tools Comparison'.",
            "column": "todo",
            "priority": "medium",
            "tags": ["youtube", "content", "tutorial"]
        },
        {
            "title": "💬 Launch Discord Community",
            "description": "Create Discord server for AI Skills Bootcamp community. Set up channels: #showcase, #help, #weekly-drops, #general. Invite first 50 members free.",
            "column": "todo",
            "priority": "medium",
            "tags": ["community", "discord", "engagement"]
        },
        {
            "title": "📝 Write Guest Blog Posts",
            "description": "Write 3 guest posts for marketing blogs: 'AI Marketing for Small Business', 'Template Marketing Strategy', 'Building Brand with AI'.",
            "column": "todo",
            "priority": "low",
            "tags": ["content", "seo", "guest-post"]
        },
        {
            "title": "🎉 Launch Referral Program",
            "description": "Create member referral program: Give 1 month free for every 3 referrals. Add referral tracking to member dashboard.",
            "column": "todo",
            "priority": "medium",
            "tags": ["referral", "growth", "viral"]
        },
        {
            "title": "📈 Optimize Conversion Funnel",
            "description": "A/B test landing pages, email subject lines, and pricing. Track conversion at each step and optimize for maximum revenue.",
            "column": "todo",
            "priority": "medium",
            "tags": ["cro", "analytics", "optimization"]
        },
    ]
    
    print("🚀 Adding Marketing Tool Tasks to Command Board...")
    print("=" * 60)
    
    for task in tasks:
        add_task(
            task["title"],
            task["description"],
            task["column"],
            task["priority"],
            task["tags"]
        )
    
    print("=" * 60)
    print(f"✅ Added {len(tasks)} tasks to Command Board!")

if __name__ == "__main__":
    setup_marketing_tasks()
