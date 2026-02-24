import json
import os
import urllib.request
from google.oauth2 import service_account
from google.auth.transport.requests import Request

FIREBASE_KEY = '/root/.openclaw/workspace/.keys/firebase.json'
DB_URL = "https://winslow-756c3-default-rtdb.firebaseio.com/workspaces/winslow_main/notes.json"

def get_firebase_token():
    creds = service_account.Credentials.from_service_account_file(
        FIREBASE_KEY,
        scopes=['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/firebase.database']
    )
    creds.refresh(Request())
    return creds.token

def list_notes():
    try:
        token = get_firebase_token()
        url = f"{DB_URL}?access_token={token}"
        
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if not data:
                print("No notes found.")
                return
            
            for note_id, note in data.items():
                print(f"ID: {note_id} | Title: {note.get('title')} | Type: {note.get('type')}")
                if "Discord Welcome" in note.get('title', ''):
                    print(f"--- CONTENT START ---\n{note.get('content')}\n--- CONTENT END ---")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_notes()
