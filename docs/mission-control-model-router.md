# Mission Control — Model Router Matrix

Updated: 2026-02-17 (UTC)

## Objective
Ship continuously without hitting provider limits by routing work to the right model lane, with explicit failover.

## Primary Routing Order
1. **gemini-3.0-pro** (Antigravity) — default coding + architecture
2. **claude-sonnet / claude-opus** (Antigravity) — hard debugging, deep reasoning
3. **minimax** — overflow coding, repetitive implementation, bulk edits
4. **Kimi Swarm** — parallel research/spec ideation/test scenarios

---

## Lane Matrix (What goes where)

### Lane A — Core Product Coding
- **Tasks:** feature implementation, refactors, API integrations, DB schema updates
- **Primary:** gemini-3.0-pro
- **Fallback 1:** claude-sonnet
- **Fallback 2:** minimax
- **Done format:** diff summary + changed files + test status + next step

### Lane B — Debugging / Root-Cause
- **Tasks:** hard bugs, race conditions, state-sync issues, incident triage
- **Primary:** claude-opus
- **Fallback 1:** gemini-3.0-pro
- **Fallback 2:** minimax
- **Done format:** root cause + fix + regression test + monitoring check

### Lane C — Bulk/Low-Leverage Work
- **Tasks:** boilerplate, lint sweeps, test scaffolds, repetitive UI cleanup, copy adjustments
- **Primary:** minimax
- **Fallback 1:** gemini-3.0-flash
- **Fallback 2:** kimi swarm worker
- **Done format:** checklist completed + touched files + anything risky

### Lane D — Research / Strategy / Discovery
- **Tasks:** competitor scans, trend mining, prompt experiments, growth hypotheses
- **Primary:** kimi swarm (parallel)
- **Fallback 1:** minimax
- **Fallback 2:** claude-opus
- **Done format:** top findings + confidence + recommended action

### Lane E — Release Validation
- **Tasks:** preflight QA, smoke tests, deploy notes, rollback plan
- **Primary:** gemini-3.0-pro
- **Fallback 1:** claude-sonnet
- **Fallback 2:** minimax
- **Done format:** pass/fail grid + blockers + ship/no-ship

---

## Switch Triggers (If/Then)

### Provider Pressure Triggers
- If Antigravity usage is constrained or erroring → route new non-critical coding to **minimax**.
- If minimax is approaching cap (>=250/300 prompts per 5h) → reserve minimax for urgent tasks and shift research to **kimi swarm**.
- If one lane is blocked >15 minutes → auto-reassign to next fallback model.

### Task-Complexity Triggers
- If task requires multi-file architecture decisions → **gemini-3.0-pro** or **claude-opus**.
- If task is repetitive or mechanical → **minimax** first.
- If task can be parallelized into independent questions → **kimi swarm** fan-out.

### Quality Triggers
- If two failed attempts on same bug in same model → escalate to next model tier immediately.
- If fix touches auth/billing/data integrity → mandatory second-pass review in a different model lane.

---

## Session/Context Rules

- Keep main chat for approvals and decisions.
- Execute implementation in sub-agents.
- Every sub-agent completion must return:
  1) Summary of work
  2) Files changed
  3) Validation/tests
  4) Exact next step

### 85% Context Rollover
- At ~85% context usage:
  - Write/overwrite `/root/.openclaw/workspace/memory/session-handoff.md`
  - Include: objective, decisions, done, open tasks, exact next step
  - Start fresh session and load handoff first

---

## Daily Operating Rhythm
- **Morning (build-critical):** Gemini/Claude for high-leverage coding and architectural choices
- **Afternoon (throughput):** MiniMax for bulk implementation and cleanups
- **Background all day:** Kimi swarm for research, test ideas, and opportunity scans
- **End of day:** release validation lane + handoff update if needed

---

## Mission Control Cleanup (Immediate Execution)

1. **UI debt sweep (MiniMax lane)**
   - standardize spacing/typography/components
   - remove dead UI states and stale feature flags

2. **Sync/data bugs (Claude/Gemini lane)**
   - audit state sync flows
   - patch data integrity edge cases
   - add regression tests

3. **Performance pass (Gemini lane)**
   - trim heavy renders
   - reduce network chatter
   - optimize critical interactions

4. **Growth loop (Kimi lane)**
   - generate 10 weekly experiments
   - score by effort/impact/confidence
   - push top 2 into build queue

---

## Non-Negotiables
- No single-model dependence.
- No long-running work in main chat.
- No deployment without release validation lane.
- Always preserve a clean handoff at context rollover.
