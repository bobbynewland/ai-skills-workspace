import requests
import os

# Get available voices
api_key = os.getenv('ELEVENLABS_API_KEY')
response = requests.get(
    'https://api.elevenlabs.io/v1/voices',
    headers={'xi-api-key': api_key}
)

if response.status_code == 200:
    voices = response.json().get('voices', [])
    print("Available voices:")
    for voice in voices[:5]:  # Show first 5
        print(f"  {voice['voice_id']} - {voice['name']}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
