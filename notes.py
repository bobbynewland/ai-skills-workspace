#!/usr/bin/env python3
"""Brain Dump Notes - Read/write notes from Google Docs"""
import sys
import json
from google_workspace import get_creds, docs_get

NOTES_FILE = '/root/.openclaw/workspace/.notes_doc.json'

def read_notes():
    """Read current notes"""
    with open(NOTES_FILE, 'r') as f:
        config = json.load(f)
    
    creds, email = get_creds()
    doc = docs_get(config['doc_id'])
    
    print(f"\n📝 BRAIN DUMP NOTES")
    print(f"   {config['url']}\n")
    print("-" * 50)
    
    # Extract text from doc content
    content = doc.get('body', {}).get('content', [])
    text = ""
    for element in content:
        if 'paragraph' in element:
            for p in element['paragraph'].get('elements', []):
                text += p.get('textRun', {}).get('content', '')
    
    print(text if text.strip() else "(Empty - start dumping your thoughts!)")
    print("-" * 50)
    
    return doc

def append_note(text):
    """Append a note to the doc using Drive API"""
    from google_workspace import refresh_if_needed, build
    
    with open(NOTES_FILE, 'r') as f:
        config = json.load(f)
    
    creds, email = get_creds()
    creds = refresh_if_needed(creds)
    
    service = build('drive', 'v3', credentials=creds)
    
    # Append text to document
    # Get current content length
    doc = docs_get(config['doc_id'])
    end_index = doc.get('body', {}).get('endIndex', 1)
    
    requests = [{
        'insertText': {
            'location': {'index': end_index - 1},
            'text': f"\n{text}\n"
        }
    }]
    
    result = service.documents().batchUpdate(
        documentId=config['doc_id'],
        body={'requests': requests}
    ).execute()
    
    print(f"✅ Added note: {text[:50]}...")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'read':
            read_notes()
        elif sys.argv[1] == 'add' and len(sys.argv) > 2:
            append_note(' '.join(sys.argv[2:]))
        else:
            print("Usage: python3 notes.py [read|add <text>]")
    else:
        read_notes()
