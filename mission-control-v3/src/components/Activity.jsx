import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Play, Pause, Calendar } from 'lucide-react';

const scheduleToText = (schedule) => {
  if (!schedule) return 'Unknown';
  if (schedule.kind === 'cron' && schedule.expr) return `cron: ${schedule.expr}`;
  if (schedule.kind === 'every' && schedule.everyMs) return `every ${Math.round(schedule.everyMs / 1000)}s`;
  if (schedule.kind === 'at' && schedule.at) return `at ${schedule.at}`;
  return schedule.kind || 'Unknown';
};

const mapJob = (job) => ({
  id: job.id,
  name: job.name || job.id,
  status: job?.state?.lastStatus || 'unknown',
  lastRunAtMs: job?.state?.lastRunAtMs || null,
  lastDurationMs: job?.state?.lastDurationMs || null,
  enabled: !!job.enabled,
  schedule: scheduleToText(job.schedule),
  lastError: job?.state?.lastError || null,
});

const Activity = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cron-jobs');
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.detail || data?.error || 'Failed to fetch cron jobs');
      }

      const mapped = (data.jobs || []).map(mapJob);
      setJobs(mapped);
    } catch (err) {
      setJobs([]);
      setError(err.message || 'Failed to load activity data');
    }

    setLoading(false);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return <CheckCircle size={16} className="text-green-400" />;
      case 'error': return <XCircle size={16} className="text-red-400" />;
      default: return <AlertCircle size={16} className="text-yellow-400" />;
    }
  };

  const filteredJobs = filter === 'all'
    ? jobs
    : filter === 'active'
      ? jobs.filter(j => j.enabled)
      : filter === 'error'
        ? jobs.filter(j => j.status === 'error')
        : jobs.filter(j => !j.enabled);

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.enabled).length,
    errors: jobs.filter(j => j.status === 'error').length,
    ok: jobs.filter(j => j.status === 'ok').length
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-gold" size={24} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Activity <span className="text-gold">Center</span>
          </h2>
          <p className="text-white/40 text-sm">Live cron + workflow activity</p>
        </div>
        <button
          onClick={loadJobs}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase hover:bg-white/10"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-xs text-red-400">Live data unavailable: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
            <Clock size={12} /> Total
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-green-400 text-xs uppercase tracking-wider mb-1">
            <Play size={12} /> Active
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-red-400 text-xs uppercase tracking-wider mb-1">
            <XCircle size={12} /> Errors
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.errors}</div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-blue-400 text-xs uppercase tracking-wider mb-1">
            <CheckCircle size={12} /> OK
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.ok}</div>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'error', label: 'Errors' },
          { id: 'inactive', label: 'Inactive' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
              filter === f.id
                ? 'bg-gold text-black'
                : 'bg-white/5 text-white/40 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredJobs.length === 0 ? (
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center text-white/50 text-sm">
            No live jobs found.
          </div>
        ) : filteredJobs.map(job => (
          <div
            key={job.id}
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(job.status)}
                <div>
                  <p className="font-bold text-white">{job.name}</p>
                  <p className="text-xs text-white/40 flex items-center gap-2">
                    <Calendar size={10} />
                    {job.schedule}
                    {job.lastDurationMs && (
                      <span>• {job.lastDurationMs}ms</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-white/60">
                  {job.lastRunAtMs ? formatTime(Date.now() - job.lastRunAtMs) : 'Never'}
                </p>
                <p className={`text-xs ${job.enabled ? 'text-green-400' : 'text-white/30'}`}>
                  {job.enabled ? '● Active' : '○ Inactive'}
                </p>
              </div>
            </div>

            {job.lastError && (
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-400">{job.lastError}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
