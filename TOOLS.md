# Model Priority

## Coding ⭐
1. **NVIDIA Kimi K2.5** (Primary coding - check credits!)
2. Gemini CLI (free)
3. Codex OAuth
4. Gemini 2.5 Flash

## Chat
1. MiniMax M2.1
2. Gemini 2.5 Flash

## General
1. Gemini 2.5 Pro
2. Gemini 2.5 Flash

## Image/Video
- Imagen 4.0 (images)
- Veo 3.0 (video)

## Keys
`/root/.openclaw/workspace/.keys/`
- google_ai_studio.key ✅
- vertex_ai.json ✅
- openrouter.key ✅
- nvidia.key ✅

# Commands
/model codex - GPT-4o coding
/model gemini-2.5-flash - fast reasoning
/model pony-alpha - free fallback


NVIDIA
Explore
Models
Blueprints
GPUs
Docs
Search
⌘K
?
B

kimi-k2.5
Experience
Model Card
View Code
AI models generate responses and outputs based on complex algorithms and machine learning techniques, and those responses or outputs may be inaccurate, harmful, biased or indecent. By testing this model, you assume the risk of any harm caused by any response or output of the model. Please do not upload any confidential information or personal data unless expressly permitted. Your use is logged for security purposes.
kimi-k2.5

Image
What is in this image?

Which number is larger, 9.11 or 9.8?
How many 'r's are in the word 'strawberry'?

Image
Describe the image.

Tools
OFF
ON
Reasoning
Parameters


I can evaluate text or images based on your prompt or an example from above.



GOVERNING TERMS: This trial service is governed by the NVIDIA API Trial Terms of Service. Use of this model is governed by the NVIDIA Open Model License Agreement. Additional Information: Modified MIT License.

Terms of Use
Privacy Policy
Your Privacy Choices
Contact
Copyright © 2026 NVIDIA Corporation

kimi-k2.5 Model by Moonshotai | NVIDIA NIM
Copy Code to Make an API Request

Python

LangChain

Node

Shell
API Reference
Using free API for development
Upgrade
Generate API Key

Copy

import requests, base64

invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
stream = True


headers = {
  "Authorization": "Bearer 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",
  "Accept": "text/event-stream" if stream else "application/json"
}

payload = {
  "model": "moonshotai/kimi-k2.5",
  "messages": [{"role":"user","content":""}],
  "max_tokens": 16384,
  "temperature": 1.00,
  "top_p": 1.00,
  "stream": stream,
  "chat_template_kwargs": {"thinking":True},
}



response = requests.post(invoke_url, headers=headers, json=payload)

if stream:
    for line in response.iter_lines():
        if line:
            print(line.decode("utf-8"))
else:
    print(response.json())

Close Modal

