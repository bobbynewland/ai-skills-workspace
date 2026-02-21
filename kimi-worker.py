#!/usr/bin/env python3
"""
Kimi Swarm Worker - Direct API calls to Kimi via NVIDIA
"""
import json
import subprocess
import sys
import requests

SWARM_SCRIPT = "/root/.openclaw/workspace/swarm-scheduler.py"
KEYS_FILE = "/root/.openclaw/workspace/.keys/nvidia.key"
NVIDIA_BASE = "https://integrate.api.nvidia.com/v1"

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

def load_keys():
    with open(KEYS_FILE, 'r') as f:
        lines = [line.strip() for line in f.readlines()]
    return [k for k in lines if k and not k.startswith('#')]


def call_kimi(prompt, key_index=None, model="moonshotai/kimi-k2.5", max_tokens=4096):
    """Call Kimi with the given prompt"""
    
    # Get key if not specified
    if key_index is None:
        key_index, api_key = get_key()
        if not api_key:
            return {"error": "No keys available"}
    else:
        # mark usage + rate-limit bookkeeping
        subprocess.run(
            ["python3", SWARM_SCRIPT, "use-key", str(key_index), "task"],
            capture_output=True, text=True
        )
        keys = load_keys()
        if key_index < 1 or key_index > len(keys):
            return {"error": f"Invalid key index: {key_index}"}
        api_key = keys[key_index - 1]
    
    # Make API call
    url = f"{NVIDIA_BASE}/chat/completions"
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
        
        # Extract content
        if "choices" in result and len(result["choices"]) > 0:
            content = result["choices"][0]["message"].get("content", "")
            reasoning = result["choices"][0]["message"].get("reasoning", "")
            return {
                "status": "success",
                "key_index": key_index,
                "content": content[:5000],  # Truncate long responses
                "reasoning": reasoning[:1000] if reasoning else None,
                "usage": result.get("usage", {})
            }
        else:
            return {"error": "No response", "result": result}
    
    except Exception as e:
        return {"error": str(e)}

def run_task(prompt, key_index=None):
    """Run a task and return result"""
    return call_kimi(prompt, key_index)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 kimi-worker.py <prompt>")
        print("       python3 kimi-worker.py --key 3 <prompt>")
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
