
import os
import json
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from google.analytics.admin_v1alpha import AnalyticsAdminServiceClient

FIREBASE_KEY = '/root/.openclaw/workspace/.keys/firebase.json'

def find_property_id(measurement_id):
    try:
        creds = service_account.Credentials.from_service_account_file(
            FIREBASE_KEY,
            scopes=['https://www.googleapis.com/auth/analytics.readonly']
        )
        client = AnalyticsAdminServiceClient(credentials=creds)
        # List all accounts
        accounts = client.list_accounts()
        for account in accounts:
            properties = client.list_properties(filter=f"parent:{account.name}")
            for prop in properties:
                # Get data streams for the property
                streams = client.list_data_streams(parent=prop.name)
                for stream in streams:
                    if stream.web_stream_data and stream.web_stream_data.measurement_id == measurement_id:
                        print(f"FOUND! Property: {prop.display_name}, ID: {prop.name.split('/')[-1]}")
                        return prop.name.split('/')[-1]
        print("Property not found.")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    find_property_id("G-MVD2D7J17N")
