// Mission Control 2.0 - Redesigned with Tailwind CSS
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, FolderKanban, FileText, Folder, 
  Search, X, Plus, Mail, Cloud, Calendar, Users,
  Activity, Zap, Menu, Settings, Bell, ChevronRight,
  GripHorizontal, Edit3, Trash2, Check, Clock, AlertCircle,
  LogIn, File, FileText as FileTextIcon, Loader2, RefreshCw
} from 'lucide-react'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set, push } from 'firebase/database'
import googleWorkspace from './googleWorkspace'

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD0Z7R2J8kF3L5N9P1Q2R4S6V8X0Y2Z4",
  authDomain: "winslow-756c3.firebaseapp.com",
  databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
  projectId: "winslow-756c3"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Kanban columns
const kanbanColumns = [
  { id: 'backlog', title: 'Backlog', color: '#71717A' },
  { id: 'todo', title: 'To Do', color: '#6366F1' },
  { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'done', title: 'Done', color: '#10B981' },
]

// Initial tasks
const initialTasks = [
  { id: 1, title: 'Design new landing page', status: 'in-progress', priority: 'high' },
  { id: 2, title: 'Set up Firebase auth', status: 'todo', priority: 'high' },
  { id: 3, title: 'Write API documentation', status: 'backlog', priority: 'medium' },
  { id: 4, title: 'Deploy to production', status: 'done', priority: 'high' },
  { id: 5, title: 'User testing round 1', status: 'todo', priority: 'medium' },
]

// Sidebar
function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'files', label: 'Files', icon: Folder },
    { id: 'agents', label: 'Agents', icon: Activity },
    { id: 'workspace', label: 'Workspace', icon: Mail },
  ]
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 h-screen bg-[#0D0D0F] border-r border-[#27272A] flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 lg:w-64'} overflow-hidden`}>
        {/* Logo */}
        <div className="p-4 border-b border-[#27272A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Mission Control</span>
          </div>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        
        {/* User */}
        <div className="p-3 border-t border-[#27272A]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
              B
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Bobby</p>
              <p className="text-xs text-zinc-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// Sortable Task Card
function TaskCard({ task, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const priorityColors = {
    high: 'text-red-400 bg-red-400/10',
    medium: 'text-amber-400 bg-amber-400/10',
    low: 'text-emerald-400 bg-emerald-400/10',
  }
  
  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className={`bg-[#18181B] rounded-lg border border-[#27272A] p-3 hover:border-indigo-500/50 transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}>
        <div className="flex items-start gap-2">
          <button {...attributes} {...listeners} className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripHorizontal size={14} className="text-zinc-500" />
          </button>
          <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
            <p className="text-sm text-zinc-200 font-medium truncate">{task.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          </div>
          <button onClick={() => onEdit(task)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-800 rounded">
            <Edit3 size={12} className="text-zinc-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Task Card Overlay (dragging)
function TaskCardOverlay({ task }) {
  const priorityColors = {
    high: 'text-red-400 bg-red-400/10',
    medium: 'text-amber-400 bg-amber-400/10',
    low: 'text-emerald-400 bg-emerald-400/10',
  }
  
  return (
    <div className="bg-[#18181B] rounded-lg border-2 border-indigo-500 p-3 shadow-2xl cursor-grabbing">
      <p className="text-sm text-zinc-200 font-medium">{task.title}</p>
      <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
        {task.priority}
      </span>
    </div>
  )
}

// Kanban Column
function KanbanColumn({ column, tasks, onAdd, onEdit }) {
  const { setNodeRef } = useSortable({ id: column.id })
  
  return (
    <div className="flex-shrink-0 w-[85vw] sm:w-72">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="text-sm font-semibold text-zinc-300">{column.title}</h3>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button onClick={onAdd} className="p-1 hover:bg-zinc-800 rounded transition-colors touch-manipulation">
          <Plus size={16} className="text-zinc-500" />
        </button>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-2 min-h-[150px] md:min-h-[200px] p-1">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

// Edit Modal
function EditModal({ task, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(task?.title || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [status, setStatus] = useState(task?.status || 'todo')
  
  if (!task) return null
  
  const handleSave = () => {
    onSave({ ...task, title, priority, status })
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
          <h3 className="text-lg font-semibold text-white">Edit Task</h3>
          <button onClick={onClose}><X size={20} className="text-zinc-500 hover:text-white" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#27272A] rounded-lg text-white focus:border-indigo-500 outline-none transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Priority</label>
            <select 
              value={priority} 
              onChange={e => setPriority(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#27272A] rounded-lg text-white focus:border-indigo-500 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#27272A] rounded-lg text-white focus:border-indigo-500 outline-none"
            >
              {kanbanColumns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-[#27272A]">
          <button 
            onClick={() => { onDelete(task.id); onClose(); }} 
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 size={16} />Delete
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">Save</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Stats Card
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-4 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  )
}

// Dashboard View
function Dashboard({ tasks }) {
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 mt-1 text-sm md:text-base">Welcome back! Here's what's happening.</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total" value={stats.total} icon={FolderKanban} color="#6366F1" />
        <StatCard label="Active" value={stats.inProgress} icon={Clock} color="#F59E0B" />
        <StatCard label="Done" value={stats.done} icon={Check} color="#10B981" />
        <StatCard label="High" value={stats.highPriority} icon={AlertCircle} color="#EF4444" />
      </div>
      
      {/* Recent Activity */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-4">
        <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Recent Tasks</h2>
        <div className="space-y-2 md:space-y-3">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center justify-between py-2 border-b border-[#27272A] last:border-0">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
                <span className="text-zinc-300 text-sm truncate">{task.title}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${
                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>{task.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Projects (Kanban) View
function ProjectsView({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState({ title: '', column: 'todo' })
  const [editingTask, setEditingTask] = useState(null)
  const [activeId, setActiveId] = useState(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  
  const findContainer = (id) => {
    if (kanbanColumns.find(c => c.id === id)) return id
    return tasks.find(t => t.id === id)?.status
  }
  
  const handleDragStart = (event) => setActiveId(event.active.id)
  
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    
    const activeId = active.id
    const overId = over.id
    
    const activeTask = tasks.find(t => t.id === activeId)
    const activeContainer = activeTask?.status
    const overContainer = findContainer(overId)
    
    if (!activeContainer || !overContainer) return
    
    let updatedTasks
    if (activeContainer !== overContainer) {
      updatedTasks = tasks.map(t => t.id === activeId ? { ...t, status: overContainer } : t)
    } else if (activeId !== overId) {
      const columnTasks = tasks.filter(t => t.status === activeContainer)
      const oldIndex = columnTasks.findIndex(t => t.id === activeId)
      const newIndex = columnTasks.findIndex(t => t.id === overId)
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(columnTasks, oldIndex, newIndex)
        const otherTasks = tasks.filter(t => t.status !== activeContainer)
        updatedTasks = [...otherTasks, ...reordered]
      }
    }
    
    if (updatedTasks && updatedTasks !== tasks) {
      setTasks(updatedTasks)
      saveToFirebase(updatedTasks)
    }
  }
  
  const addTask = () => {
    if (!newTask.title.trim()) return
    const task = { id: Date.now(), title: newTask.title, status: newTask.column, priority: 'medium' }
    const updated = [...tasks, task]
    setTasks(updated)
    saveToFirebase(updated)
    setNewTask({ title: '', column: 'todo' })
  }
  
  const saveTask = (updated) => {
    const updatedTasks = tasks.map(t => t.id === updated.id ? updated : t)
    setTasks(updatedTasks)
    saveToFirebase(updatedTasks)
  }
  
  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    saveToFirebase(updated)
  }
  
  const saveToFirebase = async (tasks) => {
    try {
      const obj = tasks.reduce((acc, t) => { acc[t.id] = t; return acc }, {})
      await set(ref(database, 'kanban/tasks'), obj)
    } catch (e) {
      console.warn('Firebase save failed:', e)
    }
  }
  
  const activeTask = tasks.find(t => t.id === activeId)
  
  return (
    <div className="p-3 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Projects</h1>
          <p className="text-zinc-500 mt-0.5 text-sm">Drag to reorder • Click to edit</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="New task..." 
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            className="px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-white placeholder-zinc-500 focus:border-indigo-500 outline-none w-full sm:w-40 md:w-64"
          />
          <select 
            value={newTask.column}
            onChange={e => setNewTask({ ...newTask, column: e.target.value })}
            className="px-2 md:px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
          >
            {kanbanColumns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button onClick={addTask} className="px-3 md:px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors touch-manipulation">
            <Plus size={18} />
          </button>
        </div>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-3 px-3 md:mx-0 md:px-0 md:w-full">
          {kanbanColumns.map(col => (
            <KanbanColumn 
              key={col.id} 
              column={col} 
              tasks={tasks.filter(t => t.status === col.id)} 
              onAdd={() => setNewTask({ ...newTask, column: col.id })}
              onEdit={setEditingTask}
            />
          ))}
        </div>
        <DragOverlay>{activeTask ? <TaskCardOverlay task={activeTask} /> : null}</DragOverlay>
      </DndContext>
      
      <EditModal 
        task={editingTask} 
        onClose={() => setEditingTask(null)} 
        onSave={saveTask} 
        onDelete={deleteTask}
      />
    </div>
  )
}

// Workspace View - Google Workspace Integration
function WorkspaceView() {
  const [gmail, setGmail] = useState({ unreadCount: 0, recentEmails: [], connected: false })
  const [calendar, setCalendar] = useState({ events: [], connected: false })
  const [drive, setDrive] = useState({ files: [], connected: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading Google Workspace data
    // In production, this would call the actual Google APIs
    setTimeout(() => {
      setGmail({
        unreadCount: 5,
        recentEmails: [
          { id: '1', subject: 'Project Update', from: 'team@aiskills.studio', snippet: 'Latest updates on the new feature...' },
          { id: '2', subject: 'Meeting Tomorrow', from: 'bobby@framelensmedia.com', snippet: 'Don\'t forget our standup at 9am...' },
          { id: '3', subject: 'Invoice #1234', from: 'billing@company.com', summary: 'Your invoice is ready for review' },
        ],
        connected: true
      })
      setCalendar({
        events: [
          { id: '1', summary: 'Team Standup', start: { dateTime: '09:00' }, end: { dateTime: '09:30' }, color: '#6366F1' },
          { id: '2', summary: 'Project Review', start: { dateTime: '14:00' }, end: { dateTime: '15:00' }, color: '#F59E0B' },
          { id: '3', summary: 'Client Call', start: { dateTime: '16:00' }, end: { dateTime: '16:30' }, color: '#10B981' },
        ],
        connected: true
      })
      setDrive({
        files: [
          { id: '1', name: 'Q1 Roadmap.pdf', mimeType: 'application/pdf', modifiedTime: '2 hours ago' },
          { id: '2', name: 'Design Assets.zip', mimeType: 'application/zip', modifiedTime: 'Yesterday' },
          { id: '3', name: 'Meeting Notes.docx', mimeType: 'application/vnd.google-apps.document', modifiedTime: '2 days ago' },
          { id: '4', name: 'Project Specs', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '1 week ago' },
        ],
        connected: true
      })
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-5 h-5 border-2 border-zinc-500 border-t-indigo-500 rounded-full animate-spin" />
          <span>Loading Workspace...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Google Workspace</h1>
        <p className="text-zinc-500 mt-1 text-sm">Your connected apps and files</p>
      </div>

      {/* Gmail */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Mail size={20} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Gmail</h2>
              <p className="text-xs text-zinc-500">{gmail.unreadCount} unread</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${gmail.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
            {gmail.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="space-y-2">
          {gmail.recentEmails.slice(0, 3).map(email => (
            <div key={email.id} className="flex items-start gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
                {email.from.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{email.subject}</p>
                <p className="text-xs text-zinc-500 truncate">{email.from}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Today's Events</h2>
              <p className="text-xs text-zinc-500">{calendar.events.length} events</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${calendar.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
            {calendar.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="space-y-2">
          {calendar.events.map(event => (
            <div key={event.id} className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: event.color }} />
              <div className="flex-1">
                <p className="text-sm text-white">{event.summary}</p>
                <p className="text-xs text-zinc-500">{event.start.dateTime} - {event.end.dateTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drive */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Cloud size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Drive</h2>
              <p className="text-xs text-zinc-500">{drive.files.length} recent files</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${drive.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
            {drive.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {drive.files.slice(0, 4).map(file => (
            <div key={file.id} className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <File size={16} className="text-zinc-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.name}</p>
                <p className="text-xs text-zinc-500">{file.modifiedTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main App
export default function MissionControl() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  
  // Load from Firebase
  useEffect(() => {
    let unsubscribe = null
    const init = async () => {
      try {
        const tasksRef = ref(database, 'kanban/tasks')
        unsubscribe = onValue(tasksRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const arr = Object.entries(data).map(([id, t]) => ({ id: parseInt(id), ...t }))
            setTasks(arr)
          }
        }, () => {}) // Ignore errors
      } catch (e) {
        console.warn('Firebase init failed:', e)
      }
    }
    init()
    return () => { if (unsubscribe) unsubscribe() }
  }, [])
  
  return (
    <div className="flex h-[100dvh] bg-[#0D0D0F] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header - smaller on mobile */}
        <header className="h-12 md:h-14 border-b border-[#27272A] flex items-center justify-between px-3 md:px-4 bg-[#0D0D0F] shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 md:p-2 hover:bg-zinc-800 rounded-lg touch-manipulation">
              <Menu size={20} className="text-zinc-400" />
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-white placeholder-zinc-500 focus:border-indigo-500 outline-none w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-1.5 md:p-2 hover:bg-zinc-800 rounded-lg touch-manipulation">
              <Bell size={18} className="text-zinc-400" />
            </button>
            <button className="p-1.5 md:p-2 hover:bg-zinc-800 rounded-lg touch-manipulation">
              <Settings size={18} className="text-zinc-400" />
            </button>
          </div>
        </header>
        
        {/* Content - scrollable, safe area aware */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-safe">
          {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}
          {activeTab === 'projects' && <ProjectsView tasks={tasks} setTasks={setTasks} />}
          {activeTab === 'notes' && <div className="p-4 md:p-6"><h1 className="text-xl md:text-2xl font-bold text-white">Notes</h1><p className="text-zinc-500 mt-2">Coming soon...</p></div>}
          {activeTab === 'files' && <div className="p-4 md:p-6"><h1 className="text-xl md:text-2xl font-bold text-white">Files</h1><p className="text-zinc-500 mt-2">Coming soon...</p></div>}
          {activeTab === 'agents' && <div className="p-4 md:p-6"><h1 className="text-xl md:text-2xl font-bold text-white">Agents</h1><p className="text-zinc-500 mt-2">Coming soon...</p></div>}
          {activeTab === 'workspace' && <WorkspaceView />}
        </div>
      </main>
    </div>
  )
}
