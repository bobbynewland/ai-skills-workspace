// Firebase Configuration for Command Board
// Replace with your Firebase project config

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Initialize Firebase (when config is provided)
let db = null;
let auth = null;

function initFirebase(config) {
  if (!config || config.apiKey === "YOUR_API_KEY") {
    console.log("Firebase not configured yet");
    return false;
  }
  
  firebase.initializeApp(config);
  db = firebase.database();
  auth = firebase.auth();
  
  // Anonymous auth for easy access
  auth.signInAnonymously().catch(error => {
    console.error("Auth error:", error);
  });
  
  return true;
}

// Sync tasks to Firebase
function syncToFirebase(tasks) {
  if (!db) return;
  
  const userId = auth.currentUser?.uid || 'anonymous';
  db.ref(`users/${userId}/tasks`).set(tasks)
    .then(() => console.log("Synced to Firebase"))
    .catch(err => console.error("Sync error:", err));
}

// Listen for Firebase updates
function listenToFirebase(callback) {
  if (!db) return;
  
  const userId = auth.currentUser?.uid || 'anonymous';
  db.ref(`users/${userId}/tasks`).on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
}