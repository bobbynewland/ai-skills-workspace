from google_workspace import get_creds, refresh_if_needed, build

file_ids = [
    "1y3t_C5zaQVu2dfqB6Yq33hOyZ3etbVlc", # wellness-01
    "1Y59J-6O7yETQ33r3oTrR_nWzqm4D263-", # wellness-02
    "1N7_2dGHs1hH6C9G0objdlkLW6K4BMqOK", # wellness-03
    "1Gdqx3surpJDbcHMN53zur4yMnCC7ozmn", # wellness-04
    "14KASrMqeFfi8BH80D37Kakk0hlJuZ5bl"  # thumbnail
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
