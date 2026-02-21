#!/bin/bash
# Cron wrapper for custom workflow - runs every 5 minutes
# Add to crontab: */5 * * * * /root/.openclaw/workspace/custom-workflows/cron.sh

cd /root/.openclaw/workspace/custom-workflows

# Check for any pending runs that aren't progressing
python3 -c "
import sqlite3
import os
from datetime import datetime

DB = '/root/.openclaw/workspace/custom-workflows.db'

if not os.path.exists(DB):
    print('No workflow DB')
    exit(0)

conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Find running workflows with old updates (>10 min)
old_runs = cur.execute('''
    SELECT * FROM runs 
    WHERE status = 'running' 
    AND updated_at < ?
''', (int(datetime.now().timestamp() * 1000) - 600000,)).fetchall()

for run in old_runs:
    # Check if any step is actually running
    running = cur.execute('''
        SELECT COUNT(*) as c FROM steps 
        WHERE run_id = ? AND status = 'running'
    ''', (run['id'],)).fetchone()
    
    if running['c'] == 0:
        # No active step, might be stuck - restart
        print(f'Restarting stuck workflow: {run[\"id\"]}')
        
        # Reset pending steps
        cur.execute('''
            UPDATE steps SET status = 'pending' 
            WHERE run_id = ? AND status IN ('running', 'failed')
        ''', (run['id'],))
        conn.commit()

conn.close()
print('Cron check complete')
"
