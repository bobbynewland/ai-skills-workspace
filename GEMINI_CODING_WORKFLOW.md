# Gemini Pro Coding Workflow

Use Google's Gemini Pro for coding tasks to save on Kimi API credits.

## 💰 Cost Comparison

| Service | Model | Cost per 1K tokens |
|---------|-------|-------------------|
| **Kimi** | kimi-k2.5 | ~$0.015 |
| **Gemini Pro** | gemini-1.5-pro | **FREE tier** / $0.0005 paid |
| **Gemini Flash** | gemini-1.5-flash | **FREE tier** / $0.0001 paid |

**Savings:** Up to 90% vs paid APIs!

---

## 🚀 Quick Setup

### 1. Get Gemini API Key (FREE)
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

### 2. Set Environment Variable
```bash
export GEMINI_API_KEY="your_api_key_here"
```

Or add to `.bashrc` / `.zshrc`:
```bash
echo 'export GEMINI_API_KEY="your_key"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Test Connection
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{"contents":[{"parts":[{"text":"Hello Gemini!"}]}]}'
```

---

## 🛠️ Coding Workflows

### Option 1: Direct API (Recommended for scripts)

**Create a coding assistant script:**
```bash
./gemini_code.sh "Create a Python function to calculate fibonacci"
```

**Script:** `gemini_code.sh`
```bash
#!/bin/bash
PROMPT="$1"
API_KEY="$GEMINI_API_KEY"

RESPONSE=$(curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d "{\"contents\":[{\"parts\":[{\"text\":\"$PROMPT\"}]}]}")

echo "$RESPONSE" | jq -r '.candidates[0].content.parts[0].text'
```

### Option 2: Use with Files

**Generate code from file:**
```bash
python3 gemini_coder.py --file input.txt --output result.py
```

### Option 3: Interactive Mode

**Chat with Gemini about your code:**
```bash
python3 gemini_chat.py
```

---

## 📋 Use Cases for Coding

### 1. Generate New Code
```bash
# Instead of using Kimi, use Gemini:
python3 gemini_coder.py "Create a React component for a todo list with TypeScript"
```

### 2. Debug Existing Code
```bash
# Pass your code file
cat broken_script.js | python3 gemini_debug.py
```

### 3. Code Review
```bash
# Get code review
python3 gemini_review.py my_code.py
```

### 4. Generate Documentation
```bash
# Create docs from code
python3 gemini_docs.py script.py
```

### 5. Refactor Code
```bash
# Improve existing code
python3 gemini_refactor.py old_code.py --output new_code.py
```

---

## 🔄 Switching Between AI Models

### Current Setup (Kimi - Paid)
```bash
# Kimi API (uses credits)
./use_kimi.sh "Create a Python script"
```

### New Setup (Gemini - FREE)
```bash
# Gemini API (free tier)
./use_gemini.sh "Create a Python script"
```

### Smart Routing
```bash
# Use Gemini for simple tasks
# Use Kimi for complex reasoning
./smart_ai.sh "Your prompt here"
```

---

## 📊 Cost Tracking

Track your savings:
```bash
# Log usage
echo "$(date): Used Gemini for coding task" >> ai_usage.log

# Monthly report
cat ai_usage.log | grep -c "Gemini" # Count Gemini uses
cat ai_usage.log | grep -c "Kimi"   # Count Kimi uses
```

---

## 🎯 When to Use Which

| Task | Use | Why |
|------|-----|-----|
| Code generation | **Gemini Flash** | Fast, cheap, good quality |
| Code review | **Gemini Pro** | Detailed analysis |
| Complex debugging | **Kimi** | Better reasoning |
| Documentation | **Gemini Flash** | Quick generation |
| Refactoring | **Gemini Pro** | Context understanding |
| Architecture decisions | **Kimi** | Deep thinking |

---

## 🚀 Automation Scripts

### Auto-code Generator
```bash
# Watch folder and auto-generate code
./gemini_watch.sh /path/to/requests/
```

### Git Commit Helper
```bash
# Generate commit messages
git diff | python3 gemini_commit.py
```

### Test Generator
```bash
# Generate unit tests
python3 gemini_tests.py my_module.py
```

---

## 🔐 Security Notes

- Store API keys in environment variables
- Never commit keys to git
- Rotate keys monthly
- Use `.env` files for local development

---

## 💡 Pro Tips

1. **Start with Gemini Flash** for most coding tasks (fastest)
2. **Use Gemini Pro** when Flash doesn't give good results
3. **Reserve Kimi** for complex architecture and reasoning
4. **Cache responses** for repetitive tasks
5. **Batch requests** when possible

---

## 📈 Expected Savings

**Before:**
- 100 coding tasks/month × $0.015 = **$1.50**

**After (using Gemini):**
- 100 coding tasks/month × $0 = **$0** (free tier)

**Monthly savings: $1.50+**
**Annual savings: $18+**

*(Plus better performance for simple tasks!)*

---

## 🔗 Resources

- Gemini API Docs: https://ai.google.dev/docs
- Gemini Pro Pricing: https://ai.google.dev/pricing
- Free Tier Limits: 60 requests/minute, 1M tokens/day

---

**Ready to switch? Set your GEMINI_API_KEY and start saving! 🚀**
