import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Calendar, 
  Plus, 
  X,
  GripVertical,
  CheckCircle2,
  Paperclip,
  Trash2,
  CheckSquare,
  Upload,
  ExternalLink,
  ChevronDown,
  Clock
} from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
  rectIntersection,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db, ref, onValue, push, update, remove, set, database, storageService } from '../lib/firebase';

const COLUMNS = [
  { id: 'todo', title: 'Todo', color: 'border-white/20' },
  { id: 'progress', title: 'In Progress', color: 'border-gold/40' },
  { id: 'review', title: 'Review', color: 'border-purple/40' },
  { id: 'done', title: 'Done', color: 'border-green-500/40' },
];

const SortableCard = ({ card, id, onClick, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isOverlay });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  if (!card) return null;

  const completedItems = card.checklist ? Object.values(card.checklist).filter(item => item.completed).length : 0;
  const totalItems = card.checklist ? Object.values(card.checklist).length : 0;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`touch-manipulation mb-3 select-none outline-none ${isDragging ? 'z-50' : ''}`}
    >
      <div 
        onClick={(e) => {
          if (!isDragging && onClick) {
            e.stopPropagation();
            onClick(card, id);
          }
        }}
        className={`glass p-3.5 rounded-2xl border-l-[3px] border-l-white/10 active:bg-white/5 transition-all group relative ${isDragging ? 'cursor-grabbing shadow-2xl scale-[1.02]' : 'cursor-default'}`}
      >
        <div className="flex justify-between items-start mb-1.5">
          <div className="flex flex-wrap gap-1">
            {card.tags?.map(tag => (
              <span key={tag} className="text-[7px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full text-white/30">
                {tag}
              </span>
            ))}
            {card.priority === 'high' && (
               <span className="text-[7px] font-black uppercase tracking-widest bg-red-500/20 px-2 py-0.5 rounded-full text-red-400">
                High
              </span>
            )}
          </div>
          <div 
            {...attributes} 
            {...listeners} 
            className="p-2 -m-2 text-white/10 hover:text-white/40 touch-manual z-10 cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={18} />
          </div>
        </div>
        
        <h4 className="font-bold text-[13px] mb-1 leading-tight tracking-tight text-white/90">{card.title}</h4>
        <p className="text-[11px] text-white/30 mb-3 line-clamp-2 leading-relaxed font-medium">{card.description}</p>
        
        <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
          <div className="flex items-center gap-2.5 text-white/20">
            {totalItems > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare size={10} className={completedItems === totalItems ? 'text-green-500/60' : ''} />
                <span className="text-[9px] font-mono tracking-tighter">{completedItems}/{totalItems}</span>
              </div>
            )}
            {card.files && Object.keys(card.files).length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip size={10} />
                <span className="text-[9px] font-mono">{Object.keys(card.files).length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/20">
             <Clock size={10} className="opacity-40" />
             <span className="text-[9px] font-mono uppercase opacity-40">
                {card.createdAt ? new Date(card.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Feb 14'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DroppableColumn = ({ id, title, color, count, children, onAdd }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="kanban-column min-w-[85vw] md:min-w-[320px] h-full flex flex-col">
      <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${color}`}>
        <h3 className="font-black uppercase tracking-widest text-[11px] italic">{title}</h3>
        <span className="text-[10px] font-mono text-white/20">{count}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 min-h-[150px]">
        {children}
        <button 
          onClick={onAdd}
          className="w-full py-6 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-white/10 hover:border-white/20 hover:text-white/40 transition-all active:scale-[0.98]"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

const Kanban = () => {
  const [tasks, setTasks] = useState({});
  const [localTaskIds, setLocalTaskIds] = useState({ todo: [], progress: [], review: [], done: [] });
  const [activeId, setActiveId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newCheckItem, setNewCheckItem] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', column: 'todo', priority: 'medium', tags: [] });

  useEffect(() => {
    const tasksRef = ref(database, 'workspaces/winslow_main/tasks');
    return onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTasks(data);
    });
  }, []);

  useEffect(() => {
    if (!activeId) {
      const acc = { todo: [], progress: [], review: [], done: [] };
      const sortedTasks = Object.entries(tasks).sort((a, b) => (a[1].position || 0) - (b[1].position || 0));
      sortedTasks.forEach(([id, task]) => {
        if (acc[task.column]) acc[task.column].push(id);
      });
      setLocalTaskIds(acc);
    }
  }, [tasks, activeId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 8 } 
    }),
    useSensor(TouchSensor, { 
      activationConstraint: { delay: 0, tolerance: 10 }
    })
  );

  const findColumnOfId = (id) => {
    if (localTaskIds[id]) return id;
    return Object.keys(localTaskIds).find(key => localTaskIds[key].includes(id));
  };

  const persistOrder = async (columnId, ids) => {
    const updates = {};
    ids.forEach((id, index) => {
      updates[`workspaces/winslow_main/tasks/${id}/position`] = index;
      updates[`workspaces/winslow_main/tasks/${id}/column`] = columnId;
    });
    await update(ref(database), updates);
  };

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findColumnOfId(activeId);
    const overContainer = findColumnOfId(overId);

    if (!activeContainer || !overContainer) return;

    // Handle same column reordering
    if (activeContainer === overContainer) {
      setLocalTaskIds((prev) => {
        const items = prev[activeContainer];
        const activeIndex = items.indexOf(activeId);
        const overIndex = items.indexOf(overId);
        
        if (activeIndex !== overIndex && overIndex !== -1) {
          return {
            ...prev,
            [activeContainer]: arrayMove(items, activeIndex, overIndex)
          };
        }
        return prev;
      });
      return;
    }

    // Handle cross-column movement
    setLocalTaskIds((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      return {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item !== activeId),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeId,
          ...overItems.slice(newIndex)
        ]
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over) {
      const overContainer = findColumnOfId(over.id);
      if (overContainer) {
        Object.keys(localTaskIds).forEach(colId => {
          persistOrder(colId, localTaskIds[colId]);
        });
      }
    }
  };

  const addTask = async () => {
    if (!newTask.title) return;
    const taskRef = push(ref(database, 'workspaces/winslow_main/tasks'));
    await update(taskRef, {
      ...newTask,
      id: taskRef.key,
      position: localTaskIds[newTask.column]?.length || 0,
      createdAt: Date.now()
    });
    setNewTask({ title: '', description: '', column: 'todo', priority: 'medium', tags: [] });
    setShowAddModal(false);
  };

  const saveEdit = async (data = editData) => {
    if (!data.title) return;
    await update(ref(database, `workspaces/winslow_main/tasks/${selectedTask.id}`), data);
    setSelectedTask({ ...data, id: selectedTask.id });
    setIsEditing(false);
  };

  const updateColumnManually = async (newColumn) => {
    if (!selectedTask) return;
    await update(ref(database, `workspaces/winslow_main/tasks/${selectedTask.id}`), {
      column: newColumn,
      position: localTaskIds[newColumn]?.length || 0
    });
    setSelectedTask(prev => ({ ...prev, column: newColumn }));
  };

  const addChecklistItem = async () => {
    if (!newCheckItem) return;
    const itemRef = push(ref(database, `workspaces/winslow_main/tasks/${selectedTask.id}/checklist`));
    await set(itemRef, { text: newCheckItem, completed: false });
    setNewCheckItem('');
  };

  const toggleChecklistItem = async (itemId, completed) => {
    await update(ref(database, `workspaces/winslow_main/tasks/${selectedTask.id}/checklist/${itemId}`), { completed: !completed });
  };

  const deleteChecklistItem = async (itemId) => {
    await remove(ref(database, `workspaces/winslow_main/tasks/${selectedTask.id}/checklist/${itemId}`));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await storageService.upload(file, `tasks/${selectedTask.id}`);
      const fileRef = push(ref(database, `workspaces/winslow_main/tasks/${selectedTask.id}/files`));
      await set(fileRef, { name: file.name, url, type: file.type, uploadedAt: Date.now() });
    } catch (err) { alert('Upload failed'); } finally { setUploading(false); }
  };

  return (
    <div className="h-full flex flex-col relative overflow-x-auto overflow-y-hidden">
      <div className="px-6 py-3 flex items-center justify-between flex-shrink-0">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 italic">Tasks</h2>
        <div className="flex gap-2 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse"></div>
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar px-2 lg:px-6 pt-2 pb-12 flex gap-3 lg:gap-4">
          {COLUMNS.map(column => (
            <DroppableColumn 
              key={column.id} 
              id={column.id} 
              title={column.title} 
              color={column.color} 
              count={localTaskIds[column.id]?.length || 0}
              onAdd={() => {
                setNewTask(prev => ({ ...prev, column: column.id }));
                setShowAddModal(true);
              }}
            >
              <SortableContext items={localTaskIds[column.id] || []} strategy={verticalListSortingStrategy}>
                {localTaskIds[column.id]?.map(id => (
                  <SortableCard 
                    key={id} 
                    id={id} 
                    card={tasks[id]} 
                    onClick={(card, cardId) => {
                      setSelectedTask({ ...card, id: cardId });
                      setEditData({ ...card });
                      setIsEditing(false);
                    }}
                  />
                ))}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeId && tasks[activeId] ? (
            <div className="opacity-90 drop-shadow-2xl cursor-grabbing rotate-2">
               <SortableCard id={activeId} card={tasks[activeId]} isOverlay onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedTask(null); setIsEditing(false); }} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="glass w-full max-w-xl p-8 rounded-t-[3rem] sm:rounded-[3rem] relative z-10 border border-white/10 overflow-y-auto max-h-[92vh] no-scrollbar" >
              <div className="flex justify-between items-start mb-8">
                <div className="flex flex-wrap gap-2">
                  <div className="relative group">
                    <select value={selectedTask.column} onChange={(e) => updateColumnManually(e.target.value)} className="text-[10px] font-black uppercase tracking-[0.2em] bg-gold text-black pl-4 pr-10 py-2.5 rounded-full appearance-none outline-none font-sans" >
                      {COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                  </div>
                </div>
                <button onClick={() => { setSelectedTask(null); setIsEditing(false); }} className="text-white/20 hover:text-white p-2"><X size={28} /></button>
              </div>

              {isEditing ? (
                <div className="space-y-6 mb-8 text-white">
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 block italic">// Title</label>
                    <input type="text" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold focus:border-gold/50 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 block italic">// Description</label>
                    <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm h-40 focus:border-gold/50 outline-none" />
                  </div>
                </div>
              ) : (
                <div className="mb-8 text-white">
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4 leading-none">{selectedTask.title}</h3>
                  <div className="text-sm text-white/60 leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5 font-medium mb-8">
                    {selectedTask.description || "No description provided."}
                  </div>

                  <div className="mb-8">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4 block italic">// Checklist</label>
                    <div className="space-y-3 mb-4">
                      {tasks[selectedTask.id]?.checklist && Object.entries(tasks[selectedTask.id].checklist).map(([id, item]) => (
                        <div key={id} className="flex items-center justify-between group bg-white/5 p-3 rounded-xl border border-white/5">
                          <button onClick={() => toggleChecklistItem(id, item.completed)} className="flex items-center gap-3 flex-1 text-left" >
                            {item.completed ? <CheckCircle2 size={18} className="text-gold" /> : <div className="w-[18px] h-[18px] rounded-md border-2 border-white/20"></div>}
                            <span className={`text-[13px] ${item.completed ? 'text-white/20 line-through' : 'text-white/70'}`}>{item.text}</span>
                          </button>
                          <button onClick={() => deleteChecklistItem(id)} className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newCheckItem} onChange={e => setNewCheckItem(e.target.value)} onKeyPress={e => e.key === 'Enter' && addChecklistItem()} placeholder="New step..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/50 text-white" />
                      <button onClick={addChecklistItem} className="p-3 bg-white/10 rounded-xl text-white/60 hover:text-white"><Plus size={20} /></button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4 block italic">// Assets</label>
                    <div className="grid grid-cols-1 gap-2 mb-4">
                       {tasks[selectedTask.id]?.files && Object.entries(tasks[selectedTask.id].files).map(([id, file]) => (
                         <a key={id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all" >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Paperclip size={16} className="text-gold flex-shrink-0" />
                              <span className="text-xs font-medium truncate text-white/70">{file.name}</span>
                            </div>
                            <ExternalLink size={14} className="text-white/20" />
                         </a>
                       ))}
                    </div>
                    <label className={`flex items-center justify-center gap-2 w-full py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-gold/30 hover:text-white transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                      <Upload size={18} className={uploading ? 'animate-bounce' : ''} />
                      <span className="text-xs font-black uppercase tracking-widest text-white/40">{uploading ? 'Uploading...' : 'Attach File'}</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                 {isEditing ? (
                   <>
                    <button onClick={() => saveEdit()} className="flex-1 bg-gold text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl active:scale-[0.98] transition-all" >Save</button>
                    <button onClick={() => setIsEditing(false)} className="px-8 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest py-5 rounded-2xl">Cancel</button>
                   </>
                 ) : (
                   <>
                    <button onClick={() => setIsEditing(true)} className="flex-1 bg-white text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl active:scale-[0.98] transition-all" >Edit</button>
                    <button onClick={async () => { if(confirm('Delete task?')) { await remove(ref(database, `workspaces/winslow_main/tasks/${selectedTask.id}`)); setSelectedTask(null); } }} className="px-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-black uppercase tracking-widest py-5 rounded-2xl transition-all" >Delete</button>
                   </>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="glass w-full max-w-lg p-10 rounded-[3rem] relative z-10 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]" >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none text-white">New <span className="text-gold">Task</span></h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/20 hover:text-white"><X size={32} /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3 block italic">// Title</label>
                  <input type="text" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-gold/50 transition-colors text-white" placeholder="Task title..." />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3 block italic">// Description</label>
                  <textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm h-32 outline-none focus:border-gold/50 transition-colors text-white" placeholder="Task details..." />
                </div>
                <button onClick={addTask} className="w-full bg-gold text-black font-black uppercase tracking-[0.3em] py-6 rounded-2xl active:scale-[0.98] transition-all" >Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Kanban;
