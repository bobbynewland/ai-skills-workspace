import os
import json
import urllib.request
import threading
import subprocess

def get_api_key():
    with open('/root/.openclaw/workspace/.keys/fal.key', 'r') as f:
        return f.read().strip()

url = "https://fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image"
api_key = get_api_key()

prompts = [
    (
        "zumba", 
        "A vibrant, energetic fitness promotional flyer design for a Zumba or dance fitness class. "
        "At the top, large bold pink typography says 'DANCE IT OUT'. "
        "Below it, smaller clean white text says 'Join the Party'. "
        "In the center, a joyful, fit female instructor in bright athletic wear is facing the camera directly with a clear, well-lit, unobstructed view of her face (perfect for a face swap). "
        "At the bottom, a stylish yellow text box says 'SATURDAY CLASSES'. "
        "The background is a bright studio with neon accents and energetic lighting. "
        "No random numbers or aspect ratios written on the image. "
        "8k, hyper-realistic photography combined with sleek pop-art graphic design."
    ),
    (
        "boxing", 
        "A gritty, intense fitness promotional flyer design for a boxing or MMA coach. "
        "At the top, massive bold yellow typography says 'STRIKE FIRST'. "
        "Directly below it in clean white text says 'Unleash Your Power'. "
        "In the center, an athletic, lean male coach with hand wraps is standing straight forward, arms crossed, facing the camera directly with a clear, well-lit view of his face (perfect for face swap). "
        "At the bottom right corner, yellow text says 'FIGHT CAMP'. "
        "The background is a dark, moody boxing gym with stark contrast and dramatic spotlighting. "
        "No random numbers or aspect ratios written on the image. "
        "8k, hyper-realistic photography combined with sleek graphic design."
    ),
    (
        "yoga", 
        "A calm, premium wellness promotional flyer design for a yoga instructor. "
        "At the top, elegant, minimalist dark green typography says 'FIND BALANCE'. "
        "Directly below it in smaller soft beige text says 'Mind & Body Reset'. "
        "In the center, a serene female instructor in earth-toned yoga apparel is standing tall and relaxed, facing the camera directly with a clear, softly-lit, unobstructed view of her face (perfect for face swap). "
        "At the bottom center, elegant text says 'BOOK YOUR MAT'. "
        "The background is a bright, airy, modern studio with natural sunlight and plants. "
        "No random numbers or aspect ratios written on the image. "
        "8k, hyper-realistic photography combined with minimalist editorial graphic design."
    )
]

def generate_and_upload(name, prompt):
    print(f"Generating {name}...")
    headers = {
        "Authorization": f"Key {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": prompt,
        "image_size": "portrait_16_9"
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        
        image_url = result['images'][0]['url']
        out_path = f"/root/.openclaw/workspace/memory/variation_{name}.jpg"
        urllib.request.urlretrieve(image_url, out_path)
        print(f"✅ Saved {name} to {out_path}")
        
        # Upload
        upload_cmd = f"/root/.openclaw/workspace/venv/bin/python /root/.openclaw/workspace/auto_drive_archive.py {out_path}"
        output = subprocess.check_output(upload_cmd, shell=True).decode('utf-8')
        print(f"[{name}] {output.strip()}")
    except Exception as e:
        print(f"Failed {name}: {e}")

threads = []
for name, prompt in prompts:
    t = threading.Thread(target=generate_and_upload, args=(name, prompt))
    t.start()
    threads.append(t)

for t in threads:
    t.join()

print("All variations completed.")
