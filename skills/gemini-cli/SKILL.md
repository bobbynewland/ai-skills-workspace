---
name: gemini-cli
description: Google Gemini CLI for AI-powered coding, text generation, and workspace automation.
---

# Gemini CLI Skill

Google Gemini integration for AI coding assistant and text generation.

## Installation

```bash
# Install via npm
npm install -g @google/gemini-cli

# Or download from https://github.com/google-gemini/gemini-cli
```

## Authentication

```bash
gemini login
# Or set API key
gemini config set apiKey YOUR_API_KEY
```

## Common Commands

### Code Generation
```bash
# Generate code
gemini generate "Create a React component for a todo list"

# Explain code
gemini explain file.js

# Review code
gemini review file.js
```

### Chat Mode
```bash
# Interactive chat
gemini chat

# Single prompt
gemini ask "How do I optimize this SQL query?"
```

### File Operations
```bash
# Generate and save
gemini generate "Python script to parse JSON" --output parser.py

# Edit file
gemini edit file.js "Add error handling"
```

## Workspace Integration

**Generate Template:**
```bash
gemini generate "Create a marketing email template for product launch" --output email.html
```

**Code Review:**
```bash
gemini review /root/.openclaw/workspace/command-board.html
```

**Documentation:**
```bash
gemini generate "Write README for AI Skills Bootcamp" --output README.md
```

## API Usage

Direct API access via curl:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [{
      "parts":[{"text": "Write a function to calculate fibonacci"}]
    }]
  }'
```
