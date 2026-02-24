import os
import urllib.request
import subprocess

def run():
    print("Downloading original Zumba flyer...")
    url = "https://drive.google.com/uc?export=view&id=1nOP1jTd9VyLNUTCqWDrNPLPjdwEy3A7E"
    in_path = "/root/.openclaw/workspace/memory/zumba_original.jpg"
    urllib.request.urlretrieve(url, in_path)
    print("Downloaded.")
    
    out_path = "/root/.openclaw/workspace/memory/zumba_edited.jpg"
    
    print("Running seedream-edit.py...")
    prompt = "Remove the '8K' text from the top of the image completely. Keep the rest of the 'DANCE IT OUT' text and background exactly the same."
    
    cmd = [
        "/root/.openclaw/workspace/venv/bin/python", 
        "/root/.openclaw/workspace/seedream-edit.py",
        "--image", in_path,
        "--prompt", prompt,
        "--output", out_path
    ]
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    
    print(stdout.decode('utf-8'))
    if stderr:
        print(f"Error: {stderr.decode('utf-8')}")

if __name__ == "__main__":
    run()
