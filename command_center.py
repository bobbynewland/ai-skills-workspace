#!/usr/bin/env python3
"""
🏆 EMPIRE COMMAND CENTER
AI Skills Studio - Business Command Hub

Usage: python3 command_center.py
"""
import sys
import json
from datetime import datetime

# Import all tool modules
from google_workspace import (
    gmail_send, gmail_search, calendar_events, calendar_create_event,
    drive_list, drive_upload, sheets_read, sheets_create, docs_create,
    slides_create, forms_create, forms_responses, contacts_list
)

WORKSPACE = '/root/.openclaw/workspace'

# ============== CONFIG ==============

FIREBASE_URL = "https://winslow-756c3-default-rtdb.firebaseio.com"
WORKSPACE_TASKS = "winslow_main"

TEMPLATE_FOLDERS = {
    'template_packs': '1c2Avh-PNtg9tEpgZWpDJjE6WdqQB9Cyy',
    'media_assets': '1SKqsnfGGc1hSW0hqA-SiOXmn1SI47z-K',
    'exports': '1P5xl8qhO3yeK90m2XU_Hwp-Psw5S5D1h'
}

# ============== HELPERS ==============

def print_header(text):
    print(f"\n{'='*60}")
    print(f"🏆 {text}")
    print(f"{'='*60}")

def print_sub(text):
    print(f"\n📌 {text}")

def print_success(text):
    print(f"✅ {text}")

def print_info(text):
    print(f"ℹ️  {text}")

# ============== CORE COMMANDS ==============

def cmd_status():
    """Quick status overview"""
    print_header("EMPIRE STATUS")
    
    print_sub("📅 Today's Calendar")
    events = calendar_events(max_results=3)
    for e in events:
        print(f"  • {e.get('summary', 'Untitled')} - {e.get('start', {}).get('dateTime', 'TBD')[:10]}")
    if not events:
        print("  (No events today)")
    
    print_sub("📧 Recent Emails")
    emails = gmail_search('newer_than:1d', max_results=3)
    for e in emails:
        print(f"  • {e['snippet'][:50]}...")
    if not emails:
        print("  (No recent emails)")
    
    print_sub("💾 Recent Drive Files")
    files = drive_list(max_results=5)
    for f in files:
        icon = '📁' if 'folder' in f.get('mimeType') else '📄'
        print(f"  {icon} {f.get('name')}")
    if not files:
        print("  (No recent files)")

def cmd_brain_dump():
    """Read brain dump notes"""
    import subprocess
    result = subprocess.run(['python3', f'{WORKSPACE}/notes.py', 'read'], capture_output=True, text=True)
    print(result.stdout)

def cmd_email(subject, body, to=None):
    """Send email"""
    to = to or "bobby.newland@gmail.com"
    result = gmail_send(to, subject, body)
    print_success(f"Email sent to {to}")

def cmd_calendar(days=7):
    """Show calendar events"""
    print_header(f"📅 NEXT {days} DAYS")
    events = calendar_events(max_results=days)
    for e in events:
        time = e.get('start', {}).get('dateTime', 'TBD')[:16].replace('T', ' ')
        print(f"  📅 {time} | {e.get('summary', 'Untitled')}")

def cmd_drive(query=None):
    """List Drive files"""
    print_header("💾 DRIVE FILES")
    files = drive_list(query, max_results=20)
    for f in files:
        icon = '📁' if 'folder' in f.get('mimeType') else '📄'
        print(f"  {icon} {f.get('name')}")

def cmd_drive_upload(filename):
    """Upload file to Drive"""
    folder = TEMPLATE_FOLDERS.get('exports')  # default to exports
    result = drive_upload(filename, None, folder)
    print_success(f"Uploaded {filename}")

def cmd_templates_upload():
    """Upload all templates to Drive"""
    import subprocess
    print("📤 Uploading templates to Drive...")
    subprocess.run(['python3', f'{WORKSPACE}/upload_templates.py'], check=True)
    print_success("Templates uploaded!")

def cmd_templates_public():
    """Make templates public and get links"""
    import subprocess
    print("🔗 Making templates public...")
    subprocess.run(['python3', f'{WORKSPACE}/make_public.py'], check=True)
    print_success("Templates are now public!")

def cmd_sheets_list():
    """List recent Sheets"""
    print_header("📊 SHEETS")
    files = drive_list("mimeType='application/vnd.google-apps.spreadsheet'", max_results=10)
    for f in files:
        print(f"  📊 {f.get('name')} (https://docs.google.com/spreadsheets/d/{f.get('id')})")

def cmd_sheets_create(title):
    """Create new Sheet"""
    result = sheets_create(title)
    print_success(f"Created: https://docs.google.com/spreadsheets/d/{result.get('spreadsheetId')}/edit")

def cmd_docs_list():
    """List recent Docs"""
    print_header("📝 DOCS")
    files = drive_list("mimeType='application/vnd.google-apps.document'", max_results=10)
    for f in files:
        print(f"  📝 {f.get('name')} (https://docs.google.com/document/d/{f.get('id')}/edit)")

def cmd_docs_create(title):
    """Create new Doc"""
    result = docs_create(title)
    print_success(f"Created: https://docs.google.com/document/d/{result.get('documentId')}/edit")

def cmd_slides_create(title):
    """Create new Presentation"""
    result = slides_create(title)
    print_success(f"Created: https://docs.google.com/presentation/d/{result.get('presentationId')}/edit")

def cmd_forms_list():
    """List forms"""
    print_header("📋 FORMS")
    files = drive_list("mimeType='application/vnd.google-apps.form'", max_results=10)
    for f in files:
        print(f"  📋 {f.get('name')} (https://docs.google.com/forms/d/{f.get('id')}/viewform)")

def cmd_forms_create(title):
    """Create new Form"""
    result = forms_create(title)
    print_success(f"Created: https://docs.google.com/forms/d/{result.get('formId')}/viewform")

def cmd_contacts():
    """List contacts"""
    print_header("👥 CONTACTS")
    contacts = contacts_list(max_results=20)
    for c in contacts:
        name = c.get('names', [{}])[0].get('displayName', 'Unknown')
        emails = [e.get('value') for e in c.get('emailAddresses', [])]
        print(f"  👤 {name}: {', '.join(emails[:2])}")

def cmd_backup():
    """Full backup routine"""
    print_header("💾 RUNNING FULL BACKUP")
    
    print_info("1. Syncing templates to Drive...")
    cmd_templates_upload()
    
    print_info("2. Pushing to GitHub...")
    import subprocess
    subprocess.run(['git', 'add', '-A'], cwd=WORKSPACE)
    subprocess.run(['git', 'commit', '-m', 'Auto-backup'], cwd=WORKSPACE)
    subprocess.run(['git', 'push', 'origin', 'main'], cwd=WORKSPACE)
    
    print_success("Backup complete!")

def cmd_git_status():
    """Git status"""
    print_header("📊 GIT STATUS")
    import subprocess
    result = subprocess.run(['git', 'status', '--short'], cwd=WORKSPACE, capture_output=True, text=True)
    print(result.stdout if result.stdout else "  Working tree clean")
    
    result = subprocess.run(['git', 'log', '--oneline', '-5'], cwd=WORKSPACE, capture_output=True, text=True)
    print("Recent commits:")
    print(result.stdout)

# ============== COMMAND BOARD ==============

def cmd_board(args=None):
    """Command Board - Task Management"""
    import subprocess
    cmd = ['python3', f'{WORKSPACE}/command_board.py']
    if args:
        cmd.extend(args)
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr)

def cmd_help():
    """Show all commands"""
    print("""
🏆 EMPIRE COMMAND CENTER
========================

📊 STATUS & OVERVIEW
  status              Quick overview of empire
  brain_dump          Read brain dump notes

📧 EMAIL
  email <subj> <body> [to]    Send email

📅 CALENDAR
  calendar [days]     Show upcoming events

💾 DRIVE
  drive [query]      List Drive files
  upload <filename>  Upload file to Drive
  templates          Upload templates to Drive
  public             Make templates public

📊 SHEETS
  sheets_list        List Sheets
  sheets <title>     Create new Sheet

📝 DOCS
  docs_list          List Docs
  docs <title>       Create new Doc

🎬 SLIDES
  slides <title>    Create presentation

📋 FORMS
  forms_list        List Forms
  forms <title>     Create new Form

👥 CONTACTS
  contacts          List contacts

🏆 COMMAND BOARD
  board            List all tasks
  board todo       Todo tasks only
  board doing      Doing tasks
  board done       Done tasks
  board add <title> <desc> [col] [prio]  Add task
  board stats      Task statistics

🔧 SYSTEM
  backup            Full backup routine
  git               Git status & recent commits
  help              Show this help

💡 EXAMPLES
  python3 command_center.py status
  python3 command_center.py email "Quick Update" "Meeting at 3pm"
  python3 command_center.py calendar 7
  python3 command_center.py docs "Meeting Notes"
  python3 command_center.py backup
""")

# ============== MAIN ==============

def main():
    if len(sys.argv) < 2:
        cmd_status()
        print("\n💡 Run 'python3 command_center.py help' for all commands")
        return
    
    cmd = sys.argv[1].lower()
    args = sys.argv[2:]
    
    commands = {
        'status': cmd_status,
        'brain_dump': cmd_brain_dump,
        'email': lambda: cmd_email(args[0], args[1], args[2] if len(args) > 2 else None),
        'calendar': lambda: cmd_calendar(int(args[0]) if args else 7),
        'drive': lambda: cmd_drive(args[0] if args else None),
        'upload': lambda: cmd_drive_upload(args[0]),
        'templates': cmd_templates_upload,
        'public': cmd_templates_public,
        'sheets_list': cmd_sheets_list,
        'sheets': lambda: cmd_sheets_create(args[0]),
        'docs_list': cmd_docs_list,
        'docs': lambda: cmd_docs_create(args[0]),
        'slides': lambda: cmd_slides_create(args[0]),
        'forms_list': cmd_forms_list,
        'forms': lambda: cmd_forms_create(args[0]),
        'contacts': cmd_contacts,
        'backup': cmd_backup,
        'board': lambda: cmd_board(args),
        'git': cmd_git_status,
        'help': cmd_help,
        '--help': cmd_help,
        '-h': cmd_help,
    }
    
    if cmd in commands:
        try:
            commands[cmd]()
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"❌ Unknown command: {cmd}")
        print("💡 Run 'python3 command_center.py help' for all commands")

if __name__ == "__main__":
    main()
