# Command Board - Firebase Sync

Real-time Kanban board with Firebase synchronization across devices.

## 🚀 Features

- **Real-time Sync** - Tasks sync instantly across all devices
- **Offline Support** - Works without internet, syncs when connected
- **No Login Required** - Anonymous Firebase auth
- **Mobile Optimized** - Works on phone, tablet, desktop

## 🔥 Firebase Setup

### 1. Create Firebase Project
```bash
# Go to https://console.firebase.google.com/
# Create new project
# Enable Realtime Database
# Enable Anonymous Auth
```

### 2. Get Config
In Firebase Console:
- Project Settings → General → Your apps → Web app
- Copy config object

### 3. Connect
Open Command Board in browser:
```
http://147.93.40.188:8080/command-board/index.html
```

Enter Firebase credentials in the config panel:
- API Key
- Project ID  
- Database URL

Click **"Connect Firebase"**

## 📱 Access

### Desktop
```
http://147.93.40.188:8080/command-board/index.html
```

### Mobile
Same URL - responsive design

## 🔄 Sync Status

- **● Live Sync** - Connected to Firebase, real-time updates
- **○ Offline Mode** - Using LocalStorage only
- **⚠ Sync Error** - Connection issue, retrying

## 💾 Data Storage

### With Firebase
- Tasks stored in Firebase Realtime Database
- Syncs across all connected devices instantly
- Persistent cloud storage

### Without Firebase
- Tasks stored in browser LocalStorage
- Device-only (no sync)
- Export/Import JSON for backup

## 🔐 Security

- Anonymous authentication (no passwords)
- Each user gets unique ID
- Data isolated per user

## 📊 Stats Tracked

- Total Tasks
- Tasks by Status (Todo, Progress, Review, Done)
- Revenue Metrics (Ambassadors, Monthly, Users)

## 🎨 Categories

- Development
- Marketing  
- Content
- Operations

## 📝 Task Fields

- Title
- Description/Notes
- Status
- Priority (High/Medium/Low)
- Category

## 🚀 Future Features

- [ ] File attachments via Firebase Storage
- [ ] Team collaboration (multi-user)
- [ ] Due dates & reminders
- [ ] Task templates
- [ ] Export to CSV/PDF

---

Built with vanilla JS + Firebase
