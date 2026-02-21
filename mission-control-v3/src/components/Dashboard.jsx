import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  Brain,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  Search,
  ChevronRight,
  Terminal,
  Radio,
  Cloud,
  History,
  Loader2,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import WorkflowSection from './WorkflowStatus';
import OpsPanels from './OpsPanels';
import { database, ref, get } from '../lib/firebase';

const StatCard = ({ icon: Icon, label, value, subtext, color = 'gold' }) => (
  <div className="glass p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-xl bg-${color}/10`}>
        <Icon size={18} className={`text-${color}`} />
      </div>
    </div>
    <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">{label}</h3>
    <p className="text-xl font-black text-white">{value}</p>
    {subtext && <p className="text-[10px] text-white/20 mt-1">{subtext}</p>}
  </div>
);

const AgentCard = ({ name, status, role, lastActive, model, currentJob }) => {
  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    offline: 'bg-red-500'
  };

  const statusIcons = {
    active: <CheckCircle2 size={12} className="text-green-400" />,
    idle: <AlertCircle size={12} className="text-yellow-400" />,
    offline: <XCircle size={12} className="text-red-400" />
  };

  return (
    <div className="glass p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status] || 'bg-white/30'}`} />
          {statusIcons[status] || <AlertCircle size={12} className="text-white/40" />}
        </div>
        <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{name}</h4>
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{role}</p>
      {currentJob && status === 'active' && (
        <div className="mb-2 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-[10px] text-green-400 font-mono truncate">▶ {currentJob}</p>
        </div>
      )}
      <div className="flex items-center justify-between text-[10px] text-white/20">
        <span className="font-mono truncate max-w-[140px]">{model || 'N/A'}</span>
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {lastActive}
        </span>
      </div>
    </div>
  );
};

const JobCard = ({ title, status, agent, progress, timestamp }) => {
  const statusColors = {
    running: 'text-green-400',
    queued: 'text-yellow-400',
    completed: 'text-blue-400',
    failed: 'text-red-400'
  };

  const statusIcons = {
    running: <Loader2 size={12} className="animate-spin" />,
    queued: <Clock size={12} />,
    completed: <Check size={12} />,
    failed: <X size={12} />
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-green-400 animate-pulse' : status === 'queued' ? 'bg-yellow-400' : status === 'completed' ? 'bg-blue-400' : 'bg-red-400'}`} />
        <div>
          <h5 className="text-sm font-bold text-white">{title}</h5>
          <p className="text-[10px] text-white/40">{agent}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-[10px] font-bold ${statusColors[status] || 'text-white/40'} uppercase flex items-center gap-1`}>
          {statusIcons[status] || <Clock size={12} />}
          {status}
        </p>
        {progress !== undefined && (
          <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}
        {timestamp && (
          <p className="text-[8px] text-white/20 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigate, onAction }) => {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalTasks: 0, inProgress: 0, completed: 0, apiHealthPct: 0, uptime: '0h' });
  const [agents, setAgents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [apiKeys, setApiKeys] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const applyTelemetry = (data) => {
    setStats(data?.stats || {});
    setAgents(data?.agents || []);
    setJobs((data?.jobs || []).slice(0, 6));
    setApiKeys(data?.apiKeys || {});
  };

  const loadFirebaseTelemetry = async () => {
    const snap = await get(ref(database, 'workspaces/winslow_main/live_telemetry'));
    if (!snap.exists()) throw new Error('No Firebase telemetry yet');
    return snap.val();
  };

  const loadLive = async () => {
    try {
      setError(null);
      const res = await fetch('/api/mission-control-live', { cache: 'no-store' });
      const raw = await res.text();

      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error('Live telemetry returned an invalid response.');
      }

      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Live telemetry unavailable.');

      if (data?.degraded) {
        const fbData = await loadFirebaseTelemetry();
        applyTelemetry(fbData);
        setError(null);
      } else {
        applyTelemetry(data);
      }
    } catch {
      try {
        const fbData = await loadFirebaseTelemetry();
        applyTelemetry(fbData);
        setError(null);
      } catch {
        setError('Live telemetry is temporarily unavailable. Pull to refresh in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLive();
    const interval = setInterval(loadLive, 30000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-full lg:p-6 space-y-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Mission Control <span className="text-gold">Live OS</span></h2>
            <p className="text-white/40 text-sm">No demo data — real-time operational state</p>
          </div>
          <button onClick={loadLive} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase hover:bg-white/10 flex items-center gap-2">
            <RefreshCw size={14} /> Refresh
          </button>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
            Live feed issue: {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Brain} label="Total Jobs" value={stats.totalTasks ?? 0} subtext={`${stats.completed ?? 0} successful`} color="gold" />
          <StatCard icon={Activity} label="In Progress" value={stats.inProgress ?? 0} subtext={`${stats.errors ?? 0} errors`} color="green" />
          <StatCard icon={Cpu} label="API Health" value={`${stats.apiHealthPct ?? 0}%`} subtext="live checks" color="purple" />
          <StatCard icon={Clock} label="Host Uptime" value={stats.uptime ?? '0h'} subtext="server runtime" color="blue" />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Agent Fleet</h3>
              <button onClick={() => onNavigate && onNavigate('kanban')} className="text-[10px] text-gold hover:text-white transition-colors flex items-center gap-1">
                View All <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {agents.length === 0 ? (
                <div className="col-span-2 text-center p-6 glass rounded-2xl text-white/40 text-sm">No live agent telemetry yet.</div>
              ) : agents.map(agent => <AgentCard key={agent.id} {...agent} />)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Job Queue</h3>
              <span className="text-[10px] text-white/40">live cron + orchestrator</span>
            </div>
            <div className="glass p-4 rounded-2xl border border-white/5 space-y-2">
              {jobs.length === 0 ? (
                <div className="text-center py-8 text-white/30">
                  <Clock size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active jobs</p>
                </div>
              ) : jobs.map(job => <JobCard key={job.id} {...job} />)}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-4">API Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(apiKeys).map(([key, data]) => (
              <div key={key} className="glass p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{data.label}</span>
                  <span className="text-[10px] font-mono text-white/60">{data.used}/{data.total}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${Math.min(100, (data.used / Math.max(data.total || 1, 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <WorkflowSection />

        <motion.div variants={itemVariants}>
          <OpsPanels />
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={() => onAction?.('command')} className="glass p-4 rounded-2xl border border-white/5 hover:border-gold/30 transition-all group text-left">
              <Terminal size={20} className="text-white/40 mb-2 group-hover:text-gold transition-colors" />
              <span className="text-sm font-bold text-white">Run Command</span>
            </button>
            <button onClick={() => onAction?.('spawn')} className="glass p-4 rounded-2xl border border-white/5 hover:border-purple/30 transition-all group text-left">
              <Radio size={20} className="text-white/40 mb-2 group-hover:text-purple-400 transition-colors" />
              <span className="text-sm font-bold text-white">Spawn Agent</span>
            </button>
            <button onClick={() => onAction?.('deploy')} className="glass p-4 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all group text-left">
              <Cloud size={20} className="text-white/40 mb-2 group-hover:text-green-400 transition-colors" />
              <span className="text-sm font-bold text-white">Deploy</span>
            </button>
            <button onClick={() => onAction?.('research')} className="glass p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group text-left">
              <Search size={20} className="text-white/40 mb-2 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-bold text-white">Research</span>
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-center pt-4">
          <div className="text-center">
            <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">System Time</p>
            <p className="text-2xl font-black text-white/60 italic">{time.toLocaleTimeString('en-US', { hour12: true })}</p>
            <p className="text-[10px] text-white/30">{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
