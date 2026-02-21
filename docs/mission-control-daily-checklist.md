# Mission Control — Daily Auto-Run Checklist

Updated: 2026-02-17 (UTC)

## 5-Minute Startup (AM)

### 1) Capacity check (1 min)
- [ ] Confirm Antigravity availability (Gemini/Claude)
- [ ] Confirm MiniMax headroom (watch 250/300 threshold)
- [ ] Confirm Kimi swarm available for parallel research

### 2) Queue triage (2 min)
- [ ] Classify tasks into lanes:
  - A Core Coding
  - B Debugging
  - C Bulk/Low-Leverage
  - D Research/Strategy
  - E Release Validation
- [ ] Mark top 1 critical ship item for today

### 3) Dispatch (2 min)
- [ ] Route A/E to Gemini first
- [ ] Route B to Claude Opus first
- [ ] Route C to MiniMax first
- [ ] Route D to Kimi swarm (parallel)
- [ ] Ensure implementation runs in sub-agents, not main chat

---

## Midday Throughput Pass (PM)

### 1) Blocker sweep
- [ ] Any task blocked >15 min? Re-route to fallback model immediately
- [ ] Any model failed twice on same issue? Escalate one tier

### 2) Bulk completion wave
- [ ] Push repetitive tasks to MiniMax
- [ ] Keep Gemini/Claude for high-leverage logic only
- [ ] Capture concise outputs: summary + files + tests + next step

### 3) Research feed
- [ ] Run Kimi swarm in background for:
  - competitor findings
  - test ideas
  - growth experiments
- [ ] Add top 1–2 findings into build queue

---

## End-of-Day Release Gate (EOD)

### 1) Validation lane
- [ ] Smoke tests pass
- [ ] No auth/billing/data-integrity regressions
- [ ] Rollback plan noted for any risky deploy

### 2) Ship decision
- [ ] Ship if pass grid is clean
- [ ] Hold if blocker exists
- [ ] Record blocker owner + next action

### 3) Clean handoff
- [ ] If context near 85%, overwrite:
  - `/root/.openclaw/workspace/memory/session-handoff.md`
- [ ] Include:
  1. Objective
  2. Decisions
  3. Done
  4. Open tasks
  5. Exact next step

---

## Fast Routing Rules (At a Glance)

- **Complex coding/architecture:** Gemini 3.0 Pro → Claude Sonnet/Opus → MiniMax
- **Hard debugging:** Claude Opus → Gemini 3.0 Pro → MiniMax
- **Repetitive/bulk work:** MiniMax → Gemini Flash → Kimi worker
- **Research/strategy:** Kimi swarm → MiniMax → Claude Opus

---

## Daily Definition of Done
- [ ] One high-impact item shipped or merged-ready
- [ ] One debt item reduced (UI/perf/test/ops)
- [ ] One new growth experiment queued
- [ ] Session handoff clean if rollover threshold reached
