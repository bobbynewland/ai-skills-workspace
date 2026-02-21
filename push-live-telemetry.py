#!/usr/bin/env python3
import json
import os
import subprocess
import time
import urllib.request

DB_URL = "https://winslow-756c3-default-rtdb.firebaseio.com/workspaces/winslow_main/live_telemetry.json"


def run_json(cmd):
    try:
      p = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
      if p.returncode != 0:
          return {}
      return json.loads(p.stdout or "{}")
    except Exception:
      return {}


def run_text(cmd):
    try:
      p = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
      if p.returncode != 0:
          return ""
      return (p.stdout or "").strip()
    except Exception:
      return ""


def main():
    cron = run_json(["openclaw", "cron", "list", "--json"]).get("jobs", [])
    sessions = run_json(["openclaw", "sessions", "--json"]).get("sessions", [])
    minimax = run_json(["python3", "/root/.openclaw/workspace/minimax-tracker.py", "--json"])

    usepct = run_text(["bash", "-lc", "df -h / | awk 'NR==2 {print $5}'"]) or "N/A"

    enabled_jobs = [j for j in cron if j.get("enabled")]
    errors = [j for j in cron if j.get("state", {}).get("lastStatus") == "error"]

    data = {
        "ok": True,
        "source": "host-firebase-push",
        "updatedAt": int(time.time() * 1000),
        "stats": {
            "totalTasks": len(cron),
            "inProgress": len(enabled_jobs),
            "completed": len([j for j in cron if j.get("state", {}).get("lastStatus") == "ok"]),
            "errors": len(errors),
            "apiHealthPct": 100,
            "uptime": f"{int(float((run_text(['cat','/proc/uptime']).split()[0] if run_text(['cat','/proc/uptime']) else '0'))//3600)}h",
        },
        "jobs": [
            {
                "id": j.get("id"),
                "title": j.get("name") or j.get("id"),
                "status": "failed" if j.get("state", {}).get("lastStatus") == "error" else ("running" if j.get("enabled") else "queued"),
                "agent": j.get("agentId") or "main",
                "progress": 100 if j.get("enabled") else 0,
                "timestamp": "live",
            }
            for j in cron[:12]
        ],
        "agents": [
            {
                "id": 1,
                "name": "MiniMax Chief",
                "role": "Chief of Staff",
                "status": "active" if (minimax.get("requests", 0) or 0) > 0 else "idle",
                "lastActive": "Live" if (minimax.get("requests", 0) or 0) > 0 else "Idle",
                "model": "MiniMax 2.5",
                "currentJob": f"{minimax.get('requests',0)} requests in 5h" if (minimax.get("requests", 0) or 0) > 0 else None,
            },
            {
                "id": 2,
                "name": "Engineering",
                "role": "Build Team",
                "status": "active" if len(sessions) > 0 else "idle",
                "lastActive": "Live" if len(sessions) > 0 else "Idle",
                "model": (sessions[0].get("model") if sessions else "Gemini / Codex"),
                "currentJob": (f"Session: {sessions[0].get('kind','main')}" if sessions else None),
            },
            {
                "id": 3,
                "name": "Host Storage",
                "role": "Operations",
                "status": "active",
                "lastActive": "Just now",
                "model": "Linux Host",
                "currentJob": f"Disk usage {usepct}",
            },
        ],
        "apiKeys": {
            "minimax": {"used": minimax.get("requests", 0) or 0, "total": minimax.get("limit", 300) or 300, "label": "MiniMax 2.5"},
            "kimi": {"used": 0, "total": 10, "label": "Kimi Swarm"},
            "glm": {"used": 0, "total": 10, "label": "GLM Swarm"},
            "cron": {"used": len(enabled_jobs), "total": max(len(cron), 1), "label": "Cron Jobs"},
        },
        "disk": {"usePercent": usepct},
    }

    req = urllib.request.Request(
        DB_URL,
        data=json.dumps(data).encode("utf-8"),
        method="PUT",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        if resp.status != 200:
            raise RuntimeError(f"firebase write failed: {resp.status}")


if __name__ == "__main__":
    main()
