# Kimi Strategist Skill

Use for planning, architecture, and high-level design thinking.

## When to Use
- Planning new features or projects
- System architecture decisions
- Complex problem analysis
- Strategy sessions
- "Think through this..."

## Kimi K2.5 Endpoint
```
https://integrate.api.nvidia.com/v1/chat/completions
Model: moonshotai/kimi-k2.5
Rate Limit: 40 RPM (FREE)
```

## Prompt Pattern
```
You are a strategic AI architect. Think through this problem step by step:

[PASK HERE]

Provide:
1. Analysis
2. Strategic recommendations  
3. Implementation approach
4. Potential risks
5. Next steps
```

## Quick Actions

**Planning a feature:**
```bash
kimistrat "Plan a new Kanban board feature with drag-drop"
```

**Architecture review:**
```bash
kimistrat "Review the current React app architecture and suggest improvements"
```

**Risk analysis:**
```bash
kimistrat "What are the risks of using touch events for drag-drop on mobile?"
```

## Example Session

```
> kimistrat "How should we structure the Mission Control app for scaling?"

[Kimi thinks through architecture, provides detailed plan]
```

## Tips
- Kimi has thinking enabled - let it deep dive
- 16K max tokens - can handle complex analysis
- Temperature 0.1 for focused strategic thinking
- No cost impact - use liberally for planning
