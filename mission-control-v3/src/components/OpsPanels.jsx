import React, { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, CheckSquare, HardDrive, Copy, Check, AlertTriangle, RefreshCw, Send, Loader2 } from 'lucide-react';
import { database, ref, get } from '../lib/firebase';

const STORAGE_KEY_ROUTER = 'mc3_model_router';
const STORAGE_KEY_CHECKLIST = 'mc3_daily_checklist';
const STORAGE_KEY_HANDOFF = 'mc3_handoff';

const MODEL_LANES = [
  { id: 'gemini', name: 'Gemini 3.0', trigger: 'heavy coding + long context' },
  { id: 'claude', name: 'Claude 4.5', trigger: 'architecture + complex reasoning' },
  { id: 'minimax', name: 'MiniMax 2.5', trigger: 'fallback / high throughput' },
  { id: 'kimi', name: 'Kimi K2.5', trigger: 'parallel research swarm' },
];

const CHECKLIST_TEMPLATE = {
  am: ['Review briefing', 'Prioritize top 3 outcomes', 'Clear blockers in Kanban'],
  pm: ['Run progress checkpoint', 'Update activity log', 'Sync dependencies'],
  eod: ['Close open loops', 'Write handoff draft', 'Queue tomorrow\'s first task'],
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export default function OpsPanels() {
  const [router, setRouter] = useState(() => loadJson(STORAGE_KEY_ROUTER, { active: 'gemini', lastSwitchAt: null }));
  const [checklist, setChecklist] = useState(() => loadJson(STORAGE_KEY_CHECKLIST, { date: todayKey(), items: {} }));
  const [storageHealth, setStorageHealth] = useState({ loading: true, degraded: false, error: null, disk: null, topDirs: [] });
  const [handoff, setHandoff] = useState(() => loadJson(STORAGE_KEY_HANDOFF, {
    objective: '',
    wins: '',
    blockers: '',
    nextActions: '',
  }));
  const [copied, setCopied] = useState(false);
  const [sampleTask, setSampleTask] = useState('Summarize current blockers and propose top 3 next actions.');
  const [routingResult, setRoutingResult] = useState(null);
  const [dispatching, setDispatching] = useState(false);
  const [retrySummary, setRetrySummary] = useState({ total: 0, queued: 0, retrying: 0, succeeded: 0, failed: 0 });
  const [retryResult, setRetryResult] = useState(null);
  const [retryingQueued, setRetryingQueued] = useState(false);

  useEffect(() => {
    saveJson(STORAGE_KEY_ROUTER, router);
  }, [router]);

  useEffect(() => {
    const tk = todayKey();
    if (checklist.date !== tk) {
      setChecklist({ date: tk, items: {} });
      return;
    }
    saveJson(STORAGE_KEY_CHECKLIST, checklist);
  }, [checklist]);

  useEffect(() => {
    saveJson(STORAGE_KEY_HANDOFF, handoff);
  }, [handoff]);

  const fetchStorageHealth = async () => {
    setStorageHealth((s) => ({ ...s, loading: true, error: null }));

    const readFirebaseFallback = async () => {
      const snap = await get(ref(database, 'workspaces/winslow_main/live_telemetry'));
      if (!snap.exists()) throw new Error('No Firebase telemetry found');
      const live = snap.val() || {};
      const pct = live?.disk?.usePercent || 'N/A';
      return {
        ok: true,
        degraded: true,
        disk: {
          filesystem: 'host',
          total: 'N/A',
          used: 'N/A',
          available: 'N/A',
          usePercent: pct,
          mount: '/',
          warning: String(pct).includes('%') ? parseInt(pct, 10) >= 85 : false,
        },
        topDirs: [],
      };
    };

    try {
      const res = await fetch('/api/storage-health', { cache: 'no-store' });
      const raw = await res.text();
      let data = null;

      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error('Storage telemetry returned an invalid response.');
      }

      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Storage telemetry unavailable.');

      if (data?.degraded && (!data?.disk?.usePercent || data?.disk?.usePercent === 'N/A')) {
        const fb = await readFirebaseFallback();
        setStorageHealth({ loading: false, degraded: true, error: 'Using Firebase host telemetry fallback.', disk: fb.disk, topDirs: fb.topDirs || [] });
        return;
      }

      setStorageHealth({ loading: false, degraded: !!data.degraded, error: data?.degraded ? 'Limited telemetry in this environment.' : null, disk: data.disk, topDirs: data.topDirs || [] });
    } catch {
      try {
        const fb = await readFirebaseFallback();
        setStorageHealth({ loading: false, degraded: true, error: 'Using Firebase host telemetry fallback.', disk: fb.disk, topDirs: fb.topDirs || [] });
      } catch {
        setStorageHealth({ loading: false, degraded: true, error: 'Storage telemetry unavailable right now.', disk: null, topDirs: [] });
      }
    }
  };

  useEffect(() => {
    fetchStorageHealth();
  }, []);

  const checklistProgress = useMemo(() => {
    const allItems = Object.entries(CHECKLIST_TEMPLATE).flatMap(([period, items]) => items.map((item, idx) => `${period}:${idx}`));
    const done = allItems.filter((key) => checklist.items[key]).length;
    return { done, total: allItems.length, pct: allItems.length ? Math.round((done / allItems.length) * 100) : 0 };
  }, [checklist.items]);

  const toggleChecklist = (period, idx) => {
    const key = `${period}:${idx}`;
    setChecklist((prev) => ({ ...prev, items: { ...prev.items, [key]: !prev.items[key] } }));
  };

  const handoffTemplate = `SESSION HANDOFF (${todayKey()})\n\nContext rollover target: 85%\n\nObjective:\n${handoff.objective || '-'}\n\nWins:\n${handoff.wins || '-'}\n\nBlockers:\n${handoff.blockers || '-'}\n\nNext Actions (ordered):\n${handoff.nextActions || '-'}\n\nModel Router:\nActive lane: ${MODEL_LANES.find((m) => m.id === router.active)?.name || 'Unknown'}\nLast switch: ${router.lastSwitchAt ? new Date(router.lastSwitchAt).toLocaleString() : 'N/A'}\n\nChecklist status:\n${checklistProgress.done}/${checklistProgress.total} complete (${checklistProgress.pct}%)`;

  const copyHandoff = async () => {
    try {
      await navigator.clipboard.writeText(handoffTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const fetchRetrySummary = async () => {
    try {
      const res = await fetch('/api/model-router-retry');
      const data = await res.json();
      if (res.ok && data.ok && data.summary) {
        setRetrySummary(data.summary);
      }
    } catch {
      // keep existing summary state on transient failures
    }
  };

  useEffect(() => {
    fetchRetrySummary();
  }, []);

  const dispatchSampleTask = async () => {
    setDispatching(true);
    setRoutingResult(null);
    try {
      const res = await fetch('/api/model-router-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lane: router.active,
          task: sampleTask,
          metadata: {
            sourcePanel: 'ops-model-router',
            laneSelectedAt: router.lastSwitchAt,
          },
        }),
      });

      const data = await res.json();
      setRoutingResult({ httpStatus: res.status, ...data });
      await fetchRetrySummary();
    } catch (e) {
      setRoutingResult({
        ok: false,
        status: 'error',
        error: e.message || 'Dispatch failed',
      });
    } finally {
      setDispatching(false);
    }
  };

  const retryQueuedTasks = async () => {
    setRetryingQueued(true);
    setRetryResult(null);
    try {
      const res = await fetch('/api/model-router-retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 5 }),
      });
      const data = await res.json();
      setRetryResult({ httpStatus: res.status, ...data });
      if (data?.summary) setRetrySummary(data.summary);
      else await fetchRetrySummary();
    } catch (e) {
      setRetryResult({ ok: false, status: 'error', error: e.message || 'Retry run failed' });
    } finally {
      setRetryingQueued(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="glass p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60 flex items-center gap-2"><BrainCircuit size={14} className="text-gold" /> Model Router</h3>
          <span className="text-[10px] text-white/40">Active lane routing</span>
        </div>
        <div className="space-y-2">
          {MODEL_LANES.map((lane) => {
            const active = router.active === lane.id;
            return (
              <button
                key={lane.id}
                onClick={() => setRouter({ active: lane.id, lastSwitchAt: Date.now() })}
                className={`w-full text-left p-3 rounded-xl border transition-all ${active ? 'border-gold/40 bg-gold/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{lane.name}</span>
                  <span className={`text-[10px] uppercase font-bold ${active ? 'text-gold' : 'text-white/40'}`}>{active ? 'active' : 'switch'}</span>
                </div>
                <p className="text-[10px] text-white/40 mt-1">Trigger: {lane.trigger}</p>
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-3 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-white/40">Dispatch sample task</p>
          <textarea
            value={sampleTask}
            onChange={(e) => setSampleTask(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold/50 h-20"
          />
          <button
            onClick={dispatchSampleTask}
            disabled={dispatching || !sampleTask.trim()}
            className="w-full px-3 py-2 rounded-xl bg-gold text-black text-xs font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {dispatching ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Route via {router.active}
          </button>

          <div className="bg-white/5 border border-white/10 rounded-xl p-2 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
              <span>Queue summary</span>
              <button onClick={fetchRetrySummary} className="text-white/60 hover:text-white flex items-center gap-1"><RefreshCw size={11} /> Refresh</button>
            </div>
            <div className="grid grid-cols-5 gap-1 text-[10px]">
              <div className="bg-white/5 rounded p-1 text-center"><p className="text-white/30">total</p><p className="font-mono text-white">{retrySummary.total}</p></div>
              <div className="bg-white/5 rounded p-1 text-center"><p className="text-white/30">queued</p><p className="font-mono text-yellow-300">{retrySummary.queued}</p></div>
              <div className="bg-white/5 rounded p-1 text-center"><p className="text-white/30">retrying</p><p className="font-mono text-blue-300">{retrySummary.retrying}</p></div>
              <div className="bg-white/5 rounded p-1 text-center"><p className="text-white/30">ok</p><p className="font-mono text-green-300">{retrySummary.succeeded}</p></div>
              <div className="bg-white/5 rounded p-1 text-center"><p className="text-white/30">failed</p><p className="font-mono text-red-300">{retrySummary.failed}</p></div>
            </div>
            <button
              onClick={retryQueuedTasks}
              disabled={retryingQueued || retrySummary.queued === 0}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {retryingQueued ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Retry queued tasks
            </button>
          </div>

          {routingResult && (
            <div className="text-xs bg-white/5 border border-white/10 rounded-xl p-2 space-y-1">
              <p className="text-white/70">Status: <span className="font-mono text-gold">{routingResult.status}</span>{routingResult.httpStatus ? ` (HTTP ${routingResult.httpStatus})` : ''}</p>
              <p className="text-white/50">Requested lane: <span className="font-mono">{routingResult.lane || router.active}</span></p>
              {routingResult.routedLane && <p className="text-white/50">Routed lane: <span className="font-mono">{routingResult.routedLane}</span></p>}
              {routingResult.modelStrategy && <p className="text-white/50">Model: <span className="font-mono">{routingResult.modelStrategy}</span></p>}
              {routingResult.error && <p className="text-red-300">Error: {routingResult.error}</p>}
            </div>
          )}

          {retryResult && (
            <div className="text-xs bg-white/5 border border-white/10 rounded-xl p-2 space-y-1">
              <p className="text-white/70">Retry status: <span className="font-mono text-gold">{retryResult.status}</span>{retryResult.httpStatus ? ` (HTTP ${retryResult.httpStatus})` : ''}</p>
              {typeof retryResult.processed === 'number' && <p className="text-white/50">Processed: <span className="font-mono">{retryResult.processed}</span></p>}
              {retryResult.error && <p className="text-red-300">Error: {retryResult.error}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="glass p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60 flex items-center gap-2"><CheckSquare size={14} className="text-green-400" /> Daily Auto-Run Checklist</h3>
          <span className="text-[10px] text-white/40">{checklistProgress.done}/{checklistProgress.total}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full" style={{ width: `${checklistProgress.pct}%` }} />
        </div>
        {Object.entries(CHECKLIST_TEMPLATE).map(([period, items]) => (
          <div key={period}>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{period}</p>
            <div className="space-y-1.5">
              {items.map((item, idx) => {
                const checked = !!checklist.items[`${period}:${idx}`];
                return (
                  <button key={item} onClick={() => toggleChecklist(period, idx)} className="w-full flex items-center gap-2 text-left text-sm text-white/80 hover:text-white">
                    <span className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                      {checked && <Check size={12} />}
                    </span>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60 flex items-center gap-2"><HardDrive size={14} className="text-blue-400" /> Storage Health</h3>
          <button onClick={fetchStorageHealth} className="text-[10px] text-white/50 hover:text-white flex items-center gap-1"><RefreshCw size={12} /> Refresh</button>
        </div>
        {storageHealth.loading ? <p className="text-sm text-white/40">Loading storage telemetry...</p> : (
          <>
            {storageHealth.degraded && (
              <div className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 flex items-center gap-2"><AlertTriangle size={12} /> degraded mode{storageHealth.error ? `: ${storageHealth.error}` : ''}</div>
            )}
            <div className="text-sm text-white">Disk: <span className="font-mono text-white/80">{storageHealth.disk?.used || 'N/A'} / {storageHealth.disk?.total || 'N/A'}</span> <span className="text-white/40">({storageHealth.disk?.usePercent || 'N/A'})</span></div>
            <div className="space-y-1">
              {(storageHealth.topDirs || []).map((d) => (
                <div key={d.path} className="flex items-center justify-between text-xs bg-white/5 rounded-lg p-2">
                  <span className="text-white/70 truncate pr-2">{d.path}</span>
                  <span className="font-mono text-white/40">{d.size}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="glass p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Session Handoff (85%)</h3>
          <button onClick={copyHandoff} className="text-xs px-2 py-1 rounded-lg border border-white/20 hover:border-gold/40 text-white/70 hover:text-white flex items-center gap-1">
            <Copy size={12} /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[
            ['objective', 'Objective'],
            ['wins', 'Wins'],
            ['blockers', 'Blockers'],
            ['nextActions', 'Next Actions (ordered)'],
          ].map(([key, label]) => (
            <textarea
              key={key}
              value={handoff[key] || ''}
              onChange={(e) => setHandoff((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={label}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold/50 h-16"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
