import os
import json
import urllib.request
import time

def generate_image():
    # Setup fal.ai API call
    url = "https://fal.run/fal-ai/bytedance/seedream/v4.5/text-to-image"
    
    with open('/root/.openclaw/workspace/.keys/fal.key', 'r') as f:
        api_key = f.read().strip()
        
    headers = {
        "Authorization": f"Key {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "prompt": "High-end fitness trainer promotional flyer background, vertical orientation. A powerful, shredded athletic fitness trainer in sleek dark gym apparel doing a dynamic kettlebell swing. The background is a moody, premium industrial gym with neon blue and stark white rim lighting. Bold composition, 8k, extremely high quality, hyper-realistic, dramatic cinematic shadows. Clean negative space at the top and bottom for typography. No text overlays, no letters, no words, image only.",
        "image_size": "portrait_4_5"
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        
        if 'images' in result and len(result['images']) > 0:
            image_url = result['images'][0]['url']
            
            output_path = "/root/.openclaw/workspace/memory/fitness-trainer-flyer.png"
            urllib.request.urlretrieve(image_url, output_path)
            print(f"✅ Image generated and saved to {output_path}")
            
            # Use nano-banana's auto_drive_archive if available, or just rclone
            os.system(f"python3 /root/.openclaw/workspace/make_public.py {output_path} || echo 'Public link script failed'")
            
            # Simple rclone fallback
            os.system(f"rclone copy {output_path} gdrive:Template\\ Packs/ -v")
            link_output = os.popen(f"rclone link gdrive:Template\\ Packs/fitness-trainer-flyer.png").read().strip()
            print(f"Drive Link: {link_output}")
            
            # Output direct link
            if link_output and "id=" in link_output:
                file_id = link_output.split("id=")[1]
                print(f"Direct Link: https://drive.google.com/uc?export=view&id={file_id}")
            
            return link_output
            
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    generate_image()
