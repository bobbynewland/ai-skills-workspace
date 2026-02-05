# Gemini API Pricing (Google AI Studio)

**Your Account:** $300 free credits

---

## 💰 Pricing Per Model

### **Gemini 2.0 Flash** (Fast, efficient)
| Metric | Price |
|--------|-------|
| Input | $0.075 / 1M tokens |
| Output | $0.30 / 1M tokens |
| **Context window** | 1M tokens |

**Use for:** Simple tasks, summaries, quick answers, data extraction

---

### **Gemini 2.5 Pro** (Most capable)
| Metric | Price |
|--------|-------|
| Input | $1.25 / 1M tokens |
| Output | $10.00 / 1M tokens |
| **Context window** | 2M tokens |

**Use for:** Complex coding, architecture, detailed analysis

---

### **Gemini 2.5 Flash** (Balanced)
| Metric | Price |
|--------|-------|
| Input | $0.15 / 1M tokens |
| Output | $0.60 / 1M tokens |
| **Context window** | 1M tokens |

**Use for:** Medium complexity tasks, documentation, reviews

---

### **Gemini 2.0 Flash-Lite** (Cheapest)
| Metric | Price |
|--------|-------|
| Input | $0.075 / 1M tokens |
| Output | $0.30 / 1M tokens |
| **Context window** | 1M tokens |

**Use for:** High-volume, simple tasks

---

## 📊 Cost Examples

### **Coding Task (Gemini 2.5 Pro)**
- Input: 500 tokens
- Output: 800 tokens
- **Cost:** $0.0014 (0.14 cents)

### **Summary Task (Gemini 2.0 Flash)**
- Input: 2,000 tokens
- Output: 300 tokens
- **Cost:** $0.00024 (0.024 cents)

### **Complex Architecture (Gemini 2.5 Pro)**
- Input: 5,000 tokens
- Output: 3,000 tokens
- **Cost:** $0.036 (3.6 cents)

---

## 🎯 Usage Strategy

| Task Type | Model | Why |
|-----------|-------|-----|
| **Coding** | Gemini 2.5 Pro | Best quality code |
| **Code Review** | Gemini 2.5 Pro | Detailed analysis |
| **Summaries** | Gemini 2.0 Flash | Fast & cheap |
| **Documentation** | Gemini 2.0 Flash | Good enough |
| **Data Extraction** | Gemini 2.0 Flash | Fast parsing |
| **Translation** | Gemini 2.0 Flash | Quick & accurate |
| **Questions** | Gemini 2.0 Flash | General knowledge |
| **Chat** | Kimi | Reserved for conversation |

---

## 💵 $300 Credit Breakdown

| Activity | Est. Cost | # of Tasks |
|----------|-----------|------------|
| Coding (Pro) | $0.002 avg | ~150,000 tasks |
| Tasks (Flash) | $0.0003 avg | ~1,000,000 tasks |

**$300 = roughly 150,000 coding tasks OR 1M+ simple tasks**

---

## 🔧 Available Models

```python
MODELS = {
    "gemini-2.5-pro": "Best quality, highest cost",
    "gemini-2.5-flash": "Good balance",
    "gemini-2.0-flash": "Fast & cheap (default)",
    "gemini-2.0-flash-lite": "Cheapest option"
}
```

---

## 📈 Rate Limits (with billing)

| Model | Requests/min | Tokens/min |
|-------|-------------|-----------|
| Gemini 2.5 Pro | 1,000 | 4M |
| Gemini 2.0 Flash | 2,000 | 4M |
| Gemini 2.5 Flash | 2,000 | 4M |

---

## 🚀 Quick Start

```bash
# Set API key
export GEMINI_API_KEY="your_key"

# Coding (uses Pro by default)
python3 google_coder.py generate "Create API endpoint"

# Tasks (uses Flash)
python3 gemini_tasks.py summarize "text.txt"

# Chat (uses Kimi - reserved)
# Just talk to me normally!
```

---

**Full docs:** https://ai.google.dev/pricing
