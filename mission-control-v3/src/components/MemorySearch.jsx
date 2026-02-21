import React, { useState } from 'react';
import { Search, FileText, Loader, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const MemorySearch = () => {
  const [q, setQ] = useState('');
  const [topK, setTopK] = useState(8);
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [meta, setMeta] = useState(null);

  const runSearch = async ({ sync = false } = {}) => {
    if (!q.trim() && !sync) return;
    setLoading(true);

    try {
      const res = await fetch('/api/memory-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, topK, source: source || undefined, date: date || undefined, sync }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');

      setResults(data.results || []);
      setMeta({
        provider: data.queryEmbeddingProvider,
        totalCandidates: data.totalCandidates,
        sync: data.sync || null,
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Ask <span className="text-gold">Memory</span>
        </h2>
        <p className="text-white/40 text-sm">Semantic search over MEMORY.md and memory/*.md</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder="Ask memory..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white"
          />
        </div>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Filter source (optional)"
          className="bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white"
        />
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date YYYY-MM-DD"
          className="bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white"
        />
        <input
          type="number"
          min="1"
          max="20"
          value={topK}
          onChange={(e) => setTopK(Number(e.target.value || 8))}
          className="bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => runSearch()}
          className="px-4 py-2 rounded-xl bg-gold text-black font-bold hover:bg-gold/80"
        >
          Search
        </button>
        <button
          onClick={() => runSearch({ sync: true })}
          className="px-4 py-2 rounded-xl border border-gold/40 text-gold hover:bg-gold/10 flex items-center gap-2"
        >
          <RefreshCw size={14} /> Sync + Search
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-white/60"><Loader className="animate-spin" size={16} /> Searching...</div>
      )}

      {meta && (
        <div className="text-xs text-white/40">
          provider: {meta.provider || 'n/a'} • candidates: {meta.totalCandidates ?? 0}
          {meta.sync ? ` • synced ${meta.sync.chunksStored} chunks` : ''}
        </div>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <button className="w-full text-left" onClick={() => toggleExpanded(r.id)}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <FileText size={14} className="text-gold" />
                    <span className="font-semibold">{r.source}</span>
                  </div>
                  <div className="text-xs text-white/40 mt-1">{r.citation} • score {(r.score ?? 0).toFixed(4)}</div>
                  <p className="text-sm text-white/70 mt-2">{r.snippet}</p>
                </div>
                {expanded[r.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {expanded[r.id] && (
              <pre className="mt-3 text-xs text-white/70 whitespace-pre-wrap bg-black/30 rounded-lg p-3 border border-white/5">
                {r.text}
              </pre>
            )}
          </div>
        ))}

        {!loading && results.length === 0 && (
          <p className="text-white/40 text-sm">No results yet. Try a query, or run Sync + Search.</p>
        )}
      </div>
    </div>
  );
};

export default MemorySearch;
