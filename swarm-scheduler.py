#!/usr/bin/env python3
"""
Kimi Swarm Scheduler - Distributes tasks across 10 NVIDIA Kimi keys
Usage: python3 swarm-scheduler.py [task] [model-index]

Rate Limit: 30 RPM per key (2 seconds between requests)
"""

import os
import json
import time
import subprocess
from datetime import datetime, timedelta
import threading

# Load keys
KEYS_FILE = "/root/.openclaw/workspace/.keys/nvidia.key"

# Rate limiting: 30 RPM = 1 request every 2 seconds
RPM = 30
REQUEST_DELAY = 60.0 / RPM  # 2 seconds between requests

# Track last request time per key
_key_last_request = {}
_key_lock = threading.Lock()

def load_keys():
    """Load all NVIDIA API keys (ignore comments/blank lines)."""
    with open(KEYS_FILE, 'r') as f:
        lines = [line.strip() for line in f.readlines()]
    keys = [k for k in lines if k and not k.startswith('#')]
    return keys

def load_usage():
    """Load usage tracking"""
    usage_file = "/root/.openclaw/workspace/.swarm_usage.json"
    if os.path.exists(usage_file):
        with open(usage_file, 'r') as f:
            return json.load(f)
    return {str(i): {"requests": 0, "last_used": None} for i in range(1, 11)}

def save_usage(usage):
    """Save usage tracking"""
    usage_file = "/root/.openclaw/workspace/.swarm_usage.json"
    with open(usage_file, 'w') as f:
        json.dump(usage, f, indent=2)

def get_least_used_key():
    """Get the key with least requests - true round robin with rate limiting"""
    keys = load_keys()
    usage = load_usage()
    current_time = time.time()
    
    # Find keys that have waited long enough (30 RPM = 2 sec delay)
    available = []
    for i in range(1, len(keys) + 1):
        last_used = _key_last_request.get(i, 0)
        if current_time - last_used >= REQUEST_DELAY:
            available.append(i)
    
    # If none available due to rate limit, wait and try again
    if not available:
        # Find key with earliest availability
        wait_times = [(i, REQUEST_DELAY - (current_time - _key_last_request.get(i, 0))) 
                      for i in range(1, len(keys) + 1)]
        wait_times.sort(key=lambda x: x[1])
        min_wait = max(0, wait_times[0][1])
        if min_wait > 0:
            print(f"⏳ Rate limited. Waiting {min_wait:.1f}s...")
            time.sleep(min_wait)
        current_time = time.time()
        available = [i for i in range(1, len(keys) + 1) 
                     if current_time - _key_last_request.get(i, 0) >= REQUEST_DELAY]
    
    # Pick key with fewest total requests (load balancing)
    available.sort(key=lambda x: usage.get(str(x), {}).get("requests", 0))
    key_index = available[0] - 1
    
    # Update last request time
    _key_last_request[available[0]] = current_time
    
    return keys[key_index], key_index + 1

def run_task_with_key(key_index, prompt):
    """Run a task with a specific key - with rate limiting"""
    keys = load_keys()
    if key_index < 1 or key_index > len(keys):
        return {"error": f"Invalid key index: {key_index}"}
    
    # Rate limit: wait if needed
    current_time = time.time()
    last_used = _key_last_request.get(key_index, 0)
    wait_time = REQUEST_DELAY - (current_time - last_used)
    
    if wait_time > 0:
        print(f"⏳ Key {key_index}: waiting {wait_time:.1f}s for rate limit...")
        time.sleep(wait_time)
    
    _key_last_request[key_index] = time.time()
    key = keys[key_index - 1]
    
    # Update usage
    usage = load_usage()
    usage[str(key_index)]["requests"] += 1
    usage[str(key_index)]["last_used"] = time.time()
    save_usage(usage)
    
    # Return the key info (for now)
    return {
        "key_index": key_index,
        "key_prefix": key[:20] + "...",
        "status": "ready",
        "prompt_length": len(prompt),
        "rpm_limit": RPM
    }

def status():
    """Show swarm status"""
    keys = load_keys()
    usage = load_usage()
    
    print("🕸️  KIMI SWARM STATUS")
    print("=" * 40)
    print(f"Total Keys: {len(keys)}")
    print(f"Rate Limit: {RPM} RPM (1 req every {REQUEST_DELAY:.1f}s)")
    print()
    
    for i in range(1, len(keys) + 1):
        reqs = usage.get(str(i), {}).get("requests", 0)
        last = usage.get(str(i), {}).get("last_used")
        
        if last:
            ago = datetime.now() - datetime.fromtimestamp(last)
            ago_str = f"{int(ago.total_seconds())}s ago"
        else:
            ago_str = "Never"
        
        status = "🟢" if not last or time.time() - last > 3600 else "🟡"
        print(f"Key {i:2d}: {status} {reqs:3d} requests | Last: {ago_str}")
    
    print()
    
    # Suggest next available
    key, idx = get_least_used_key()
    print(f"➡️  Next available: Key {idx}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        status()
    elif sys.argv[1] == "status":
        status()
    elif sys.argv[1] == "get-key":
        key, idx = get_least_used_key()
        print(f"{idx}:{key}")
    elif sys.argv[1] == "run" and len(sys.argv) > 2:
        prompt = sys.argv[2]
        key, idx = get_least_used_key()
        result = run_task_with_key(idx, prompt)
        print(json.dumps(result))
    elif sys.argv[1] == "use-key" and len(sys.argv) > 2:
        key_idx = int(sys.argv[2])
        prompt = sys.argv[3] if len(sys.argv) > 3 else ""
        result = run_task_with_key(key_idx, prompt)
        print(json.dumps(result))
    else:
        print("Usage:")
        print("  python3 swarm-scheduler.py status     # Show all keys")
        print("  python3 swarm-scheduler.py get-key    # Get next available key")
        print("  python3 swarm-scheduler.py run <prompt>  # Run task with least-used key")
        print("  python3 swarm-scheduler.py use-key <1-10> <prompt>  # Use specific key")
