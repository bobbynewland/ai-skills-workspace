import React, { useState, useEffect, useRef } from 'react';
import { Activity, Clock, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const MiniMaxMonitor = () => {
  const [stats, setStats] = useState({
    requests: 0,
    prompts: 0,
    tokensIn: 0,
    tokensOut: 0,
    limit: 300,
    windowHours: 5,
    lastUpdated: null
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/minimax-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        
        // Add to history
        setHistory(prev => {
          const newEntry = {
            time: new Date().toISOString(),
            requests: data.requests || 0,
            prompts: data.prompts || 0
          };
          const updated = [...prev, newEntry].slice(-60); // Keep last 60 readings
          return updated;
        });
      }
    } catch (err) {
      // Use local tracker if API fails
      console.log('Using local tracker');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    // Poll every 60 seconds
    intervalRef.current = setInterval(fetchStats, 60000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const remaining = stats.limit - stats.requests;
  const percentage = (stats.requests / stats.limit) * 100;
  const isWarning = remaining < 50;
  const isCritical = remaining < 20;

  // Calculate rate per hour (extrapolate from history)
  const requestsPerHour = history.length > 1 
    ? ((history[history.length - 1]?.requests || 0) - (history[0]?.requests || 0)) / (history.length / 60) * 60
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            MiniMax <span className="text-gold">Monitor</span>
          </h2>
          <p className="text-white/40 text-sm">API request tracking (5-hour rolling window)</p>
        </div>
        <button
          onClick={fetchStats}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Main Stats */}
      <div className={`p-6 rounded-2xl border-2 ${isCritical ? 'border-red-500 bg-red-500/10' : isWarning ? 'border-yellow-500 bg-yellow-500/10' : 'border-green-500/30 bg-green-500/5'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isCritical ? (
              <AlertTriangle className="text-red-400" size={24} />
            ) : isWarning ? (
              <AlertTriangle className="text-yellow-400" size={24} />
            ) : (
              <CheckCircle className="text-green-400" size={24} />
            )}
            <div>
              <p className="text-white/60 text-sm uppercase tracking-wider">Remaining</p>
              <p className={`text-4xl font-black ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400'}`}>
                {remaining}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs uppercase">of {stats.limit} requests</p>
            <p className="text-white/60 text-sm">{Math.round(percentage)}% used</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Time indicator */}
        <div className="flex items-center justify-between mt-4 text-xs text-white/40">
          <span>0 min</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            5-hour rolling window
          </span>
          <span>300 min</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
            <Activity size={12} /> Requests
          </div>
          <div className="text-2xl font-bold">{stats.requests}</div>
        </div>
        
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
            <TrendingUp size={12} /> Prompts
          </div>
          <div className="text-2xl font-bold">{stats.prompts}</div>
        </div>
        
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
            ↓ Tokens In
          </div>
          <div className="text-2xl font-bold">{stats.tokensIn?.toLocaleString() || 0}</div>
        </div>
        
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
            ↑ Tokens Out
          </div>
          <div className="text-2xl font-bold">{stats.tokensOut?.toLocaleString() || 0}</div>
        </div>
      </div>

      {/* Rate Info */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Current Rate</p>
            <p className="text-lg font-bold">{requestsPerHour.toFixed(1)} req/hr</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs uppercase tracking-wider">Capacity</p>
            <p className="text-lg font-bold text-green-400">
              {remaining > 0 ? `~${Math.round(remaining / Math.max(requestsPerHour, 1))}h` : '0h'}
            </p>
          </div>
        </div>
      </div>

      {/* MiniMax Info */}
      <div className="text-xs text-white/30 text-center">
        <p>MiniMax Limit: 300 requests per 5 hours</p>
        <p>Rolling window resets as requests age out</p>
      </div>
    </div>
  );
};

export default MiniMaxMonitor;
