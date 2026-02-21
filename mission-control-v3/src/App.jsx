import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Kanban as KanbanIcon, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Zap,
  HardDrive,
  Menu,
  X,
  ChevronRight,
  Radio,
  Cloud,
  Terminal,
  Brain,
  Activity as ActivityIcon,
  Database,
  Sun,
  GitBranch
} from 'lucide-react';
import Kanban from './components/Kanban';
import GoogleDrive from './components/GoogleDrive';
import Dashboard from './components/Dashboard';
import Config from './components/Config';
import MemorySearch from './components/MemorySearch';
import Activity from './components/Activity';
// MiniMax monitor hidden from nav per product decision
import QuickCapture from './components/QuickCapture';
import DailyBriefing from './components/DailyBriefing';
import UnifiedSearch from './components/UnifiedSearch';
// PricingCalculator removed - kept as standalone
import Auth from './components/Auth';
import OrgOS from './components/OrgOS';
import { initGA, trackPageView } from './lib/analytics';

const menuItems = [
  { id: 'dashboard', label: 'Hub', icon: LayoutDashboard },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'briefing', label: 'Briefing', icon: Sun },
  { id: 'orgos', label: 'Org OS', icon: GitBranch },
  { id: 'capture', label: 'Capture', icon: Zap },
  { id: 'kanban', label: 'Tasks', icon: KanbanIcon },
  { id: 'drive', label: 'Drive', icon: HardDrive },
  { id: 'memory', label: 'Memory', icon: Database },
  { id: 'activity', label: 'Activity', icon: ActivityIcon },
  { id: 'config', label: 'Config', icon: Settings },
];

const quickActions = [
  { id: 'command', label: 'Run Command', icon: Terminal },
  { id: 'spawn', label: 'Spawn Agent', icon: Radio },
  { id: 'deploy', label: 'Deploy', icon: Cloud },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isPwaMode, setIsPwaMode] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mainRef = useRef(null);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  useEffect(() => {
    // Check auth on mount
    const auth = localStorage.getItem('mc_auth');
    setIsAuthenticated(auth === 'true');
    
    // Initialize GA4
    // Using import.meta.env for Vercel/Vite environment variables
    const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (GA_ID) {
      initGA(GA_ID);
    }
  }, []);

  useEffect(() => {
    // Track page view on tab change
    if (isAuthenticated) {
      trackPageView(activeTab);
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const updatePwaMode = () => {
      setIsPwaMode(Boolean(media.matches || window.navigator.standalone));
    };
    updatePwaMode();
    media.addEventListener?.('change', updatePwaMode);
    return () => media.removeEventListener?.('change', updatePwaMode);
  }, []);

  const handleAuth = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show auth if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuth={handleAuth} />;
  }

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleQuickAction = (actionId) => {
    const actionMap = {
      command: 'activity',
      spawn: 'activity',
      deploy: 'config',
      research: 'search',
      templates: 'drive',
      team: 'activity',
    };
    const targetTab = actionMap[actionId];
    if (targetTab) {
      setActiveTab(targetTab);
      setMobileMenuOpen(false);
    }
  };

  const handleTouchStart = (e) => {
    if (!isPwaMode || window.innerWidth >= 1024 || mobileMenuOpen || isRefreshing) return;
    const top = (mainRef.current?.scrollTop || 0) <= 0 && window.scrollY <= 0;
    if (!top) return;
    touchStartY.current = e.touches[0].clientY;
    isPulling.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isPulling.current || !isPwaMode || window.innerWidth >= 1024 || isRefreshing) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta <= 0) {
      setPullDistance(0);
      return;
    }
    setPullDistance(Math.min(110, delta * 0.45));
  };

  const handleTouchEnd = () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= 75 && isPwaMode && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        window.location.reload();
      }, 120);
      return;
    }

    setPullDistance(0);
  };

  return (
    <div className="flex h-screen w-full max-w-full overflow-x-hidden bg-background text-white font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Mission <span className="text-gold">Control</span>
          </h1>
          <p className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">
            System v3.0 // Active
          </p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-gold/10 border border-gold/30 text-gold' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 glass rounded-xl">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gold/20">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bobby" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Bobby Newland</p>
              <p className="text-[10px] text-white/40">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div
        ref={mainRef}
        className="flex-1 flex flex-col min-w-0 overflow-x-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <header style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }} className="flex items-center justify-between px-4 py-3 border-b border-white/5 lg:px-6 lg:pb-4">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 glass rounded-xl text-white/60 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="lg:hidden">
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                Mission <span className="text-gold">Control</span>
              </h1>
              <p className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">
                System v3.0 // Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full glass flex items-center justify-center border-white/10 active:scale-95 transition-transform">
              <Bell size={16} className="text-white/60" />
            </div>
            <div className="w-9 h-9 rounded-full glass border border-gold/30 overflow-hidden bg-gold/10 active:scale-95 transition-transform">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bobby" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Pull to refresh indicator (PWA mobile) */}
        {isPwaMode && (
          <div
            className="lg:hidden flex justify-center pointer-events-none"
            style={{ height: `${pullDistance}px`, transition: isRefreshing ? 'none' : 'height 120ms ease-out' }}
          >
            <div className="text-[10px] text-white/50 font-mono uppercase tracking-widest">
              {isRefreshing ? 'Refreshing...' : pullDistance >= 75 ? 'Release to refresh' : 'Pull to refresh'}
            </div>
          </div>
        )}

        {/* Tab Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-1 px-4 py-2 border-b border-white/5 overflow-x-auto">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-gold text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 flex min-w-0 flex-col overflow-x-hidden pb-20 lg:pb-0">
          {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => { setActiveTab(tab); }} onAction={handleQuickAction} />}
          {activeTab === 'search' && <UnifiedSearch onNavigate={handleNav} />}
          {activeTab === 'briefing' && <DailyBriefing onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'orgos' && <OrgOS />}
          {activeTab === 'capture' && <QuickCapture />}
          {activeTab === 'kanban' && <Kanban />}
          {activeTab === 'drive' && <GoogleDrive />}
          {activeTab === 'activity' && <Activity />}
          {activeTab === 'memory' && <MemorySearch />}
          {activeTab === 'config' && <Config />}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 safe-area-pb z-30">
          <div className="flex items-center justify-around py-2 px-1">
            {[{id:'search', icon:Search, label:'Search'}, {id:'briefing', icon:Sun, label:'Brief'}, {id:'capture', icon:Zap, label:'Capture'}, {id:'kanban', icon:KanbanIcon, label:'Tasks'}, {id:'memory', icon:Database, label:'Memory'}].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 min-w-[56px] rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'text-gold' 
                    : 'text-white/40'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-gold' : ''} />
                <span className="text-[9px] font-bold uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-[#0a0a0a] border-r border-white/10 z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tighter italic">
                    Mission <span className="text-gold">Control</span>
                  </h2>
                  <p className="text-[8px] text-white/40 font-mono uppercase">v3.0</p>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <p className="text-[8px] text-white/30 uppercase tracking-widest px-2 mb-2">Navigation</p>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-gold/10 border border-gold/30 text-gold' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                ))}

                <p className="text-[8px] text-white/30 uppercase tracking-widest px-2 mt-6 mb-2">Quick Actions</p>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <action.icon size={18} />
                    <span className="text-sm">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 glass rounded-xl">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gold/20">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bobby" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Bobby Newland</p>
                    <p className="text-[10px] text-white/40">Admin</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
