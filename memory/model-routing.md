# Model Routing Strategy - Updated 2026-02-06

## STRICT ROUTING RULES

**Kimi (moonshot/kimi-k2.5) - CHAT ONLY**
- Use ONLY for direct conversation/chat responses
- NO file operations
- NO code execution
- NO system commands

**Gemini Flash (vertex/gemini-3-flash-preview) - LIGHT TASKS**
- File operations (move, copy, organize)
- Git commands (status, add, commit, push)
- Notes and summaries
- Light system tasks
- Cron job execution

**Gemini 2.5 Pro (google/gemini-2.5-pro) - CODING**
- Code generation
- Code review
- Debugging
- Technical implementation

**Gemini 3 Pro (vertex/gemini-3-pro-preview) - COMPLEX**
- Complex analysis
- Research synthesis
- Strategic planning
- Multi-step reasoning tasks

## SPAWN RULES
- If task is NOT pure chat → SPAWN sub-agent
- Always specify model in spawn
- Use "thinking: off" for light tasks
- Use "thinking: high" for complex tasks

Last updated: 2026-02-06 21:01 UTC