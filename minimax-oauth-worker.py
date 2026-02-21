#!/usr/bin/env python3
"""MiniMax OAuth Worker - uses gateway's MiniMax OAuth"""
import sys
import json
import subprocess

def run_minimax(prompt):
    """Run using MiniMax OAuth via gateway"""
    try:
        # Use gateway to call MiniMax
        result = subprocess.run(
            ["python3", "-c", f"""
import requests
resp = requests.post('http://localhost:3000/api/chat', json={{
    'messages': [{{'role': 'user', 'content': '''{prompt}'''}}],
    'model': 'minimax-portal/MiniMax-M2.5'
}}, timeout=120)
print(resp.text)
"""],
            capture_output=True, text=True, timeout=130
        )
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if "choices" in data and data["choices"]:
                return {
                    "status": "success",
                    "content": data["choices"][0]["message"]["content"]
                }
        return {"status": "error", "message": result.stderr or "Failed"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    prompt = " ".join(sys.argv[1:])
    result = run_minimax(prompt)
    print(json.dumps(result))
