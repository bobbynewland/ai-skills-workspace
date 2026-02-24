import os
import json
import urllib.request
from PIL import Image, ImageDraw, ImageFont

def get_api_key():
    with open('/root/.openclaw/workspace/.keys/fal.key', 'r') as f:
        return f.read().strip()

def run():
    print("Generating new background...")
    url = "https://fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image"
    headers = {
        "Authorization": f"Key {get_api_key()}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "prompt": "High-end fitness trainer promotional flyer background, vertical 9:16 orientation. A powerful, shredded athletic male fitness trainer in sleek dark gym apparel doing a dynamic kettlebell swing. The background is a moody, premium industrial gym with neon blue and stark white rim lighting. Bold composition, extremely high quality, hyper-realistic, dramatic cinematic shadows. Massive clean negative space at the very top and very bottom for large typography. No text overlays, no letters, no words, image only.",
        "image_size": "portrait_16_9"
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode('utf-8'))
    
    image_url = result['images'][0]['url']
    bg_path = "/root/.openclaw/workspace/memory/temp_bg.jpg"
    urllib.request.urlretrieve(image_url, bg_path)
    
    print("Overlaying massive mobile text...")
    img = Image.open(bg_path).convert("RGBA")
    
    try:
        headline_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 160)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 65)
        body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 50)
        cta_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
    except:
        headline_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
        cta_font = ImageFont.load_default()

    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    headline_1 = "ELEVATE"
    headline_2 = "YOUR GRIND"
    subtitle = "1-ON-1 PREMIUM TRAINING"
    details = "NOW ACCEPTING Q1 CLIENTS"
    cta_text = "BOOK SESSION"
    
    def draw_centered_text(text, font, y_pos, color):
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        x = (width - w) / 2
        draw.text((x+6, y_pos+6), text, font=font, fill=(0,0,0,255))
        draw.text((x, y_pos), text, font=font, fill=color)

    # Top Section
    draw_centered_text(headline_1, headline_font, 120, (255, 255, 255, 255))
    draw_centered_text(headline_2, headline_font, 300, (255, 51, 102, 255))
    draw_centered_text(subtitle, subtitle_font, 500, (255, 255, 255, 255))
    
    # Bottom Section
    draw_centered_text(details, body_font, 1500, (224, 224, 224, 255))
    
    bbox = draw.textbbox((0, 0), cta_text, font=cta_font)
    btn_w = (bbox[2] - bbox[0]) + 180
    btn_h = (bbox[3] - bbox[1]) + 80
    btn_x = (width - btn_w) / 2
    btn_y = 1620
    
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=20, fill=(255, 51, 102, 255))
    draw_centered_text(cta_text, cta_font, btn_y + 30, (255, 255, 255, 255))
    
    out_path = "/root/.openclaw/workspace/memory/fitness_flyer_mobile.jpg"
    img.convert("RGB").save(out_path, quality=95)
    print(f"✅ Saved to {out_path}")
    
    # Upload via workspace archiver
    os.system(f"/root/.openclaw/workspace/venv/bin/python /root/.openclaw/workspace/auto_drive_archive.py {out_path}")

if __name__ == "__main__":
    run()
