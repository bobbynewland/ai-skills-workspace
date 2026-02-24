import os
import json
import urllib.request

def get_api_key():
    with open('/root/.openclaw/workspace/.keys/fal.key', 'r') as f:
        return f.read().strip()

def run():
    print("Generating full promotional flyer in one shot...")
    url = "https://fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image"
    headers = {
        "Authorization": f"Key {get_api_key()}",
        "Content-Type": "application/json"
    }
    
    prompt = (
        "A highly professional fitness promotional flyer design, vertical 9:16 orientation. "
        "At the top, massive bold red typography says exactly 'POWER UP'. "
        "Directly below it in smaller clean white text says exactly 'Push Your Limits'. "
        "In the center, a highly detailed, muscular athletic male in black gym apparel is doing a one-arm dumbbell row, "
        "with a power rack and weights in the moody, dark background. "
        "At the bottom right corner, red text says exactly 'GYM PRO'. "
        "The flyer features striking red geometric angle graphics at the very top edge and bottom edge. "
        "Dramatic cinematic lighting, 8k, hyper-realistic photography combined with sleek graphic design."
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
        out_path = "/root/.openclaw/workspace/memory/one_shot_flyer.jpg"
        urllib.request.urlretrieve(image_url, out_path)
        print(f"✅ Saved to {out_path}")
        
        # Upload via workspace archiver
        os.system(f"/root/.openclaw/workspace/venv/bin/python /root/.openclaw/workspace/auto_drive_archive.py {out_path}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    run()
