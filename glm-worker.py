#!/usr/bin/env python3
"""
GLM Swarm Worker - Direct API calls to GLM via Modal
"""
import json
import subprocess
import sys
import requests

SWARM_SCRIPT = "/root/.openclaw/workspace/glm-swarm-scheduler.py"
MODAL_BASE = "https://api.us-west-2.modal.direct/v1"

def get_key():
    """Get next available key"""
    result = subprocess.run(
        ["python3", SWARM_SCRIPT, "get-key"],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        parts = result.stdout.strip().split(":")
        return int(parts[0]), parts[1]
    return None, None

def call_glm(prompt, key_index=None, model="zai-org/GLM-5-FP8", max_tokens=4096):
    """Call GLM with the given prompt"""
    
    if key_index is None:
        key_index, api_key = get_key()
        if not api_key:
            return {"error": "No keys available"}
    else:
        keys = open("/root/.openclaw/workspace/.keys/glm.key").read().strip().split('\n')
        api_key = keys[key_index - 1]
    
    url = f"{MODAL_BASE}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        result = response.json()
        
        if "choices" in result and len(result["choices"]) > 0:
            content = result["choices"][0]["message"].get("content", "")
            return {
                "status": "success",
                "key_index": key_index,
                "content": content[:5000],
                "usage": result.get("usage", {})
            }
        else:
            return {"error": "No response", "result": result}
    
    except Exception as e:
        return {"error": str(e)}

def run_task(prompt, key_index=None):
    """Run a task and return result"""
    return call_glm(prompt, key_index)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 glm-worker.py <prompt>")
        print("       python3 glm-worker.py --key 3 <prompt>")
        sys.exit(1)
    
    key_index = None
    args = sys.argv[1:]
    
    if args[0] == "--key":
        key_index = int(args[1])
        prompt = " ".join(args[2:])
    else:
        prompt = " ".join(args)
    
    result = run_task(prompt, key_index)
    print(json.dumps(result, indent=2))
