#!/usr/bin/env python3
"""
🏆 COMMAND BOARD - Task Management Integration
Full admin access to Firebase Command Board
"""
import os
import json
import sys
from datetime import datetime

# Firebase setup
import firebase_admin
from firebase_admin import credentials, db

FIREBASE_CREDS = '/root/.openclaw/workspace/.keys/firebase.json'
WORKSPACE = 'winslow_main'

# Initialize Firebase
cred = credentials.Certificate(FIREBASE_CREDS)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://winslow-756c3-default-rtdb.firebaseio.com'
})

ref = db.reference(f'/workspaces/{WORKSPACE}')

# ============== TASKS ==============

def cmd_tasks(column=None):
    """List tasks by column (todo, doing, done, etc.)"""
    print(f"\n📋 TASKS")
    print("="*50)
    
    if column:
        tasks = ref.child('tasks').order_by_child('column').equal_to(column).get()
    else:
        tasks = ref.child('tasks').get()
    
    if not tasks:
        print("  No tasks found")
        return
    
    # Group by column
    columns = {}
    for tid, task in tasks.items():
        col = task.get('column', 'unknown')
        if col not in columns:
            columns[col] = []
        columns[col].append((tid, task))
    
    for col_name in ['todo', 'doing', 'done', 'backlog']:
        if col_name in columns:
            icon = {'todo': '📥', 'doing': '🔄', 'done': '✅', 'backlog': '📦'}.get(col_name, '📌')
            print(f"\n{icon} {col_name.upper()}")
            for tid, task in columns[col_name]:
                priority = task.get('priority', 'medium')
                prio_icon = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}.get(priority, '⚪')
                print(f"  {prio_icon} {task.get('title', 'Untitled')}")
                if task.get('description'):
                    desc = task.get('description', '')[:60]
                    print(f"      └─ {desc}...")

def cmd_add(title, description, column='todo', priority='medium', tags=None):
    """Add a new task"""
    tags = tags or []
    
    task_data = {
        'title': title,
        'description': description,
        'column': column,
        'priority': priority,
        'tags': tags,
        'createdAt': int(datetime.now().timestamp() * 1000),
        'assignedTo': None
    }
    
    new_task = ref.child('tasks').push(task_data)
    print(f"✅ Added task: {title}")
    print(f"   ID: {new_task.key}")
    return new_task.key

def cmd_move(task_id, column):
    """Move task to another column"""
    ref.child('tasks').child(task_id).update({'column': column})
    print(f"✅ Moved {task_id} → {column}")

def cmd_update(task_id, field, value):
    """Update task field"""
    ref.child('tasks').child(task_id).update({field: value})
    print(f"✅ Updated {task_id}.{field} = {value}")

def cmd_delete(task_id):
    """Delete a task"""
    ref.child('tasks').child(task_id).delete()
    print(f"🗑️  Deleted {task_id}")

def cmd_clear(column):
    """Clear all tasks in a column"""
    tasks = ref.child('tasks').get()
    count = 0
    for tid, task in tasks.items():
        if task.get('column') == column:
            ref.child('tasks').child(tid).delete()
            count += 1
    print(f"🗑️  Cleared {count} tasks from {column}")

# ============== TABS ==============

def cmd_tabs():
    """List all tabs"""
    print(f"\n🏆 COMMAND BOARD TABS")
    print("="*50)
    
    tabs = ref.child('tabs').get()
    if tabs:
        for tab_id, tab in tabs.items():
            icon = tab.get('icon', '📁')
            print(f"  {icon} {tab.get('name', tab_id)}")
    else:
        print("  No custom tabs")

def cmd_tab_add(name, icon='📁', columns=None):
    """Add a new tab"""
    columns = columns or ['todo', 'doing', 'done']
    ref.child('tabs').push({
        'name': name,
        'icon': icon,
        'columns': columns
    })
    print(f"✅ Added tab: {icon} {name}")

# ============== STATS ==============

def cmd_stats():
    """Show task statistics"""
    print(f"\n📊 TASK STATS")
    print("="*50)
    
    tasks = ref.child('tasks').get()
    if not tasks:
        print("  No tasks")
        return
    
    total = len(tasks)
    by_col = {}
    by_prio = {}
    
    for tid, task in tasks.items():
        col = task.get('column', 'unknown')
        prio = task.get('priority', 'medium')
        by_col[col] = by_col.get(col, 0) + 1
        by_prio[prio] = by_prio.get(prio, 0) + 1
    
    print(f"  Total: {total}")
    print(f"\n  By Column:")
    for col, count in sorted(by_col.items()):
        print(f"    📌 {col}: {count}")
    
    print(f"\n  By Priority:")
    for prio, count in sorted(by_prio.items()):
        icon = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}.get(prio, '⚪')
        print(f"    {icon} {prio}: {count}")

# ============== SYNC ==============

def cmd_sync():
    """Sync command board to/from other systems"""
    print(f"\n🔄 SYNCING...")
    
    # Sync with Brain Dump
    from google_workspace import get_creds, docs_get
    import json
    
    try:
        with open('/root/.openclaw/workspace/.notes_doc.json', 'r') as f:
            notes_config = json.load(f)
        
        doc = docs_get(notes_config['doc_id'])
        print(f"  ✅ Brain Dump connected")
    except Exception as e:
        print(f"  ⚠️  Brain Dump: {e}")
    
    # Sync with Drive
    try:
        from google_workspace import drive_list
        files = drive_list(max_results=5)
        print(f"  ✅ Drive connected ({len(files)} files)")
    except Exception as e:
        print(f"  ⚠️  Drive: {e}")
    
    print(f"  ✅ Command Board: Connected")
    print(f"\n🔄 Sync complete!")

# ============== MAIN ==============

def main():
    if len(sys.argv) < 2:
        print("""
🏆 COMMAND BOARD
================

📋 TASKS
  tasks              List all tasks
  tasks todo         List todo tasks
  tasks doing        List doing tasks
  tasks done         List done tasks
  add <title> <desc> [col] [prio]    Add task
  move <id> <col>    Move task
  update <id> <f> <v>  Update field
  delete <id>        Delete task
  clear <col>        Clear column

📊 STATS
  stats              Show task statistics

🏷️ TABS
  tabs               List tabs
  tab add <name> <icon>  Add tab

🔄 SYNC
  sync               Sync with other systems

💡 EXAMPLES
  python3 command_board.py tasks
  python3 command_board.py add "Launch TikTok" "Post first video" todo high
  python3 command_board.py stats
""")
        return
    
    cmd = sys.argv[1].lower()
    args = sys.argv[2:]
    
    try:
        if cmd == 'tasks':
            cmd_tasks(args[0] if args else None)
        
        elif cmd == 'add':
            title = args[0]
            description = args[1] if len(args) > 1 else ''
            column = args[2] if len(args) > 2 else 'todo'
            priority = args[3] if len(args) > 3 else 'medium'
            cmd_add(title, description, column, priority)
        
        elif cmd == 'move':
            cmd_move(args[0], args[1])
        
        elif cmd == 'update':
            cmd_update(args[0], args[1], args[2])
        
        elif cmd == 'delete':
            cmd_delete(args[0])
        
        elif cmd == 'clear':
            cmd_clear(args[0])
        
        elif cmd == 'tabs':
            cmd_tabs()
        
        elif cmd == 'tab':
            if args[0] == 'add':
                cmd_tab_add(args[1], args[2] if len(args) > 2 else '📁')
        
        elif cmd == 'stats':
            cmd_stats()
        
        elif cmd == 'sync':
            cmd_sync()
        
        else:
            print(f"❌ Unknown command: {cmd}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
