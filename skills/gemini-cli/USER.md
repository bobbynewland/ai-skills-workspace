# USER.md - Model Strategy

## Command Board Access

**URL:** http://147.93.40.188:8080/command-board.html

## Model Priority Chain

### Chat (Direct Conversations)
1. **MiniMax M2.1** - Primary chat brain
2. **Gemini 1.5 Flash** - Fallback

### Coding Tasks
1. **Gemini CLI** (free tier) - First attempt
2. **Gemini API** (AI Studio) - If rate limited
3. **MiniMax M2.1** - Final fallback

### General Tasks
1. **Gemini 1.5 Flash** - Fast, efficient
2. **Gemini 1.5 Pro** - Complex tasks
3. **MiniMax M2.1** - Final fallback

## API Keys Needed

Store in: `/root/.openclaw/workspace/.keys/`
- `google_ai_studio.key` - For Gemini API access
- `vertex_ai.key` - For Vertex AI credits (optional)
