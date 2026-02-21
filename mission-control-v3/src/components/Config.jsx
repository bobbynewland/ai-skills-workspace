import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Database,
  Save,
  Check,
  X
} from 'lucide-react';

const SettingSection = ({ icon: Icon, title, children }) => (
  <div className="glass p-6 rounded-2xl border border-white/5">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-xl bg-gold/10">
        <Icon size={18} className="text-gold" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-white/60">{title}</h3>
    </div>
    {children}
  </div>
);

const Toggle = ({ enabled, onToggle, label }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <span className="text-sm text-white/80">{label}</span>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all ${enabled ? 'bg-gold' : 'bg-white/20'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const Config = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: 'Bobby Newland',
      email: 'bobby@framelens.media',
      timezone: 'America/New_York'
    },
    notifications: {
      jobs: true,
      agents: true,
      errors: true,
      email: false
    },
    api: {
      minimaxKey: '••••••••••••••••',
      antigravity: true,
      openai: false
    },
    appearance: {
      theme: 'dark',
      animations: true,
      compact: false
    }
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen overflow-y-auto no-scrollbar pb-32">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">
              Config
            </h2>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-1">
              System Settings
            </p>
          </div>
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gold text-black'}`}
          >
            {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save</>}
          </button>
        </div>

        {/* Profile */}
        <SettingSection icon={User} title="Profile">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Display Name</label>
              <input 
                type="text" 
                value={settings.profile.name}
                onChange={(e) => setSettings({...settings, profile: {...settings.profile, name: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Email</label>
              <input 
                type="email" 
                value={settings.profile.email}
                onChange={(e) => setSettings({...settings, profile: {...settings.profile, email: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Timezone</label>
              <select 
                value={settings.profile.timezone}
                onChange={(e) => setSettings({...settings, profile: {...settings.profile, timezone: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50"
              >
                <option value="America/New_York">Eastern (ET)</option>
                <option value="America/Chicago">Central (CT)</option>
                <option value="America/Denver">Mountain (MT)</option>
                <option value="America/Los_Angeles">Pacific (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={Bell} title="Notifications">
          <Toggle 
            label="Job completions" 
            enabled={settings.notifications.jobs}
            onToggle={() => setSettings({...settings, notifications: {...settings.notifications, jobs: !settings.notifications.jobs}})}
          />
          <Toggle 
            label="Agent status changes" 
            enabled={settings.notifications.agents}
            onToggle={() => setSettings({...settings, notifications: {...settings.notifications, agents: !settings.notifications.agents}})}
          />
          <Toggle 
            label="Error alerts" 
            enabled={settings.notifications.errors}
            onToggle={() => setSettings({...settings, notifications: {...settings.notifications, errors: !settings.notifications.errors}})}
          />
          <Toggle 
            label="Email digest" 
            enabled={settings.notifications.email}
            onToggle={() => setSettings({...settings, notifications: {...settings.notifications, email: !settings.notifications.email}})}
          />
        </SettingSection>

        {/* API Keys */}
        <SettingSection icon={Key} title="API Configuration">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">MiniMax API Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={settings.api.minimaxKey}
                  onChange={(e) => setSettings({...settings, api: {...settings.api, minimaxKey: e.target.value}})}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 font-mono"
                />
                <button className="px-4 py-2 bg-white/10 rounded-xl text-white/60 text-sm hover:text-white transition-colors">
                  Update
                </button>
              </div>
            </div>
            <Toggle 
              label="Antigravity Models" 
              enabled={settings.api.antigravity}
              onToggle={() => setSettings({...settings, api: {...settings.api, antigravity: !settings.api.antigravity}})}
            />
            <Toggle 
              label="OpenAI Backup" 
              enabled={settings.api.openai}
              onToggle={() => setSettings({...settings, api: {...settings.api, openai: !settings.api.openai}})}
            />
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection icon={Palette} title="Appearance">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Theme</label>
              <div className="flex gap-2">
                {['dark', 'light', 'system'].map(theme => (
                  <button 
                    key={theme}
                    onClick={() => setSettings({...settings, appearance: {...settings.appearance, theme}})}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${settings.appearance.theme === theme ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:text-white'}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <Toggle 
              label="Enable animations" 
              enabled={settings.appearance.animations}
              onToggle={() => setSettings({...settings, appearance: {...settings.appearance, animations: !settings.appearance.animations}})}
            />
            <Toggle 
              label="Compact mode" 
              enabled={settings.appearance.compact}
              onToggle={() => setSettings({...settings, appearance: {...settings.appearance, compact: !settings.appearance.compact}})}
            />
          </div>
        </SettingSection>

        {/* Database */}
        <SettingSection icon={Database} title="Data">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <span className="text-sm text-white/80 block">Firebase Project</span>
              <span className="text-[10px] text-white/40 font-mono">winslow-756c3-default-rtdb</span>
            </div>
            <span className="text-[10px] text-green-400 uppercase tracking-wider">Connected</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="text-sm text-white/80 block">Data Sync</span>
              <span className="text-[10px] text-white/40 font-mono">Last: 2 minutes ago</span>
            </div>
            <button className="text-[10px] text-gold hover:text-white transition-colors uppercase tracking-wider">
              Sync Now
            </button>
          </div>
        </SettingSection>

        {/* Version */}
        <div className="text-center pt-4">
          <p className="text-[10px] text-white/20 font-mono">Mission Control v3.0 // AI Skills Studio</p>
        </div>
      </div>
    </div>
  );
};

export default Config;