
import os
import json
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import requests

FIREBASE_KEY = '/root/.openclaw/workspace/.keys/firebase.json'

def get_firebase_token():
    creds = service_account.Credentials.from_service_account_file(
        FIREBASE_KEY,
        scopes=['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/firebase.database']
    )
    creds.refresh(Request())
    return creds.token

def read_firebase(path):
    token = get_firebase_token()
    url = f"https://winslow-756c3-default-rtdb.firebaseio.com/{path}.json?access_token={token}"
    resp = requests.get(url)
    return resp.json()

if __name__ == "__main__":
    path = "workspaces/winslow_main/analytics_realtime"
    data = read_firebase(path)
    print(json.dumps(data, indent=2))
