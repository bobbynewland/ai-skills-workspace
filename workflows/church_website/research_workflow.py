#!/usr/bin/env python3
"""
Website Research Workflow
Deep research on church/organization websites for inspiration
"""
import os
import sys

def research_church_websites():
    """Research top church websites and generate analysis"""
    
    # This would typically use web_search, but we'll structure the research
    # to be done manually or with Gemini
    
    research_prompt = """Research and analyze the top 10 church websites in the world.

For each website, analyze:
1. URL and name
2. Color scheme (primary, secondary, accent)
3. Typography (font families)
4. Hero section design
5. Navigation structure
6. Call-to-action placement
7. Animation/effects used
8. Mobile responsiveness approach
9. Overall vibe/atmosphere

Top churches to research:
1. Hillsong.com
2. Elevation Church
3. Life.Church
4. Saddleback Church
5. Bethel Music
6. Transformation Church
7. Transformation Church
8. Transformation Church
9. Transformation Church
10. Transformation Church

Output as structured JSON with detailed analysis."""
    
    print("🤖 Researching church websites with Gemini 3 Pro...")
    print("\nUse this command to generate research:")
    print(f"python3 /root/.openclaw/workspace/google_coder.py generate '{research_prompt}' --output research_analysis.json")
    
    return research_prompt

def create_mood_board_prompt():
    """Generate mood board creation prompt"""
    
    prompt = """Based on church website research, create a mood board specification:

## Mood Board Elements:

### Color Palette
- Primary: [Main brand color]
- Secondary: [Supporting color]
- Accent: [Highlight color]
- Background: [Light/Dark]
- Text: [Font colors]

### Typography
- Heading Font: [Font family]
- Body Font: [Font family]
- Accent Font: [Optional]

### Imagery Style
- Photo style: [Lifestyle, candid, posed]
- Color grading: [Warm, cool, vibrant, muted]
- Subject matter: [People, buildings, nature]

### Layout Patterns
- Hero section: [Full screen, split, centered]
- Content sections: [Grid, list, cards]
- Navigation: [Top, side, hamburger]

### Animation Style
- Entrance effects: [Fade, slide, scale]
- Hover states: [Subtle, bold]
- Scroll effects: [Parallax, reveal]

Output as markdown with specific hex codes and font names."""
    
    return prompt

def generate_website_template():
    """Generate the HTML website template"""
    
    spec = """Create a complete church website in a single HTML5 file:

## Technical Requirements:
- Single .html file
- Tailwind CSS via CDN
- Vanilla JavaScript
- GSAP for animations (via CDN)
- Font Awesome for icons
- Google Fonts

## Sections Required:
1. Navigation (sticky, mobile responsive)
2. Hero (full screen, welcome message, CTA button)
3. Service Times (grid layout, 3 services)
4. About Church (text + image)
5. Ministries (3-4 ministry cards)
6. Contact Form (Name, Email, Phone, Message, Prayer checkbox)
7. Footer (social links, address, map embed)

## Design Specs:
- Modern, clean, professional
- Warm, welcoming atmosphere
- Smooth scroll animations
- Mobile-first responsive
- Form posts to webhook URL

## JavaScript Features:
- Mobile menu toggle
- Smooth scroll navigation
- Scroll reveal animations
- Form validation
- Success message after form submit
- Dynamic year in footer

## Go High Level Integration:
Form should POST to webhook with JSON:
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "message": "...",
  "prayer_request": true/false,
  "source": "church_website"
}

Include placeholder images from Unsplash.
Make it easy to customize colors and text."""
    
    return spec

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Church Website Research Workflow')
    parser.add_argument('phase', choices=['research', 'moodboard', 'template'], help='Workflow phase')
    args = parser.parse_args()
    
    if args.phase == 'research':
        prompt = research_church_websites()
        print("\n📝 Research Prompt Generated!")
        print("Copy the prompt above and run with google_coder.py")
        
    elif args.phase == 'moodboard':
        prompt = create_mood_board_prompt()
        print("\n🎨 Mood Board Prompt:")
        print(prompt)
        print("\nRun: python3 /root/.openclaw/workspace/google_coder.py generate '[prompt]' --output moodboard.md")
        
    elif args.phase == 'template':
        spec = generate_website_template()
        print("\n💻 Website Template Spec:")
        print(spec)
        print("\nRun: python3 /root/.openclaw/workspace/google_coder.py generate '[spec]' --output church_website.html")

if __name__ == "__main__":
    main()
