import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, remove, onValue, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD0Z7R2J8kF3L5N9P1Q2R4S6V8X0Y2Z4",
  authDomain: "winslow-756c3.firebaseapp.com",
  databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
  projectId: "winslow-756c3",
  storageBucket: "winslow-756c3.appspot.com",
  messagingSenderId: "114362401734976703623",
  appId: "1:114362401734976703623:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export const db = {
  kanban: {
    ref: () => ref(database, 'workspaces/winslow_main/tasks'),
    set: (data) => set(ref(database, 'workspaces/winslow_main/tasks'), data),
    get: () => get(ref(database, 'workspaces/winslow_main/tasks')),
    subscribe: (callback) => onValue(ref(database, 'workspaces/winslow_main/tasks'), (snapshot) => callback(snapshot.val())),
    push: (data) => push(ref(database, 'workspaces/winslow_main/tasks'), data),
    updateTask: (id, data) => update(ref(database, `workspaces/winslow_main/tasks/${id}`), data),
    removeTask: (id) => remove(ref(database, `workspaces/winslow_main/tasks/${id}`))
  },
  agentActivity: {
    ref: () => ref(database, 'workspaces/winslow_main/agent_activity'),
    set: (data) => set(ref(database, 'workspaces/winslow_main/agent_activity'), data),
    get: () => get(ref(database, 'workspaces/winslow_main/agent_activity')),
    subscribe: (callback) => onValue(ref(database, 'workspaces/winslow_main/agent_activity'), (snapshot) => callback(snapshot.val())),
    push: (data) => push(ref(database, 'workspaces/winslow_main/agent_activity'), data),
    updateActivity: (id, data) => update(ref(database, `workspaces/winslow_main/agent_activity/${id}`), data),
    removeActivity: (id) => remove(ref(database, `workspaces/winslow_main/agent_activity/${id}`))
  },
  notes: {
    ref: () => ref(database, 'workspaces/winslow_main/notes'),
    set: (data) => set(ref(database, 'workspaces/winslow_main/notes'), data),
    get: (id) => get(ref(database, `workspaces/winslow_main/notes/${id}`)),
    list: () => get(ref(database, 'workspaces/winslow_main/notes')),
    subscribeList: (callback) => onValue(ref(database, 'workspaces/winslow_main/notes'), (snapshot) => callback(snapshot.val())),
    subscribeNote: (id, callback) => onValue(ref(database, `workspaces/winslow_main/notes/${id}`), (snapshot) => callback(snapshot.val())),
    push: (data) => push(ref(database, 'workspaces/winslow_main/notes'), data),
    updateNote: (id, data) => update(ref(database, `workspaces/winslow_main/notes/${id}`), data),
    removeNote: (id) => remove(ref(database, `workspaces/winslow_main/notes/${id}`))
  }
};

export const storageService = {
  upload: async (file, path = 'uploads') => {
    const fileRef = storageRef(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }
};

export { database, storage, ref, onValue, set, get, push, remove, update };
export default app;
