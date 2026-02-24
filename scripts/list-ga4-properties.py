
import os
import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google.analytics.admin_v1alpha import AnalyticsAdminServiceClient

TOKEN_FILE = '/root/.config/gogcli/tokens.json'
CREDS_FILE = '/root/.openclaw/workspace/.keys/google_creds.json'

def get_creds():
    if not os.path.exists(TOKEN_FILE):
        raise Exception(f"Token file not found: {TOKEN_FILE}")
    with open(TOKEN_FILE, 'r') as f:
        data = json.load(f)
    accounts = data.get('accounts', {})
    if not accounts:
        raise Exception("No accounts found in token file")
    email = list(accounts.keys())[0]
    account_data = accounts[email]
    if not os.path.exists(CREDS_FILE):
         raise Exception(f"Creds file not found: {CREDS_FILE}")
    with open(CREDS_FILE, 'r') as f:
        creds_data = json.load(f)
    client_id = creds_data.get('installed', {}).get('client_id')
    client_secret = creds_data.get('installed', {}).get('client_secret')
    creds = Credentials(
        token=account_data.get('access_token'),
        refresh_token=account_data.get('refresh_token'),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=client_id,
        client_secret=client_secret
    )
    if creds.expired or not creds.valid:
        creds.refresh(Request())
    return creds

def list_properties():
    creds = get_creds()
    client = AnalyticsAdminServiceClient(credentials=creds)
    # List all accounts
    accounts = client.list_accounts()
    for account in accounts:
        print(f"Account: {account.display_name} ({account.name})")
        properties = client.list_properties(filter=f"parent:{account.name}")
        for prop in properties:
            print(f"  Property: {prop.display_name} ({prop.name})")

if __name__ == "__main__":
    try:
        list_properties()
    except Exception as e:
        print(f"Error: {e}")
