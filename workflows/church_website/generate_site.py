#!/usr/bin/env python3
"""Generate church website with Gemini 3 Pro"""
import os
import requests

api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("❌ Set GEMINI_API_KEY")
    exit(1)

url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key={api_key}'

website_prompt = """Create a complete church website in a SINGLE HTML5 file.

## Design Specifications:
- Color: Navy #1E3A5F primary, Gold #D4AF37 accent, White #FFFFFF background
- Fonts: Playfair Display (headings), Inter (body)
- Style: Modern, professional, warm, welcoming

## Technical Stack:
- Tailwind CSS via CDN
- GSAP animations via CDN
- Font Awesome via CDN
- Google Fonts
- Single HTML file only

## Sections Required:
1. Navigation (sticky, mobile responsive with hamburger menu)
2. Hero Section (full viewport, background image overlay, welcome message, gold CTA button)
3. Service Times (3 cards showing Sunday 9am/11am/6pm services)
4. About Section (split layout: image left, text right with pastor info)
5. Ministries (4 cards: Youth, Children, Worship, Community with icons)
6. Contact Form (Name, Email, Phone, Message textarea, Prayer request checkbox, Submit button)
7. Footer (social links, address, copyright)

## Features:
- Smooth scroll navigation
- Scroll reveal animations (fade up)
- Mobile responsive
- Form validation
- Success message after submit
- All buttons have hover effects
- Professional church imagery placeholders (use placeholder.com or gradients)

## Form Webhook:
Form should show alert on submit with message "Thank you! We will be in touch soon."

## Code Structure:
- Complete HTML5 document
- Tailwind classes for styling
- Internal CSS in <style> for custom animations
- JavaScript at bottom for interactions
- Semantic HTML5 tags (header, nav, main, section, footer)

Generate production-ready, beautifully designed code."""

data = {
    'contents': [{'parts': [{'text': website_prompt}]}],
    'generationConfig': {'temperature': 0.7, 'maxOutputTokens': 8192}
}

print('🤖 Generating church website with Gemini 3 Pro...')
print('This may take 30-60 seconds...')
print()

try:
    resp = requests.post(url, json=data, headers={'Content-Type': 'application/json'}, timeout=120)
    if resp.status_code == 200:
        result = resp.json()
        code = result['candidates'][0]['content']['parts'][0]['text']
        
        # Extract code from markdown
        if '```html' in code:
            code = code.split('```html')[1].split('```')[0]
        elif '```' in code:
            code = code.split('```')[1].split('```')[0]
        
        output_path = '/root/.openclaw/workspace/workflows/church_website/index.html'
        with open(output_path, 'w') as f:
            f.write(code)
        
        print(f'✅ Church website saved to: workflows/church_website/index.html')
        print(f'📄 File size: {len(code)} characters')
    else:
        print(f'❌ Error: {resp.status_code}')
        print(resp.text)
except Exception as e:
    print(f'❌ Error: {e}')
