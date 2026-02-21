from google_workspace import get_creds, refresh_if_needed, build

file_ids = [
    "1ib9VmzqjUURSs3-dvt9yiyoiZR0N7tvu", # surreal-01
    "1MveZllVGITmnFzwQRwQd4Ok7QRc9o8Xg", # surreal-02
    "1ccMN5mGePF9r1ktwc1zlQ7IQLss6wn75", # surreal-03
    "1cNfv3Wz-56nQnO0XihTJ4KDFYHq87ksQ", # surreal-04
    "1_Xau0cjceaLrxjJSKGf8OlX2Pcws1TwD"  # thumbnail
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
