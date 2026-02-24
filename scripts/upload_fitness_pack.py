import requests
import json

url = "https://aiskills.studio/api/v1/clawdbot/upload-pack"
headers = {
    "x-api-key": "f0959c2b9c94427b13401afccb60e699bcd320fbc25398d3eef2456364330f03",
    "Content-Type": "application/json"
}

payload = {
    "pack": {
        "name": "The Fitness Studio Blueprint",
        "description": "High-impact social promo flyers for the fitness industry. Bold typography and cinematic vibes designed for mobile scrollers. One-shot generations ready for immediate use or face-swapping.",
        "thumbnail_url": "https://drive.google.com/uc?export=view&id=1lpC6v1aIHkfGlnYT-Ac2Xn8iFYo24yE6"
    },
    "templates": [
        {
            "title": "Power Up (Gym Promo)",
            "prompt_text": "A professional fitness promo flyer for gyms. High-contrast, moody lighting, featuring 'POWER UP' typography. Clear front-facing subject.",
            "image_url": "https://drive.google.com/uc?export=view&id=1lpC6v1aIHkfGlnYT-Ac2Xn8iFYo24yE6"
        },
        {
            "title": "Dance It Out (Zumba & Cardio)",
            "prompt_text": "An energetic, neon-accented flyer for dance fitness classes. Features bold pink 'DANCE IT OUT' typography. Clear front-facing subject.",
            "image_url": "https://drive.google.com/uc?export=view&id=1vdHx5z2HJAkxeNJF5uvhRnfEKj45_QSR"
        },
        {
            "title": "Strike First (Boxing & MMA)",
            "prompt_text": "A gritty, yellow-and-black promo flyer for combat sports coaches. Features 'STRIKE FIRST' typography. Clear front-facing subject.",
            "image_url": "https://drive.google.com/uc?export=view&id=1jYZ_6eo2tJ9mtciHl_Fn6lq-OTVRFZib"
        },
        {
            "title": "Find Balance (Yoga & Wellness)",
            "prompt_text": "A minimalist, calm editorial flyer for wellness studios. Features 'FIND BALANCE' typography in earth tones. Clear front-facing subject.",
            "image_url": "https://drive.google.com/uc?export=view&id=1OpHRPW8MY83CQuccOhpD2gvMGDsPhPfQ"
        }
    ]
}

response = requests.post(url, headers=headers, json=payload)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
