#!/usr/bin/env python3
"""
Custom Workflow Engine v2 - Simple & Reliable
Uses direct API calls, syncs to Firebase for tracking
"""
import json
import time
import uuid
import sqlite3
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# ============================================================================
# CONFIG
DB_PATH = "/root/.openclaw/workspace/custom-workflows-v2.db"
FIREBASE_URL = "https://winslow-756c3-default-rtdb.firebaseio.com/workflows"

# ============================================================================
# DATABASE
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS runs (
            id TEXT PRIMARY KEY,
            workflow TEXT,
            task TEXT,
            status TEXT DEFAULT 'pending',
            result TEXT,
            created_at INTEGER,
            updated_at INTEGER
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS steps (
            id TEXT PRIMARY KEY,
            run_id TEXT,
            agent TEXT,
            status TEXT DEFAULT 'pending',
            input TEXT,
            output TEXT,
            created_at INTEGER,
            FOREIGN KEY (run_id) REFERENCES runs(id)
        )
    """)
    conn.commit()
    conn.close()

# ============================================================================
# FIREBASE SYNC
def sync_to_firebase(run_id):
    """Sync workflow status to Firebase for real-time tracking"""
    try:
        import urllib.request
        conn = get_db()
        run = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
        steps = conn.execute("SELECT * FROM steps WHERE run_id = ?", (run_id,)).fetchall()
        conn.close()
        
        if not run:
            return
        
        data = {
            "id": run["id"],
            "workflow": run["workflow"],
            "task": run["task"],
            "status": run["status"],
            "result": run["result"],
            "updated": run["updated_at"],
            "steps": {s["agent"]: s["status"] for s in steps}
        }
        
        req = urllib.request.Request(
            f"{FIREBASE_URL}/{run_id}.json",
            data=json.dumps(data).encode(),
            headers={"Content-Type": "application/json"},
            method="PUT"
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"Firebase sync error: {e}")

def clear_firebase():
    """Clear old workflows from Firebase"""
    try:
        import urllib.request
        req = urllib.request.Request(f"{FIREBASE_URL}.json", method="DELETE")
        urllib.request.urlopen(req, timeout=5)
    except:
        pass

# ============================================================================
# AI CALLS - Kimi with delay between calls

def run_ai(prompt, max_retries=3):
    """Use Kimi worker with retry logic"""
    import subprocess
    for attempt in range(max_retries):
        try:
            proc = subprocess.Popen(
                ["python3", "/root/.openclaw/workspace/kimi-worker.py", "--key", "1", prompt],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            stdout, stderr = proc.communicate(timeout=90)
            
            if proc.returncode == 0:
                import json
                data = json.loads(stdout)
                if data.get("status") == "success":
                    return data.get("content", "")
                else:
                    print(f"Kimi error (attempt {attempt+1}): {data}")
            else:
                print(f"Kimi failed (attempt {attempt+1}): returncode={proc.returncode}")
        except subprocess.TimeoutExpired:
            print(f"AI call timed out (attempt {attempt+1})")
        except Exception as e:
            print(f"AI call error (attempt {attempt+1}): {e}")
        
        if attempt < max_retries - 1:
            print(f"Retrying in 5 seconds...")
            time.sleep(5)
    
    return None

# ============================================================================
# WORKFLOW EXECUTION
STEPS = ["analyze", "plan", "implement", "verify", "test"]

def create_run(workflow, task):
    """Create a new workflow run"""
    run_id = uuid.uuid4().hex[:8]
    now = int(time.time() * 1000)
    
    conn = get_db()
    conn.execute(
        "INSERT INTO runs (id, workflow, task, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        (run_id, workflow, task, "running", now, now)
    )
    
    # Create steps
    for i, agent in enumerate(STEPS):
        step_id = f"{run_id}-{agent}"
        conn.execute(
            "INSERT INTO steps (id, run_id, agent, status, input, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (step_id, run_id, agent, "pending", f"Execute {agent} step", now + i)
        )
    
    conn.commit()
    conn.close()
    
    sync_to_firebase(run_id)
    return run_id

def execute_step(run_id, step_name):
    """Execute a single step"""
    step_id = f"{run_id}-{step_name}"
    
    # Get task
    conn = get_db()
    run = conn.execute("SELECT task FROM runs WHERE id = ?", (run_id,)).fetchone()
    task = run["task"] if run else "No task"
    
    # Update step to running
    now = int(time.time() * 1000)
    conn.execute("UPDATE steps SET status = 'running', output = NULL WHERE id = ?", (step_id,))
    conn.execute("UPDATE runs SET updated_at = ? WHERE id = ?", (now, run_id))
    conn.commit()
    conn.close()
    sync_to_firebase(run_id)
    
    # Build prompt based on step
    prompts = {
        "analyze": f"Analyze this task and provide requirements: {task}",
        "plan": f"Create a simple implementation plan for: {task}",
        "implement": f"Write the code/implementation for: {task}",
        "verify": f"Verify this implementation: {task}",
        "test": f"Suggest tests for: {task}"
    }
    
    prompt = prompts.get(step_name, f"Complete step {step_name} for: {task}")
    
    # Run AI
    result = run_ai(prompt)
    
    # Update step
    conn = get_db()
    if result:
        conn.execute("UPDATE steps SET status = 'completed', output = ? WHERE id = ?", 
                    (result[:5000] if result else "", step_id))
        print(f"  ✅ {step_name}: completed")
    else:
        conn.execute("UPDATE steps SET status = 'failed', output = 'AI call failed' WHERE id = ?", (step_id,))
        print(f"  ❌ {step_name}: failed")
    
    conn.execute("UPDATE runs SET updated_at = ? WHERE id = ?", (int(time.time() * 1000), run_id))
    conn.commit()
    conn.close()
    sync_to_firebase(run_id)
    
    return result is not None

def run_workflow(run_id):
    """Run all steps in sequence"""
    print(f"🚀 Starting workflow {run_id}")
    
    for step in STEPS:
        success = execute_step(run_id, step)
        if not success:
            # Mark failed
            conn = get_db()
            conn.execute("UPDATE runs SET status = 'failed' WHERE id = ?", (run_id,))
            conn.commit()
            conn.close()
            sync_to_firebase(run_id)
            print(f"❌ Workflow {run_id} failed at {step}")
            return
    
    # All steps complete
    conn = get_db()
    conn.execute("UPDATE runs SET status = 'completed', updated_at = ? WHERE id = ?", 
                 (int(time.time() * 1000), run_id))
    conn.commit()
    conn.close()
    sync_to_firebase(run_id)
    print(f"✅ Workflow {run_id} complete!")

# ============================================================================
# API SERVER
class WorkflowHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        
        path = self.path
        
        if path == "/api/runs" or path.startswith("/api/runs?"):
            conn = get_db()
            runs = conn.execute("SELECT * FROM runs ORDER BY created_at DESC").fetchall()
            conn.close()
            self.wfile.write(json.dumps({"runs": [dict(r) for r in runs]}).encode())
            
        elif path.startswith("/api/run?id="):
            run_id = path.split("id=")[1].split("&")[0]
            conn = get_db()
            run = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
            steps = conn.execute("SELECT * FROM steps WHERE run_id = ?", (run_id,)).fetchall()
            conn.close()
            if run:
                self.wfile.write(json.dumps({"run": dict(run), "steps": [dict(s) for s in steps]}).encode())
            else:
                self.wfile.write(json.dumps({"error": "Not found"}).encode())
                
        elif path.startswith("/api/workflow/run"):
            query = parse_qs(urlparse(path).query)
            task = query.get("task", [""])[0]
            workflow = query.get("workflow", ["default"])[0]
            
            run_id = create_run(workflow, task)
            # Run as subprocess to not block the server
            import subprocess
            subprocess.Popen(
                ["python3", __file__, "run", workflow, task],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            
            self.wfile.write(json.dumps({"status": "started", "run_id": run_id}).encode())
            
        else:
            self.wfile.write(json.dumps({"status": "ok"}).encode())
    
    def log_message(self, format, *args):
        pass  # Silent

def serve(port=3334):
    """Start the API server"""
    init_db()
    clear_firebase()
    
    server = HTTPServer(("0.0.0.0", port), WorkflowHandler)
    print(f"🚀 Workflow v2 server running on port {port}")
    server.serve_forever()

# ============================================================================
# CLI
if __name__ == "__main__":
    import sys
    import subprocess
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "serve":
            serve()
        elif sys.argv[1] == "run" and len(sys.argv) > 3:
            workflow = sys.argv[2]
            task = " ".join(sys.argv[3:])
            run_id = create_run(workflow, task)
            print(f"🚀 Started: {task}")
            print(f"📋 ID: {run_id}")
            run_workflow(run_id)
        elif sys.argv[1] == "init":
            init_db()
            print("Database initialized")
        else:
            print("Usage: workflow.py [serve|run <workflow> <task>|init]")
    else:
        serve()
