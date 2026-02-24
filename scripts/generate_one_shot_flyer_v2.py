import os
import json
import urllib.request

def get_api_key():
    with open('/root/.openclaw/workspace/.keys/fal.key', 'r') as f:
        return f.read().strip()

def run():
    print("Generating refined one-shot flyer...")
    url = "https://fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image"
    headers = {
        "Authorization": f"Key {get_api_key()}",
        "Content-Type": "application/json"
    }
    
    prompt = (
        "A highly professional fitness promotional flyer design. "
        "At the top, massive bold red typography says exactly 'POWER UP'. "
        "Directly below it in smaller clean white text says exactly 'Push Your Limits'. "
        "In the center, a muscular athletic male in black gym apparel is lifting a dumbbell. "
        "CRITICAL: The subject is facing the camera directly, providing a clear, unobstructed, well-lit view of his face (perfect for a face swap). "
        "At the bottom right corner, red text says exactly 'GYM PRO'. "
        "The background is a dark, moody, premium industrial gym with dramatic cinematic lighting. "
        "No random numbers, no aspect ratios written on the image, only the specified text. "
        "8k, hyper-realistic photography combined with sleek graphic design."
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
        out_path = "/root/.openclaw/workspace/memory/one_shot_flyer_v2.jpg"
        urllib.request.urlretrieve(image_url, out_path)
        print(f"✅ Saved to {out_path}")
        
        os.system(f"/root/.openclaw/workspace/venv/bin/python /root/.openclaw/workspace/auto_drive_archive.py {out_path} > /root/.openclaw/workspace/memory/one_shot_link.txt")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    run()
