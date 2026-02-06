#!/usr/bin/env python3
"""
Social Media Auto-Poster for AI Skills Bootcamp
Posts template previews to TikTok, Instagram, LinkedIn, Twitter
"""
import json
import os
from datetime import datetime, timedelta
import schedule
import time
from pathlib import Path

class SocialMediaPoster:
    def __init__(self, config_file='social_config.json'):
        self.config_file = config_file
        self.platforms = {
            'tiktok': TikTokPoster(),
            'instagram': InstagramPoster(),
            'linkedin': LinkedInPoster(),
            'twitter': TwitterPoster()
        }
        self.content_calendar = []
        
    def load_config(self):
        """Load social media config"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return {
            'tiktok': {'enabled': True, 'post_times': ['09:00', '15:00', '20:00']},
            'instagram': {'enabled': True, 'post_times': ['10:00', '18:00']},
            'linkedin': {'enabled': True, 'post_times': ['08:00', '17:00']},
            'twitter': {'enabled': True, 'post_times': ['08:00', '12:00', '16:00', '20:00']}
        }
    
    def generate_content_ideas(self, template_pack_name, niche):
        """Generate content ideas using Gemini"""
        ideas = [
            {
                'type': 'before_after',
                'title': f'Before vs After: {niche} Marketing',
                'hook': f'I transformed this {niche.lower()} business marketing in 5 minutes using AI',
                'hashtags': f'#AI #Marketing #{niche.replace(" ", "")} #SmallBusiness #AITools'
            },
            {
                'type': 'tutorial',
                'title': f'How to Create {niche} Graphics',
                'hook': f'Step-by-step: Creating professional {niche.lower()} marketing graphics with AI',
                'hashtags': f'#Tutorial #{niche.replace(" ", "")} #MarketingTips #AI #SmallBusiness'
            },
            {
                'type': 'transformation',
                'title': f'{niche} Brand Glow-Up',
                'hook': f'Watch this {niche.lower()} get a complete brand makeover in 60 seconds',
                'hashtags': f'#BrandGlowUp #{niche.replace(" ", "")} #AITransformation #Marketing'
            },
            {
                'type': 'tips',
                'title': f'3 Marketing Tips for {niche}',
                'hook': f'3 things every {niche.lower()} needs to know about marketing in 2025',
                'hashtags': f'#MarketingTips #{niche.replace(" ", "")} #SmallBusiness #AI #Growth'
            },
            {
                'type': 'story',
                'title': f'I Helped a {niche} 10x Their Sales',
                'hook': f'True story: How AI templates helped a {niche.lower()} go from struggling to thriving',
                'hashtags': f'#SuccessStory #{niche.replace(" ", "")} #SmallBusiness #AITools #Marketing'
            }
        ]
        return ideas
    
    def create_content_calendar(self, days=30):
        """Create 30-day content calendar"""
        niches = ['Restaurant', 'Beauty Salon', 'Auto Shop', 'Real Estate', 'Church', 'Coffee Shop', 'Gym', 'Boutique']
        content_types = ['before_after', 'tutorial', 'transformation', 'tips', 'story']
        
        calendar = []
        start_date = datetime.now()
        
        for day in range(days):
            date = start_date + timedelta(days=day)
            niche = niches[day % len(niches)]
            
            # TikTok posts (3x daily)
            for i, hour in enumerate(['09:00', '15:00', '20:00']):
                content_type = content_types[(day + i) % len(content_types)]
                ideas = self.generate_content_ideas(f'{niche} Templates', niche)
                idea = next((i for i in ideas if i['type'] == content_type), ideas[0])
                
                calendar.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'time': hour,
                    'platform': 'tiktok',
                    'content': idea,
                    'status': 'scheduled'
                })
            
            # Instagram (2x daily)
            for i, hour in enumerate(['10:00', '18:00']):
                calendar.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'time': hour,
                    'platform': 'instagram',
                    'content': {
                        'type': 'carousel',
                        'title': f'{niche} Template Pack',
                        'caption': f'✨ New {niche} templates just dropped! Swipe to see the collection 👉',
                        'hashtags': f'#{niche.replace(" ", "")} #Marketing #SmallBusiness #Templates #AI'
                    },
                    'status': 'scheduled'
                })
            
            # LinkedIn (1x daily)
            calendar.append({
                'date': date.strftime('%Y-%m-%d'),
                'time': '08:00',
                'platform': 'linkedin',
                'content': {
                    'type': 'article',
                    'title': f'How {niche} Businesses Can Leverage AI for Marketing',
                    'excerpt': f'AI is transforming how {niche.lower()} businesses approach marketing. Here are 5 strategies...',
                    'hashtags': '#AI #Marketing #SmallBusiness #Entrepreneurship'
                },
                'status': 'scheduled'
            })
            
            # Twitter/X (4x daily)
            for hour in ['08:00', '12:00', '16:00', '20:00']:
                calendar.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'time': hour,
                    'platform': 'twitter',
                    'content': {
                        'type': 'thread' if hour == '08:00' else 'single',
                        'text': f'🚀 {niche} owners: Stop spending hours on marketing graphics. AI does it in 5 min. Here\'s how 👇' if hour == '08:00' else f'💡 Marketing tip for {niche.lower()} businesses: Consistency beats perfection. Post daily, even if it\'s not perfect.',
                        'hashtags': f'#{niche.replace(" ", "")} #Marketing #AI'
                    },
                    'status': 'scheduled'
                })
        
        self.content_calendar = calendar
        
        # Save calendar
        with open('content_calendar.json', 'w') as f:
            json.dump(calendar, f, indent=2)
        
        print(f"✅ Created {len(calendar)} posts for 30 days")
        return calendar
    
    def get_today_posts(self):
        """Get all posts scheduled for today"""
        today = datetime.now().strftime('%Y-%m-%d')
        return [p for p in self.content_calendar if p['date'] == today]
    
    def post_to_platform(self, platform, content):
        """Post to specific platform"""
        poster = self.platforms.get(platform)
        if poster:
            return poster.post(content)
        return False

# Platform-specific poster classes (stubs for now)
class TikTokPoster:
    def post(self, content):
        print(f"📱 TikTok: {content['title']}")
        # TODO: Implement TikTok API integration
        return True

class InstagramPoster:
    def post(self, content):
        print(f"📸 Instagram: {content['title']}")
        # TODO: Implement Instagram Graph API
        return True

class LinkedInPoster:
    def post(self, content):
        print(f"💼 LinkedIn: {content['title']}")
        # TODO: Implement LinkedIn API
        return True

class TwitterPoster:
    def post(self, content):
        print(f"🐦 Twitter: {content['text'][:50]}...")
        # TODO: Implement Twitter/X API
        return True

# CLI Interface
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Social Media Auto-Poster')
    parser.add_argument('action', choices=['calendar', 'today', 'post', 'schedule'], help='Action to perform')
    parser.add_argument('--platform', '-p', choices=['tiktok', 'instagram', 'linkedin', 'twitter'], help='Platform')
    
    args = parser.parse_args()
    
    poster = SocialMediaPoster()
    
    if args.action == 'calendar':
        print("📅 Creating 30-day content calendar...")
        calendar = poster.create_content_calendar()
        print(f"\n📝 Sample posts:")
        for post in calendar[:5]:
            print(f"  {post['date']} {post['time']} - {post['platform']}: {post['content'].get('title', post['content'].get('text', ''))[:50]}...")
    
    elif args.action == 'today':
        calendar = poster.create_content_calendar()
        today_posts = poster.get_today_posts()
        print(f"📅 Today's posts ({len(today_posts)} total):")
        for post in today_posts[:10]:
            print(f"  {post['time']} - {post['platform']}: {post['content'].get('title', post['content'].get('text', ''))[:40]}...")
    
    elif args.action == 'post':
        if not args.platform:
            print("❌ Please specify --platform")
            return
        content = {'title': 'Test post', 'text': 'This is a test post'}
        poster.post_to_platform(args.platform, content)
    
    elif args.action == 'schedule':
        print("⏰ Setting up scheduled posts...")
        # TODO: Implement actual scheduling with cron or background task
        print("Use: python3 social_poster.py today")
        print("And set up cron job to run hourly")

if __name__ == '__main__':
    main()
