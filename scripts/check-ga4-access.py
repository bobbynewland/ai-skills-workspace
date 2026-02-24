#!/usr/bin/env python3
from google.oauth2 import service_account
from google.analytics.admin_v1alpha import AnalyticsAdminServiceClient

GA4_SERVICE_KEY = '/root/.openclaw/workspace/.keys/ga4-service-account.json'

def list_properties():
    creds = service_account.Credentials.from_service_account_file(GA4_SERVICE_KEY)
    client = AnalyticsAdminServiceClient(credentials=creds)
    try:
        accounts = client.list_accounts()
        found = False
        for account in accounts:
            found = True
            print(f"Account: {account.display_name} ({account.name})")
            properties = client.list_properties(filter=f"parent:{account.name}")
            for prop in properties:
                print(f"  Property: {prop.display_name} ({prop.name}) - ID: {prop.name.split('/')[-1]}")
        if not found:
            print("No accounts found. Service account may not have Analytics Admin access.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_properties()
