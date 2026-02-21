from google_workspace import get_creds, refresh_if_needed, build

file_ids = [
    "1J1PoviQV-vGlTpPJVGtMk4dMYLzEnqQP", # industrial-01
    "1LZaEBvYvpHcXkLeHRxoIsEdMud8ZMW79", # industrial-02
    "1eXB5ucg7q8rdu42NJaGyMkbSU40aYi-e", # industrial-03
    "1yhxAKw-xIzGEcpiFlkpoF1fpHGfncqOq", # industrial-04
    "1KZcltCKmuczq8NO2H1gKGxcuHkC_MGkk"  # thumbnail
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
