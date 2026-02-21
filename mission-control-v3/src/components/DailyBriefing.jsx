import React, { useEffect, useMemo, useState } from 'react';
import {
  Sun,
  Calendar,
  Target,
  AlertTriangle,
  Rocket,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const STORAGE_KEY = 'mc3-morning-brief-v1';

const defaultState = {
  priorities: [
    { text: '', done: false },
    { text: '', done: false },
    { text: '', done: false },
  ],
  kpis: {
    cash: '',
    meetings: '',
    deals: '',
    mrrDelta: '',
  },
  blockers: '',
  summary: '',
  summaryVisible: false,
};

const safeParse = (raw, fallback) => {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const DailyBriefing = ({ onNavigate }) => {
  const [state, setState] = useState(defaultState);
  const [captureStats, setCaptureStats] = useState({
    pendingTasks: 0,
    notesToday: 0,
    ideasToday: 0,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), defaultState);
    setState({
      ...defaultState,
      ...stored,
      priorities: Array.isArray(stored.priorities)
        ? stored.priorities.slice(0, 3).map((p, i) => ({
            text: p?.text ?? defaultState.priorities[i].text,
            done: Boolean(p?.done),
          }))
        : defaultState.priorities,
      kpis: { ...defaultState.kpis, ...(stored.kpis || {}) },
    });

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const refreshCaptureStats = () => {
    const items = safeParse(localStorage.getItem('quick_capture'), []);
    const today = new Date().toDateString();

    const pendingTasks = items.filter((item) => item?.type === 'task' && item?.status !== 'completed').length;
    const notesToday = items.filter((item) => item?.type === 'note' && new Date(item?.created).toDateString() === today).length;
    const ideasToday = items.filter((item) => item?.type === 'idea' && new Date(item?.created).toDateString() === today).length;

    setCaptureStats({ pendingTasks, notesToday, ideasToday });
  };

  useEffect(() => {
    refreshCaptureStats();
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  const completedCount = state.priorities.filter((p) => p.done).length;

  const updatePriority = (index, value) => {
    setState((prev) => {
      const next = [...prev.priorities];
      next[index] = { ...next[index], text: value };
      return { ...prev, priorities: next };
    });
  };

  const togglePriority = (index) => {
    setState((prev) => {
      const next = [...prev.priorities];
      next[index] = { ...next[index], done: !next[index].done };
      return { ...prev, priorities: next };
    });
  };

  const updateKpi = (key, value) => {
    setState((prev) => ({ ...prev, kpis: { ...prev.kpis, [key]: value } }));
  };

  const generateSummary = () => {
    const priorities = state.priorities.map((p) => p.text.trim()).filter(Boolean);
    const blockers = state.blockers.trim();

    const openSlots = 3 - priorities.length;
    const momentum =
      Number(state.kpis.meetings || 0) + Number(state.kpis.deals || 0) > 0
        ? 'Pipeline has visible movement—stay in execution blocks.'
        : 'Pipeline is quiet—prioritize outreach before noon.';

    const lines = [
      `Mission signal: ${completedCount}/3 priorities already marked complete.`,
      priorities.length
        ? `Top focus: ${priorities.slice(0, 2).join(' + ')}${priorities.length > 2 ? ' + 1 more.' : '.'}`
        : 'Top focus is still blank—lock your Top 3 before the first context switch.',
      `KPI pulse: Cash ${state.kpis.cash || '—'}, Meetings ${state.kpis.meetings || '—'}, Deals ${state.kpis.deals || '—'}, MRR Δ ${state.kpis.mrrDelta || '—'}.`,
      blockers
        ? `Primary blocker: ${blockers}`
        : 'No blockers logged. Keep this honest and update the moment risk appears.',
      openSlots > 0
        ? `You still have ${openSlots} priority slot${openSlots > 1 ? 's' : ''} unclaimed.`
        : momentum,
    ];

    setState((prev) => ({
      ...prev,
      summary: lines.join(' '),
      summaryVisible: true,
    }));
  };

  const resetBrief = () => {
    setState(defaultState);
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-4 pb-28 lg:px-6 lg:py-6 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-4 lg:space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold/90">
                <Sun size={14} /> Morning Brief
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{greeting}, Bobby</h2>
              <p className="mt-1 flex items-center gap-2 text-xs text-white/50 sm:text-sm">
                <Calendar size={14} /> {todayLabel}
              </p>
            </div>
            <button
              onClick={resetBrief}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-white"
            >
              <RefreshCw size={13} /> Reset
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
              <Target size={16} className="text-gold" /> Today&apos;s Top 3 Priorities
            </h3>
            <span className="text-xs text-white/45">{completedCount}/3 complete</span>
          </div>

          <div className="space-y-2.5">
            {state.priorities.map((priority, index) => (
              <div key={index} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2.5">
                <button
                  onClick={() => togglePriority(index)}
                  className={`rounded-md p-1.5 transition ${priority.done ? 'text-green-400' : 'text-white/35 hover:text-white/70'}`}
                  aria-label={`Mark priority ${index + 1} complete`}
                >
                  <CheckCircle2 size={18} />
                </button>
                <input
                  value={priority.text}
                  onChange={(e) => updatePriority(index, e.target.value)}
                  placeholder={`Priority ${index + 1}...`}
                  className={`w-full bg-transparent text-sm outline-none placeholder:text-white/25 ${priority.done ? 'line-through text-white/45' : 'text-white'}`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
            <TrendingUp size={16} className="text-gold" /> KPI Pulse Snapshot
          </h3>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              ['Cash', 'cash', '$0'],
              ['Meetings', 'meetings', '0'],
              ['Deals', 'deals', '0'],
              ['MRR Δ', 'mrrDelta', '+$0'],
            ].map(([label, key, placeholder]) => (
              <label key={key} className="rounded-xl border border-white/10 bg-black/20 p-2.5">
                <p className="text-[11px] uppercase tracking-wider text-white/45">{label}</p>
                <input
                  value={state.kpis[key]}
                  onChange={(e) => updateKpi(key, e.target.value)}
                  placeholder={placeholder}
                  className="mt-1 w-full bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/25"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
            <AlertTriangle size={16} className="text-gold" /> Risks / Blockers
          </h3>
          <textarea
            value={state.blockers}
            onChange={(e) => setState((prev) => ({ ...prev, blockers: e.target.value }))}
            rows={3}
            placeholder="Where can execution break today? Dependencies, client risk, resource gaps..."
            className="w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-white/25"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
            <Rocket size={16} className="text-gold" /> Quick Launch
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              ['kanban', 'Open Kanban'],
              ['orgos', 'Open Org OS'],
              ['dashboard', 'Open Dashboard'],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => onNavigate?.(tab)}
                className="flex items-center justify-between rounded-xl border border-gold/20 bg-gold/5 px-3 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10"
              >
                {label} <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
              <Sparkles size={16} className="text-gold" /> AI-style Morning Summary
            </h3>
            <button
              onClick={generateSummary}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/70 hover:bg-white/5"
            >
              Generate
            </button>
          </div>

          {state.summaryVisible && state.summary ? (
            <p className="rounded-xl border border-gold/20 bg-gold/5 p-3 text-sm leading-relaxed text-white/85">{state.summary}</p>
          ) : (
            <p className="text-sm text-white/45">Generate a brief from today&apos;s priorities, KPI pulse, and blockers.</p>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">Execution Signal</h3>
            <button onClick={refreshCaptureStats} className="text-xs text-gold hover:underline">Refresh</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-white/10 bg-black/20 py-2">
              <p className="text-lg font-black">{captureStats.pendingTasks}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">Pending tasks</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 py-2">
              <p className="text-lg font-black">{captureStats.notesToday}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">Notes today</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 py-2">
              <p className="text-lg font-black">{captureStats.ideasToday}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">Ideas today</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DailyBriefing;
