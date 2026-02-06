#!/usr/bin/env python3
"""
Lead Magnet Generator for AI Skills Bootcamp
Creates free template packs, landing pages, and email capture forms
"""
import json
import os
from datetime import datetime
from pathlib import Path

class LeadMagnetGenerator:
    def __init__(self, output_dir='lead_magnets'):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        self.magnet_types = {
            'starter_kit': {
                'name': 'Small Business Starter Kit',
                'templates': ['business_card', 'flyer', 'social_media_bundle'],
                'value_prop': 'Everything you need to launch your business',
                'email_subject': 'Your FREE Small Business Starter Kit is here!'
            },
            'social_basics': {
                'name': 'Social Media Basics Pack',
                'templates': ['instagram_post', 'facebook_cover', 'story_template'],
                'value_prop': '30 days of social media content done for you',
                'email_subject': '30 Days of Social Content - FREE Download'
            },
            'grand_opening': {
                'name': 'Grand Opening Templates',
                'templates': ['grand_opening_flyer', 'ribbon_cutting', 'announcement_post'],
                'value_prop': 'Make your launch unforgettable',
                'email_subject': 'Your Grand Opening Templates Inside!'
            },
            'holiday_special': {
                'name': 'Holiday Marketing Bundle',
                'templates': ['holiday_sale', 'seasonal_greeting', 'gift_certificate'],
                'value_prop': 'Boost holiday sales with these proven templates',
                'email_subject': 'Get Holiday-Ready with FREE Templates'
            }
        }
    
    def create_landing_page(self, magnet_type, niche='small business'):
        """Generate landing page HTML"""
        magnet = self.magnet_types[magnet_type]
        
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Free {magnet['name']} | AI Skills Bootcamp</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); 
            color: #fff; 
            line-height: 1.6;
        }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 40px 20px; }}
        .header {{ text-align: center; margin-bottom: 40px; }}
        .badge {{ 
            display: inline-block; 
            background: linear-gradient(90deg, #00d4ff, #7b2cbf); 
            padding: 8px 20px; 
            border-radius: 20px; 
            font-size: 0.85rem; 
            font-weight: 600;
            margin-bottom: 20px;
        }}
        h1 {{ font-size: 2.5rem; margin-bottom: 20px; }}
        .subtitle {{ color: #888; font-size: 1.2rem; margin-bottom: 30px; }}
        .preview {{ 
            background: rgba(255,255,255,0.05); 
            border-radius: 20px; 
            padding: 30px; 
            margin-bottom: 40px;
            border: 1px solid rgba(255,255,255,0.1);
        }}
        .template-list {{ list-style: none; margin: 20px 0; }}
        .template-list li {{ 
            padding: 15px; 
            background: rgba(0,212,255,0.1); 
            border-radius: 10px; 
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        .template-list li::before {{ content: "✓"; color: #00d4ff; font-weight: bold; }}
        .form {{ background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; }}
        .form-group {{ margin-bottom: 20px; }}
        label {{ display: block; margin-bottom: 8px; color: #aaa; }}
        input {{ 
            width: 100%; 
            padding: 15px; 
            background: rgba(0,0,0,0.3); 
            border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 10px; 
            color: #fff;
            font-size: 1rem;
        }}
        input:focus {{ outline: none; border-color: #00d4ff; }}
        button {{ 
            width: 100%; 
            padding: 18px; 
            background: linear-gradient(90deg, #00d4ff, #7b2cbf); 
            border: none; 
            border-radius: 10px; 
            color: #fff; 
            font-size: 1.1rem; 
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
        }}
        button:hover {{ opacity: 0.9; }}
        .trust {{ text-align: center; margin-top: 30px; color: #666; font-size: 0.9rem; }}
        .urgency {{ 
            background: rgba(255,107,107,0.1); 
            border: 1px solid rgba(255,107,107,0.3); 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            text-align: center;
        }}
        .urgency span {{ color: #ff6b6b; font-weight: 600; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">🎁 FREE DOWNLOAD</div>
            <h1>{magnet['name']}</h1>
            <p class="subtitle">{magnet['value_prop']} - normally $97, yours FREE</p>
        </div>
        
        <div class="preview">
            <h3 style="margin-bottom: 20px;">What's Included:</h3>
            <ul class="template-list">
                {''.join([f'<li>{t.replace("_", " ").title()}</li>' for t in magnet['templates']])}
            </ul>
            <p style="color: #888; margin-top: 20px;">✨ AI-Powered • Instant Download • Fully Customizable</p>
        </div>
        
        <div class="urgency">
            <span>⚡ Limited Time:</span> Only 500 downloads available this month
        </div>
        
        <div class="form">
            <h3 style="margin-bottom: 25px; text-align: center;">Get Instant Access</h3>
            <form id="leadForm">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" placeholder="Your first name" required>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label>Business Type</label>
                    <input type="text" name="business" placeholder="e.g., Restaurant, Salon, Shop">
                </div>
                <button type="submit">📥 Download FREE Templates Now</button>
            </form>
        </div>
        
        <div class="trust">
            <p>🔒 Your information is secure. Unsubscribe anytime.</p>
            <p style="margin-top: 10px;">Join 2,500+ business owners using our templates</p>
        </div>
    </div>
    
    <script>
        document.getElementById('leadForm').addEventListener('submit', async (e) => {{
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {{
                firstName: formData.get('firstName'),
                email: formData.get('email'),
                business: formData.get('business'),
                magnet: '{magnet_type}',
                timestamp: new Date().toISOString()
            }};
            
            // Submit to your email service (Go High Level, etc.)
            // await fetch('/api/capture-lead', {{ method: 'POST', body: JSON.stringify(data) }});
            
            // Redirect to download
            window.location.href = '/download/{magnet_type}';
        }});
    </script>
</body>
</html>'''
        
        # Save landing page
        filename = self.output_dir / f'{magnet_type}_landing.html'
        with open(filename, 'w') as f:
            f.write(html)
        
        print(f"✅ Created landing page: {filename}")
        return str(filename)
    
    def create_email_sequence(self, magnet_type):
        """Create 5-day email sequence"""
        magnet = self.magnet_types[magnet_type]
        
        emails = [
            {
                'day': 0,
                'subject': magnet['email_subject'],
                'preview': 'Your templates are ready for download...',
                'body': f'''Hey {{first_name}}!

Your FREE {magnet['name']} is attached! 🎉

These templates normally sell for $97, but I wanted you to see the quality we create at AI Skills Bootcamp.

[DOWNLOAD LINK]

What's next?
1. Download your templates
2. Customize with your brand
3. Start attracting more customers

Questions? Just reply to this email.

To your success,
Win
AI Skills Bootcamp

P.S. Want access to ALL our templates? Check out Pro membership (30% off this week only).
'''
            },
            {
                'day': 1,
                'subject': 'Quick tip: Getting the most from your templates',
                'preview': 'Here\'s how to customize in 5 minutes...',
                'body': f'''Hey {{first_name}},

Hope you're loving the {magnet['name']}!

Quick question: Have you customized them yet?

If not, here's a 5-minute customization guide:

1. Replace placeholder text with your info
2. Add your logo (if you have one)
3. Match your brand colors
4. Save and start using!

Pro tip: These templates work best when you post consistently. Try to share 1-2 graphics per day.

[UPGRADE TO PRO - Get 100+ more templates]

Cheers,
Win
'''
            },
            {
                'day': 2,
                'subject': f'Success story: How Sarah 10x\'d her {magnet_type.replace("_", " ")}',
                'preview': 'From struggling to thriving in 30 days...',
                'body': '''Hey {first_name},

Want to see what's possible with consistent marketing?

Meet Sarah, a coffee shop owner who was struggling to get customers through the door.

She started using our templates and posting daily on Instagram.

Results after 30 days:
• Followers: 200 → 2,400
• Daily customers: 15 → 45
• Revenue: Up 180%

Her secret? She didn't try to be perfect. She just posted consistently using our templates.

"I went from spending 2 hours on one graphic to 5 minutes. Game changer!" - Sarah

You can do the same.

[SEE ALL TEMPLATES - 30% OFF THIS WEEK]

To your success,
Win
'''
            },
            {
                'day': 3,
                'subject': 'The #1 mistake small businesses make (avoid this)',
                'preview': 'It\'s costing you customers every day...',
                'body': '''Hey {first_name},

The #1 mistake I see small businesses make?

Inconsistent marketing.

They post for a week, get busy, then... crickets.

Meanwhile, their competitors who post daily are stealing their customers.

Here's the truth: Marketing isn't a one-time thing. It's a daily habit.

But I get it - you're busy running your business.

That's exactly why I created AI Skills Bootcamp.

✅ Done-for-you templates
✅ New packs every month
✅ AI does the heavy lifting
✅ 5 minutes per day

[UPGRADE TO PRO - Cancel anytime]

Stop letting customers slip away.

Win
'''
            },
            {
                'day': 4,
                'subject': 'Last chance: 30% off ends tonight ⏰',
                'preview': 'Don\'t miss out on this...',
                'body': f'''Hey {{first_name}},

This is it - your last chance to get Pro membership at 30% off.

The discount expires at midnight tonight.

Here's what you get with Pro:

✅ ALL template packs (200+ templates)
✅ New packs every month
✅ AI copywriting tools
✅ Priority support
✅ Commercial license

Regular price: $79/month
Your price: $55/month (30% off)

That's less than $2 per day for unlimited professional marketing.

[CLAIM YOUR DISCOUNT NOW]

After tonight, the price goes back to $79.

Don't let this slip away.

[UPGRADE TO PRO - 30% OFF]

Talk soon,
Win

P.S. Still have questions? Just reply to this email. I read every message personally.
'''
            }
        ]
        
        # Save email sequence
        filename = self.output_dir / f'{magnet_type}_emails.json'
        with open(filename, 'w') as f:
            json.dump(emails, f, indent=2)
        
        print(f"✅ Created email sequence: {filename}")
        return str(filename)
    
    def create_all(self):
        """Create all lead magnets"""
        print("🎁 Generating Lead Magnets...")
        print("=" * 60)
        
        for magnet_type in self.magnet_types:
            print(f"\n📦 Creating: {self.magnet_types[magnet_type]['name']}")
            self.create_landing_page(magnet_type)
            self.create_email_sequence(magnet_type)
        
        print("\n" + "=" * 60)
        print(f"✅ Created {len(self.magnet_types)} lead magnets!")
        print(f"📁 Files saved to: {self.output_dir}/")

if __name__ == '__main__':
    generator = LeadMagnetGenerator()
    generator.create_all()
