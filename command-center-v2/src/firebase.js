import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, push, remove, onValue, update } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD0Z7R2J8kF3L5N9P1Q2R4S6V8X0Y2Z4",
  authDomain: "winslow-756c3.firebaseapp.com",
  databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
  projectId: "winslow-756c3",
  storageBucket: "winslow-756c3.appspot.com",
  messagingSenderId: "114362401734976703623",
  appId: "1:114362401734976703623:web:abc123def456"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const storage = getStorage(app)

// Database references
export const db = {
  projects: {
    ref: () => ref(database, 'projects'),
    set: (data) => set(ref(database, 'projects'), data),
    get: () => get(ref(database, 'projects')),
    subscribe: (callback) => onValue(ref(database, 'projects'), (snapshot) => callback(snapshot.val()))
  },
  notes: {
    ref: () => ref(database, 'notes'),
    get: () => get(ref(database, 'notes')),
    push: (data) => push(ref(database, 'notes'), data),
    update: (id, data) => update(ref(database, `notes/${id}`), data)
  },
  files: {
    ref: () => ref(database, 'files'),
    get: () => get(ref(database, 'files')),
    push: (data) => push(ref(database, 'files'), data)
  },
  agents: {
    ref: () => ref(database, 'agents'),
    get: () => get(ref(database, 'agents')),
    update: (id, data) => update(ref(database, `agents/${id}`), data)
  },
  skills: {
    ref: () => ref(database, 'skills'),
    get: () => get(ref(database, 'skills'))
  },
  kanban: {
    ref: () => ref(database, 'kanban'),
    set: (data) => set(ref(database, 'kanban'), data),
    get: () => get(ref(database, 'kanban')),
    subscribe: (callback) => onValue(ref(database, 'kanban'), (snapshot) => callback(snapshot.val()))
  }
}

// Storage references
export const storageService = {
  upload: async (file, path = 'uploads') => {
    const fileRef = storageRef(storage, `${path}/${Date.now()}_${file.name}`)
    await uploadBytes(fileRef, file)
    return getDownloadURL(fileRef)
  },
  delete: async (url) => {
    const fileRef = storageRef(storage, url)
    await deleteObject(fileRef)
  },
  list: async (path = 'uploads') => {
    const folderRef = storageRef(storage, path)
    const result = await listAll(folderRef)
    return Promise.all(result.items.map(item => getDownloadURL(item)))
  }
}

export { app, database, storage, ref, onValue, set, get, push, remove, update }
export default app
