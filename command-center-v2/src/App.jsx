// Mission Control 2.0 - Premium Dashboard with Firebase, Kanban, Google Workspace, Agent Status & Skills
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, FolderKanban, FileText, Folder, 
  Settings, Search, Command, X, Plus, Calendar,
  Mail, Cloud, Calendar as CalendarIcon, Users,
  Activity, Zap, ChevronRight, GripVertical,
  Star, Clock, Tag, MoreHorizontal, Image, Video,
  Layout, RefreshCw, CheckCircle, Loader, Menu, XCircle,
  Upload, File, Trash2
} from 'lucide-react'

// Colors
const colors = {
  bg: '#0A0A0B',
  bgSecondary: '#141416',
  bgTertiary: '#1C1C1F',
  border: '#27272A',
  accent: '#6366F1',
  accentHover: '#818CF8',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}

// Navigation
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'files', label: 'Files', icon: Folder },
  { id: 'agents', label: 'Agents', icon: Activity },
  { id: 'workspace', label: 'Workspace', icon: Mail },
]

// Kanban columns
const kanbanColumns = [
  { id: 'backlog', title: 'Backlog', color: '#71717A' },
  { id: 'todo', title: 'Todo', color: '#6366F1' },
  { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'done', title: 'Done', color: '#10B981' },
]

// Sample projects for Kanban
const initialProjects = [
  { id: 1, title: 'AI Skills Studio v2', status: 'in-progress', priority: 'high' },
  { id: 2, title: 'Client Dashboard Redesign', status: 'todo', priority: 'medium' },
  { id: 3, title: 'Template Pack Launch', status: 'done', priority: 'high' },
  { id: 4, title: 'Mobile App MVP', status: 'backlog', priority: 'low' },
]

// Command Palette
function CommandPalette({ isOpen, onClose }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)
  
  const quickActions = [
    { id: 'new-project', label: 'New Project', shortcut: '⌘N' },
    { id: 'new-note', label: 'New Note', shortcut: '⌘⇧N' },
    { id: 'search', label: 'Search', shortcut: '⌘K' },
  ]

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#1C1C1F] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-[#27272A]">
          <Search size={18} className="text-[#71717A]" />
          <input ref={inputRef} type="text" placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-3 bg-transparent text-[#FAFAFA] placeholder-[#71717A] outline-none" />
          <button onClick={onClose}><X size={16} className="text-[#71717A]" /></button>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {quickActions.filter(a => a.label.toLowerCase().includes(search.toLowerCase())).map(action => (
            <button key={action.id} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#27272A]">
              <span className="text-[#FAFAFA]">{action.label}</span>
              <span className="text-[#71717A] text-sm font-mono">{action.shortcut}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Sidebar
function Sidebar({ activeTab, onTabChange, isOpen, onClose }) {
  return (
    <div className={`fixed lg:relative z-40 h-screen bg-[#141416] border-r border-[#27272A] flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-60`}>
      <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[#FAFAFA] flex items-center gap-2">
          <Zap size={20} className="text-[#6366F1]" />Mission Control
        </h1>
        <button onClick={onClose} className="lg:hidden"><X size={20} /></button>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        {navItems.map(item => (
          <button key={item.id} onClick={() => { onTabChange(item.id); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeTab === item.id ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'text-[#A1A1AA] hover:bg-[#1C1C1F]'}`}>
            <item.icon size={18} /><span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// Kanban Card
function KanbanCard({ project, onMove }) {
  const priorityColors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-3 bg-[#141416] rounded-lg border border-[#27272A] cursor-grab active:cursor-grabbing mb-2">
      <p className="text-sm font-medium text-[#FAFAFA]">{project.title}</p>
      <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full" 
        style={{ backgroundColor: `${priorityColors[project.priority]}20`, color: priorityColors[project.priority] }}>
        {project.priority}
      </span>
    </motion.div>
  )
}

// Kanban Column
function KanbanColumn({ column, projects, onAdd, onMove }) {
  return (
    <div className="flex-shrink-0 w-72 bg-[#1C1C1F] rounded-xl p-3 mr-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="text-sm font-medium text-[#FAFAFA]">{column.title}</h3>
          <span className="text-xs text-[#71717A]">({projects.length})</span>
        </div>
        <button onClick={onAdd} className="p-1 hover:bg-[#27272A] rounded"><Plus size={16} className="text-[#71717A]" /></button>
      </div>
      <div className="space-y-2 min-h-[200px]">
        {projects.map(p => <KanbanCard key={p.id} project={p} onMove={onMove} />)}
      </div>
    </div>
  )
}

// Projects Tab (Kanban)
function ProjectsTab({ projects, setProjects }) {
  const [newCard, setNewCard] = useState({ title: '', column: 'todo' })
  
  const addCard = () => {
    if (!newCard.title.trim()) return
    setProjects([...projects, { id: Date.now(), title: newCard.title, status: newCard.column, priority: 'medium' }])
    setNewCard({ title: '', column: 'todo' })
  }

  return (
    <div className="p-4 lg:p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl font-semibold text-[#FAFAFA]">Projects</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="New task..." value={newCard.title}
            onChange={e => setNewCard({ ...newCard, title: e.target.value })}
            className="px-3 py-2 bg-[#1C1C1F] border border-[#27272A] rounded-lg text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none" />
          <select value={newCard.column} onChange={e => setNewCard({ ...newCard, column: e.target.value })}
            className="px-3 py-2 bg-[#1C1C1F] border border-[#27272A] rounded-lg text-sm text-[#FAFAFA] outline-none">
            {kanbanColumns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button onClick={addCard} className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#818CF8]">
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
        {kanbanColumns.map(col => (
          <KanbanColumn key={col.id} column={col} projects={projects.filter(p => p.status === col.id)} onAdd={() => setNewCard({ ...newCard, column: col.id })} />
        ))}
      </div>
    </div>
  )
}

// Dashboard Tab
function DashboardTab({ projects }) {
  const stats = { projects: projects.length || 0, tasks: projects.filter(p => p.status === 'in-progress').length || 0, notes: 12, team: 5 }
  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <h2 className="text-xl lg:text-2xl font-semibold text-[#FAFAFA]">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: stats.projects, icon: FolderKanban, color: '#6366F1' },
          { label: 'Active Tasks', value: stats.tasks, icon: Activity, color: '#10B981' },
          { label: 'Notes', value: stats.notes, icon: FileText, color: '#F59E0B' },
          { label: 'Team', value: stats.team, icon: Users, color: '#EF4444' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-4 bg-[#1C1C1F] rounded-xl border border-[#27272A]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <span className="text-[#71717A] text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-[#FAFAFA]">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Notes Tab
function NotesTab() {
  const notes = [
    { id: 1, title: 'Q1 Roadmap', content: 'Focus on AI features and automation...' },
    { id: 2, title: 'Design System', content: 'Use Linear-inspired patterns...' },
  ]
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-semibold text-[#FAFAFA]">Notes</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#818CF8]">
          <Plus size={16} /><span className="text-sm">Add Note</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map(note => (
          <div key={note.id} className="p-4 bg-[#1C1C1F] rounded-xl border border-[#27272A]">
            <h3 className="text-lg font-medium text-[#FAFAFA]">{note.title}</h3>
            <p className="text-sm text-[#71717A] mt-1">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Files Tab with Upload
function FilesTab() {
  const [files, setFiles] = useState([
    { id: 1, name: 'Project Specs.pdf', type: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'Design Assets.zip', type: 'zip', size: '15 MB' },
  ])
  const [uploading, setUploading] = useState(false)

  const handleUpload = (e) => {
    const uploaded = Array.from(e.target.files).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      type: f.name.split('.').pop(),
      size: (f.size / 1024 / 1024).toFixed(1) + ' MB'
    }))
    setFiles([...files, ...uploaded])
    setUploading(false)
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-semibold text-[#FAFAFA]">Files</h2>
        <label className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#818CF8] cursor-pointer">
          <Upload size={16} /><span className="text-sm">Upload</span>
          <input type="file" multiple className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.map(file => (
          <div key={file.id} className="p-4 bg-[#1C1C1F] rounded-xl border border-[#27272A] flex items-center gap-3">
            <File size={24} className="text-[#6366F1]" />
            <div>
              <p className="text-sm font-medium text-[#FAFAFA] truncate max-w-[150px]">{file.name}</p>
              <p className="text-xs text-[#71717A]">{file.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Agents Tab
function AgentsTab() {
  const agents = [
    { id: 1, name: 'Scout', role: 'Research', status: 'active', tasks: 12 },
    { id: 2, name: 'Builder', role: 'Engineering', status: 'idle', tasks: 3 },
    { id: 3, name: 'Artist', role: 'Creative', status: 'active', tasks: 8 },
  ]
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-semibold text-[#FAFAFA]">Agent Swarm</h2>
        <span className="flex items-center gap-2 text-sm text-[#10B981]"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />Live</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="p-4 bg-[#1C1C1F] rounded-xl border border-[#27272A]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-[#10B981]' : 'bg-[#71717A]'}`} />
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">{agent.name}</p>
                  <p className="text-xs text-[#71717A]">{agent.role}</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-[#6366F1]/10 text-[#6366F1] rounded-full">{agent.tasks} tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Workspace Tab
function WorkspaceTab() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <h2 className="text-xl lg:text-2xl font-semibold text-[#FAFAFA]">Google Workspace</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Gmail', icon: Mail, color: '#6366F1', info: '5 unread' },
          { label: 'Calendar', icon: CalendarIcon, color: '#10B981', info: '2 events today' },
          { label: 'Drive', icon: Cloud, color: '#F59E0B', info: '12 recent files' },
        ].map(item => (
          <div key={item.label} className="p-4 bg-[#1C1C1F] rounded-xl border border-[#27272A]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#FAFAFA]">{item.label}</p>
                <p className="text-xs text-[#71717A]">{item.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main App
export default function MissionControl() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [commandOpen, setCommandOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projects, setProjects] = useState(initialProjects)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCommandOpen(true) }
      if (e.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab projects={projects} />
      case 'projects': return <ProjectsTab projects={projects} setProjects={setProjects} />
      case 'notes': return <NotesTab />
      case 'files': return <FilesTab />
      case 'agents': return <AgentsTab />
      case 'workspace': return <WorkspaceTab />
      default: return <DashboardTab projects={projects} />
    }
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="flex-1 overflow-auto">
        <div className="lg:hidden p-4 border-b border-[#27272A] flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-[#1C1C1F] rounded-lg">
            <Menu size={24} className="text-[#FAFAFA]" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-[#FAFAFA]">Mission Control</h1>
        </div>
        {renderTab()}
      </main>
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  )
}
