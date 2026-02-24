import os
import json
import urllib.request
import subprocess

def get_api_key():
    with open('/root/.openclaw/workspace/.keys/fal.key', 'r') as f:
        return f.read().strip()

def run():
    print("Regenerating Zumba flyer without 8k...")
    url = "https://fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image"
    headers = {
        "Authorization": f"Key {get_api_key()}",
        "Content-Type": "application/json"
    }
    
    prompt = (
        "A vibrant, energetic fitness promotional flyer design for a dance fitness class. "
        "At the top, large bold pink typography says exactly 'DANCE IT OUT'. "
        "Below it, smaller clean white text says exactly 'Join the Party'. "
        "In the center, a joyful, fit female instructor in bright athletic wear is facing the camera directly with a clear, well-lit, unobstructed view of her face (perfect for a face swap). "
        "At the bottom, a stylish yellow text box says exactly 'SATURDAY CLASSES'. "
        "The background is a bright studio with neon accents and energetic lighting. "
        "CRITICAL: Do not write '8k', random numbers, or aspect ratios on the image. "
        "Hyper-realistic photography combined with sleek pop-art graphic design."
    )
    
    payload = {
        "prompt": prompt,
        "image_size": "portrait_16_9"
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        
        image_url = result['images'][0]['url']
        out_path = "/root/.openclaw/workspace/memory/variation_zumba_fixed.jpg"
        urllib.request.urlretrieve(image_url, out_path)
        print(f"✅ Saved to {out_path}")
        
        # Upload
        upload_cmd = f"/root/.openclaw/workspace/venv/bin/python /root/.openclaw/workspace/auto_drive_archive.py {out_path}"
        output = subprocess.check_output(upload_cmd, shell=True).decode('utf-8')
        print(output.strip())
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    run()
