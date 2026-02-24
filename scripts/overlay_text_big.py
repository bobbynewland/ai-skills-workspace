import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont

def create_preview():
    # 1. Download the background image again (since we deleted the local copy)
    url = "https://drive.google.com/uc?export=view&id=12AS0tt_04Ff0eOx3fXrhKduNs0qakPuU"
    bg_path = "/root/.openclaw/workspace/memory/fitness_bg.jpg"
    urllib.request.urlretrieve(url, bg_path)
    
    img = Image.open(bg_path).convert("RGBA")
    
    # 2. Setup much larger fonts
    try:
        # Use a very bold font
        headline_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 160)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 45)
        cta_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 55)
    except:
        headline_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
        cta_font = ImageFont.load_default()

    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Text content - simplified and punchy for mobile
    headline_1 = "ELEVATE"
    headline_2 = "YOUR GRIND"
    subtitle = "PREMIUM 1-ON-1 TRAINING"
    details = "NOW ACCEPTING Q1 CLIENTS"
    cta_text = "BOOK SESSION"
    
    # Helpers for centered text
    def draw_centered_text(text, font, y_pos, color):
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        x = (width - w) / 2
        
        # Heavy drop shadow for readability against dark/moody backgrounds
        draw.text((x+5, y_pos+5), text, font=font, fill=(0,0,0,255))
        draw.text((x+2, y_pos+2), text, font=font, fill=(0,0,0,200))
        draw.text((x, y_pos), text, font=font, fill=color)

    # Top Section - Massive Stacked Headline
    draw_centered_text(headline_1, headline_font, 120, (255, 255, 255, 255))
    draw_centered_text(headline_2, headline_font, 300, (255, 51, 102, 255)) # Neon Red
    
    draw_centered_text(subtitle, subtitle_font, 500, (255, 255, 255, 255))
    
    # Bottom Section - Large CTA area
    draw_centered_text(details, body_font, 1550, (224, 224, 224, 255))
    
    # Draw huge button background
    bbox = draw.textbbox((0, 0), cta_text, font=cta_font)
    btn_w = (bbox[2] - bbox[0]) + 160
    btn_h = (bbox[3] - bbox[1]) + 60
    btn_x = (width - btn_w) / 2
    btn_y = 1650
    
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=15, fill=(255, 51, 102, 255))
    draw_centered_text(cta_text, cta_font, btn_y + 25, (255, 255, 255, 255))
    
    # Save the composite
    out_path = "/root/.openclaw/workspace/memory/fitness_flyer_preview_mobile.jpg"
    img.convert("RGB").save(out_path, quality=95)
    print(f"✅ Preview saved to {out_path}")
    
if __name__ == "__main__":
    create_preview()
