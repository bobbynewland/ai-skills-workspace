
import os
import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunRealtimeReportRequest,
    Metric,
    Dimension,
)

TOKEN_FILE = '/root/.config/gogcli/tokens.json'
CREDS_FILE = '/root/.openclaw/workspace/.keys/google_creds.json'
PROPERTY_ID = "476483424"

def get_creds():
    with open(TOKEN_FILE, 'r') as f:
        data = json.load(f)
    accounts = data.get('accounts', {})
    email = list(accounts.keys())[0]
    account_data = accounts[email]
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

def get_ga4_data(property_id):
    creds = get_creds()
    client = BetaAnalyticsDataClient(credentials=creds)
    request = RunRealtimeReportRequest(
        property=f"properties/{property_id}",
        metrics=[Metric(name="activeUsers")],
    )
    response = client.run_realtime_report(request)
    active_users = 0
    if response.rows:
        active_users = int(response.rows[0].metric_values[0].value)
    return active_users

if __name__ == "__main__":
    try:
        users = get_ga4_data(PROPERTY_ID)
        print(f"Active Users: {users}")
    except Exception as e:
        print(f"Error: {e}")
