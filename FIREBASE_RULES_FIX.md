# Firebase Security Rules Fix

## 🔒 Permission Denied Error

The Firebase Realtime Database needs updated security rules to allow email authentication.

---

## 🛠️ How to Fix

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select project: `winslow-756c3`
3. Click **"Realtime Database"** in left sidebar
4. Click **"Rules"** tab

### Step 2: Update Rules
Replace the current rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "shared": {
      "$workspaceId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

### Step 3: Publish Rules
Click **"Publish"** button

---

## 📝 What These Rules Do:

| Path | Read | Write |
|------|------|-------|
| `/users/{uid}` | Only the owner | Only the owner |
| `/shared/{id}` | Anyone | Anyone |

---

## 🚨 Alternative: Open Rules (Less Secure)

If you want it to work immediately without auth:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning:** This allows anyone to read/write your database!

---

## ✅ Quick Test

After updating rules:
1. Refresh Command Board
2. Log in with email
3. Try adding a task
4. Should work now!

---

## 🔧 Or Use Shared Mode Instead

While fixing rules, you can use **Shared Mode**:
1. Go to Command Board
2. Click **"🔥 Shared Mode"** tab
3. Enter workspace ID: `winslow-main`
4. Click **"Join Workspace"**

Shared mode doesn't require authentication and works immediately!

---

**Let me know once you've updated the rules!** 🎯
