from google_workspace import get_creds, refresh_if_needed, build

file_ids = [
    "1ls5223A1Nnir7wN0wV9--aJTUYCOaHRF", # Thumbnail
    "1z_a0X9h2Egx36kECeeul-5Zifnhu6H7N", # Variation A
    "13EC-cs3HcQ8DxjFpXiLv22eKDpwOnDaM", # Variation B
    "1Il6gnHivEaovRCB8rPxyU4zXiWViyOXY", # Variation C
    "1DTkiGtY-spdJJEXlCHiiOCrUWrH0R2dc", # Variation D
    "1ly5-BsNGf9kBD5QQlKdtYGOIXJWg7Kpk"  # Test Image
]

creds, email = get_creds()
creds = refresh_if_needed(creds)
service = build('drive', 'v3', credentials=creds)

for file_id in file_ids:
    try:
        service.permissions().create(
            fileId=file_id,
            body={'type': 'anyone', 'role': 'reader'}
        ).execute()
        print(f"SUCCESS: {file_id} is now public.")
    except Exception as e:
        print(f"FAILED: {file_id} - {e}")
