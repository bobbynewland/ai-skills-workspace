import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Kanban as KanbanIcon, 
  HardDrive,
  Settings,
  Plus,
  Zap,
  Activity,
  Cpu,
  Brain,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  Users,
  FileText,
  Search,
  ChevronRight,
  Terminal,
  Radio,
  Cloud
} from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';

const StatCard = ({ icon: Icon, label, value, subtext, color = 'gold', trend }) => (
  <div className="glass p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-xl bg-${color}/10`}>
        <Icon size={18} className={`text-${color}`} />
      </div>
      {trend && (
        <span className={`text-[10px] font-mono ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">{label}</h3>
    <p className="text-xl font-black text-white">{value}</p>
    {subtext && <p className="text-[10px] text-white/20 mt-1">{subtext}</p>}
  </div>
);

const AgentCard = ({ name, status, role, lastActive, model }) => {
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
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          {statusIcons[status]}
        </div>
        <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{name}</h4>
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{role}</p>
      <div className="flex items-center justify-between text-[10px] text-white/20">
        <span className="font-mono">{model || 'N/A'}</span>
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {lastActive}
        </span>
      </div>
    </div>
  );
};

const JobCard = ({ id, title, status, agent, progress }) => {
  const statusColors = {
    running: 'text-green-400',
    queued: 'text-yellow-400',
    completed: 'text-blue-400',
    failed: 'text-red-400'
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
        <p className={`text-[10px] font-bold ${statusColors[status]} uppercase`}>{status}</p>
        {progress !== undefined && (
          <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigate }) => {
  const [time, setTime] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [agents, setAgents] = useState([
    { id: 1, name: 'MiniMax Chief', role: 'Chief of Staff', status: 'active', lastActive: 'Now', model: 'MiniMax 2.5' },
    { id: 2, name: 'Research Swarm', role: 'Research Team', status: 'active', lastActive: '2m ago', model: 'Kimi K2.5 x10' },
    { id: 3, name: 'Engineering', role: 'Build Team', status: 'idle', lastActive: '15m ago', model: 'Gemini 3.0' },
    { id: 4, name: 'Creative Studio', role: 'Image Generation', status: 'active', lastActive: '1m ago', model: 'Nano Banana' },
  ]);
  const [jobs, setJobs] = useState([]);
  const [apiKeys, setApiKeys] = useState({
    minimax: { used: 0, total: 300, label: 'MiniMax 2.5 (300/5hr)' },
    kimi: { used: 0, total: 400, label: 'Kimi Swarm (400 RPM)' },
    glm: { used: 0, total: 10, label: 'GLM Swarm (10 concurrent)' }
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real tasks from Firebase
  useEffect(() => {
    const tasksRef = ref(database, 'workspaces/winslow_main/tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTasks(data);
      
      // Extract jobs from tasks
      const taskList = Object.values(data);
      setJobs(taskList.slice(0, 5).map((task, i) => ({
        id: task.id || i,
        title: task.title,
        status: task.column === 'done' ? 'completed' : task.column === 'in-progress' || task.column === 'progress' ? 'running' : 'queued',
        agent: task.category || 'Unassigned',
        progress: task.column === 'in-progress' ? 50 : undefined
      })));
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-full lg:p-6 space-y-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-6"
      >
        {/* Header Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard 
            icon={Brain} 
            label="Total Tasks" 
            value={Object.keys(tasks).length} 
            subtext={`${Object.values(tasks).filter(t => t.column === 'done').length} completed`}
            color="gold"
          />
          <StatCard 
            icon={Activity} 
            label="In Progress" 
            value={Object.values(tasks).filter(t => t.column === 'in-progress' || t.column === 'progress').length} 
            subtext={`${Object.values(tasks).filter(t => t.column === 'todo').length} todo`}
            color="green"
          />
          <StatCard 
            icon={Cpu} 
            label="API Health" 
            value="98%" 
            subtext="All systems nominal"
            color="purple"
            trend={2}
          />
          <StatCard 
            icon={Clock} 
            label="Uptime" 
            value="99.9%" 
            subtext="Last 30 days"
            color="blue"
          />
        </motion.div>

        {/* Main Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agent Health */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Agent Fleet</h3>
              <button onClick={() => onNavigate && onNavigate('kanban')} className="text-[10px] text-gold hover:text-white transition-colors flex items-center gap-1">
                View All <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {agents.map(agent => (
                <AgentCard key={agent.id} {...agent} />
              ))}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Job Queue</h3>
              <button onClick={() => onNavigate && onNavigate('kanban')} className="text-[10px] text-gold hover:text-white transition-colors flex items-center gap-1">
                View All <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="glass p-4 rounded-2xl border border-white/5 space-y-2">
              {jobs.map(job => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* API Keys Status */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/60">API Resources</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(apiKeys).map(([key, data]) => (
              <div key={key} className="glass p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{data.label}</span>
                  <span className="text-[10px] font-mono text-white/60">{data.used}/{data.total}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full transition-all" 
                    style={{ width: `${(data.used / data.total) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="glass p-4 rounded-2xl border border-white/5 hover:border-gold/30 transition-all group text-left">
              <Terminal size={20} className="text-white/40 mb-2 group-hover:text-gold transition-colors" />
              <span className="text-sm font-bold text-white">Run Command</span>
            </button>
            <button className="glass p-4 rounded-2xl border border-white/5 hover:border-purple-30 transition-all group text-left">
              <Radio size={20} className="text-white/40 mb-2 group-hover:text-purple-400 transition-colors" />
              <span className="text-sm font-bold text-white">Spawn Agent</span>
            </button>
            <button className="glass p-4 rounded-2xl border border-white/5 hover:border-green-30 transition-all group text-left">
              <Cloud size={20} className="text-white/40 mb-2 group-hover:text-green-400 transition-colors" />
              <span className="text-sm font-bold text-white">Deploy</span>
            </button>
            <button className="glass p-4 rounded-2xl border border-white/5 hover:border-blue-30 transition-all group text-left">
              <Search size={20} className="text-white/40 mb-2 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-bold text-white">Research</span>
            </button>
          </div>
        </motion.div>

        {/* System Time */}
        <motion.div variants={itemVariants} className="flex items-center justify-center pt-4">
          <div className="text-center">
            <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">System Time</p>
            <p className="text-2xl font-black text-white/60 italic">
              {time.toLocaleTimeString('en-US', { hour12: true })}
            </p>
            <p className="text-[10px] text-white/30">{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;