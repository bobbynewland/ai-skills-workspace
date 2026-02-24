import requests
import json
import sys

def call_nvidia(prompt, model="meta/llama-3.3-70b-instruct"):
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    api_key = "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"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 2048,
        "temperature": 0.7
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        result = response.json()
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"].get("content", "")
        else:
            return f"Error: {result}"
    except Exception as e:
        return f"Exception: {str(e)}"

if __name__ == "__main__":
    prompt = sys.argv[1]
    print(call_nvidia(prompt))
