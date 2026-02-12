# MiniMax Vision Skill

Use for image analysis and web search — MiniMax's native vision and search capabilities.

## When to Use
- Analyzing images you share or link
- Searching the web for current info
- Understanding screenshots, photos, or diagrams
- "what's in this image?" or "search for..."

## Tools
- **understand_image**: Analyzes images via MiniMax vision API
- **web_search**: Searches the web via MiniMax

## Examples

**Analyze an image:**
```
> Send me an image URL and ask "what's in this?"

understand_image "Describe what's in this image" --image https://example.com/photo.jpg
```

**Search the web:**
```
web_search "latest AI tools 2026"
```

## Setup
Requires MiniMax API key in `~/.openclaw/workspace/.keys/minimax.key`
