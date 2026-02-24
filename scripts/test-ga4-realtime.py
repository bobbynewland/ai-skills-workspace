#!/usr/bin/env python3
from google.oauth2 import service_account
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunRealtimeReportRequest,
    Metric,
    Dimension,
)

GA4_SERVICE_KEY = '/root/.openclaw/workspace/.keys/ga4-service-account.json'
PROPERTY_ID = "476483424"

def test_realtime():
    client = BetaAnalyticsDataClient.from_service_account_file(GA4_SERVICE_KEY)
    request = RunRealtimeReportRequest(
        property=f"properties/{PROPERTY_ID}",
        metrics=[Metric(name="activeUsers")],
    )
    response = client.run_realtime_report(request)
    active_users = 0
    if response.rows:
        active_users = int(response.rows[0].metric_values[0].value)
    print(f"✅ SUCCESS! Active Users: {active_users}")

if __name__ == "__main__":
    try:
        test_realtime()
    except Exception as e:
        print(f"❌ Error: {e}")
