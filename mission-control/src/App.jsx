import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3Z1WDeqO4cEBMk5Q1j9H8c2-0Z1Y8X0",
  authDomain: "winslow-756c3.firebaseapp.com",
  databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
  projectId: "winslow-756c3",
  storageBucket: "winslow-756c3.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Icons
const Icons = {
  todo: '📋',
  progress: '🔥',
  review: '👀',
  done: '✅',
  dev: '💻',
  marketing: '📣',
  content: '🎨',
  ambassador: '🤝',
  ops: '⚙️',
  michigan: '🏔️',
  internal: '🏠',
  brainDump: '🧠',
  meeting: '📅',
  idea: '💡',
  project: '📋'
};

const categoryColors = {
  dev: 'blue', marketing: 'red', content: 'amber', ambassador: 'emerald', ops: 'primary',
  michigan: 'orange', internal: 'cyan'
};

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400'
};

function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState({});
  const [notes, setNotes] = useState({});
  const [status, setStatus] = useState({ text: 'Loading...', type: 'saved' });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Load tasks from Firebase
  useEffect(() => {
    const tasksRef = ref(db, 'workspaces/winslow_main/tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTasks(data);
        setStatus({ text: 'Synced ✓', type: 'saved' });
      } else {
        // Default tasks
        setTasks({
          '1': { id: '1', title: 'Welcome to Mission Control', category: 'ops', priority: 'medium', status: 'todo', order: 0 },
          '2': { id: '2', title: 'Drag cards to move them', category: 'dev', priority: 'low', status: 'todo', order: 1 },
          '3': { id: '3', title: 'Michigan Project Task', category: 'michigan', priority: 'high', status: 'progress', order: 0 }
        });
        setStatus({ text: 'Ready', type: 'saved' });
      }
    });
    return () => unsubscribe();
  }, []);

  // Load notes from Firebase
  useEffect(() => {
    const notesRef = ref(db, 'workspaces/winslow_main/notes');
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setNotes(data);
    });
    return () => unsubscribe();
  }, []);

  // Save tasks
  const saveTasks = async (newTasks) => {
    setStatus({ text: 'Saving...', type: 'saving' });
    try {
      await set(ref(db, 'workspaces/winslow_main/tasks'), newTasks);
      setStatus({ text: 'Saved ✓', type: 'saved' });
    } catch (e) {
      setStatus({ text: 'Local only', type: 'saved' });
    }
  };

  // Save notes
  const saveNotes = async (newNotes) => {
    try {
      await set(ref(db, 'workspaces/winslow_main/notes'), newNotes);
    } catch (e) {
      console.log('Notes save failed', e);
    }
  };

  // Add task
  const addTask = (task) => {
    const id = Date.now().toString();
    const order = Object.values(tasks).filter(t => t.status === task.status).length;
    const newTasks = { ...tasks, [id]: { ...task, id, order } };
    setTasks(newTasks);
    saveTasks(newTasks);
    setShowAddTask(false);
  };

  // Update task
  const updateTask = (id, updates) => {
    const newTasks = { ...tasks, [id]: { ...tasks[id], ...updates } };
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Move task
  const moveTask = (id, newStatus, newOrder) => {
    const task = tasks[id];
    const newTasks = { ...tasks };
    
    // Remove from old position
    Object.values(newTasks).forEach(t => {
      if (t.status === task.status && t.order > task.order) {
        newTasks[t.id] = { ...t, order: t.order - 1 };
      }
    });
    
    // Add to new position
    Object.values(newTasks).forEach(t => {
      if (t.status === newStatus && t.order >= newOrder && t.id !== id) {
        newTasks[t.id] = { ...t, order: t.order + 1 };
      }
    });
    
    newTasks[id] = { ...task, status: newStatus, order: newOrder };
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Delete task
  const deleteTask = (id) => {
    const newTasks = { ...tasks };
    const task = newTasks[id];
    delete newTasks[id];
    
    // Reorder remaining
    Object.values(newTasks).forEach(t => {
      if (t.status === task.status && t.order > task.order) {
        newTasks[t.id] = { ...t, order: t.order - 1 };
      }
    });
    
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Add note
  const addNote = (note) => {
    const id = Date.now().toString();
    const newNotes = { ...notes, [id]: { ...note, id, updated: Date.now() } };
    setNotes(newNotes);
    saveNotes(newNotes);
    setShowAddNote(false);
  };

  // Update note
  const updateNote = (id, updates) => {
    const newNotes = { ...notes, [id]: { ...notes[id], ...updates, updated: Date.now() } };
    setNotes(newNotes);
    saveNotes(newNotes);
    setEditingNote(null);
  };

  // Delete note
  const deleteNote = (id) => {
    const newNotes = { ...notes };
    delete newNotes[id];
    setNotes(newNotes);
    saveNotes(newNotes);
    setEditingNote(null);
  };

  return (
    <div className="h-full bg-dark-950 text-gray-200 font-sans overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-lg border-b border-dark-800/50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-primary-400 bg-clip-text text-transparent">
              🚀 Mission Control
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Your command center</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.type === 'saving' ? 'bg-amber-500/20' : 'bg-dark-800/50'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.type === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            <span className={`text-xs ${status.type === 'saving' ? 'text-amber-400' : 'text-gray-400'}`}>{status.text}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-24 z-30 bg-dark-950/95 backdrop-blur-sm px-5 py-3 border-b border-dark-800/30">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['tasks', 'notes', 'files', 'tools'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                  : 'bg-dark-800/50 text-gray-400 border border-dark-700/50'
              }`}
            >
              {tab === 'tasks' && '📋 Tasks'}
              {tab === 'notes' && '📝 Notes'}
              {tab === 'files' && '📁 Files'}
              {tab === 'tools' && '🔧 Tools'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-12rem)] overflow-auto -overflow-x-hidden">
        {activeTab === 'tasks' && (
          <TaskBoard 
            tasks={tasks} 
            moveTask={moveTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}
        {activeTab === 'notes' && (
          <NotesList 
            notes={notes}
            onAdd={() => setShowAddNote(true)}
            onEdit={setEditingNote}
            onDelete={deleteNote}
          />
        )}
        {activeTab === 'files' && <FilesTab />}
        {activeTab === 'tools' && <ToolsTab />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur-lg border-t border-dark-800/50 z-40 pb-safe">
        <div className="flex justify-around py-2 px-2">
          {[
            { id: 'tasks', icon: '📋', label: 'Tasks' },
            { id: 'notes', icon: '📝', label: 'Notes' },
            { id: 'files', icon: '📁', label: 'Files' },
            { id: 'tools', icon: '🔧', label: 'Tools' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 py-3 px-4 text-center transition-colors ${
                activeTab === item.id ? 'text-primary-400' : 'text-gray-400'
              }`}
            >
              <div className="text-xl mb-0.5">{item.icon}</div>
              <div className="text-xs font-medium">{item.label}</div>
            </button>
          ))}
        </div>
      </nav>

      {/* FAB */}
      {activeTab === 'tasks' && (
        <button
          onClick={() => setShowAddTask(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white text-2xl shadow-lg shadow-primary-500/30 z-50 flex items-center justify-center active:scale-95 transition-transform"
        >
          +
        </button>
      )}

      {activeTab === 'notes' && (
        <button
          onClick={() => setShowAddNote(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white text-2xl shadow-lg shadow-primary-500/30 z-50 flex items-center justify-center active:scale-95 transition-transform"
        >
          +
        </button>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onSave={addTask}
        />
      )}

      {/* Add Note Modal */}
      {showAddNote && (
        <AddNoteModal
          onClose={() => setShowAddNote(false)}
          onSave={addNote}
        />
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <EditNoteModal
          note={notes[editingNote]}
          onClose={() => setEditingNote(null)}
          onSave={(updates) => updateNote(editingNote, updates)}
          onDelete={() => deleteNote(editingNote)}
        />
      )}
    </div>
  );
}

// Task Board Component
function TaskBoard({ tasks, moveTask, updateTask, deleteTask }) {
  const columns = ['todo', 'progress', 'review', 'done'];
  const columnLabels = { todo: 'To Do', progress: 'In Progress', review: 'Review', done: 'Done' };

  const getColumnTasks = (status) => {
    return Object.values(tasks)
      .filter(t => t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const order = getColumnTasks(status).length;
    moveTask(taskId, status, order);
  };

  return (
    <div className="flex gap-3 px-5 pb-32 overflow-x-auto overflow-y-hidden min-h-full -overflow-x-hidden">
      {columns.map(status => (
        <div
          key={status}
          className="min-w-[17.5rem] max-w-[17.5rem] flex-shrink-0 flex flex-col"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 px-1"
               style={{ 
                 borderColor: 
                   status === 'todo' ? '#f87171' : 
                   status === 'progress' ? '#fbbf24' : 
                   status === 'review' ? '#34d399' : '#60a5fa' 
               }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{Icons[status]}</span>
              <span className="font-semibold text-sm">{columnLabels[status]}</span>
              <span className="px-2 py-0.5 rounded-full bg-dark-700/50 text-xs">
                {getColumnTasks(status).length}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto cards-scroll pr-2">
            {getColumnTasks(status).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Task Card Component
function TaskCard({ task, onDragStart, onUpdate, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-dark-800/40 border border-dark-700/50 rounded-xl p-4 cursor-grab active:cursor-grabbing touch-none transition-all duration-150 flex-shrink-0 mb-3"
      onClick={() => setShowMenu(true)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium text-sm leading-snug pr-2">{task.title}</div>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`}></span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium bg-${categoryColors[task.category]}-500/15 text-${categoryColors[task.category]}-400`}>
          {Icons[task.category]} {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
        </span>
      </div>
    </div>
  );
}

// Add Task Modal
function AddTaskModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ops');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, category, priority, status: 'todo' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-end justify-center sm:items-center" onClick={onClose}>
      <div 
        className="bg-dark-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">New Task</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-dark-700/50 text-gray-400 text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500"
                placeholder="Task title..."
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500"
              >
                <option value="dev">💻 Dev</option>
                <option value="marketing">📣 Marketing</option>
                <option value="content">🎨 Content</option>
                <option value="ambassador">🤝 Ambassador</option>
                <option value="ops">⚙️ Ops</option>
                <option value="michigan">🏔️ Michigan Project</option>
                <option value="internal">🏠 Internal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl bg-dark-700/50 text-gray-300 font-semibold">Cancel</button>
            <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Notes List Component
function NotesList({ notes, onAdd, onEdit, onDelete }) {
  const noteList = Object.values(notes).sort((a, b) => b.updated - a.updated);

  return (
    <div className="px-5 pb-32">
      <div className="space-y-3">
        {noteList.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No notes yet. Create your first note!
          </div>
        ) : (
          noteList.map(note => (
            <div
              key={note.id}
              onClick={() => onEdit(note.id)}
              className="bg-dark-800/40 border border-dark-700/50 rounded-xl p-4 active:bg-dark-800/60 transition"
            >
              <div className="flex items-center gap-2 font-semibold text-sm mb-2">
                <span className="text-lg">{Icons[note.type] || '📝'}</span>
                {note.title}
                <span className="ml-auto text-xs px-2 py-0.5 rounded-lg bg-blue-500/15 text-blue-400 capitalize">
                  {note.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-3">{note.content}</p>
              <div className="text-xs text-gray-600 mt-2">
                {new Date(note.updated).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Add Note Modal
function AddNoteModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('brain_dump');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content, type });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-end justify-center sm:items-center" onClick={onClose}>
      <div 
        className="bg-dark-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">New Note</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-dark-700/50 text-gray-400 text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500"
                placeholder="Note title..."
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500 resize-none"
                placeholder="Brain dump, ideas, meeting notes..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500"
              >
                <option value="brain_dump">🧠 Brain Dump</option>
                <option value="meeting">📅 Meeting Notes</option>
                <option value="idea">💡 Idea</option>
                <option value="project">📋 Project</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl bg-dark-700/50 text-gray-300 font-semibold">Cancel</button>
            <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Note Modal
function EditNoteModal({ note, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [type, setType] = useState(note.type);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content, type });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-end justify-center sm:items-center" onClick={onClose}>
      <div 
        className="bg-dark-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Note</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-dark-700/50 text-gray-400 text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-700/50 border border-dark-600 text-white text-base focus:outline-none focus:border-primary-500"
              >
                <option value="brain_dump">🧠 Brain Dump</option>
                <option value="meeting">📅 Meeting Notes</option>
                <option value="idea">💡 Idea</option>
                <option value="project">📋 Project</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onDelete} className="flex-1 py-3.5 rounded-xl bg-red-500/15 text-red-400 font-semibold">Delete</button>
            <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Files Tab
function FilesTab() {
  return (
    <div className="px-5 pb-32">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-800/40 border border-dark-700/50 rounded-xl p-4 text-center active:bg-dark-800/60 transition">
          <div className="text-3xl mb-2">📁</div>
          <div className="text-xs font-medium">Template Pack V4</div>
        </div>
        <div className="bg-dark-800/40 border border-dark-700/50 rounded-xl p-4 text-center active:bg-dark-800/60 transition">
          <div className="text-3xl mb-2">🎨</div>
          <div className="text-xs font-medium">Brand Assets</div>
        </div>
      </div>
    </div>
  );
}

// Tools Tab
function ToolsTab() {
  const openTool = (tool) => {
    const urls = {
      docs: 'https://docs.google.com',
      sheets: 'https://sheets.google.com',
      drive: 'https://drive.google.com',
      calendar: 'https://calendar.google.com',
      gmail: 'https://mail.google.com',
      photos: 'https://photos.google.com'
    };
    window.open(urls[tool], '_blank');
  };

  return (
    <div className="px-5 pb-32">
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'docs', icon: '📄', name: 'Docs' },
          { id: 'sheets', icon: '📊', name: 'Sheets' },
          { id: 'drive', icon: '☁️', name: 'Drive' },
          { id: 'calendar', icon: '📅', name: 'Calendar' },
          { id: 'gmail', icon: '✉️', name: 'Gmail' },
          { id: 'photos', icon: '🖼️', name: 'Photos' }
        ].map(tool => (
          <div
            key={tool.id}
            onClick={() => openTool(tool.id)}
            className="bg-dark-800/40 border border-dark-700/50 rounded-2xl p-5 text-center active:bg-dark-800/60 transition"
          >
            <div className="text-3xl mb-2">{tool.icon}</div>
            <div className="text-sm font-semibold">{tool.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
