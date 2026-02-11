import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB3Z1WDeqO4cEBMk5Q1j9H8c2-0Z1Y8X0",
  authDomain: "winslow-756c3.firebaseapp.com",
  databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
  projectId: "winslow-756c3",
  storageBucket: "winslow-756c3.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Icons = {
  todo: '📋', progress: '🔥', review: '👀', done: '✅',
  dev: '💻', marketing: '📣', content: '🎨', ambassador: '🤝', ops: '⚙️',
  michigan: '🏔️', internal: '🏠',
  brain_dump: '🧠', meeting: '📅', idea: '💡', project: '📋'
};

const categoryColors = {
  dev: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa' },
  marketing: { bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171' },
  content: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24' },
  ambassador: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399' },
  ops: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
  michigan: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c' },
  internal: { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee' }
};

const priorityColors = { high: '#ef4444', medium: '#fbbf24', low: '#34d399' };
const noteTypeColors = {
  brain_dump: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24' },
  meeting: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa' },
  idea: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399' },
  project: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' }
};

const columnColors = { todo: '#f87171', progress: '#fbbf24', review: '#34d399', done: '#60a5fa' };

function TaskCard({ task, onClick, onDragStart, onDragEnd, onTouchStart, onTouchMove, onTouchEnd }) {
  const catColor = categoryColors[task.category] || categoryColors.ops;
  
  return (
    <div
      className="task-card"
      data-task-id={task.id}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.4, paddingRight: '0.5rem', flex: 1 }}>
          {task.title}
        </div>
        <div className="priority-dot" style={{ backgroundColor: priorityColors[task.priority] }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div className="category-badge" style={{ background: catColor.bg, color: catColor.text }}>
          {Icons[task.category]} {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
        </div>
      </div>
    </div>
  );
}

function TaskColumn({ status, tasks, columnIcons, columnLabels, onTaskClick, onDragOver, onDragLeave, onDrop, onDragStart, onDragEnd, onTouchStart, onTouchMove, onTouchEnd, isOver }) {
  const columnTasks = Object.values(tasks).filter(t => t.status === status).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div
      id={`column-${status}`}
      data-status={status}
      className={`column-layout ${isOver ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ minHeight: '150px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `2px solid ${columnColors[status]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.125rem' }}>{columnIcons[status]}</span>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{columnLabels[status]}</span>
          <div style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'rgba(55, 65, 81, 0.5)', fontSize: '0.75rem', color: '#9ca3af' }}>
            {columnTasks.length}
          </div>
        </div>
      </div>
      <div className="cards-scroll" style={{ minHeight: '100px' }}>
        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        ))}
        {columnTasks.length === 0 && (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#4b5563', fontSize: '0.75rem' }}>
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

function NoteCard({ note, onClick }) {
  const noteColor = noteTypeColors[note.type] || noteTypeColors.brain_dump;
  
  return (
    <div className="note-card" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.125rem' }}>{Icons[note.type] || '📝'}</span>
        {note.title}
        <div style={{ marginLeft: 'auto', padding: '0.125rem 0.5rem', borderRadius: '0.5rem', background: noteColor.bg, color: noteColor.text, fontSize: '0.75rem', textTransform: 'capitalize' }}>
          {note.type.replace('_', ' ')}
        </div>
      </div>
      <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {note.content}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.5rem' }}>
        {new Date(note.updated).toLocaleDateString()}
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState({});
  const [notes, setNotes] = useState({});
  const [syncStatus, setSyncStatus] = useState({ text: 'Loading...', type: 'saved' });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [draggingTask, setDraggingTask] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Touch drag state
  const touchDragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    taskId: null,
    draggedElement: null,
    clone: null,
  });

  // Load tasks from Firebase
  useEffect(() => {
    const tasksRef = ref(db, 'workspaces/winslow_main/tasks');
    const unsub = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTasks(data);
        setSyncStatus({ text: 'Synced ✓', type: 'saved' });
      } else {
        // Default tasks
        const defaults = {
          '1': { id: '1', title: 'Welcome to Mission Control', category: 'ops', priority: 'medium', status: 'todo', order: 0 },
          '2': { id: '2', title: 'Drag cards between columns', category: 'dev', priority: 'low', status: 'todo', order: 1 },
          '3': { id: '3', title: 'Try moving to Progress', category: 'michigan', priority: 'high', status: 'progress', order: 0 },
          '4': { id: '4', title: 'Or drop in Review', category: 'content', priority: 'medium', status: 'review', order: 0 },
          '5': { id: '5', title: 'Completed tasks go to Done', category: 'marketing', priority: 'low', status: 'done', order: 0 }
        };
        setTasks(defaults);
        set(ref(db, 'workspaces/winslow_main/tasks'), defaults);
        setSyncStatus({ text: 'Ready', type: 'saved' });
      }
    });
    return () => unsub();
  }, []);

  // Load notes from Firebase
  useEffect(() => {
    const notesRef = ref(db, 'workspaces/winslow_main/notes');
    const unsub = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setNotes(data);
    });
    return () => unsub();
  }, []);

  // Save tasks to Firebase
  const saveTasks = useCallback(async (newTasks) => {
    setSyncStatus({ text: 'Saving...', type: 'saving' });
    try {
      await set(ref(db, 'workspaces/winslow_main/tasks'), newTasks);
      setSyncStatus({ text: 'Saved ✓', type: 'saved' });
    } catch (e) {
      setSyncStatus({ text: 'Local only', type: 'saved' });
    }
  }, []);

  // Save notes to Firebase
  const saveNotes = useCallback(async (newNotes) => {
    try {
      await set(ref(db, 'workspaces/winslow_main/notes'), newNotes);
    } catch (e) {
      console.log('Notes save failed', e);
    }
  }, []);

  // Track scroll position for indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drag handlers - native HTML5 drag and drop
  const handleDragStart = useCallback((e, task) => {
    setDraggingTask(task);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback
    e.target.classList.add('dragging');
  }, []);

  const handleDragEnd = useCallback((e) => {
    setDraggingTask(null);
    setOverColumn(null);
    e.target.classList.remove('dragging');
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Find which column we're over
    let el = e.target;
    while (el && el !== document.body) {
      if (el.id && el.id.startsWith('column-')) {
        if (overColumn !== el.id) {
          setOverColumn(el.id);
        }
        break;
      }
      el = el.parentElement;
    }
  }, [overColumn]);

  const handleDragLeave = useCallback((e) => {
    // Only clear if we're actually leaving the column
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setOverColumn(null);
    
    const taskId = e.dataTransfer.getData('text/plain');
    const newStatus = e.currentTarget.dataset.status;
    
    if (taskId && newStatus && tasks[taskId]) {
      const task = tasks[taskId];
      
      if (task.status !== newStatus) {
        const newTasks = { ...tasks };
        
        // Remove from old position
        Object.values(newTasks).forEach(t => {
          if (t.status === task.status && t.order > task.order) {
            newTasks[t.id] = { ...t, order: t.order - 1 };
          }
        });
        
        // Add to new column at the end
        const colTasks = Object.values(newTasks).filter(t => t.status === newStatus);
        const newOrder = colTasks.length;
        
        newTasks[taskId] = { ...task, status: newStatus, order: newOrder };
        
        setTasks(newTasks);
        saveTasks(newTasks);
      }
    }
    
    setDraggingTask(null);
  }, [tasks, saveTasks]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const card = e.currentTarget;
    const taskId = card.dataset.taskId || card.getAttribute('data-task-id');
    
    touchDragRef.current = {
      isDragging: false,
      startX: touch.clientX,
      startY: touch.clientY,
      taskId: taskId,
      draggedElement: card,
      clone: null,
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    const { startX, startY, isDragging, taskId, draggedElement, clone } = touchDragRef.current;
    
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);
    
    // If moved more than 25px vertically, start drag (prevents accidental drags during scroll)
    // We prioritize vertical movement for drag start to allow horizontal scroll when swiping between tabs/cards slightly
    if (!isDragging && deltaY > 25 && deltaX < deltaY * 1.5) {
      const task = tasks[taskId];
      if (!task) return;
      
      touchDragRef.current.isDragging = true;
      setDraggingTask(task);
      
      // Create visual clone
      const rect = draggedElement.getBoundingClientRect();
      const cloneEl = draggedElement.cloneNode(true);
      cloneEl.style.position = 'fixed';
      cloneEl.style.left = `${rect.left}px`;
      cloneEl.style.top = `${rect.top}px`;
      cloneEl.style.width = `${rect.width}px`;
      cloneEl.style.zIndex = '9999';
      cloneEl.style.opacity = '0.9';
      cloneEl.style.pointerEvents = 'none';
      cloneEl.classList.add('dragging');
      document.body.appendChild(cloneEl);
      touchDragRef.current.clone = cloneEl;
    }
    
    // Update clone position
    if (isDragging && clone) {
      clone.style.left = `${touch.clientX - 40}px`;
      clone.style.top = `${touch.clientY - 40}px`;
      
      // Find column under touch
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      let columnEl = element?.closest('[data-status]');
      
      if (columnEl && columnEl.id?.startsWith('column-')) {
        if (overColumn !== columnEl.id) {
          setOverColumn(columnEl.id);
        }
      } else {
        setOverColumn(null);
      }
    }
  }, [tasks, overColumn]);

  const handleTouchEnd = useCallback((e) => {
    const { isDragging, taskId, clone } = touchDragRef.current;
    
    if (clone) {
      clone.remove();
    }
    
    if (isDragging && taskId && overColumn) {
      const newStatus = overColumn.replace('column-', '');
      const task = tasks[taskId];
      
      if (task && task.status !== newStatus) {
        const newTasks = { ...tasks };
        
        Object.values(newTasks).forEach(t => {
          if (t.status === task.status && t.order > task.order) {
            newTasks[t.id] = { ...t, order: t.order - 1 };
          }
        });
        
        const colTasks = Object.values(newTasks).filter(t => t.status === newStatus);
        const newOrder = colTasks.length;
        
        newTasks[taskId] = { ...task, status: newStatus, order: newOrder };
        
        setTasks(newTasks);
        saveTasks(newTasks);
      }
    }
    
    touchDragRef.current = { isDragging: false, startX: 0, startY: 0, taskId: null, draggedElement: null, clone: null };
    setDraggingTask(null);
    setOverColumn(null);
  }, [tasks, overColumn, saveTasks]);

  // Task CRUD operations
  const addTask = (task) => {
    const id = Date.now().toString();
    const order = Object.values(tasks).filter(t => t.status === task.status).length;
    const newTasks = { ...tasks, [id]: { ...task, id, order } };
    setTasks(newTasks);
    saveTasks(newTasks);
    setShowAddTask(false);
  };

  const updateTask = (id, updates) => {
    const newTasks = { ...tasks, [id]: { ...tasks[id], ...updates } };
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = async (id) => {
    const newTasks = { ...tasks };
    const task = newTasks[id];
    delete newTasks[id];
    
    // Reorder remaining tasks
    Object.values(newTasks).forEach(t => {
      if (t.status === task.status && t.order > task.order) {
        newTasks[t.id] = { ...t, order: t.order - 1 };
      }
    });
    
    setTasks(newTasks);
    await saveTasks(newTasks);
  };

  // Note CRUD operations
  const addNote = (note) => {
    const id = Date.now().toString();
    const newNotes = { ...notes, [id]: { ...note, id, updated: Date.now() } };
    setNotes(newNotes);
    saveNotes(newNotes);
    setShowAddNote(false);
  };

  const updateNote = (id, updates) => {
    const newNotes = { ...notes, [id]: { ...notes[id], ...updates, updated: Date.now() } };
    setNotes(newNotes);
    saveNotes(newNotes);
    setEditingNote(null);
  };

  const deleteNote = async (id) => {
    const newNotes = { ...notes };
    delete newNotes[id];
    setNotes(newNotes);
    await saveNotes(newNotes);
    setEditingNote(null);
  };

  const stats = {
    total: Object.keys(tasks).length,
    todo: Object.values(tasks).filter(t => t.status === 'todo').length,
    progress: Object.values(tasks).filter(t => t.status === 'progress').length,
    review: Object.values(tasks).filter(t => t.status === 'review').length,
    done: Object.values(tasks).filter(t => t.status === 'done').length
  };

  const columnIcons = { todo: '📋', progress: '🔥', review: '👀', done: '✅' };
  const columnLabels = { todo: 'To Do', progress: 'In Progress', review: 'Review', done: 'Done' };

  const tools = [
    { i: '📄', n: 'Docs', u: 'https://docs.google.com' },
    { i: '📊', n: 'Sheets', u: 'https://sheets.google.com' },
    { i: '☁️', n: 'Drive', u: 'https://drive.google.com' },
    { i: '📅', n: 'Calendar', u: 'https://calendar.google.com' },
    { i: '✉️', n: 'Gmail', u: 'https://mail.google.com' },
    { i: '🖼️', n: 'Photos', u: 'https://photos.google.com' }
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(55, 65, 81, 0.3)', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              🚀 Mission Control
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>Drag cards between columns</p>
          </div>
          <div className={`status-badge ${syncStatus.type}`}>
            <span className={`status-dot ${syncStatus.type}`}></span>
            <span>{syncStatus.text}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ position: 'sticky', top: '5.5rem', zIndex: 30, background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(55, 65, 81, 0.3)', padding: '0.75rem 1.25rem' }}>
        <div className="tab-scroll">
          {['tasks', 'notes', 'files', 'tools'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : 'inactive'}`}
            >
              {tab === 'tasks' ? '📋 Tasks' : tab === 'notes' ? '📝 Notes' : tab === 'files' ? '📁 Files' : '🔧 Tools'}
            </button>
          ))}
        </div>
      </div>

            {/* Scroll Position Indicator - fixed outside scroll container */}
      <div style={{ position: 'fixed', left: 0, top: '5.5rem', bottom: '4.5rem', width: '4px', background: 'rgba(55, 65, 81, 0.5)', zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${scrollProgress}%`, background: 'linear-gradient(180deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)', transition: 'height 0.1s ease-out', boxShadow: '0 0 8px rgba(167, 139, 250, 0.5)' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', touchAction: 'pan-y' }}>
        {/* Stats */}
        <div className="stats-scroll">
          <div className="stat-pill">Total: <span>{stats.total}</span></div>
          <div className="stat-pill" style={{ color: '#f87171' }}>To Do: <span>{stats.todo}</span></div>
          <div className="stat-pill" style={{ color: '#fbbf24' }}>Progress: <span>{stats.progress}</span></div>
          <div className="stat-pill" style={{ color: '#34d399' }}>Done: <span>{stats.done}</span></div>
        </div>

        {/* Tasks Board */}
        {activeTab === 'tasks' && (
          <div className="board-container" style={{ touchAction: 'pan-y' }}>
            {['todo', 'progress', 'review', 'done'].map(status => (
              <TaskColumn
                key={status}
                status={status}
                tasks={tasks}
                columnIcons={columnIcons}
                columnLabels={columnLabels}
                onTaskClick={(task) => setEditingTask(task)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                isOver={overColumn === `column-${status}`}
              />
            ))}
          </div>
        )}

        {/* Notes */}
        {activeTab === 'notes' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.keys(notes).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  No notes yet. Create your first note!
                </div>
              ) : (
                Object.values(notes).sort((a, b) => b.updated - a.updated).map(note => (
                  <NoteCard key={note.id} note={note} onClick={() => setEditingNote(note)} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Files */}
        {activeTab === 'files' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div className="grid-card">
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📁</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>Template Pack V4</div>
              </div>
              <div className="grid-card">
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🎨</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>Brand Assets</div>
              </div>
            </div>
          </div>
        )}

        {/* Tools */}
        {activeTab === 'tools' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {tools.map(tool => (
                <div key={tool.n} className="grid-card" onClick={() => window.open(tool.u, '_blank')}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{tool.i}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{tool.n}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.5rem' }}>
          {[{ id: 'tasks', icon: '📋', label: 'Tasks' }, { id: 'notes', icon: '📝', label: 'Notes' }, { id: 'files', icon: '📁', label: 'Files' }, { id: 'tools', icon: '🔧', label: 'Tools' }].map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-label">{item.label}</div>
            </div>
          ))}
        </div>
      </nav>

      {/* FAB Buttons */}
      {activeTab === 'tasks' && <button className="fab" onClick={() => setShowAddTask(true)}>+</button>}
      {activeTab === 'notes' && <button className="fab" onClick={() => setShowAddNote(true)}>+</button>}

      {/* Add Task Modal */}
      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="New Task">
        <form onSubmit={(e) => { e.preventDefault(); const f = e.target; addTask({ title: f.title.value, category: f.category.value, priority: f.priority.value, status: 'todo' }); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Title</label>
              <input name="title" required className="form-input" placeholder="Task title..." autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Category</label>
              <select name="category" className="form-select">
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
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Priority</label>
              <select name="priority" className="form-select">
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={editingTask !== null} onClose={() => setEditingTask(null)} title="Task Details">
        {editingTask && (
          <form onSubmit={(e) => { e.preventDefault(); const f = e.target; updateTask(editingTask.id, { title: f.title.value, category: f.category.value, priority: f.priority.value, status: f.status.value }); setEditingTask(null); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Status</label>
                <select name="status" className="form-select" defaultValue={editingTask.status}>
                  <option value="todo">📋 To Do</option>
                  <option value="progress">🔥 In Progress</option>
                  <option value="review">👀 Review</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Title</label>
                <input name="title" required className="form-input" defaultValue={editingTask.title} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Category</label>
                <select name="category" className="form-select" defaultValue={editingTask.category}>
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
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Priority</label>
                <select name="priority" className="form-select" defaultValue={editingTask.priority}>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-danger" onClick={() => { deleteTask(editingTask.id); setEditingTask(null); }}>Delete</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Note Modal */}
      <Modal isOpen={showAddNote} onClose={() => setShowAddNote(false)} title="New Note">
        <form onSubmit={(e) => { e.preventDefault(); const f = e.target; addNote({ title: f.title.value, content: f.content.value, type: f.type.value }); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Title</label>
              <input name="title" required className="form-input" placeholder="Note title..." autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Content</label>
              <textarea name="content" className="form-textarea" placeholder="Brain dump, ideas, meeting notes..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Type</label>
              <select name="type" className="form-select">
                <option value="brain_dump">🧠 Brain Dump</option>
                <option value="meeting">📅 Meeting Notes</option>
                <option value="idea">💡 Idea</option>
                <option value="project">📋 Project</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddNote(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      {/* Edit Note Modal */}
      <Modal isOpen={editingNote !== null} onClose={() => setEditingNote(null)} title="Edit Note">
        {editingNote && (
          <form onSubmit={(e) => { e.preventDefault(); const f = e.target; updateNote(editingNote.id, { title: f.title.value, content: f.content.value, type: f.type.value }); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Title</label>
                <input name="title" required className="form-input" defaultValue={editingNote.title} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Content</label>
                <textarea name="content" className="form-textarea" defaultValue={editingNote.content} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Type</label>
                <select name="type" className="form-select" defaultValue={editingNote.type}>
                  <option value="brain_dump">🧠 Brain Dump</option>
                  <option value="meeting">📅 Meeting Notes</option>
                  <option value="idea">💡 Idea</option>
                  <option value="project">📋 Project</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-danger" onClick={() => { deleteNote(editingNote.id); }}>Delete</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default App;
