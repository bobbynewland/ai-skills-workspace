import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  ChevronLeft, 
  Clock, 
  ExternalLink,
  Loader2,
  MoreVertical,
  Type,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Quote,
  CheckSquare,
  Eye,
  Edit3
} from 'lucide-react';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const Notes = () => {
  const [notes, setNotes] = useState({});
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localContent, setLocalContent] = useState('');
  const [localTitle, setLocalTitle] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef(null);

  // Subscribe to notes list
  useEffect(() => {
    const unsubscribe = db.notes.subscribeList((data) => {
      setNotes(data || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle Note Selection
  const selectNote = (id) => {
    setSelectedNoteId(id);
    if (id && notes[id]) {
      setLocalContent(notes[id].content || '');
      setLocalTitle(notes[id].title || '');
      setPreviewMode(false);
    }
  };

  // Live Sync / Save
  const saveNote = useCallback(async (id, title, content) => {
    if (!id) return;
    setSaving(true);
    try {
      await db.notes.updateNote(id, {
        title: title || 'Untitled Note',
        content: content || '',
        updated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  // Debounced auto-save effect
  useEffect(() => {
    if (!selectedNoteId) return;
    const timeout = setTimeout(() => {
      if (localContent !== notes[selectedNoteId]?.content || localTitle !== notes[selectedNoteId]?.title) {
        saveNote(selectedNoteId, localTitle, localContent);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [localContent, localTitle, selectedNoteId, notes, saveNote]);

  const createNewNote = async () => {
    const timestamp = new Date().toISOString();
    const newNote = {
      title: 'New Note',
      content: '',
      type: 'note',
      created: timestamp,
      updated: timestamp
    };
    const result = await db.notes.push(newNote);
    selectNote(result.key);
  };

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this note?')) {
      if (selectedNoteId === id) setSelectedNoteId(null);
      await db.notes.removeNote(id);
    }
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setLocalContent(newText);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const filteredNotes = Object.entries(notes)
    .filter(([_, note]) => 
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b[1].updated) - new Date(a[1].updated));

  // Simple Markdown Parser (very basic for preview)
  const renderPreview = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-white mb-4 mt-6">{line.substring(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-white mb-3 mt-5">{line.substring(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mb-2 mt-4">{line.substring(4)}</h3>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-gold/50 pl-4 py-1 italic text-white/60 mb-4 bg-white/5 rounded-r-lg">{line.substring(2)}</blockquote>;
      if (line.startsWith('- [ ] ')) return <div key={i} className="flex items-center gap-2 mb-1"><div className="w-4 h-4 border border-white/20 rounded" /> <span className="text-white/80">{line.substring(6)}</span></div>;
      if (line.startsWith('- [x] ')) return <div key={i} className="flex items-center gap-2 mb-1 opacity-50"><CheckSquare size={16} className="text-gold" /> <span className="line-through">{line.substring(6)}</span></div>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-white/80 mb-1">{line.substring(2)}</li>;
      
      // Basic bold/italic
      let processed = line;
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return <p key={i} className="mb-4 text-white/70 leading-relaxed min-h-[1.5em]" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="flex h-full bg-black/20 backdrop-blur-xl overflow-hidden rounded-[2.5rem] border border-white/5">
      {/* Sidebar: Note List */}
      <div className={`w-full md:w-80 border-r border-white/10 flex flex-col ${selectedNoteId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-tighter italic">
              Knowledge <span className="text-gold">Base</span>
            </h2>
            <button 
              onClick={createNewNote}
              className="w-8 h-8 glass rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-gold/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Loader2 className="animate-spin mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Syncing...</span>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-20 opacity-20 uppercase font-black text-[10px] tracking-widest italic">
              No entries found
            </div>
          ) : (
            filteredNotes.map(([id, note]) => (
              <button
                key={id}
                onClick={() => selectNote(id)}
                className={`w-full text-left p-4 rounded-2xl transition-all group relative overflow-hidden ${
                  selectedNoteId === id ? 'bg-white/10 border border-white/10 shadow-xl' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {selectedNoteId === id && (
                  <motion.div layoutId="active-note" className="absolute inset-0 bg-gold/5 -z-10" />
                )}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[7px] uppercase font-black px-1.5 py-0.5 rounded-sm border ${
                        note.type === 'idea' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5' : 'text-blue-400 border-blue-400/30 bg-blue-400/5'
                      }`}>
                        {note.type || 'note'}
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm truncate pr-6 ${selectedNoteId === id ? 'text-gold' : 'text-white/80'}`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                  </div>
                  <button 
                    onClick={(e) => deleteNote(id, e)}
                    className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity pt-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-[10px] text-white/30 line-clamp-2 leading-relaxed">
                  {note.content || 'No content...'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest opacity-30">
                  <Clock size={8} />
                  {new Date(note.updated).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main: Editor */}
      <div className={`flex-1 flex flex-col bg-white/[0.02] ${!selectedNoteId ? 'hidden md:flex' : 'flex'}`}>
        {selectedNoteId ? (
          <>
            <div className="p-4 md:p-6 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedNoteId(null)}
                  className="md:hidden w-8 h-8 glass rounded-full flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex flex-col">
                  <input 
                    type="text"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    className="bg-transparent border-none text-lg font-black uppercase tracking-tighter italic text-white focus:outline-none placeholder:opacity-20"
                    placeholder="Note Title..."
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${saving ? 'bg-gold animate-pulse' : 'bg-green-500/50'}`} />
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">
                      {saving ? 'Saving to cloud...' : 'Synced'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    previewMode ? 'bg-gold text-black' : 'glass text-white/40 hover:text-white'
                  }`}
                >
                  {previewMode ? <Edit3 size={14} /> : <Eye size={14} />}
                  {previewMode ? 'Editor' : 'Preview'}
                </button>
                <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
                <button className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/20 hover:text-white transition-all">
                  <ExternalLink size={16} />
                </button>
                <button className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/20 hover:text-white transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Editor Toolbar */}
            {!previewMode && (
              <div className="px-6 py-3 border-b border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar bg-white/[0.01]">
                <button onClick={() => insertMarkdown('**', '**')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Bold">
                  <Bold size={16} />
                </button>
                <button onClick={() => insertMarkdown('*', '*')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Italic">
                  <Italic size={16} />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button onClick={() => insertMarkdown('# ')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Heading 1">
                  <Heading1 size={16} />
                </button>
                <button onClick={() => insertMarkdown('## ')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Heading 2">
                  <Heading2 size={16} />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button onClick={() => insertMarkdown('- ')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Bullet List">
                  <List size={16} />
                </button>
                <button onClick={() => insertMarkdown('- [ ] ')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Checklist">
                  <CheckSquare size={16} />
                </button>
                <button onClick={() => insertMarkdown('> ')} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all" title="Quote">
                  <Quote size={16} />
                </button>
              </div>
            )}

            <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
              {previewMode ? (
                <div className="prose prose-invert max-w-none">
                  {renderPreview(localContent)}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={localContent}
                  onChange={(e) => setLocalContent(e.target.value)}
                  className="w-full h-full bg-transparent border-none text-white/80 leading-relaxed resize-none focus:outline-none placeholder:opacity-10 text-base font-mono"
                  placeholder="Start typing your strategy..."
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-20">
            <div className="w-20 h-20 glass rounded-[2rem] flex items-center justify-center">
              <FileText size={40} className="text-gold" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black uppercase tracking-widest italic">Open an Entry</h3>
              <p className="text-xs font-bold uppercase tracking-widest mt-2">Select a note or create a new one to begin</p>
            </div>
            <button 
              onClick={createNewNote}
              className="px-6 py-3 glass rounded-2xl border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-gold hover:text-black transition-all"
            >
              Start New Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
