import requests
import json
from google.oauth2 import service_account
from google.auth.transport.requests import Request

FIREBASE_KEY = '/root/.openclaw/workspace/.keys/firebase.json'
NOTE_ID = "-OmBRoxnL6uH2SELpyse"
DB_URL = f"https://winslow-756c3-default-rtdb.firebaseio.com/workspaces/winslow_main/notes/{NOTE_ID}.json"

NEW_CONTENT = """# 💎 Welcome to the AI Skills Studio Elite VIP Mastermind

Welcome to the inner circle. You’re here because you’re ready to stop trading time for money and start using AI as your ultimate leverage. This isn't just a community—it's your unfair advantage.

Our mission is simple: To give you the tools, the training, and the network to hit your personal goals, one small win at a time. Whether you're here to scale your own business or grow your income as an Ambassador, every resource in this group is designed for your individual success.

---

### **🛡️ The Rules of the House**
- **Individual Focus:** This is about your growth. Share your wins, ask for help, and use the leverage provided.
- **Extreme Ownership:** You have the tools; now apply them to your specific vision.
- **Privacy is Premium:** What happens in the Mastermind stays in the Mastermind.

### **🗺️ Navigating the Academy**
- **🎓 #daily-skill-drop:** Your daily 1% improvement. Actionable training on AI-Entrepreneurship designed for you to implement immediately.
- **🎤 #live-stream-archive:** Recordings and deep-dives from our live sessions so you can learn on your own schedule.
- **📂 #resource-vault:** The "Black Box." Checklists, prompts, and blueprints to give you a head start.
- **💬 #vip-mastermind:** High-level networking with fellow entrepreneurs who are on the same path.

### **🚀 Phase 1: Initiation**
1. **Introduce Yourself:** Head to `#vip-mastermind` and tell us what personal goal you're working toward right now.
2. **Audit the Vault:** Grab the "Local Domination" cheat sheet in `#resource-vault`.
3. **Turn on Notifications:** The daily skill drops are your edge—don't let them sit in the box.

---
*Signed,*
**Winslow (Win)**
*Invisible Architect // CTO*
"""

def update_note():
    try:
        creds = service_account.Credentials.from_service_account_file(
            FIREBASE_KEY,
            scopes=['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/firebase.database']
        )
        creds.refresh(Request())
        token = creds.token
        
        payload = {
            "title": "Discord Welcome",
            "content": NEW_CONTENT,
            "type": "note",
            "updated": "2026-02-23T23:58:00.000Z",
            "created": "2026-02-23T23:50:00.000Z"
        }
        
        response = requests.put(f"{DB_URL}?access_token={token}", json=payload)
        if response.status_code == 200:
            print("Note updated successfully via PUT.")
        else:
            print(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_note()
