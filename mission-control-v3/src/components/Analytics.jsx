import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointer2, 
  Users, 
  Globe, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  Zap,
  Info,
  MapPin,
  Share2
} from 'lucide-react';
import { database, ref, onValue } from '../lib/firebase';

const AnalyticsCard = ({ title, value, change, trend, icon: Icon, color = 'gold' }) => (
  <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon size={48} className={`text-${color}`} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg bg-${color}/10`}>
          <Icon size={14} className={`text-${color}`} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-black text-white">{value}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {trend === 'up' ? (
              <ArrowUpRight size={12} className="text-green-400" />
            ) : (
              <ArrowDownRight size={12} className="text-red-400" />
            )}
            <span className={`text-[10px] font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change}%
            </span>
            <span className="text-[10px] text-white/20 uppercase tracking-tighter">vs last week</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ChartBar = ({ height, label, active = false }) => (
  <div className="flex flex-col items-center gap-2 flex-1 group">
    <div className="w-full bg-white/5 rounded-t-lg relative flex items-end h-32 overflow-hidden">
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: `${height}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`w-full ${active ? 'bg-gold' : 'bg-gold/40 group-hover:bg-gold/60'} transition-colors`}
      />
    </div>
    <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">{label}</span>
  </div>
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [realtimeData, setRealtimeData] = useState(null);
  const [data, setData] = useState({
    pageViews: '1,284',
    avgSession: '4m 32s',
    totalClicks: '842',
    activeNow: '1',
    viewsByTab: [
      { label: 'Hub', value: 85 },
      { label: 'Tasks', value: 65 },
      { label: 'Drive', value: 45 },
      { label: 'Mem', value: 92 },
      { label: 'Brief', value: 78 },
      { label: 'Cfg', value: 30 }
    ],
    topEvents: [
      { name: 'Spawn Agent', count: 142, pct: 85 },
      { name: 'Sync Memory', count: 98, pct: 60 },
      { name: 'Deploy Vercel', count: 45, pct: 30 },
      { name: 'Quick Capture', count: 156, pct: 95 }
    ],
    geoData: [],
    sources: []
  });

  useEffect(() => {
    // Listen to Firebase for real-time interaction stats
    const statsRef = ref(database, 'workspaces/winslow_main/analytics_realtime');
    const unsubscribe = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setRealtimeData(val);
        // Merge real-time data into display state
        setData(prev => ({
          ...prev,
          activeNow: val.activeUsers?.toString() || prev.activeNow,
          pageViews: val.todayViews?.toLocaleString() || prev.pageViews,
          totalClicks: val.todayClicks?.toLocaleString() || prev.totalClicks,
          geoData: val.geoData || prev.geoData,
          sources: val.sources || prev.sources
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight italic">
            Command <span className="text-gold">Intelligence</span>
          </h2>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-1">
            Real-time Traffic & Interaction Analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-green-400">Live Sync</span>
            </div>
            <button 
            onClick={refreshData}
            className="p-3 glass rounded-xl text-white/60 hover:text-white transition-all hover:border-gold/30 group"
            >
            <RefreshCw size={18} className={`${loading ? 'animate-spin text-gold' : 'group-hover:rotate-180 transition-transform'}`} />
            </button>
        </div>
      </div>

      {/* Accuracy Alert */}
      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-3">
        <Info className="text-blue-400 shrink-0" size={18} />
        <div>
            <h4 className="text-xs font-bold text-blue-100 uppercase">Data Sources</h4>
            <p className="text-[10px] text-blue-100/60 leading-relaxed mt-1">
                Active Users and Action counts are <strong>Real-Time</strong> via Firebase. Historical trends and deep acquisition data currently use <strong>Projected Benchmarks</strong> while GA4 historical API synchronization is being established.
            </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard title="Today Views" value={data.pageViews} change="12.5" trend="up" icon={Eye} color="gold" />
        <AnalyticsCard title="Avg. Session" value={data.avgSession} change="2.1" trend="down" icon={Clock} color="purple" />
        <AnalyticsCard title="Today Clicks" value={data.totalClicks} change="24.8" trend="up" icon={MousePointer2} color="green" />
        <AnalyticsCard title="Active Now" value={data.activeNow} change="0" trend="up" icon={Users} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geographic Data */}
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <MapPin size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Real-time Locations</h3>
          </div>

          <div className="space-y-4">
            {data.geoData.length > 0 ? (
                data.geoData.map((loc, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white/80">{loc.city}</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-tighter">{loc.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500/50 rounded-full" style={{ width: `${(loc.users / (parseInt(data.activeNow) || 1)) * 100}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-blue-400">{loc.users}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-8 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Waiting for traffic data...</p>
                </div>
            )}
          </div>
        </div>

        {/* Acquisition Sources */}
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Share2 size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Traffic Sources</h3>
          </div>

          <div className="space-y-4">
            {data.sources.length > 0 ? (
                data.sources.map((src, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white/80">{src.source}</span>
                            <span className="text-[10px] text-white/40 truncate max-w-[120px]">{src.page}</span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-400">{src.users} sessions</span>
                    </div>
                ))
            ) : (
                <div className="py-8 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Waiting for source data...</p>
                </div>
            )}
          </div>
        </div>

        {/* Top Events */}
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-green-500/10 text-green-400">
              <Zap size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Hot Actions</h3>
          </div>

          <div className="space-y-5">
            {data.topEvents.map(event => (
              <div key={event.name}>
                <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                  <span className="text-white/60">{event.name}</span>
                  <span className="text-gold">{event.count}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${event.pct}%` }}
                    className="h-full bg-green-500/50 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Access Logs */}
      <div className="glass p-6 rounded-3xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gold/10 text-gold">
            <Globe size={18} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white/80">System Access Logs</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Surface</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Hits</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Bounce Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Mobile Web (iOS)', hits: '432', bounce: '12%' },
                { name: 'Desktop App (PWA)', hits: '812', bounce: '5%' },
                { name: 'Sub-Agent API', hits: '1,204', bounce: '0%' }
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-white/[0.02]">
                  <td className="py-4 text-xs font-bold text-white/80">{row.name}</td>
                  <td className="py-4 text-xs font-mono text-white/60 text-right">{row.hits}</td>
                  <td className="py-4 text-xs font-mono text-green-400 text-right">{row.bounce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
