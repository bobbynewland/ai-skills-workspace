# Codex Skill - OpenAI Code Generation

Generate and complete code using OpenAI Codex via OpenRouter.

## Setup

Codex is already configured in OpenRouter. No additional setup needed!

## Usage

```bash
# Generate code from description
python3 /root/.openclaw/workspace/skills/codex/codex_skill.py generate "Create a Python function to calculate fibonacci"

# Complete code from partial input
python3 /root/.openclaw/workspace/skills/codex/codex_skill.py complete "def fibonacci(n):"

# Explain code
python3 /root/.openclaw/workspace/skills/codex/codex_skill.py explain "def factorial(n): if n == 0: return 1"

# Fix bugs
python3 /root/.openclaw/workspace/skills/codex/codex_skill.py fix "def add(a, b) return a + b"

# Generate tests
python3 /root/.openclaw/workspace/skills/codex/codex_skill.py tests "def validate_email(email):"

# List supported languages
python3 /root/.openclaw/workspace/skills/codex/codex_skill.py languages
```

## OpenClaw Integration

Add to skills directory to use via command center.
