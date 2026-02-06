#!/usr/bin/env python3
"""
Content Generator for AI Skills Bootcamp
Generates TikTok scripts, Instagram captions, YouTube ideas using Gemini
"""
import json
import os
from datetime import datetime

class ContentGenerator:
    def __init__(self):
        self.templates = {
            'tiktok': {
                'hook_templates': [
                    "I transformed this {niche} business marketing in 5 minutes using AI",
                    "POV: You're a {niche} owner who discovered AI templates",
                    "Stop doing this if you're a {niche} business 👇",
                    "This {niche} went from struggling to thriving in 30 days",
                    "The secret {niche} businesses don't want you to know"
                ],
                'script_templates': [
                    {
                        'type': 'before_after',
                        'structure': [
                            "Hook: Show the 'before' state",
                            "Problem: Describe the struggle",
                            "Solution: Introduce AI templates",
                            "Result: Show the transformation",
                            "CTA: Link in bio for templates"
                        ]
                    },
                    {
                        'type': 'tutorial',
                        'structure': [
                            "Hook: 'Here's how I create graphics in 5 min'",
                            "Step 1: Choose template",
                            "Step 2: Customize with brand",
                            "Step 3: Export and post",
                            "CTA: Try it yourself - link in bio"
                        ]
                    },
                    {
                        'type': 'story',
                        'structure': [
                            "Hook: Meet [Name], {niche} owner",
                            "The struggle: No time for marketing",
                            "The discovery: AI templates",
                            "The results: 10x growth in 30 days",
                            "CTA: You can do this too!"
                        ]
                    }
                ]
            },
            'instagram': {
                'caption_templates': [
                    "✨ {niche} owners, this one's for you!\n\nCreating professional marketing doesn't have to take hours.\n\nWith AI-powered templates, you can:\n✅ Design in minutes\n✅ Stay consistent\n✅ Attract more customers\n\nDrop a 💙 if you want the link!\n\n#{niche} #SmallBusiness #Marketing #AITools",
                    
                    "Before vs After: {niche} Marketing Edition 🎨\n\nBefore: 2 hours creating one graphic\nAfter: 5 minutes with AI templates\n\nThe difference? Consistency = Growth 📈\n\nSwipe to see the transformation 👉\n\nLink in bio for templates 💫\n\n#{niche} #MarketingTips #SmallBusiness #Templates",
                    
                    "Monday motivation for {niche} owners! 💪\n\n\"Marketing is too expensive\"\n\"I don't have time\"\n\"I'm not creative\"\n\nAI templates solve ALL of these.\n\n✨ Professional designs\n⏰ Done in 5 minutes\n💰 Costs less than a coffee\n\nYour competitors are already using AI. Don't get left behind.\n\n👆 Link in bio\n\n#{niche} #Entrepreneur #GrowthMindset"
                ],
                'hashtag_sets': [
                    '#{niche} #SmallBusiness #Marketing #AITools #Templates',
                    '#{niche} #MarketingTips #Entrepreneur #BusinessGrowth #AI',
                    '#{niche} #DigitalMarketing #ContentCreation #SmallBiz #Branding'
                ]
            },
            'youtube': {
                'title_templates': [
                    "How I Created 30 Days of {niche} Content in 1 Hour (AI Tutorial)",
                    "{niche} Marketing: Before vs After AI (Real Results)",
                    "5 AI Tools Every {niche} Owner Needs in 2025",
                    "I Made $5K/Month Using These {niche} Templates",
                    "Complete {niche} Marketing Guide (Step-by-Step)"
                ],
                'description_templates': [
                    """🚀 In this video, I show you how {niche} businesses can use AI to create professional marketing in minutes.

TIMESTAMPS:
00:00 - Introduction
01:30 - The Problem with Traditional Marketing
03:00 - AI Template Demo
08:00 - Real Results & Case Studies
12:00 - How to Get Started
15:00 - Final Tips

🎁 FREE TEMPLATES: Get started with AI-powered templates
👉 https://ai-skills-bootcamp-portal.vercel.app/

⏱️ Time-stamped chapters above!

📌 RESOURCES MENTIONED:
• AI Skills Bootcamp Portal
• Template Packs
• Marketing Guide

LIKE & SUBSCRIBE for more AI marketing tips!

#AI #Marketing #SmallBusiness""",
                ]
            },
            'linkedin': {
                'post_templates': [
                    """🎯 The biggest mistake I see {niche} businesses make?

Inconsistent marketing.

They post for a week, get busy, then... silence.

Meanwhile, their competitors who post daily are capturing all the attention (and customers).

Here's the truth: Marketing isn't a one-time thing. It's a daily habit.

But I get it. You're busy running your business.

That's why AI templates are game-changers:

✅ Professional designs in 5 minutes
✅ Consistent brand presence
✅ More time for what matters

The businesses that embrace AI marketing now will dominate in 2025.

The question is: Will you be one of them?

👇 What's your biggest marketing challenge? Let's discuss.

#{niche} #Marketing #SmallBusiness #AI #Entrepreneurship""",
                    
                    """📊 CASE STUDY: How a {niche} increased revenue by 180% in 30 days

THE SITUATION:
• Struggling to attract customers
• No marketing budget
• Owner spending 10+ hours/week on social media

THE SOLUTION:
• AI-powered templates
• Consistent daily posting
• 5-minute content creation

THE RESULTS:
✅ 180% revenue increase
✅ 10x social media following
✅ 15+ hours saved per week

The owner told me: "I went from dreading marketing to actually enjoying it."

Sometimes the right tools make all the difference.

What's holding you back from growing your business?

#{niche} #Growth #SmallBusiness #AITools"""
                ]
            },
            'twitter': {
                'thread_templates': [
                    {
                        'hook': "I helped a {niche} go from $2K to $10K/month in 60 days.\n\nHere's the exact strategy (thread): 🧵",
                        'tweets': [
                            "1/ The Problem:\n\nThey were posting randomly, inconsistent branding, and spending 10+ hours on content.\n\nSound familiar?",
                            "2/ The Strategy:\n\n✅ AI templates for consistency\n✅ Scheduled posting\n✅ Professional branding\n✅ 5-min content creation",
                            "3/ The Results:\n\n📈 400% revenue growth\n⏰ 15 hours saved weekly\n👥 10x audience growth\n💰 $8K additional monthly profit",
                            "4/ The Secret:\n\nIt's not about being perfect.\n\nIt's about being CONSISTENT.\n\nAI makes consistency possible.\n\nThe end.",
                            "5/ Want the same results?\n\nI created a free template pack for {niche} businesses.\n\nLink in bio 👆\n\nRT if you found this helpful!"
                        ]
                    },
                    {
                        'hook': "Stop spending 2 hours on one Instagram post.\n\nHere's how to create 30 posts in 30 minutes using AI: 👇",
                        'tweets': [
                            "1/ Use AI templates\n\nStart with proven designs. Customize in minutes. No design skills needed.",
                            "2/ Batch create\n\nSet aside 30 minutes. Create a week's worth of content. Schedule and done.",
                            "3/ Stay consistent\n\nThe algorithm rewards consistency. Post daily. Even if it's not perfect.",
                            "4/ Track results\n\nMonitor what works. Double down. Ignore what doesn't.",
                            "5/ Scale up\n\nMore content = More visibility = More customers\n\nSimple math.",
                            "Want the templates I use?\n\nLink in bio (free starter pack) 🎁"
                        ]
                    }
                ]
            }
        }
    
    def generate_tiktok_script(self, niche, script_type='before_after'):
        """Generate TikTok video script"""
        hook = self.templates['tiktok']['hook_templates'][hash(niche) % len(self.templates['tiktok']['hook_templates'])].format(niche=niche)
        
        script_template = next((s for s in self.templates['tiktok']['script_templates'] if s['type'] == script_type), self.templates['tiktok']['script_templates'][0])
        
        return {
            'platform': 'TikTok',
            'niche': niche,
            'type': script_type,
            'hook': hook,
            'duration': '30-60 seconds',
            'script': script_template['structure'],
            'hashtags': f'#{niche.replace(" ", "")} #SmallBusiness #AITools #Marketing',
            'cta': 'Link in bio for templates!'
        }
    
    def generate_instagram_caption(self, niche, caption_type='value'):
        """Generate Instagram caption"""
        template = self.templates['instagram']['caption_templates'][hash(niche) % len(self.templates['instagram']['caption_templates'])]
        caption = template.format(niche=niche)
        
        return {
            'platform': 'Instagram',
            'niche': niche,
            'type': caption_type,
            'caption': caption,
            'character_count': len(caption),
            'hashtag_count': caption.count('#'),
            'engagement_tip': 'Post at 10 AM or 6 PM for best engagement'
        }
    
    def generate_youtube_video(self, niche):
        """Generate YouTube video concept"""
        title = self.templates['youtube']['title_templates'][hash(niche) % len(self.templates['youtube']['title_templates'])].format(niche=niche)
        description = self.templates['youtube']['description_templates'][0].format(niche=niche)
        
        return {
            'platform': 'YouTube',
            'niche': niche,
            'title': title,
            'description': description,
            'tags': [niche, 'AI', 'Marketing', 'Small Business', 'Tutorial'],
            'optimal_length': '10-15 minutes',
            'thumbnail_text': f'AI Marketing for {niche}',
            'hook': f'Struggling with {niche} marketing? This changes everything...'
        }
    
    def generate_linkedin_post(self, niche):
        """Generate LinkedIn post"""
        template = self.templates['linkedin']['post_templates'][hash(niche) % len(self.templates['linkedin']['post_templates'])]
        post = template.format(niche=niche)
        
        return {
            'platform': 'LinkedIn',
            'niche': niche,
            'post': post,
            'character_count': len(post),
            'optimal_time': 'Tuesday-Thursday, 8-10 AM',
            'engagement_prediction': 'High' if len(post) > 500 else 'Medium'
        }
    
    def generate_twitter_thread(self, niche):
        """Generate Twitter/X thread"""
        template = self.templates['twitter']['thread_templates'][hash(niche) % len(self.templates['twitter']['thread_templates'])]
        
        hook = template['hook'].format(niche=niche)
        tweets = [tweet.format(niche=niche) for tweet in template['tweets']]
        
        return {
            'platform': 'Twitter/X',
            'niche': niche,
            'hook_tweet': hook,
            'thread': tweets,
            'total_tweets': len(tweets) + 1,
            'estimated_engagement': '5-10% engagement rate',
            'best_time': '8 AM, 12 PM, or 5 PM EST'
        }
    
    def generate_content_calendar(self, niche, days=7):
        """Generate full week of content"""
        content = []
        
        for day in range(days):
            day_content = {
                'day': day + 1,
                'date': (datetime.now() + __import__('datetime').timedelta(days=day)).strftime('%Y-%m-%d'),
                'platforms': {
                    'tiktok': self.generate_tiktok_script(niche, ['before_after', 'tutorial', 'story'][day % 3]),
                    'instagram': self.generate_instagram_caption(niche),
                    'linkedin': self.generate_linkedin_post(niche),
                    'twitter': self.generate_twitter_thread(niche)
                }
            }
            content.append(day_content)
        
        return content
    
    def save_content(self, content, filename='generated_content.json'):
        """Save generated content to file"""
        with open(filename, 'w') as f:
            json.dump(content, f, indent=2)
        print(f"✅ Content saved to: {filename}")
    
    def batch_generate(self, niches, days=7):
        """Generate content for multiple niches"""
        all_content = {}
        
        for niche in niches:
            print(f"\n📝 Generating content for: {niche}")
            all_content[niche] = self.generate_content_calendar(niche, days)
        
        return all_content

# CLI Interface
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='AI Content Generator')
    parser.add_argument('niche', help='Business niche (e.g., Restaurant, Beauty Salon)')
    parser.add_argument('--platform', '-p', choices=['tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'all'], 
                       default='all', help='Platform to generate for')
    parser.add_argument('--days', '-d', type=int, default=7, help='Number of days to generate')
    parser.add_argument('--output', '-o', default='content_calendar.json', help='Output file')
    
    args = parser.parse_args()
    
    generator = ContentGenerator()
    
    print(f"\n🎨 Generating content for: {args.niche}")
    print("=" * 60)
    
    if args.platform == 'all':
        content = generator.generate_content_calendar(args.niche, args.days)
        print(f"\n✅ Generated {len(content)} days of content")
        
        # Print sample
        day = content[0]
        print(f"\n📅 Day 1 Sample:")
        print(f"  TikTok Hook: {day['platforms']['tiktok']['hook'][:60]}...")
        print(f"  IG Caption: {day['platforms']['instagram']['caption'][:60]}...")
        print(f"  YouTube Title: {day['platforms']['youtube']['title'][:60]}...")
    
    elif args.platform == 'tiktok':
        script = generator.generate_tiktok_script(args.niche)
        print(f"\n📱 TikTok Script:")
        print(f"Hook: {script['hook']}")
        print(f"\nScript Structure:")
        for step in script['script']:
            print(f"  • {step}")
        print(f"\nHashtags: {script['hashtags']}")
    
    elif args.platform == 'instagram':
        caption = generator.generate_instagram_caption(args.niche)
        print(f"\n📸 Instagram Caption:")
        print(caption['caption'])
        print(f"\nCharacters: {caption['character_count']}")
        print(f"Tip: {caption['engagement_tip']}")
    
    elif args.platform == 'youtube':
        video = generator.generate_youtube_video(args.niche)
        print(f"\n🎥 YouTube Video:")
        print(f"Title: {video['title']}")
        print(f"\nDescription Preview:")
        print(video['description'][:300] + "...")
    
    elif args.platform == 'linkedin':
        post = generator.generate_linkedin_post(args.niche)
        print(f"\n💼 LinkedIn Post:")
        print(post['post'])
    
    elif args.platform == 'twitter':
        thread = generator.generate_twitter_thread(args.niche)
        print(f"\n🐦 Twitter Thread:")
        print(f"Hook: {thread['hook_tweet']}")
        print(f"\nThread ({thread['total_tweets']} tweets):")
        for i, tweet in enumerate(thread['thread'], 1):
            print(f"\n{i}. {tweet}")
    
    # Save content
    if args.platform == 'all':
        generator.save_content(content, args.output)

if __name__ == '__main__':
    main()
