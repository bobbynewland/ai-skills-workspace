
import os
import json
from google.oauth2 import service_account
from google.analytics.admin_v1alpha import AnalyticsAdminServiceClient

FIREBASE_KEY = '/root/.openclaw/workspace/.keys/firebase.json'

def list_properties():
    creds = service_account.Credentials.from_service_account_file(FIREBASE_KEY)
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
