# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

## MiniMax Usage Tracking
- Check MiniMax usage every hour via cron job
- Command: python3 /root/.openclaw/workspace/minimax-tracker.py
- Alert if approaching 300 prompts/5hr limit
- Threshold: Alert at 250+ prompts (50 remaining)
