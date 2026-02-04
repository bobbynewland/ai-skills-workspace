# Firebase Storage CORS Fix

## Problem
Firebase Storage blocks requests from `https://ai-skills-workspace.vercel.app` due to CORS policy.

## Solution - Configure CORS in Firebase Console

### Step 1: Install gsutil (Google Cloud SDK)
```bash
# Option A: Using gcloud (recommended)
gcloud components install gsutil

# Option B: Direct install
curl https://sdk.cloud.google.com | bash
```

### Step 2: Authenticate
```bash
gcloud auth login
```

### Step 3: Create CORS Configuration File
Create a file named `cors.json`:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-resumable"]
  }
]
```

Or for specific domain only (more secure):
```json
[
  {
    "origin": ["https://ai-skills-workspace.vercel.app", "http://localhost:8080", "http://147.93.40.188:8080"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-resumable"]
  }
]
```

### Step 4: Apply CORS Configuration
```bash
gsutil cors set cors.json gs://winslow-756c3.appspot.com
```

### Step 5: Verify
```bash
gsutil cors get gs://winslow-756c3.appspot.com
```

## Alternative: Firebase Console (No Command Line)

Unfortunately, Firebase Console doesn't have a UI for CORS. You must use gsutil or the workaround below.

## Workaround: Use Firebase Realtime DB for File Metadata

Since Storage has CORS issues, we can use Realtime Database to store file metadata and use the local server (147.93.40.188:8080) for file storage instead.

### Quick Fix - Switch to Local Storage Mode

In files.html, we can add a fallback that uses the local HTTP server instead of Firebase Storage:

```javascript
// Add this mode switcher
const USE_LOCAL_STORAGE = true; // Set to false when CORS is fixed

if (USE_LOCAL_STORAGE) {
    // Upload to local server
    uploadToLocalServer(file);
} else {
    // Upload to Firebase
    uploadToFirebase(file);
}
```

## Easiest Fix for Now

**Use the local server for file uploads instead:**

The local server at `http://147.93.40.188:8080` doesn't have CORS restrictions.

To access files.html locally:
```
http://147.93.40.188:8080/command-board/files.html
```

Uploads will work without CORS issues!

## Long-term Solution

1. Run the gsutil commands above to configure CORS on Firebase Storage
2. Once CORS is configured, uploads from `https://ai-skills-workspace.vercel.app` will work
3. This is a one-time setup

## Need Help?

If you want me to help configure CORS, you would need to:
1. Give me access to run gcloud commands, OR
2. Run the gsutil commands above on your computer

For now, use the local server URL to upload files:
```
http://147.93.40.188:8080/command-board/files.html
```
