import requests

resp = requests.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=AIzaSyCLOCwyuavtdN-hEHkraOrsOJgMWYEz-FI",
    headers={"Content-Type": "application/json"},
    json={
        "contents": [{"parts": [{"text": "Create a business research report for B Natural Hair Care about natural hair growth serum. Include: 1) Market demand 2) 10 key ingredients with benefits 3) Competitors 4) Positioning 5) Pricing 6) Marketing"}],
        "generationConfig": {"maxOutputTokens": 4000, "temperature": 0.7}
    },
    timeout=120
)

print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    result = resp.json()
    if "candidates" in result:
        print(result["candidates"][0]["content"]["parts"][0]["text"][:4000])
    else:
        print(result)
else:
    print(resp.text[:500])
