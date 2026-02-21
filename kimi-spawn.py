#!/usr/bin/env python3
"""
Kimi Swarm Runner - parallel task execution across NVIDIA keys.

Usage:
  python3 kimi-spawn.py run "task" [key-index]
  python3 kimi-spawn.py parallel "task1" "task2" ...
  python3 kimi-spawn.py status
"""

import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

WORKER = "/root/.openclaw/workspace/kimi-worker.py"
SCHED = "/root/.openclaw/workspace/swarm-scheduler.py"


def run_with_key(task: str, key_index: int | None = None):
    cmd = ["python3", WORKER]
    if key_index is not None:
        cmd += ["--key", str(key_index)]
    cmd += [task]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        return {
            "status": "error",
            "key_index": key_index,
            "task": task,
            "error": proc.stderr.strip() or proc.stdout.strip() or f"exit {proc.returncode}",
        }

    try:
        data = json.loads(proc.stdout)
    except Exception:
        data = {"status": "error", "error": "invalid_json", "raw": proc.stdout[:2000]}

    data["task"] = task
    if key_index is not None:
        data["key_index"] = key_index
    return data


def parallel(tasks: list[str]):
    results = []
    with ThreadPoolExecutor(max_workers=min(10, len(tasks))) as ex:
        futures = {}
        for i, task in enumerate(tasks):
            key_index = (i % 10) + 1
            fut = ex.submit(run_with_key, task, key_index)
            futures[fut] = (task, key_index)

        for fut in as_completed(futures):
            task, key_index = futures[fut]
            try:
                res = fut.result()
            except Exception as e:
                res = {"status": "error", "task": task, "key_index": key_index, "error": str(e)}
            results.append(res)
    return results


def status():
    subprocess.run(["python3", SCHED, "status"], check=False)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:\n  python3 kimi-spawn.py run \"task\" [key-index]\n  python3 kimi-spawn.py parallel \"task1\" \"task2\" ...\n  python3 kimi-spawn.py status")
        sys.exit(1)

    action = sys.argv[1]
    if action == "status":
        status()
        sys.exit(0)

    if action == "run":
        if len(sys.argv) < 3:
            print("Missing task")
            sys.exit(1)
        task = sys.argv[2]
        key = int(sys.argv[3]) if len(sys.argv) > 3 else None
        print(json.dumps(run_with_key(task, key), indent=2))
        sys.exit(0)

    if action == "parallel":
        tasks = sys.argv[2:]
        if not tasks:
            print("Provide tasks")
            sys.exit(1)
        print(json.dumps(parallel(tasks), indent=2))
        sys.exit(0)

    print(f"Unknown action: {action}")
    sys.exit(1)
