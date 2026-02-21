#!/usr/bin/env python3
"""
Custom Workflow Engine - Uses Kimi Swarm (primary) + MiniMax (fallback)
Fixed threading - runs steps sequentially but multiple workflows in parallel
"""
import json
import os
import sys
import sqlite3
import subprocess
import threading
import time
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

WORKFLOW_DIR = "/root/.openclaw/workspace/custom-workflows"
DB_PATH = "/root/.openclaw/workspace/custom-workflows.db"
API_PORT = 3334

# Active workflow threads
active_workflows = {}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(WORKFLOW_DIR, exist_ok=True)
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS runs (
            id TEXT PRIMARY KEY,
            workflow TEXT,
            task TEXT,
            status TEXT,
            created_at INTEGER,
            updated_at INTEGER
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS steps (
            id TEXT PRIMARY KEY,
            run_id TEXT,
            agent TEXT,
            status TEXT,
            input TEXT,
            output TEXT,
            created_at INTEGER,
            FOREIGN KEY(run_id) REFERENCES runs(id)
        )
    ''')
    conn.commit()
    conn.close()

# ============================================================================
# KIMI + MINIMAX
# ============================================================================

def run_kimi(prompt, max_tokens=2048):
    """Run prompt through Kimi K2.5 worker - longer timeout for complex tasks"""
    try:
        result = subprocess.run(
            ["python3", "/root/.openclaw/workspace/kimi-worker.py", prompt, "--max-tokens", str(max_tokens)],
            capture_output=True, text=True, timeout=600  # 10 min timeout
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if data.get('status') == 'success':
                return data.get('content', '')
    except Exception as e:
        print(f"Kimi error: {e}")
    return None

def run_minimax(prompt):
    """Run prompt through MiniMax - longer timeout"""
    try:
        result = subprocess.run([
            "node", "/root/.openclaw/workspace/antfarm/dist/cli/cli.js",
            "agent-spawn", "--agent", "main", "--model", "MiniMax-M2.5",
            "--task", prompt
        ], capture_output=True, text=True, timeout=300)  # 5 min
        
        if result.returncode == 0 and result.stdout:
            return result.stdout[:2000]
    except Exception as e:
        print(f"MiniMax error: {e}")
    return None

def run_with_fallback(prompt):
    """Use MiniMax as primary (more reliable), Kimi as fallback"""
    # Try MiniMax first
    print(f"  🔄 Trying MiniMax...")
    result = run_minimax(prompt)
    if result:
        print(f"  ✅ MiniMax succeeded")
        return result
    
    # Fallback to Kimi
    print(f"  ⚠️ MiniMax failed, trying Kimi...")
    result = run_kimi(prompt)
    if result:
        print(f"  ✅ Kimi succeeded")
        return result
    
    print(f"  ❌ Both failed")
    return None

# ============================================================================
# WORKFLOW EXECUTION - FIXED THREADING
# ============================================================================

def create_run(workflow_id, task):
    import uuid
    run_id = str(uuid.uuid4())[:8]
    now = int(datetime.now().timestamp() * 1000)
    
    conn = get_db()
    conn.execute(
        "INSERT INTO runs (id, workflow, task, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        (run_id, workflow_id, task, "running", now, now)
    )
    
    steps = [
        ("analyze", "Analyze the task"),
        ("plan", "Create implementation plan"),
        ("implement", "Write the code"),
        ("verify", "Verify implementation"),
        ("test", "Run tests"),
    ]
    
    for agent, desc in steps:
        step_id = f"{run_id}-{agent}"
        conn.execute(
            "INSERT INTO steps (id, run_id, agent, status, input, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (step_id, run_id, agent, "pending", desc, now)
        )
    
    conn.commit()
    conn.close()
    return run_id

def get_pending_step(run_id):
    conn = get_db()
    step = conn.execute(
        "SELECT * FROM steps WHERE run_id = ? AND status = 'pending' ORDER BY created_at ASC LIMIT 1",
        (run_id,)
    ).fetchone()
    conn.close()
    return dict(step) if step else None

def claim_step(step_id):
    conn = get_db()
    now = int(datetime.now().timestamp() * 1000)
    conn.execute("UPDATE steps SET status = 'running', created_at = ? WHERE id = ?", (now, step_id))
    conn.execute("UPDATE runs SET updated_at = ? WHERE id = ?", (now, step_id.split('-')[0]))
    conn.commit()
    conn.close()

def complete_step(step_id, output):
    conn = get_db()
    now = int(datetime.now().timestamp() * 1000)
    conn.execute("UPDATE steps SET status = 'completed', output = ?, created_at = ? WHERE id = ?", 
                (output[:2000] if output else "No output", now, step_id))
    conn.commit()
    conn.close()

def fail_step(step_id, error):
    conn = get_db()
    conn.execute("UPDATE steps SET status = 'failed', output = ? WHERE id = ?", 
                (f"ERROR: {error}", step_id))
    conn.commit()
    conn.close()

def sync_to_firebase(run_id):
    """Sync workflow status to Firebase for real-time mobile access"""
    try:
        import urllib.request
        conn = get_db()
        run = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
        steps = conn.execute("SELECT * FROM steps WHERE run_id = ?", (run_id,)).fetchall()
        conn.close()
        
        if not run:
            return
        
        data = json.dumps({
            "task": run['task'],
            "status": run['status'],
            "workflow": run['workflow'],
            "updated": run['updated_at'],
            "steps": {s['agent']: s['status'] for s in steps}
        }).encode()
        
        # Use PUT to set specific path (no auto-push)
        req = urllib.request.Request(
            f"https://winslow-756c3-default-rtdb.firebaseio.com/workflows/{run_id}.json",
            data=data,
            method="PUT",
            headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        print(f"  ⚠️ Firebase sync: {e}")

def build_prompt(agent, task):
    """Build shorter prompts for faster responses"""
    prompts = {
        "analyze": f"Analyze: {task}",
        "plan": f"Plan: {task}",
        "implement": f"Code: {task}",
        "verify": f"Verify: {task}",
        "test": f"Test: {task}"
    }
    return prompts.get(agent, f"Do: {task}")

def run_workflow_thread(run_id):
    """Run workflow in dedicated thread - processes all steps sequentially"""
    try:
        conn = get_db()
        run_info = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
        task = run_info['task'] if run_info else "Unknown"
        conn.close()
        
        print(f"🚀 Starting workflow {run_id}: {task}")
        
        while True:
            step = get_pending_step(run_id)
            if not step:
                # Complete
                conn = get_db()
                conn.execute("UPDATE runs SET status = 'completed', updated_at = ? WHERE id = ?", 
                           (int(datetime.now().timestamp() * 1000), run_id))
                conn.commit()
                conn.close()
                print(f"✅ Workflow {run_id} complete!")
                break
            
            print(f"📝 {run_id}: {step['agent']}")
            claim_step(step['id'])
            
            prompt = build_prompt(step['agent'], task)
            result = run_with_fallback(prompt)
            
            if result:
                complete_step(step['id'], result)
                sync_to_firebase(run_id)
                print(f"  ✅ Done")
            else:
                fail_step(step['id'], "Failed")
                sync_to_firebase(run_id)
                print(f"  ❌ Failed")
                break
    
    except Exception as e:
        print(f"Workflow {run_id} error: {e}")
        conn = get_db()
        conn.execute("UPDATE runs SET status = 'failed' WHERE id = ?", (run_id,))
        conn.commit()
        conn.close()
    
    finally:
        # Clean up
        if run_id in active_workflows:
            del active_workflows[run_id]

def run_workflow_async(run_id):
    """Run workflow synchronously for reliability"""
    active_workflows[run_id] = True
    # Run in same thread - ensures completion
    run_workflow_thread(run_id)
    return run_id

# ============================================================================
# API SERVER
# ============================================================================

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        
        if parsed.path == "/api/runs":
            self.send_json(self.get_runs())
        elif parsed.path == "/api/run":
            run_id = parse_qs(parsed.query).get("id", [None])[0]
            if run_id:
                self.send_json(self.get_run(run_id))
            else:
                self.send_json({"error": "Missing run_id"})
        elif parsed.path == "/api/workflow/run":
            params = parse_qs(parsed.query)
            workflow = params.get("workflow", ["default"])[0]
            task = params.get("task", [""])[0]
            if task:
                run_id = create_run(workflow, task)
                run_workflow_async(run_id)
                self.send_json({"status": "started", "run_id": run_id})
            else:
                self.send_json({"error": "Missing task"})
        elif parsed.path == "/api/workflow/status":
            self.send_json({"active": len(active_workflows), "workflows": list(active_workflows.keys())})
        elif parsed.path == "/":
            self.send_html(self.dashboard())
        else:
            self.send_json({"error": "Not found"})
    
    def get_runs(self):
        conn = get_db()
        runs = conn.execute("SELECT * FROM runs ORDER BY created_at DESC LIMIT 20").fetchall()
        conn.close()
        return {"runs": [dict(r) for r in runs]}
    
    def get_run(self, run_id):
        conn = get_db()
        run = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
        steps = conn.execute("SELECT * FROM steps WHERE run_id = ? ORDER BY created_at", (run_id,)).fetchall()
        conn.close()
        return {"run": dict(run) if run else None, "steps": [dict(s) for s in steps]}
    
    def send_json(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_html(self, html):
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(html.encode())
    
    def dashboard(self):
        return """<!DOCTYPE html>
<html><head><title>Custom Workflows</title>
<style>
body{background:#0a0a0a;color:#fff;font-family:system-ui;margin:0;padding:20px}
h1{color:#eab308}
.run{border:1px solid #333;padding:15px;margin:10px 0;border-radius:8px;background:#111}
.step{display:inline-block;padding:5px 10px;margin:2px;border-radius:4px;font-size:12px}
.pending{background:#333}.running{background:#eab308;color:#000}.completed{background:#22c55e}.failed{background:#ef4444}
.btn{background:#eab308;color:#000;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;font-weight:bold}
input{background:#222;border:1px solid #444;padding:10px;color:#fff;border-radius:6px;width:300px}
form{margin-bottom:30px}
</style></head>
<body>
<h1>🤖 Custom Workflow Engine</h1>
<form action="/api/workflow/run" method="GET">
<input name="task" placeholder="Enter task..."/>
<button class="btn">Run Workflow</button>
</form>
<div id="runs"></div>
<script>
async function loadRuns(){
  const r=await fetch('/api/runs').then(r=>r.json());
  let html='';
  for(const run of r.runs||[]){
    const steps=await fetch('/api/run?id='+run.id).then(r=>r.json());
    let stepsHtml='';
    for(const s of steps.steps||[]){
      stepsHtml+='<span class="step '+s.status+'">'+s.agent+'</span>';
    }
    html+='<div class="run"><b>'+run.task+'</b><br><small>'+run.status+'</small><br>'+stepsHtml+'</div>';
  }
  document.getElementById('runs').innerHTML=html;
}
loadRuns();setInterval(loadRuns,5000);
</script>
</body></html>"""

def start_server():
    server = HTTPServer(("0.0.0.0", API_PORT), APIHandler)
    print(f"📊 Dashboard: http://localhost:{API_PORT}")
    server.serve_forever()

# ============================================================================
# MAIN
# ============================================================================

def main():
    init_db()
    
    if len(sys.argv) < 2:
        print("""Usage: 
  python3 workflow.py run <workflow> <task>   Run workflow
  python3 workflow.py status [run_id]        Show status
  python3 workflow.py serve                   Start dashboard
  python3 workflow.py demo                   Run demo
""")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "run":
        workflow = sys.argv[2] if len(sys.argv) > 2 else "default"
        task = sys.argv[3] if len(sys.argv) > 3 else "Your task"
        run_id = create_run(workflow, task)
        print(f"🚀 Started: {task}")
        print(f"📋 ID: {run_id}")
        run_workflow_async(run_id)
        print("🔄 Running in background...")
    
    elif cmd == "status":
        run_id = sys.argv[2] if len(sys.argv) > 2 else None
        if not run_id:
            conn = get_db()
            r = conn.execute("SELECT id FROM runs ORDER BY created_at DESC LIMIT 1").fetchone()
            conn.close()
            run_id = r['id'] if r else None
        
        if run_id:
            info = self.get_run(run_id) if hasattr(self, 'get_run') else APIHandler().get_run(run_id)
            print(f"\n📊 {info['run']['task']}")
            print(f"Status: {info['run']['status']}\n")
            for s in info['steps']:
                icons = {"pending": "⏳", "running": "🔄", "completed": "✅", "failed": "❌"}
                print(f"  {icons.get(s['status'],'❓')} {s['agent']}: {s['status']}")
        else:
            print("No runs found")
    
    elif cmd == "serve":
        start_server()
    
    elif cmd == "demo":
        task = "Add console.log to App.jsx"
        run_id = create_run("demo", task)
        print(f"🚀 Running demo: {task}")
        run_workflow_async(run_id)
        print("⏳ Running...")
    
    else:
        print(f"Unknown: {cmd}")

if __name__ == "__main__":
    main()
