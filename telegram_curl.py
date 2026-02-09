#!/usr/bin/env python3
"""
Telegram Message Sender - Uses curl to bypass Hostinger Node.js restrictions
"""
import subprocess
import sys
import json

BOT_TOKEN = "8576083106:AAEmIVmq6YQ_8GAq47Vhc2zi7ejr5coqC3Q"
API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

def curl_post(endpoint, data):
    """Generic curl POST wrapper"""
    cmd = [
        "curl", "-s", "-X", "POST",
        f"{API_URL}/{endpoint}",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(data)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        try:
            return json.loads(result.stdout)
        except:
            return None
    return None

def send_message(chat_id, text, reply_to=None):
    """Send message"""
    data = {"chat_id": str(chat_id), "text": text}
    if reply_to:
        data["reply_to_message_id"] = reply_to
    return curl_post("sendMessage", data)

def send_photo(chat_id, photo_url, caption=None):
    """Send photo"""
    data = {"chat_id": str(chat_id), "photo": photo_url}
    if caption:
        data["caption"] = caption
    return curl_post("sendPhoto", data)

def get_updates(offset=None, limit=10):
    """Get updates"""
    data = {"limit": limit}
    if offset:
        data["offset"] = offset
    return curl_post("getUpdates", data)

def get_me():
    """Get bot info"""
    return curl_post("getMe", {})

def main():
    if len(sys.argv) < 2:
        print("""
🏆 TELEGRAM CURL WRAPPER
========================

Usage:
  python3 telegram_curl.py send <chat_id> <message>
  python3 telegram_curl.py photo <chat_id> <url> [caption]
  python3 telegram_curl.py get [offset]
  python3 telegram_curl.py me

Examples:
  python3 telegram_curl.py send 123456789 "Hello!"
  python3 telegram_curl.py photo 123456789 "https://image.url" "Check this out"
  python3 telegram_curl.py get
""")
        return
    
    cmd = sys.argv[1].lower()
    
    if cmd == "send" and len(sys.argv) >= 4:
        result = send_message(sys.argv[2], " ".join(sys.argv[3:]))
        if result and result.get("ok"):
            print(f"✅ Sent! Message ID: {result['result']['message_id']}")
        else:
            print(f"❌ Failed: {result}")
    
    elif cmd == "photo" and len(sys.argv) >= 4:
        caption = sys.argv[4] if len(sys.argv) > 4 else None
        result = send_photo(sys.argv[2], sys.argv[3], caption)
        if result and result.get("ok"):
            print(f"✅ Photo sent! Message ID: {result['result']['message_id']}")
        else:
            print(f"❌ Failed: {result}")
    
    elif cmd == "get" or cmd == "updates":
        offset = int(sys.argv[2]) if len(sys.argv) > 2 else None
        result = get_updates(offset)
        if result and result.get("ok"):
            count = len(result.get("result", []))
            print(f"✅ {count} updates")
            for update in result.get("result", [])[:3]:
                msg = update.get("message", {})
                text = msg.get("text", "non-text")
                chat = msg.get("chat", {}).get("id", "?")
                print(f"  [{chat}] {text[:50]}")
        else:
            print(f"❌ Failed: {result}")
    
    elif cmd == "me":
        result = get_me()
        if result and result.get("ok"):
            bot = result["result"]
            print(f"✅ {bot['first_name']} (@{bot['username']})")
        else:
            print(f"❌ Failed: {result}")
    
    else:
        print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()

