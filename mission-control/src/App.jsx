import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB3Z1WDeqO4cEBMk5Q1j9H8c2-0Z1Y8X0",
  authDomain: "winslow-756c3.firebaseapp.com",
  databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
  projectId: "winslow-756c3",
  storageBucket: "winslow-756c3.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Initial data
const initialSwarmKeys = [
  { id: 'nvidia-1', name: 'NVIDIA Kimi K2.5 #1', provider: 'NVIDIA', status: 'healthy', rpm: 12, maxRpm: 40, tokens: 125000 },
  { id: 'nvidia-2', name: 'NVIDIA Kimi K2.5 #2', provider: 'NVIDIA', status: 'healthy', rpm: 8, maxRpm: 40, tokens: 89000 },
  { id: 'openrouter-1', name: 'OpenRouter Codex #1', provider: 'OpenRouter', status: 'healthy', rpm: 25, maxRpm: 100, tokens: 210000 },
  { id: 'openrouter-2', name: 'OpenRouter Fallback', provider: 'OpenRouter', status: 'warning', rpm: 45, maxRpm: 100, tokens: 195000 },
  { id: 'minimax-1', name: 'MiniMax M2.1 Primary', provider: 'MiniMax', status: 'healthy', rpm: 0, maxRpm: 1000, tokens: 450000 },
  { id: 'minimax-2', name: 'MiniMax M2.1 Backup', provider: 'MiniMax', status: 'offline', rpm: 0, maxRpm: 1000, tokens: 0 },
  { id: 'gemini-1', name: 'Gemini 2.5 Flash', provider: 'Google', status: 'healthy', rpm: 5, maxRpm: 1000, tokens: 75000 },
  { id: 'vertex-1', name: 'Vertex AI', provider: 'Google', status: 'healthy', rpm: 2, maxRpm: 500, tokens: 32000 },
];

const initialClients = [
  { id: '1', name: 'TechStart Agency', contact: 'John Smith', email: 'john@techstart.io', projects: 3, status: 'active', totalSpend: 2450 },
  { id: '2', name: 'Creative Co', contact: 'Sarah Lee', email: 'sarah@creative.co', projects: 2, status: 'active', totalSpend: 1800 },
  { id: '3', name: 'MediaMax', contact: 'Mike Brown', email: 'mike@mediamax.com', projects: 1, status: 'paused', totalSpend: 950 },
  { id: '4', name: 'DigitalWave', contact: 'Lisa Chen', email: 'lisa@digitalwave.io', projects: 4, status: 'active', totalSpend: 3200 },
  { id: '5', name: 'BrandNew', contact: 'Tom Wilson', email: 'tom@brandnew.com', projects: 0, status: 'prospect', totalSpend: 0 },
];

const initialProjects = [
  { id: '1', clientId: '1', name: 'AI Chatbot MVP', status: 'progress', progress: 65, dueDate: '2026-02-20', budget: 1200 },
  { id: '2', clientId: '1', name: 'Website Redesign', status: 'review', progress: 90, dueDate: '2026-02-15', budget: 800 },
  { id: '3', clientId: '1', name: 'Marketing Automation', status: 'todo', progress: 0, dueDate: '2026-03-01', budget: 450 },
  { id: '4', clientId: '2', name: 'Brand Video Series', status: 'progress', progress: 40, dueDate: '2026-02-25', budget: 1500 },
  { id: '5', clientId: '2', name: 'Social Media Campaign', status: 'done', progress: 100, dueDate: '2026-01-30', budget: 300 },
  { id: '6', clientId: '4', name: 'Mobile App Design', status: 'progress', progress: 25, dueDate: '2026-03-15', budget: 2200 },
  { id: '7', clientId: '4', name: 'E-commerce Platform', status: 'todo', progress: 0, dueDate: '2026-04-01', budget: 1000 },
];

const initialDeployments = [
  { id: '1', project: 'mission-control-v2', environment: 'production', status: 'deployed', version: '2.1.0', lastDeploy: Date.now() - 3600000, author: 'Kimi K2.5' },
  { id: '2', project: 'link-in-bio', environment: 'staging', status: 'deployed', version: '1.5.2', lastDeploy: Date.now() - 7200000, author: 'Gemini CLI' },
  { id: '3', project: 'ai-avatars', environment: 'production', status: 'failed', version: '1.2.0', lastDeploy: Date.now() - 86400000, author: 'Codex' },
  { id: '4', project: 'template-creator', environment: 'production', status: 'pending', version: '1.8.0', lastDeploy: null, author: 'Win' },
];

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const maxWidth = size === 'lg' ? '600px' : size === 'sm' ? '350px' : '450px';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function HealthCard({ title, value, subtitle, icon, color = 'purple', trend }) {
  const colors = {
    purple: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
    green: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399' },
    blue: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa' },
    orange: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c' },
  };
  const c = colors[color] || colors.purple;
  return (
    <div className="health-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{title}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: c.text }}>{value}</div>
          {subtitle && <div style={{ fontSize: '0.7rem', color: '#4b5563', marginTop: '0.25rem' }}>{subtitle}</div>}
        </div>
        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{icon}</div>
      </div>
      {trend && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem', fontSize: '0.7rem', color: trend > 0 ? '#34d399' : '#ef4444' }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week</div>}
    </div>
  );
}

function KeyStatusCard({ key }) {
  const statusColors = {
    healthy: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', dot: '#34d399' },
    warning: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', dot: '#fbbf24' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', dot: '#ef4444' },
    offline: { bg: 'rgba(55, 65, 81, 0.3)', text: '#6b7280', dot: '#6b7280' },
  };
  const color = statusColors[key.status] || statusColors.offline;
  const rpmPercent = Math.min(100, key.maxRpm > 0 ? (key.rpm / key.maxRpm) * 100 : 0);
  return (
    <div className="key-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color.dot }} />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{key.name}</span>
        </div>
        <span style={{ fontSize: '0.7rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: color.bg, color: color.text }}>{key.provider}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>RPM</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{key.rpm} / {key.maxRpm}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Tokens</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{(key.tokens / 1000).toFixed(1)}K</div>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#6b7280', marginBottom: '0.25rem' }}>
          <span>Usage</span>
          <span>{rpmPercent.toFixed(0)}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(55, 65, 81, 0.4)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: rpmPercent + '%', background: rpmPercent > 80 ? '#ef4444' : rpmPercent > 50 ? '#fbbf24' : '#34d399', borderRadius: '2px', transition: 'width 0.3s ease' }} />
        </div>
      </div>
    </div>
  );
}

function ClientCard({ client, projects, onClick }) {
  const clientProjects = projects.filter(p => p.clientId === client.id);
  const activeProjects = clientProjects.filter(p => p.status !== 'done').length;
  return (
    <div className="client-card" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{client.name}</h3>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{client.contact} • {client.email}</p>
        </div>
        <span className={`status-badge ${client.status}`}>{client.status}</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(55, 65, 81, 0.3)' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Projects</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>{client.projects}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Active</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>{activeProjects}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Total Spend</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#a78bfa' }}>${client.totalSpend.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, client }) {
  const statusColors = {
    todo: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
    progress: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24' },
    review: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa' },
    done: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399' },
  };
  const color = statusColors[project.status] || statusColors.todo;
  return (
    <div className="project-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{project.name}</h4>
          {client && <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{client.name}</p>}
        </div>
        <span style={{ fontSize: '0.65rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: color.bg, color: color.text, textTransform: 'capitalize' }}>{project.status}</span>
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#6b7280', marginBottom: '0.25rem' }}>
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(55, 65, 81, 0.4)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: project.progress + '%', background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280' }}>
        <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
        <span style={{ color: '#a78bfa' }}>${project.budget}</span>
      </div>
    </div>
  );
}

function DeploymentCard({ deployment }) {
  const statusConfig = {
    deployed: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', icon: '✅' },
    pending: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', icon: '⏳' },
    failed: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', icon: '❌' },
    building: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa', icon: '🔨' },
  };
  const config = statusConfig[deployment.status] || statusConfig.pending;
  return (
    <div className="deployment-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🚀</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: 600, fontSize: '0.875rem' }}>{deployment.project}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#6b7280' }}>
            <span style={{ padding: '0.125rem 0.375rem', borderRadius: '0.25rem', background: config.bg, color: config.text, fontSize: '0.65rem' }}>{config.icon} {deployment.status}</span>
            <span>v{deployment.version}</span>
            <span>•</span>
            <span style={{ textTransform: 'capitalize' }}>{deployment.environment}</span>
          </div>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{deployment.lastDeploy ? new Date(deployment.lastDeploy).toLocaleTimeString() : 'Pending'}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [swarmKeys, setSwarmKeys] = useState(initialSwarmKeys);
  const [clients, setClients] = useState(initialClients);
  const [projects, setProjects] = useState(initialProjects);
  const [deployments, setDeployments] = useState(initialDeployments);
  const [editingClient, setEditingClient] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwarmKeys(prev => prev.map(key => ({
        ...key,
        rpm: key.status !== 'offline' ? Math.max(0, key.rpm + Math.floor(Math.random() * 3) - 1) : 0,
        tokens: key.status !== 'offline' ? key.tokens + Math.floor(Math.random() * 100) : key.tokens,
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'clients', icon: '👥', label: 'Clients' },
    { id: 'projects', icon: '📋', label: 'Projects' },
    { id: 'swarm', icon: '🐝', label: 'Swarm' },
    { id: 'deployments', icon: '🚀', label: 'Deploy' },
  ];

  const totalKeys = swarmKeys.length;
  const healthyKeys = swarmKeys.filter(k => k.status === 'healthy').length;
  const totalTokens = swarmKeys.reduce((sum, k) => sum + k.tokens, 0);
  const activeProjects = projects.filter(p => p.status !== 'done').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpend, 0);
  const gatewayUptime = 99.9;
  const lastBackup = new Date(Date.now() - 3600000).toLocaleString();

  const updateClient = (id, updates) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    setEditingClient(null);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(55, 65, 81, 0.3)', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>🏢 AI Skills Studio Command Center</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>Powered by Kimi K2.5 • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="status-badge saved"><span className="status-dot saved"></span><span>Live</span></div>
        </div>
      </header>

      <div style={{ position: 'sticky', top: '5.5rem', zIndex: 30, background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(55, 65, 81, 0.3)', padding: '0.75rem 1.25rem' }}>
        <div className="tab-scroll">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}>{tab.icon} {tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', left: 0, top: '5.5rem', bottom: '4.5rem', width: '4px', background: 'rgba(55, 65, 81, 0.5)', zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: scrollProgress + '%', background: 'linear-gradient(180deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)', transition: 'height 0.1s ease-out', boxShadow: '0 0 8px rgba(167, 139, 250, 0.5)' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {activeTab === 'dashboard' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#e5e5e5' }}>🏥 System Health</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <HealthCard title="API Keys" value={healthyKeys + '/' + totalKeys} subtitle="Healthy keys" icon="🔑" color="purple" />
                <HealthCard title="Total Tokens" value={(totalTokens / 1000).toFixed(0) + 'K'} subtitle="This month" icon="🪙" color="green" />
                <HealthCard title="Gateway Uptime" value={gatewayUptime + '%'} subtitle="30 days" icon="🌐" color="blue" />
                <HealthCard title="MiniMax Usage" value="45%" subtitle="$9.75 / $20/mo" icon="⚡" color="orange" />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#e5e5e5' }}>📈 Quick Stats</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <HealthCard title="Active Clients" value={clients.filter(c => c.status === 'active').length} icon="👥" color="purple" />
                <HealthCard title="Active Projects" value={activeProjects} icon="📋" color="green" />
                <HealthCard title="Pending Deploys" value={deployments.filter(d => d.status === 'pending').length} icon="🚀" color="blue" />
                <HealthCard title="Revenue" value={'$' + (totalRevenue / 1000).toFixed(1) + 'K'} trend={12} icon="💰" color="orange" />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#e5e5e5' }}>🐝 Swarm Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {swarmKeys.slice(0, 4).map(key => <KeyStatusCard key={key.id} keyData={key} />)}
              </div>
            </div>
            <div className="health-card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Last Backup</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{lastBackup}</div>
                </div>
                <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>Backup Now</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e5e5e5' }}>👥 Agency Clients</h2>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{clients.length} total</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {clients.map(client => <ClientCard key={client.id} client={client} projects={projects} onClick={() => setEditingClient(client)} />)}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e5e5e5' }}>📋 Projects</h2>
              <select className="form-select" style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem', fontSize: '0.75rem' }}>
                <option>All Clients</option>
                {clients.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projects.map(project => <ProjectCard key={project.id} project={project} client={clients.find(c => c.id === project.clientId)} />)}
            </div>
          </div>
        )}

        {activeTab === 'swarm' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e5e5e5' }}>🐝 API Key Swarm</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="status-badge healthy" style={{ fontSize: '0.65rem' }}>● {healthyKeys} Healthy</span>
                <span className="status-badge warning" style={{ fontSize: '0.65rem' }}>● {swarmKeys.filter(k => k.status === 'warning').length} Warning</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {swarmKeys.map(key => <KeyStatusCard key={key.id} keyData={key} />)}
            </div>
          </div>
        )}

        {activeTab === 'deployments' && (
          <div style={{ padding: '0 1.25rem 6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e5e5e5' }}>🚀 Ship / Forge Pipeline</h2>
              <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>New Deploy</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {deployments.map(dep => <DeploymentCard key={dep.id} deployment={dep} />)}
            </div>
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.5rem' }}>
          {tabs.map(item => (
            <div key={item.id} className={'nav-item ' + (activeTab === item.id ? 'active' : 'inactive')} onClick={() => setActiveTab(item.id)}>
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-label">{item.label}</div>
            </div>
          ))}
        </div>
      </nav>

      <Modal isOpen={editingClient !== null} onClose={() => setEditingClient(null)} title="Edit Client" size="lg">
        {editingClient && (
          <form onSubmit={(e) => { e.preventDefault(); updateClient(editingClient.id, { name: e.target.name.value, contact: e.target.contact.value, email: e.target.email.value, status: e.target.status.value }); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Company Name</label>
                <input name="name" defaultValue={editingClient.name} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Contact</label>
                <input name="contact" defaultValue={editingClient.contact} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Email</label>
                <input name="email" defaultValue={editingClient.email} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Status</label>
                <select name="status" defaultValue={editingClient.status} className="form-select">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-danger" onClick={() => { setClients(prev => prev.filter(c => c.id !== editingClient.id)); setEditingClient(null); }}>Delete</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
