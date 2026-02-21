import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Workflow,
  Split,
  CalendarDays,
  ClipboardList,
  Copy,
  RotateCcw,
  CheckCircle2,
  History,
  Archive,
  Download,
} from 'lucide-react';

const STORAGE_KEY = 'org-os-scorecard-v1';

const defaultKpis = {
  cashCollected: '',
  meetingsBooked: '',
  dealsClosed: '',
  deliveryMargin: '',
  churnedClients: '',
  newTrials: '',
  trialToPaid: '',
  mrrDelta: '',
  d30Retention: '',
  experimentsLaunched: '',
  deploysThisWeek: '',
  criticalIncidents: '',
  storageHealth: '',
  backupStatus: '',
};

const focusDefaults = [
  'Finalize 2 core consulting offers + guarantee framing',
  'Stand up predictable outreach cadence + script bank',
  'Implement product onboarding friction fixes',
  'Collect 2–3 strong client wins and package proof assets',
  'Launch 2 conversion experiments in app onboarding',
  'Build referral/ambassador growth loop',
  'Tighten fulfillment SOPs for margin expansion',
  'Review full funnel economics and reallocate by ROI',
];

const kpiGroups = [
  {
    title: 'Revenue Command',
    fields: [
      ['Cash collected (week)', 'cashCollected'],
      ['Meetings booked', 'meetingsBooked'],
      ['Deals closed', 'dealsClosed'],
      ['Delivery margin %', 'deliveryMargin'],
      ['Churned clients', 'churnedClients'],
    ],
  },
  {
    title: 'Product Command',
    fields: [
      ['New trials', 'newTrials'],
      ['Trial→paid %', 'trialToPaid'],
      ['MRR delta', 'mrrDelta'],
      ['D30 retention', 'd30Retention'],
      ['Experiments launched/completed', 'experimentsLaunched'],
    ],
  },
  {
    title: 'Operating Health',
    fields: [
      ['Deploys this week', 'deploysThisWeek'],
      ['Critical incidents', 'criticalIncidents'],
      ['Storage health status', 'storageHealth'],
      ['Backup status', 'backupStatus'],
    ],
  },
];

const trendKpis = [
  { label: 'Cash', key: 'cashCollected', type: 'currency' },
  { label: 'Meetings', key: 'meetingsBooked', type: 'count' },
  { label: 'Deals', key: 'dealsClosed', type: 'count' },
  { label: 'MRR Δ', key: 'mrrDelta', type: 'currency' },
];

const getIsoWeekKey = (date = new Date()) => {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

const hasAnyKpiValue = (kpis) => Object.values(kpis || {}).some((value) => String(value || '').trim());

const archiveEntry = (history, weekKey, kpis) => [
  ...(history || []),
  {
    weekKey,
    kpis: { ...kpis },
    timestamp: new Date().toISOString(),
  },
].slice(-24);

const parseNumericValue = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  const cleaned = String(value)
    .trim()
    .replace(/,/g, '')
    .replace(/[$£€¥]/g, '')
    .replace(/%/g, '');

  if (!cleaned) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatTrendValue = (value, type) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';

  if (type === 'currency') {
    const abs = Math.abs(value);
    const digits = abs >= 1000 ? 0 : 2;
    return `${value < 0 ? '-' : ''}$${abs.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    })}`;
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const Sparkline = ({ values }) => {
  const width = 140;
  const height = 36;
  const padding = 4;
  const numericPoints = values
    .map((value, index) => ({ value, index }))
    .filter((point) => point.value !== null && Number.isFinite(point.value));

  if (numericPoints.length < 2) {
    return (
      <div className="h-9 rounded-md border border-white/10 bg-black/20 flex items-center justify-center text-[10px] text-white/35">
        —
      </div>
    );
  }

  const min = Math.min(...numericPoints.map((point) => point.value));
  const max = Math.max(...numericPoints.map((point) => point.value));
  const range = max - min || 1;

  const getX = (index) => {
    const denominator = Math.max(values.length - 1, 1);
    return padding + (index / denominator) * (width - padding * 2);
  };

  const getY = (value) => {
    if (max === min) return height / 2;
    return padding + ((max - value) / range) * (height - padding * 2);
  };

  const points = numericPoints.map((point) => `${getX(point.index)},${getY(point.value)}`).join(' ');
  const lastPoint = numericPoints[numericPoints.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-9 rounded-md border border-white/10 bg-black/20">
      <polyline fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" points={`${padding},${height / 2} ${width - padding},${height / 2}`} />
      <polyline fill="none" stroke="url(#spark-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={getX(lastPoint.index)} cy={getY(lastPoint.value)} r="2.5" fill="#ffd86b" />
      <defs>
        <linearGradient id="spark-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ffd86b" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const OrgOS = () => {
  const [currentWeekKey, setCurrentWeekKey] = useState(getIsoWeekKey());
  const [kpis, setKpis] = useState(defaultKpis);
  const [history, setHistory] = useState([]);
  const [focusChecklist, setFocusChecklist] = useState(
    focusDefaults.map((text) => ({ text, done: false }))
  );
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    const thisWeek = getIsoWeekKey();
    setCurrentWeekKey(thisWeek);

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;

      const storedWeek = parsed.currentWeekKey;
      const storedKpis = { ...defaultKpis, ...(parsed.currentKpis || {}) };
      let nextHistory = Array.isArray(parsed.history) ? parsed.history : [];

      if (storedWeek && storedWeek !== thisWeek && hasAnyKpiValue(storedKpis)) {
        nextHistory = archiveEntry(nextHistory, storedWeek, storedKpis);
        setKpis(defaultKpis);
      } else {
        setKpis(storedKpis);
      }

      setHistory(nextHistory);
    } catch {
      setKpis(defaultKpis);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentWeekKey,
          currentKpis: kpis,
          history,
        })
      );
    } catch {
      // no-op: keep app usable if storage unavailable
    }
  }, [currentWeekKey, kpis, history]);

  const summary = useMemo(() => {
    const nonEmpty = Object.entries(kpis)
      .filter(([, value]) => value?.trim())
      .map(([key, value]) => `${key}: ${value}`);

    const doneCount = focusChecklist.filter((item) => item.done).length;

    return [
      'AI Skills Studio — Org OS Weekly Snapshot',
      `Week: ${currentWeekKey}`,
      'North Star: $1M+ MRR with immediate cashflow via consulting + marketing.',
      `Allocation: 70% Revenue Command / 30% Product Command`,
      `Cadence: Mon strategy, Wed check, Fri scorecard`,
      `30-day focus complete: ${doneCount}/${focusChecklist.length}`,
      nonEmpty.length ? `KPIs:\n- ${nonEmpty.join('\n- ')}` : 'KPIs: (not filled yet)',
    ].join('\n');
  }, [kpis, focusChecklist, currentWeekKey]);

  const lastFourWeeks = useMemo(() => [...history].slice(-4).reverse(), [history]);

  const trendCards = useMemo(() => {
    const recent = [...history].slice(-8);

    return trendKpis.map((kpi) => {
      const values = recent.map((entry) => parseNumericValue(entry?.kpis?.[kpi.key]));
      const latestIndex = values.length - 1;
      const latest = latestIndex >= 0 ? values[latestIndex] : null;

      let previous = null;
      for (let i = latestIndex - 1; i >= 0; i -= 1) {
        if (values[i] !== null) {
          previous = values[i];
          break;
        }
      }

      const delta = latest !== null && previous !== null ? latest - previous : null;

      return {
        ...kpi,
        values,
        latest,
        delta,
      };
    });
  }, [history]);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const resetKpis = () => {
    setKpis(defaultKpis);
  };

  const archiveNow = () => {
    setHistory((prev) => archiveEntry(prev, currentWeekKey, kpis));
  };

  const exportHistoryJson = async () => {
    const payload = {
      currentWeekKey,
      currentKpis: kpis,
      history,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(payload, null, 2);

    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `org-os-kpi-history-${currentWeekKey}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
      return;
    } catch {
      // fallback to clipboard
    }

    try {
      await navigator.clipboard.writeText(json);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch {
      setExported(false);
    }
  };

  const toggleFocusItem = (index) => {
    setFocusChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="min-h-full p-4 pb-24 lg:p-6 lg:pb-6">
      <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
        <div className="glass rounded-2xl lg:rounded-3xl p-5 lg:p-8 border border-white/10 overflow-hidden relative">
          <div className="absolute -top-24 -right-16 w-64 h-64 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-purple/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">Operating System</p>
              <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tight">
                Org <span className="text-gold">OS</span>
              </h2>
              <p className="text-sm text-white/60 max-w-2xl mt-2">
                Two-speed execution model for AI Skills Studio: cash now via Revenue Command, compounding MRR via Product Command.
              </p>
              <p className="text-[11px] text-white/50 mt-2 font-mono">Current ISO week: {currentWeekKey}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copySummary}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wide hover:bg-white/10 flex items-center gap-2"
              >
                <Copy size={14} /> {copied ? 'Copied' : 'Copy Summary'}
              </button>
              <button
                onClick={archiveNow}
                className="px-3 py-2 rounded-xl bg-purple/10 border border-purple/30 text-purple text-xs font-bold uppercase tracking-wide hover:bg-purple/20 flex items-center gap-2"
              >
                <Archive size={14} /> Archive now
              </button>
              <button
                onClick={exportHistoryJson}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wide hover:bg-white/10 flex items-center gap-2"
              >
                <Download size={14} /> {exported ? 'Exported' : 'Export JSON'}
              </button>
              <button
                onClick={resetKpis}
                className="px-3 py-2 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wide hover:bg-gold/20 flex items-center gap-2"
              >
                <RotateCcw size={14} /> Reset KPIs
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <section className="glass rounded-2xl p-4 lg:p-6 border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2 mb-3">
              <Target size={14} /> North Star
            </h3>
            <p className="text-white/90 text-base leading-relaxed">
              Build AI Skills Studio to <span className="text-gold font-bold">$1M+ MRR</span> while generating immediate cashflow through consulting + marketing.
            </p>
          </section>

          <section className="glass rounded-2xl p-4 lg:p-6 border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2 mb-3">
              <Split size={14} /> 70 / 30 Allocation Rule
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Revenue Command</span>
                  <span>70%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gold rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Product Command</span>
                  <span>30%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[30%] bg-purple rounded-full" />
                </div>
              </div>
            </div>
          </section>

          <section className="glass rounded-2xl p-4 lg:p-6 border border-white/10 lg:col-span-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2 mb-4">
              <Workflow size={14} /> Two-Speed Org Chart
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-xl p-4 border border-gold/20">
                <h4 className="font-bold text-gold text-sm uppercase">Revenue Command</h4>
                <ul className="mt-2 text-xs text-white/70 space-y-1 list-disc list-inside">
                  <li>Sales & Pipeline Pod</li>
                  <li>Client Delivery Pod</li>
                  <li>Proof Engine Pod</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-purple/20">
                <h4 className="font-bold text-purple text-sm uppercase">Product Command</h4>
                <ul className="mt-2 text-xs text-white/70 space-y-1 list-disc list-inside">
                  <li>Product & Monetization Pod</li>
                  <li>Engineering Pod</li>
                  <li>Growth Pod</li>
                  <li>Customer Success Pod</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/15">
                <h4 className="font-bold text-white text-sm uppercase">Intelligence Layer</h4>
                <ul className="mt-2 text-xs text-white/70 space-y-1 list-disc list-inside">
                  <li>Chief of Staff AI</li>
                  <li>Research Swarm</li>
                  <li>Build Brain</li>
                  <li>Ops Automation</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass rounded-2xl p-4 lg:p-6 border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2 mb-3">
              <CalendarDays size={14} /> Weekly Cadence
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <p><span className="text-gold font-bold">Mon:</span> Strategy + Targets (30 min)</p>
              <p><span className="text-gold font-bold">Wed:</span> Pipeline + Product Check (20 min)</p>
              <p><span className="text-gold font-bold">Fri:</span> Scorecard + Decision Review (30 min)</p>
            </div>
          </section>

          <section className="glass rounded-2xl p-4 lg:p-6 border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2 mb-3">
              <ClipboardList size={14} /> 30-Day Focus Checklist
            </h3>
            <div className="space-y-2">
              {focusChecklist.map((item, idx) => (
                <button
                  key={item.text}
                  onClick={() => toggleFocusItem(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    item.done
                      ? 'bg-green-500/10 border-green-500/30 text-green-300'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5" />
                    <span className="text-xs leading-relaxed">{item.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="glass rounded-2xl p-4 lg:p-6 border border-white/10">
          <h3 className="text-sm font-black uppercase tracking-widest text-gold mb-4">Weekly Scorecard (Editable)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kpiGroups.map((group) => (
              <motion.div key={group.title} layout className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">{group.title}</h4>
                {group.fields.map(([label, key]) => (
                  <label key={key} className="block">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
                    <input
                      value={kpis[key]}
                      onChange={(e) => handleKpiChange(key, e.target.value)}
                      placeholder="Enter value"
                      className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/50"
                    />
                  </label>
                ))}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-4 lg:p-6 border border-white/10">
          <h3 className="text-sm font-black uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
            <History size={14} /> History (Last 4 Weeks)
          </h3>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {trendCards.map((trend) => {
              const isPositive = trend.delta !== null && trend.delta > 0;
              const isNegative = trend.delta !== null && trend.delta < 0;
              const deltaColor = isPositive ? 'text-green-300' : isNegative ? 'text-red-300' : 'text-white/60';

              return (
                <div key={trend.key} className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{trend.label}</p>
                    <p className={`text-[11px] font-mono ${deltaColor}`}>
                      {trend.delta === null
                        ? 'WoW —'
                        : `WoW ${trend.delta > 0 ? '+' : ''}${formatTrendValue(trend.delta, trend.type)}`}
                    </p>
                  </div>
                  <Sparkline values={trend.values} />
                  <p className="text-[11px] text-white/50">
                    Latest: <span className="text-white/75">{formatTrendValue(trend.latest, trend.type)}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {lastFourWeeks.length === 0 ? (
            <p className="text-sm text-white/50">No snapshots yet. Use “Archive now” or wait for weekly rollover.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {lastFourWeeks.map((entry) => (
                <div key={`${entry.weekKey}-${entry.timestamp}`} className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-gold">{entry.weekKey}</p>
                  <p className="text-[10px] text-white/40 mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
                  <div className="mt-2 text-xs text-white/80 space-y-1">
                    <p>Cash: {entry.kpis?.cashCollected || '—'}</p>
                    <p>Meetings: {entry.kpis?.meetingsBooked || '—'}</p>
                    <p>Deals: {entry.kpis?.dealsClosed || '—'}</p>
                    <p>MRR Δ: {entry.kpis?.mrrDelta || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrgOS;
