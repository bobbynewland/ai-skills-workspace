import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont

def create_preview():
    # 1. Download the background image
    url = "https://drive.google.com/uc?export=view&id=12AS0tt_04Ff0eOx3fXrhKduNs0qakPuU"
    bg_path = "/root/.openclaw/workspace/memory/fitness_bg.jpg"
    urllib.request.urlretrieve(url, bg_path)
    
    img = Image.open(bg_path).convert("RGBA")
    
    # 2. Setup fonts (using standard available fonts if custom aren't there)
    try:
        # Try to use a bold font if available
        headline_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 35)
        body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except:
        # Fallback
        headline_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        body_font = ImageFont.load_default()

    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Text content
    headline = "ELEVATE YOUR GRIND"
    subtitle = "1-ON-1 PREMIUM PERSONAL TRAINING"
    details1 = "NOW ACCEPTING CLIENTS FOR Q1"
    details2 = "LIMITED SPOTS AVAILABLE"
    cta_text = "BOOK YOUR SESSION"
    
    # Helpers for centered text
    def draw_centered_text(text, font, y_pos, color):
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        x = (width - w) / 2
        
        # Add drop shadow for readability
        draw.text((x+3, y_pos+3), text, font=font, fill=(0,0,0,180))
        draw.text((x, y_pos), text, font=font, fill=color)

    # Top Section
    draw_centered_text(headline, headline_font, 120, (255, 255, 255, 255))
    draw_centered_text(subtitle, subtitle_font, 220, (255, 51, 102, 255)) # Neon Red
    
    # Bottom Section
    # Draw button background
    bbox = draw.textbbox((0, 0), cta_text, font=subtitle_font)
    btn_w = (bbox[2] - bbox[0]) + 120
    btn_h = (bbox[3] - bbox[1]) + 40
    btn_x = (width - btn_w) / 2
    btn_y = 1580 # adjusted for 1920 height
    
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=10, fill=(255, 51, 102, 255))
    draw_centered_text(cta_text, subtitle_font, btn_y + 15, (255, 255, 255, 255))
    
    draw_centered_text(details1, body_font, 1450, (224, 224, 224, 255))
    draw_centered_text(details2, body_font, 1500, (224, 224, 224, 255))
    
    # Save the composite
    out_path = "/root/.openclaw/workspace/memory/fitness_flyer_preview.jpg"
    img.convert("RGB").save(out_path, quality=95)
    print(f"✅ Preview saved to {out_path}")
    
    # Upload to Google Drive using rclone
    os.system(f"rclone copy {out_path} gdrive:Template\\ Packs/ -v")
    link_output = os.popen(f"rclone link gdrive:Template\\ Packs/fitness_flyer_preview.jpg").read().strip()
    
    if link_output and "id=" in link_output:
        file_id = link_output.split("id=")[1]
        print(f"Direct Link: https://drive.google.com/uc?export=view&id={file_id}")

if __name__ == "__main__":
    create_preview()
