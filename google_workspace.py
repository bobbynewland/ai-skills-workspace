#!/usr/bin/env python3
"""
Google Workspace Toolkit - Complete Gmail, Calendar, Drive, Sheets, Docs, Slides, Forms, Contacts
Uses OAuth tokens for authentication
"""

import os
import json
import datetime
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Token file
TOKEN_FILE = '/root/.config/gogcli/tokens.json'
CREDS_FILE = '/root/.openclaw/workspace/.keys/google_creds.json'

SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/docs',
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/forms.body',
    'https://www.googleapis.com/auth/forms.responses.readonly',
    'https://www.googleapis.com/auth/slides',
    'https://www.googleapis.com/auth/contacts',
]

def get_creds():
    """Load credentials from token file"""
    if not os.path.exists(TOKEN_FILE):
        raise Exception(f"Token file not found: {TOKEN_FILE}")
    
    with open(TOKEN_FILE, 'r') as f:
        data = json.load(f)
    
    accounts = data.get('accounts', {})
    email = list(accounts.keys())[0]
    account_data = accounts[email]
    
    # Load client credentials
    with open(CREDS_FILE, 'r') as f:
        creds_data = json.load(f)
    
    client_id = creds_data.get('installed', {}).get('client_id')
    client_secret = creds_data.get('installed', {}).get('client_secret')
    
    creds = Credentials(
        token=account_data.get('access_token'),
        refresh_token=account_data.get('refresh_token'),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES
    )
    
    return creds, email

def refresh_if_needed(creds):
    """Refresh token if expired"""
    if creds.expired:
        creds.refresh(Request())
        save_tokens(creds)
    return creds

def save_tokens(creds):
    """Save refreshed tokens"""
    with open(TOKEN_FILE, 'r') as f:
        data = json.load(f)
    
    for email in data['accounts']:
        data['accounts'][email]['access_token'] = creds.token
        data['accounts'][email]['expires_in'] = 3600
    
    with open(TOKEN_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# ============ GMAIL ============

def gmail_send(to, subject, body, attachments=None):
    """Send email"""
    import base64
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.mime.base import MIMEBase
    from email import encoders
    
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('gmail', 'v1', credentials=creds)
    
    message = MIMEMultipart()
    message['to'] = to
    message['subject'] = subject
    message.attach(MIMEText(body, 'plain'))
    
    if attachments:
        for filepath in attachments:
            with open(filepath, 'rb') as f:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(f.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename= {os.path.basename(filepath)}')
                message.attach(part)
    
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    
    result = service.users().messages().send(userId='me', body={'raw': raw}).execute()
    return result

def gmail_search(query, max_results=10):
    """Search emails"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('gmail', 'v1', credentials=creds)
    results = service.users().messages().list(userId='me', q=query, maxResults=max_results).execute()
    messages = results.get('messages', [])
    
    detailed = []
    for msg in messages:
        detail = service.users().messages().get(userId='me', id=msg['id']).execute()
        detailed.append({
            'id': msg['id'],
            'snippet': detail.get('snippet', '')[:100],
            'date': detail.get('internalDate', '')
        })
    
    return detailed

# ============ CALENDAR ============

def calendar_list():
    """List calendars"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('calendar', 'v3', credentials=creds)
    results = service.calendarList().list().execute()
    return results.get('items', [])

def calendar_events(calendar_id='primary', max_results=10, days=7):
    """List calendar events"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('calendar', 'v3', credentials=creds)
    
    time_min = (datetime.datetime.utcnow()).isoformat() + 'Z'
    
    results = service.events().list(
        calendarId=calendar_id, 
        timeMin=time_min,
        maxResults=max_results,
        singleEvents=True
    ).execute()
    
    return results.get('items', [])

def calendar_create_event(summary, description, start_time, end_time, location=None, attendees=None):
    """Create calendar event"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('calendar', 'v3', credentials=creds)
    
    event = {
        'summary': summary,
        'description': description,
        'start': {'dateTime': start_time, 'timeZone': 'America/New_York'},
        'end': {'dateTime': end_time, 'timeZone': 'America/New_York'},
    }
    
    if location:
        event['location'] = location
    if attendees:
        event['attendees'] = [{'email': a} for a in attendees]
    
    result = service.events().insert(calendarId='primary', body=event).execute()
    return result

# ============ DRIVE ============

def drive_list(query=None, max_results=20):
    """List Drive files"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    
    if query:
        results = service.files().list(q=query, pageSize=max_results, fields='files(id,name,mimeType,modifiedTime)').execute()
    else:
        results = service.files().list(pageSize=max_results, fields='files(id,name,mimeType,modifiedTime)').execute()
    
    return results.get('files', [])

def drive_upload(filename, name=None, folder_id=None, convert=False):
    """Upload file to Drive"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    
    file_metadata = {'name': name or os.path.basename(filename)}
    if folder_id:
        file_metadata['parents'] = [folder_id]
    
    from googleapiclient.http import MediaFileUpload
    media = MediaFileUpload(filename)
    
    result = service.files().create(body=file_metadata, media_body=media, fields='id,name,webViewLink').execute()
    return result

def drive_download(file_id, destination):
    """Download file from Drive"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    
    request = service.files().get_media(fileId=file_id)
    with open(destination, 'wb') as f:
        f.write(request.execute())
    
    return destination

def drive_create_folder(name, parent_id=None):
    """Create Drive folder"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    
    file_metadata = {
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
    
    result = service.files().create(body=file_metadata, fields='id,name,webViewLink').execute()
    return result

# ============ SHEETS ============

def sheets_read(sheet_id, range):
    """Read from Sheet"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('sheets', 'v4', credentials=creds)
    result = service.spreadsheets().values().get(spreadsheetId=sheet_id, range=range).execute()
    return result.get('values', [])

def sheets_write(sheet_id, range, values):
    """Write to Sheet"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('sheets', 'v4', credentials=creds)
    
    body = {'values': values}
    result = service.spreadsheets().values().update(
        spreadsheetId=sheet_id, 
        range=range, 
        valueInputOption='USER_ENTERED',
        body=body
    ).execute()
    return result

def sheets_create(title, folder_id=None):
    """Create new Sheet"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('sheets', 'v4', credentials=creds)
    
    spreadsheet = {'properties': {'title': title}}
    result = service.spreadsheets().create(body=spreadsheet, fields='spreadsheetId, spreadsheetUrl').execute()
    return result

# ============ DOCS ============

def docs_get(doc_id):
    """Get Doc content"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('docs', 'v1', credentials=creds)
    result = service.documents().get(documentId=doc_id).execute()
    return result

def docs_create(title, folder_id=None):
    """Create new Doc"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('docs', 'v1', credentials=creds)
    result = service.documents().create(body={'title': title}).execute()
    return result

# ============ SLIDES ============

def slides_list():
    """List presentations (via Drive)"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    results = service.files().list(
        q="mimeType='application/vnd.google-apps.presentation'",
        pageSize=50,
        fields='files(id,name,modifiedTime)'
    ).execute()
    return results.get('files', [])

def slides_get(presentation_id):
    """Get slide content"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('slides', 'v1', credentials=creds)
    result = service.presentations().get(presentationId=presentation_id).execute()
    return result

def slides_create(title):
    """Create new presentation"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('slides', 'v1', credentials=creds)
    result = service.presentations().create(body={'title': title}).execute()
    return result

# ============ FORMS ============

def forms_list():
    """List forms (via Drive)"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    results = service.files().list(
        q="mimeType='application/vnd.google-apps.form'",
        pageSize=50,
        fields='files(id,name,modifiedTime)'
    ).execute()
    return results.get('files', [])

def forms_get(form_id):
    """Get form details"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('forms', 'v1', credentials=creds)
    result = service.forms().get(formId=form_id).execute()
    return result

def forms_responses(form_id):
    """Get form responses"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('forms', 'v1', credentials=creds)
    result = service.forms().responses().list(formId=form_id).execute()
    return result.get('responses', [])

def forms_create(title, questions=None):
    """Create new form"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('forms', 'v1', credentials=creds)
    
    form = {'info': {'title': title}}
    if questions:
        form['items'] = questions
    
    result = service.forms().create(body=form).execute()
    return result

# ============ CONTACTS ============

def contacts_list(max_results=100):
    """List contacts"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('people', 'v1', credentials=creds)
    results = service.people().connections().list(
        resourceName='people/me',
        personFields='names,emailAddresses,phoneNumbers',
        pageSize=max_results
    ).execute()
    return results.get('connections', [])

# ============ MAIN ============

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 google_workspace.py <command> [args]")
        print("\n📧 GMAIL:")
        print("  gmail send <to> <subject> <body>")
        print("  gmail search <query>")
        print("\n📅 CALENDAR:")
        print("  calendar list")
        print("  calendar events [days]")
        print("  calendar create <summary> <desc> <start> <end>")
        print("\n💾 DRIVE:")
        print("  drive list [query]")
        print("  drive upload <filename> [name]")
        print("  drive folder <name> [parent_id]")
        print("\n📊 SHEETS:")
        print("  sheets read <sheet_id> <range>")
        print("  sheets write <sheet_id> <range> <json_values>")
        print("  sheets create <title>")
        print("\n📝 DOCS:")
        print("  docs get <doc_id>")
        print("  docs create <title>")
        print("\n🎬 SLIDES:")
        print("  slides list")
        print("  slides get <id>")
        print("  slides create <title>")
        print("\n📋 FORMS:")
        print("  forms list")
        print("  forms get <form_id>")
        print("  forms responses <form_id>")
        print("  forms create <title>")
        print("\n👥 CONTACTS:")
        print("  contacts list")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    try:
        if cmd == 'gmail' and len(sys.argv) >= 3:
            subcmd = sys.argv[2]
            if subcmd == 'send' and len(sys.argv) >= 5:
                result = gmail_send(sys.argv[3], sys.argv[4], sys.argv[5])
                print(f"✅ Sent! Message ID: {result.get('id')}")
            elif subcmd == 'search':
                results = gmail_search(sys.argv[3] if len(sys.argv) > 3 else '')
                for r in results:
                    print(f"[{r['date']}] {r['snippet']}...")
        
        elif cmd == 'calendar':
            if len(sys.argv) >= 3 and sys.argv[2] == 'list':
                cals = calendar_list()
                for c in cals:
                    print(f"📅 {c.get('summary')} ({c.get('id')})")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'events':
                days = int(sys.argv[3]) if len(sys.argv) > 3 else 7
                events = calendar_events(max_results=days)
                for e in events:
                    print(f"📅 {e.get('summary')} ({e.get('start', {}).get('dateTime', 'TBD')[:10]})")
            elif len(sys.argv) >= 7 and sys.argv[2] == 'create':
                result = calendar_create_event(sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
                print(f"✅ Created! Event ID: {result.get('id')}")
        
        elif cmd == 'drive':
            if len(sys.argv) >= 3 and sys.argv[2] == 'list':
                query = sys.argv[3] if len(sys.argv) > 3 else None
                files = drive_list(query)
                for f in files:
                    icon = '📁' if 'folder' in f.get('mimeType') else '📄'
                    print(f"{icon} {f.get('name')}")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'upload':
                name = sys.argv[4] if len(sys.argv) > 4 else None
                result = drive_upload(sys.argv[3], name)
                print(f"✅ Uploaded! File ID: {result.get('id')}")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'folder':
                parent = sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].isdigit() else None
                name_idx = 3 if not parent else 4
                if len(sys.argv) > name_idx:
                    result = drive_create_folder(sys.argv[name_idx], parent)
                    print(f"✅ Created folder! ID: {result.get('id')}")
        
        elif cmd == 'sheets':
            if len(sys.argv) >= 5 and sys.argv[2] == 'read':
                values = sheets_read(sys.argv[3], sys.argv[4])
                print(json.dumps(values))
            elif len(sys.argv) >= 5 and sys.argv[2] == 'write':
                values = json.loads(sys.argv[5])
                result = sheets_write(sys.argv[3], sys.argv[4], values)
                print(f"✅ Wrote! Cells updated: {result.get('updatedCells')}")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'create':
                result = sheets_create(sys.argv[3])
                print(f"✅ Created! Sheet ID: {result.get('spreadsheetId')}")
        
        elif cmd == 'docs':
            if len(sys.argv) >= 3 and sys.argv[2] == 'get':
                result = docs_get(sys.argv[3])
                print(f"Title: {result.get('title')}")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'create':
                result = docs_create(sys.argv[3])
                print(f"✅ Created! Doc ID: {result.get('documentId')}")
        
        elif cmd == 'slides':
            if len(sys.argv) >= 3 and sys.argv[2] == 'list':
                slides = slides_list()
                for s in slides:
                    print(f"🎬 {s.get('title')} ({s.get('presentationId')})")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'get':
                result = slides_get(sys.argv[3])
                print(f"Title: {result.get('title')}, Slides: {len(result.get('slides', []))}")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'create':
                result = slides_create(sys.argv[3])
                print(f"✅ Created! ID: {result.get('presentationId')}")
        
        elif cmd == 'forms':
            if len(sys.argv) >= 3 and sys.argv[2] == 'list':
                forms = forms_list()
                for f in forms:
                    print(f"📋 {f.get('title')} ({f.get('formId')})")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'get':
                result = forms_get(sys.argv[3])
                print(f"Title: {result.get('info', {}).get('title')}")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'responses':
                responses = forms_responses(sys.argv[3])
                print(f"Responses: {len(responses)}")
                for r in responses[:3]:
                    print(f"  - {r.get('createTime')}")
            elif len(sys.argv) >= 3 and sys.argv[2] == 'create':
                result = forms_create(sys.argv[3])
                print(f"✅ Created! Form ID: {result.get('formId')}")
        
        elif cmd == 'contacts':
            contacts = contacts_list()
            for c in contacts[:10]:
                name = c.get('names', [{}])[0].get('displayName', 'Unknown')
                emails = [e.get('value') for e in c.get('emailAddresses', [])]
                print(f"👤 {name}: {', '.join(emails)}")
        
        else:
            print("Unknown command or missing args")
    
    except Exception as e:
        print(f"❌ Error: {e}")
