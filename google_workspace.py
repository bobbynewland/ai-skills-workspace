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
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/contacts.other.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.settings.basic',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.settings.sharing',
    'https://www.googleapis.com/auth/directory.readonly',
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/drive',
    'openid',
]

def get_creds():
    """Load credentials from token file"""
    if not os.path.exists(TOKEN_FILE):
        raise Exception(f"Token file not found: {TOKEN_FILE}")
    
    with open(TOKEN_FILE, 'r') as f:
        data = json.load(f)
    
    accounts = data.get('accounts', {})
    if not accounts:
        raise Exception("No accounts found in token file")
        
    email = list(accounts.keys())[0]
    account_data = accounts[email]
    
    # Load client credentials
    if not os.path.exists(CREDS_FILE):
         raise Exception(f"Creds file not found: {CREDS_FILE}")

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
    if creds.expired or not creds.valid:
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

def drive_list(query=None, max_results=100):
    """List Drive files"""
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    
    fields = 'files(id,name,mimeType,modifiedTime,webViewLink,parents,size)'
    
    if query:
        results = service.files().list(q=query, pageSize=max_results, fields=fields).execute()
    else:
        results = service.files().list(pageSize=max_results, fields=fields).execute()
    
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

# ============ MAIN ============

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 google_workspace.py <command> [args]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    try:
        if cmd == 'drive' and len(sys.argv) >= 3:
            subcmd = sys.argv[2]
            if subcmd == 'list':
                query = sys.argv[3] if len(sys.argv) > 3 else None
                files = drive_list(query)
                # Map parents list to parentId for frontend compatibility
                for f in files:
                    if 'parents' in f and f['parents']:
                        f['parentId'] = f['parents'][0]
                print(json.dumps(files))
        else:
            print("Unknown command")
    except Exception as e:
        print(f"❌ Error: {e}")
